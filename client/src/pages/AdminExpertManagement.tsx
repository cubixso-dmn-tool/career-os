import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Users } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface Expert {
  id: number;
  name: string;
  email: string;
  title: string;
  company: string;
  industry: string;
  bio: string;
  expertise: string[];
  yearsOfExperience: number;
  linkedInUrl?: string;
  portfolioUrl?: string;
  hourlyRate?: number;
  availability: string;
  isActive: boolean;
  isFeatured?: boolean;
  featuredOrder?: number;
  createdAt: string;
}

interface ExpertForm {
  name: string;
  email: string;
  title: string;
  company: string;
  industry: string;
  bio: string;
  expertise: string[];
  yearsOfExperience: number;
  linkedInUrl?: string;
  portfolioUrl?: string;
  hourlyRate?: number;
  availability: string;
}

const AdminExpertManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingExpert, setEditingExpert] = useState<Expert | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [expertiseInput, setExpertiseInput] = useState('');
  
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState<ExpertForm>({
    name: '',
    email: '',
    title: '',
    company: '',
    industry: '',
    bio: '',
    expertise: [],
    yearsOfExperience: 0,
    linkedInUrl: '',
    portfolioUrl: '',
    hourlyRate: undefined,
    availability: 'Available'
  });

  // Fetch experts
  const { data: expertsData, isLoading } = useQuery({
    queryKey: ['admin-experts', searchTerm, industryFilter],
    queryFn: async (): Promise<{ data: Expert[] }> => {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (industryFilter && industryFilter !== 'all') params.append('industry', industryFilter);
      
      const response = await fetch(`/api/admin/experts?${params}`, {
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to fetch experts');
      return response.json();
    }
  });

  const experts = expertsData?.data?.data || [];

  // Create expert mutation
  const createExpertMutation = useMutation({
    mutationFn: async (expertData: ExpertForm) => {
      const response = await fetch('/api/admin/experts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(expertData)
      });
      if (!response.ok) throw new Error('Failed to create expert');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experts'] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: 'Success', description: 'Expert created successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Update expert mutation
  const updateExpertMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ExpertForm> }) => {
      const response = await fetch(`/api/admin/experts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update expert');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experts'] });
      setIsDialogOpen(false);
      setEditingExpert(null);
      resetForm();
      toast({ title: 'Success', description: 'Expert updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Delete expert mutation
  const deleteExpertMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/experts/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!response.ok) throw new Error('Failed to delete expert');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-experts'] });
      toast({ title: 'Success', description: 'Expert deleted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Toggle featured mutation using dedicated endpoint
  const toggleFeaturedMutation = useMutation({
    mutationFn: async ({ id, isFeatured }: { id: number; isFeatured: boolean }) => {
      const response = await fetch(`/api/admin/experts/${id}/featured`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isFeatured })
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Failed to update expert featured status');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-experts'] });
      toast({ 
        title: 'Success', 
        description: data.message || 'Expert featured status updated successfully!' 
      });
    },
    onError: (error: any) => {
      console.error('Featured toggle error:', error);
      toast({ 
        title: 'Error', 
        description: error.message || 'Failed to update featured status', 
        variant: 'destructive' 
      });
    }
  });

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      title: '',
      company: '',
      industry: '',
      bio: '',
      expertise: [],
      yearsOfExperience: 0,
      linkedInUrl: '',
      portfolioUrl: '',
      hourlyRate: undefined,
      availability: 'Available'
    });
    setExpertiseInput('');
  };

  const handleEdit = (expert: Expert) => {
    setEditingExpert(expert);
    setFormData({
      name: expert.name,
      email: expert.email,
      title: expert.title,
      company: expert.company,
      industry: expert.industry,
      bio: expert.bio,
      expertise: expert.expertise,
      yearsOfExperience: expert.yearsOfExperience,
      linkedInUrl: expert.linkedInUrl || '',
      portfolioUrl: expert.portfolioUrl || '',
      hourlyRate: expert.hourlyRate,
      availability: expert.availability
    });
    setExpertiseInput(expert.expertise.join(', '));
    setIsDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const expertData = {
      ...formData,
      expertise: expertiseInput.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
    };

    if (editingExpert) {
      updateExpertMutation.mutate({ id: editingExpert.id, data: expertData });
    } else {
      createExpertMutation.mutate(expertData);
    }
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this expert?')) {
      deleteExpertMutation.mutate(id);
    }
  };

  const industries = ['Technology', 'Finance', 'Healthcare', 'Education', 'Consulting', 'Marketing', 'Design', 'Other'];

  return (
    <Layout title="Expert Management">
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Users className="h-8 w-8 text-blue-600" />
            Expert Management
          </h1>
          <p className="text-gray-600 mt-2">Manage industry experts, their profiles, and sessions</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingExpert(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Expert
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingExpert ? 'Edit Expert' : 'Add New Expert'}
              </DialogTitle>
              <DialogDescription>
                {editingExpert 
                  ? 'Update expert information below.'
                  : 'Fill in the details to add a new industry expert to the platform.'
                }
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Job Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Senior Software Engineer"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Tech Corp Inc."
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Select value={formData.industry} onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry}>
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Input
                      id="experience"
                      type="number"
                      value={formData.yearsOfExperience}
                      onChange={(e) => setFormData(prev => ({ ...prev, yearsOfExperience: parseInt(e.target.value) || 0 }))}
                      placeholder="5"
                      min="0"
                      max="50"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Professional Details</h3>
                
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    placeholder="Brief professional bio..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="expertise">Expertise Areas (comma-separated)</Label>
                  <Input
                    id="expertise"
                    value={expertiseInput}
                    onChange={(e) => setExpertiseInput(e.target.value)}
                    placeholder="React, Node.js, System Design, Leadership"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="linkedin">LinkedIn URL</Label>
                    <Input
                      id="linkedin"
                      type="url"
                      value={formData.linkedInUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, linkedInUrl: e.target.value }))}
                      placeholder="https://linkedin.com/in/johndoe"
                    />
                  </div>
                  <div>
                    <Label htmlFor="portfolio">Portfolio URL</Label>
                    <Input
                      id="portfolio"
                      type="url"
                      value={formData.portfolioUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, portfolioUrl: e.target.value }))}
                      placeholder="https://johndoe.dev"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Session Information</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="hourlyRate">Hourly Rate (₹)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      value={formData.hourlyRate || ''}
                      onChange={(e) => setFormData(prev => ({ ...prev, hourlyRate: parseFloat(e.target.value) || undefined }))}
                      placeholder="2000"
                      min="0"
                      step="100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="availability">Availability</Label>
                    <Select value={formData.availability} onValueChange={(value) => setFormData(prev => ({ ...prev, availability: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select availability" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Available">Available</SelectItem>
                        <SelectItem value="Busy">Busy</SelectItem>
                        <SelectItem value="Limited">Limited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createExpertMutation.isPending || updateExpertMutation.isPending}
                >
                  {createExpertMutation.isPending || updateExpertMutation.isPending ? "Saving..." : "Save"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search experts by name, title, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={industryFilter} onValueChange={setIndustryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filter by industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Industries</SelectItem>
                {industries.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Experts List */}
      <Card>
        <CardHeader>
          <CardTitle>Experts ({experts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading experts...</div>
          ) : experts.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No experts found. Add your first expert to get started!
            </div>
          ) : (
            <div className="space-y-4">
              {experts.map((expert) => (
                <div key={expert.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{expert.name}</h3>
                        <Badge variant="secondary">{expert.industry}</Badge>
                        <Badge className={expert.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {expert.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                        <Badge variant="outline">{expert.availability}</Badge>
                        {expert.isFeatured && (
                          <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-medium">
                            ⭐ FEATURED
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-2">{expert.title} at {expert.company}</p>
                      <p className="text-sm text-gray-500 mb-3">{expert.bio}</p>
                      
                      <div className="flex gap-4 text-sm">
                        <span><strong>Experience:</strong> {expert.yearsOfExperience} years</span>
                        {expert.hourlyRate && <span><strong>Rate:</strong> ₹{expert.hourlyRate}/hour</span>}
                        <span><strong>Expertise:</strong> {expert.expertise.length} areas</span>
                      </div>

                      {expert.expertise.length > 0 && (
                        <div className="mt-3">
                          <span className="text-sm font-medium">Skills: </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {expert.expertise.slice(0, 5).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {expert.expertise.length > 5 && (
                              <Badge variant="outline" className="text-xs">
                                +{expert.expertise.length - 5} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      <Button
                        variant={expert.isFeatured ? "default" : "outline"}
                        size="sm"
                        onClick={() => toggleFeaturedMutation.mutate({ 
                          id: expert.id, 
                          isFeatured: !expert.isFeatured 
                        })}
                        disabled={toggleFeaturedMutation.isPending}
                        className={expert.isFeatured 
                          ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0" 
                          : "border-purple-300 text-purple-600 hover:bg-purple-50"}
                      >
                        {toggleFeaturedMutation.isPending ? (
                          "⏳ Updating..."
                        ) : expert.isFeatured ? (
                          "⭐ Remove Featured"
                        ) : (
                          "⭐ Make Featured"
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(expert)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(expert.id)}
                        className="text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      </div>
    </Layout>
  );
};

export default AdminExpertManagement;