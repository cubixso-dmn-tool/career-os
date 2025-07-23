import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { BarChart3, Plus, Edit, Trash2, BookOpen, Target, Award, Users, BriefcaseBusiness } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface CareerOption {
  id: number;
  title: string;
  category: string;
  description: string;
  salaryMin?: number;
  salaryMax?: number;
  difficultyLevel?: string;
  requiredSkills: string[];
  growthOutlook?: string;
  isActive: boolean;
  createdAt: string;
}

interface CareerPath {
  id: number;
  title: string;
  category: string;
  description?: string;
  overview?: string;
  dayInLife?: string;
  salaryExpectations?: string;
  growthOutlook?: string;
  isActive: boolean;
  createdAt: string;
}

interface CareerOptionForm {
  title: string;
  category: string;
  description: string;
  salaryMin?: number;
  salaryMax?: number;
  difficultyLevel: string;
  requiredSkills: string[];
  growthOutlook?: string;
}

interface CareerPathForm {
  title: string;
  category: string;
  description?: string;
  overview?: string;
  dayInLife?: string;
  salaryExpectations?: string;
  growthOutlook?: string;
}

const AdminCareerManagement = () => {
  const [activeTab, setActiveTab] = useState('options');
  const [careerOptionDialog, setCareerOptionDialog] = useState(false);
  const [careerPathDialog, setCareerPathDialog] = useState(false);
  const [editingOption, setEditingOption] = useState<CareerOption | null>(null);
  const [editingPath, setEditingPath] = useState<CareerPath | null>(null);
  const [skillsInput, setSkillsInput] = useState('');
  
  const queryClient = useQueryClient();

  // Career Option form state
  const [optionForm, setOptionForm] = useState<CareerOptionForm>({
    title: '',
    category: '',
    description: '',
    salaryMin: undefined,
    salaryMax: undefined,
    difficultyLevel: 'Beginner',
    requiredSkills: [],
    growthOutlook: ''
  });

  // Career Path form state
  const [pathForm, setPathForm] = useState<CareerPathForm>({
    title: '',
    category: '',
    description: '',
    overview: '',
    dayInLife: '',
    salaryExpectations: '',
    growthOutlook: ''
  });

  // Fetch career options
  const { data: careerOptions = [], isLoading: optionsLoading } = useQuery({
    queryKey: ['admin-career-options'],
    queryFn: async (): Promise<CareerOption[]> => {
      const response = await fetch('/api/admin/career-options');
      if (!response.ok) throw new Error('Failed to fetch career options');
      const data = await response.json();
      return data.data || [];
    }
  });

  // Fetch career paths
  const { data: careerPaths = [], isLoading: pathsLoading } = useQuery({
    queryKey: ['admin-career-paths'],
    queryFn: async (): Promise<CareerPath[]> => {
      const response = await fetch('/api/admin/career-paths');
      if (!response.ok) throw new Error('Failed to fetch career paths');
      const data = await response.json();
      return data.data || [];
    }
  });

  // Create career option mutation
  const createOptionMutation = useMutation({
    mutationFn: async (optionData: CareerOptionForm) => {
      const response = await fetch('/api/admin/career-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(optionData)
      });
      if (!response.ok) throw new Error('Failed to create career option');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-career-options'] });
      setCareerOptionDialog(false);
      resetOptionForm();
      toast({ title: 'Success', description: 'Career option created successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Update career option mutation
  const updateOptionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<CareerOptionForm> }) => {
      const response = await fetch(`/api/admin/career-options/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update career option');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-career-options'] });
      setCareerOptionDialog(false);
      setEditingOption(null);
      resetOptionForm();
      toast({ title: 'Success', description: 'Career option updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Delete career option mutation
  const deleteOptionMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/career-options/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete career option');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-career-options'] });
      toast({ title: 'Success', description: 'Career option deleted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Create career path mutation
  const createPathMutation = useMutation({
    mutationFn: async (pathData: CareerPathForm) => {
      const response = await fetch('/api/admin/career-paths', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pathData)
      });
      if (!response.ok) throw new Error('Failed to create career path');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-career-paths'] });
      setCareerPathDialog(false);
      resetPathForm();
      toast({ title: 'Success', description: 'Career path created successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const resetOptionForm = () => {
    setOptionForm({
      title: '',
      category: '',
      description: '',
      salaryMin: undefined,
      salaryMax: undefined,
      difficultyLevel: 'Beginner',
      requiredSkills: [],
      growthOutlook: ''
    });
    setSkillsInput('');
  };

  const resetPathForm = () => {
    setPathForm({
      title: '',
      category: '',
      description: '',
      overview: '',
      dayInLife: '',
      salaryExpectations: '',
      growthOutlook: ''
    });
  };

  const handleEditOption = (option: CareerOption) => {
    setEditingOption(option);
    setOptionForm({
      title: option.title,
      category: option.category,
      description: option.description,
      salaryMin: option.salaryMin,
      salaryMax: option.salaryMax,
      difficultyLevel: option.difficultyLevel || 'Beginner',
      requiredSkills: option.requiredSkills || [],
      growthOutlook: option.growthOutlook || ''
    });
    setSkillsInput(option.requiredSkills?.join(', ') || '');
    setCareerOptionDialog(true);
  };

  const handleEditPath = (path: CareerPath) => {
    setEditingPath(path);
    setPathForm({
      title: path.title,
      category: path.category,
      description: path.description || '',
      overview: path.overview || '',
      dayInLife: path.dayInLife || '',
      salaryExpectations: path.salaryExpectations || '',
      growthOutlook: path.growthOutlook || ''
    });
    setCareerPathDialog(true);
  };

  const handleOptionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData = {
      ...optionForm,
      requiredSkills: skillsInput.split(',').map(skill => skill.trim()).filter(skill => skill.length > 0)
    };

    if (editingOption) {
      updateOptionMutation.mutate({ id: editingOption.id, data: formData });
    } else {
      createOptionMutation.mutate(formData);
    }
  };

  const handlePathSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPath) {
      // Path update mutation would go here
      toast({ title: 'Info', description: 'Career path update functionality will be implemented' });
    } else {
      createPathMutation.mutate(pathForm);
    }
  };

  const categories = [
    'Software Development',
    'Data & AI',
    'Design & Product',
    'Marketing & Growth',
    'Web & Cloud',
    'Cybersecurity',
    'Hardware & IoT'
  ];

  const formatSalary = (min?: number, max?: number) => {
    if (!min && !max) return 'Not specified';
    if (min && max) return `₹${Math.floor(min / 100000)}-${Math.floor(max / 100000)} LPA`;
    if (min) return `₹${Math.floor(min / 100000)}+ LPA`;
    return `Up to ₹${Math.floor((max || 0) / 100000)} LPA`;
  };

  return (
    <Layout title="Career Management">
      <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <BriefcaseBusiness className="h-8 w-8 text-blue-600" />
            Career Management
          </h1>
          <p className="text-gray-600 mt-2">Manage career options and roadmaps for students</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="options">Career Options ({careerOptions.length})</TabsTrigger>
          <TabsTrigger value="paths">Career Paths ({careerPaths.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="options" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Career Options</h2>
            <Dialog open={careerOptionDialog} onOpenChange={(open) => {
              setCareerOptionDialog(open);
              if (!open) {
                setEditingOption(null);
                resetOptionForm();
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Career Option
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingOption ? 'Edit Career Option' : 'Add New Career Option'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleOptionSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="title">Career Title</Label>
                      <Input
                        id="title"
                        value={optionForm.title}
                        onChange={(e) => setOptionForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Full Stack Developer"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="category">Category</Label>
                      <Select
                        value={optionForm.category}
                        onValueChange={(value) => setOptionForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={optionForm.description}
                      onChange={(e) => setOptionForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the career"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="salaryMin">Min Salary (₹)</Label>
                      <Input
                        id="salaryMin"
                        type="number"
                        value={optionForm.salaryMin || ''}
                        onChange={(e) => setOptionForm(prev => ({ 
                          ...prev, 
                          salaryMin: e.target.value ? parseInt(e.target.value) : undefined 
                        }))}
                        placeholder="400000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="salaryMax">Max Salary (₹)</Label>
                      <Input
                        id="salaryMax"
                        type="number"
                        value={optionForm.salaryMax || ''}
                        onChange={(e) => setOptionForm(prev => ({ 
                          ...prev, 
                          salaryMax: e.target.value ? parseInt(e.target.value) : undefined 
                        }))}
                        placeholder="2000000"
                      />
                    </div>
                    <div>
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select
                        value={optionForm.difficultyLevel}
                        onValueChange={(value) => setOptionForm(prev => ({ ...prev, difficultyLevel: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="skills">Required Skills (comma-separated)</Label>
                    <Input
                      id="skills"
                      value={skillsInput}
                      onChange={(e) => setSkillsInput(e.target.value)}
                      placeholder="JavaScript, React, Node.js, SQL"
                    />
                  </div>

                  <div>
                    <Label htmlFor="growthOutlook">Growth Outlook</Label>
                    <Textarea
                      id="growthOutlook"
                      value={optionForm.growthOutlook}
                      onChange={(e) => setOptionForm(prev => ({ ...prev, growthOutlook: e.target.value }))}
                      placeholder="e.g., Excellent - High demand across all industries"
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setCareerOptionDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createOptionMutation.isPending || updateOptionMutation.isPending}
                    >
                      {editingOption ? 'Update Career Option' : 'Add Career Option'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {optionsLoading ? (
            <div className="text-center py-8">Loading career options...</div>
          ) : careerOptions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No career options found. Add your first career option!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {careerOptions.map((option) => (
                <Card key={option.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{option.title}</h3>
                          <Badge variant="secondary">{option.category}</Badge>
                          {option.difficultyLevel && (
                            <Badge variant="outline">{option.difficultyLevel}</Badge>
                          )}
                          <Badge className={option.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {option.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{option.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Salary Range:</span><br />
                            {formatSalary(option.salaryMin, option.salaryMax)}
                          </div>
                          <div>
                            <span className="font-medium">Skills Required:</span><br />
                            {option.requiredSkills?.length ? `${option.requiredSkills.length} skills` : 'Not specified'}
                          </div>
                          <div>
                            <span className="font-medium">Growth Outlook:</span><br />
                            {option.growthOutlook ? 'Specified' : 'Not specified'}
                          </div>
                        </div>

                        {option.requiredSkills && option.requiredSkills.length > 0 && (
                          <div className="mt-3">
                            <span className="text-sm font-medium">Skills: </span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {option.requiredSkills.slice(0, 5).map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {option.requiredSkills.length > 5 && (
                                <Badge variant="outline" className="text-xs">
                                  +{option.requiredSkills.length - 5} more
                                </Badge>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditOption(option)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this career option?')) {
                              deleteOptionMutation.mutate(option.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="paths" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Career Paths</h2>
            <Dialog open={careerPathDialog} onOpenChange={(open) => {
              setCareerPathDialog(open);
              if (!open) {
                setEditingPath(null);
                resetPathForm();
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Career Path
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingPath ? 'Edit Career Path' : 'Add New Career Path'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handlePathSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pathTitle">Path Title</Label>
                      <Input
                        id="pathTitle"
                        value={pathForm.title}
                        onChange={(e) => setPathForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="e.g., Full Stack Developer Path"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="pathCategory">Category</Label>
                      <Select
                        value={pathForm.category}
                        onValueChange={(value) => setPathForm(prev => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="pathDescription">Description</Label>
                    <Textarea
                      id="pathDescription"
                      value={pathForm.description}
                      onChange={(e) => setPathForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Brief description of the career path"
                    />
                  </div>

                  <div>
                    <Label htmlFor="overview">Overview</Label>
                    <Textarea
                      id="overview"
                      value={pathForm.overview}
                      onChange={(e) => setPathForm(prev => ({ ...prev, overview: e.target.value }))}
                      placeholder="Comprehensive overview of the career path"
                    />
                  </div>

                  <div>
                    <Label htmlFor="dayInLife">Day in Life</Label>
                    <Textarea
                      id="dayInLife"
                      value={pathForm.dayInLife}
                      onChange={(e) => setPathForm(prev => ({ ...prev, dayInLife: e.target.value }))}
                      placeholder="What does a typical day look like?"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="salaryExpectations">Salary Expectations</Label>
                      <Input
                        id="salaryExpectations"
                        value={pathForm.salaryExpectations}
                        onChange={(e) => setPathForm(prev => ({ ...prev, salaryExpectations: e.target.value }))}
                        placeholder="e.g., ₹5-25 LPA"
                      />
                    </div>
                    <div>
                      <Label htmlFor="pathGrowthOutlook">Growth Outlook</Label>
                      <Input
                        id="pathGrowthOutlook"
                        value={pathForm.growthOutlook}
                        onChange={(e) => setPathForm(prev => ({ ...prev, growthOutlook: e.target.value }))}
                        placeholder="Future prospects"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setCareerPathDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createPathMutation.isPending}
                    >
                      {editingPath ? 'Update Career Path' : 'Add Career Path'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {pathsLoading ? (
            <div className="text-center py-8">Loading career paths...</div>
          ) : careerPaths.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No career paths found. Add your first career path!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {careerPaths.map((path) => (
                <Card key={path.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{path.title}</h3>
                          <Badge variant="secondary">{path.category}</Badge>
                          <Badge className={path.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                            {path.isActive ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        
                        {path.description && (
                          <p className="text-gray-600 mb-3">{path.description}</p>
                        )}
                        
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Overview:</span><br />
                            {path.overview ? 'Available' : 'Not set'}
                          </div>
                          <div>
                            <span className="font-medium">Salary Info:</span><br />
                            {path.salaryExpectations || 'Not specified'}
                          </div>
                          <div>
                            <span className="font-medium">Growth:</span><br />
                            {path.growthOutlook ? 'Specified' : 'Not set'}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditPath(path)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </Layout>
  );
};

export default AdminCareerManagement;