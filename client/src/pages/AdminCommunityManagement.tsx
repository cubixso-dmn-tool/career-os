import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import Layout from "@/components/layout/Layout";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Users,
  FolderOpen,
  Calendar,
  Trophy,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  ExternalLink,
  Image as ImageIcon
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

const cardSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description too long'),
  imageUrl: z.string().url('Invalid image URL').optional().or(z.literal('')),
  redirectUrl: z.string().url('Invalid redirect URL'),
  category: z.enum(['communities', 'projects', 'events', 'competitions']),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true)
});

type CardFormData = z.infer<typeof cardSchema>;

const categoryIcons = {
  communities: Users,
  projects: FolderOpen,
  events: Calendar,
  competitions: Trophy
};

const categoryLabels = {
  communities: 'Communities',
  projects: 'Projects', 
  events: 'Events',
  competitions: 'Competitions'
};

export default function AdminCommunityManagement() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['/api/community-features/admin/cards'],
    queryFn: async () => {
      const response = await fetch('/api/community-features/admin/cards', {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch cards');
      const result = await response.json();
      return result.data;
    }
  });

  const form = useForm<CardFormData>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      title: '',
      description: '',
      imageUrl: '',
      redirectUrl: '',
      category: 'communities',
      displayOrder: 0,
      isActive: true
    }
  });

  const createCardMutation = useMutation({
    mutationFn: async (data: CardFormData) => {
      const response = await fetch('/api/community-features/admin/cards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to create card');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community-features/admin/cards'] });
      setIsCreateDialogOpen(false);
      form.reset();
      toast({ title: "Card created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create card", variant: "destructive" });
    }
  });

  const updateCardMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CardFormData> }) => {
      const response = await fetch(`/api/community-features/admin/cards/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update card');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community-features/admin/cards'] });
      setEditingCard(null);
      form.reset();
      toast({ title: "Card updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update card", variant: "destructive" });
    }
  });

  const deleteCardMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/community-features/admin/cards/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to delete card');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community-features/admin/cards'] });
      toast({ title: "Card deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete card", variant: "destructive" });
    }
  });

  const toggleCardMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/community-features/admin/cards/${id}/toggle`, {
        method: 'PATCH',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to toggle card');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/community-features/admin/cards'] });
      toast({ title: "Card status updated" });
    },
    onError: () => {
      toast({ title: "Failed to update card status", variant: "destructive" });
    }
  });

  const onSubmit = (data: CardFormData) => {
    if (editingCard) {
      updateCardMutation.mutate({ id: editingCard.id, data });
    } else {
      createCardMutation.mutate(data);
    }
  };

  const handleEdit = (card: any) => {
    setEditingCard(card);
    form.reset({
      title: card.title,
      description: card.description,
      imageUrl: card.imageUrl || '',
      redirectUrl: card.redirectUrl,
      category: card.category,
      displayOrder: card.displayOrder,
      isActive: card.isActive
    });
    setIsCreateDialogOpen(true);
  };

  const handleCreate = () => {
    setEditingCard(null);
    form.reset();
    setIsCreateDialogOpen(true);
  };

  const groupedCards = cards.reduce((acc: any, card: any) => {
    if (!acc[card.category]) acc[card.category] = [];
    acc[card.category].push(card);
    return acc;
  }, {});

  return (
    <Layout title="Community Management">
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
        <div className="bg-white border-b border-gray-200 px-6 py-8 mb-8">
          <div className="max-w-7xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Users className="h-8 w-8 text-purple-600" />
                  </div>
                  Community Management
                </h1>
                <p className="text-gray-600 mt-2">
                  Manage community feature cards displayed to users
                </p>
              </div>
              <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="h-4 w-4 mr-2" />
                Add New Card
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 py-8">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading community cards...</p>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.entries(groupedCards).map(([category, categoryCards]: [string, any]) => {
                const Icon = categoryIcons[category as keyof typeof categoryIcons];
                return (
                  <motion.div
                    key={category}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="shadow-lg border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Icon className="h-6 w-6 text-purple-600" />
                          {categoryLabels[category as keyof typeof categoryLabels]}
                          <Badge variant="secondary" className="ml-2">
                            {categoryCards.length} cards
                          </Badge>
                        </CardTitle>
                        <CardDescription>
                          Manage {categoryLabels[category as keyof typeof categoryLabels].toLowerCase()} cards
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {categoryCards.map((card: any) => (
                            <Card key={card.id} className={`border ${card.isActive ? 'border-green-200' : 'border-gray-200'}`}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <h4 className="font-semibold text-gray-900 mb-1">{card.title}</h4>
                                    <p className="text-sm text-gray-600 mb-2">{card.description}</p>
                                    <div className="flex items-center gap-2 mb-2">
                                      <Badge variant={card.isActive ? 'default' : 'secondary'}>
                                        {card.isActive ? 'Active' : 'Inactive'}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        Order: {card.displayOrder}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                                
                                {card.imageUrl && (
                                  <div className="mb-3">
                                    <img 
                                      src={card.imageUrl} 
                                      alt={card.title}
                                      className="w-full h-24 object-cover rounded"
                                    />
                                  </div>
                                )}
                                
                                <div className="mb-3 p-2 bg-gray-50 rounded text-xs">
                                  <div className="flex items-center gap-1">
                                    <ExternalLink className="h-3 w-3" />
                                    <span className="truncate">{card.redirectUrl}</span>
                                  </div>
                                </div>
                                
                                <div className="flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleEdit(card)}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => toggleCardMutation.mutate(card.id)}
                                  >
                                    {card.isActive ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="text-red-600"
                                    onClick={() => deleteCardMutation.mutate(card.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
              
              {Object.keys(groupedCards).length === 0 && (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium text-gray-900 mb-2">No community cards yet</h3>
                  <p className="text-gray-600 mb-6">Start by creating your first community feature card</p>
                  <Button onClick={handleCreate} className="bg-purple-600 hover:bg-purple-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create First Card
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Create/Edit Dialog */}
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingCard ? 'Edit Community Card' : 'Create Community Card'}
              </DialogTitle>
              <DialogDescription>
                {editingCard ? 'Update the community card details' : 'Add a new community card that users can access'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  {...form.register('title')}
                  placeholder="Card title"
                />
                {form.formState.errors.title && (
                  <p className="text-sm text-red-600">{form.formState.errors.title.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  {...form.register('description')}
                  placeholder="Card description"
                  rows={3}
                />
                {form.formState.errors.description && (
                  <p className="text-sm text-red-600">{form.formState.errors.description.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={form.watch('category')} 
                  onValueChange={(value) => form.setValue('category', value as any)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="communities">Communities</SelectItem>
                    <SelectItem value="projects">Projects</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                    <SelectItem value="competitions">Competitions</SelectItem>
                  </SelectContent>
                </Select>
                {form.formState.errors.category && (
                  <p className="text-sm text-red-600">{form.formState.errors.category.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="redirectUrl">Redirect URL</Label>
                <Input
                  id="redirectUrl"
                  {...form.register('redirectUrl')}
                  placeholder="https://example.com"
                  type="url"
                />
                {form.formState.errors.redirectUrl && (
                  <p className="text-sm text-red-600">{form.formState.errors.redirectUrl.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                <Input
                  id="imageUrl"
                  {...form.register('imageUrl')}
                  placeholder="https://example.com/image.jpg"
                  type="url"
                />
                {form.formState.errors.imageUrl && (
                  <p className="text-sm text-red-600">{form.formState.errors.imageUrl.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="displayOrder">Display Order</Label>
                <Input
                  id="displayOrder"
                  {...form.register('displayOrder', { valueAsNumber: true })}
                  placeholder="0"
                  type="number"
                  min="0"
                />
                {form.formState.errors.displayOrder && (
                  <p className="text-sm text-red-600">{form.formState.errors.displayOrder.message}</p>
                )}
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createCardMutation.isPending || updateCardMutation.isPending}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {createCardMutation.isPending || updateCardMutation.isPending ? 'Saving...' : 
                   editingCard ? 'Update Card' : 'Create Card'}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}