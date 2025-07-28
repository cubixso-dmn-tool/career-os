import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { ArrowLeft, ArrowRight, Plus, X, Edit2, Save, Trash2 } from 'lucide-react';
import { ResumeData } from '../ResumeTemplates';

interface SkillsFormProps {
  initialData: ResumeData['skills'];
  onSubmit: (data: ResumeData['skills']) => void;
  onBack: () => void;
}

// Define types for skill level and category
type SkillLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
type SkillCategory = 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Mobile' | 'Languages' | 'Frameworks' | 'Tools' | 'Soft Skills' | 'Design' | 'Cloud' | 'AI/ML' | 'Other';

interface Skill {
  id: string;
  name: string;
  level?: SkillLevel;
  category?: SkillCategory;
}

// Define skill categories for easier selection
const skillCategories: SkillCategory[] = [
  'Frontend',
  'Backend',
  'Database',
  'DevOps',
  'Mobile',
  'Languages',
  'Frameworks',
  'Tools',
  'Soft Skills',
  'Design',
  'Cloud',
  'AI/ML',
  'Other'
];

// Define proficiency levels
const proficiencyLevels: SkillLevel[] = [
  'Beginner',
  'Intermediate',
  'Advanced',
  'Expert'
];

const SkillsForm: React.FC<SkillsFormProps> = ({ initialData, onSubmit, onBack }) => {
  // Convert initial data to our Skill type
  const [skills, setSkills] = useState<Skill[]>(
    initialData.map(skill => ({
      id: skill.id,
      name: skill.name,
      level: skill.level as SkillLevel | undefined,
      category: skill.category as SkillCategory | undefined
    }))
  );
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [newSkill, setNewSkill] = useState<Omit<Skill, 'id'>>({
    name: '',
    level: undefined,
    category: undefined
  });
  const [isAdding, setIsAdding] = useState(false);
  const [customCategory, setCustomCategory] = useState('');
  const [editingCustomCategory, setEditingCustomCategory] = useState('');

  // Generate a unique ID for new skills
  const generateId = () => `sk${Date.now()}`;

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    
    // Use custom category if "Other" is selected and custom category is provided
    const finalCategory = newSkill.category === 'Other' && customCategory.trim() 
      ? customCategory.trim() 
      : newSkill.category;
    
    // Ensure we don't have empty strings for optional fields
    const skillToAdd: Skill = {
      id: generateId(),
      name: newSkill.name.trim(),
      level: newSkill.level?.trim() as SkillLevel | undefined,
      category: finalCategory?.trim() as SkillCategory | undefined
    };
    
    setSkills([...skills, skillToAdd]);
    setNewSkill({
      name: '',
      level: undefined,
      category: undefined
    });
    setCustomCategory('');
    setIsAdding(false);
  };

  const handleUpdateSkill = () => {
    if (!editingSkill) return;
    
    // Use custom category if "Other" is selected and custom category is provided
    const finalCategory = editingSkill.category === 'Other' && editingCustomCategory.trim() 
      ? editingCustomCategory.trim() 
      : editingSkill.category;
    
    // Ensure we don't have empty strings for optional fields
    const updatedSkill: Skill = {
      ...editingSkill,
      name: editingSkill.name.trim(),
      level: editingSkill.level?.trim() as SkillLevel | undefined,
      category: finalCategory?.trim() as SkillCategory | undefined
    };
    
    setSkills(skills.map(skill => 
      skill.id === updatedSkill.id ? updatedSkill : skill
    ));
    
    setEditingSkill(null);
    setEditingCustomCategory('');
  };

  const handleDeleteSkill = (id: string) => {
    setSkills(skills.filter(skill => skill.id !== id));
    
    if (editingSkill && editingSkill.id === id) {
      setEditingSkill(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Convert back to the expected format for ResumeData
    const formattedSkills = skills.map(({ id, name, level, category }) => ({
      id,
      name,
      ...(level && { level }),
      ...(category && { category })
    }));
    
    onSubmit(formattedSkills);
  };

  // Group skills by category for better organization
  const skillsByCategory = skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Skills & Expertise</h2>
      <p className="text-gray-600 mb-6">
        Highlight your technical and professional skills. Group them by category and indicate your proficiency level.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Current Skills */}
        <div className="md:col-span-2">
          <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Your Skills</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAdding(true)}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Skill
              </Button>
            </div>
            
            {Object.keys(skillsByCategory).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>You haven't added any skills yet.</p>
                <p>Click "Add Skill" to get started.</p>
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
                  <div key={category}>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">{category}</h4>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map(skill => (
                        <Badge 
                          key={skill.id} 
                          variant="outline"
                          className={`px-3 py-1.5 flex items-center gap-1 ${
                            skill.level === 'Expert' 
                              ? 'bg-primary/10 border-primary/20' 
                              : skill.level === 'Advanced'
                                ? 'bg-blue-50 border-blue-200'
                                : skill.level === 'Intermediate'
                                  ? 'bg-gray-50 border-gray-200'
                                  : 'bg-gray-50 border-gray-200'
                          }`}
                        >
                          {skill.name}
                          {skill.level && (
                            <span className="ml-1 text-xs px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                              {skill.level}
                            </span>
                          )}
                          <button 
                            className="ml-1 text-gray-400 hover:text-gray-800"
                            onClick={() => {
                              setEditingSkill(skill);
                              // If the skill category is not one of the predefined ones, set it as custom
                              if (skill.category && !skillCategories.includes(skill.category as SkillCategory)) {
                                setEditingCustomCategory(skill.category);
                                setEditingSkill({...skill, category: 'Other'});
                              } else {
                                setEditingCustomCategory('');
                              }
                            }}
                          >
                            <Edit2 className="h-3 w-3" />
                          </button>
                          <button 
                            className="text-gray-400 hover:text-red-500"
                            onClick={() => handleDeleteSkill(skill.id)}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column - Add/Edit Form */}
        <div>
          {isAdding ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Add New Skill</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Skill Name</label>
                  <Input
                    placeholder="e.g. JavaScript, Project Management"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({...newSkill, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <Select
                    value={newSkill.category || ''}
                    onValueChange={(value) => setNewSkill({...newSkill, category: value as SkillCategory})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {newSkill.category === 'Other' && (
                    <div className="mt-2">
                      <Input
                        placeholder="Enter custom category"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium mb-1">Proficiency Level (Optional)</label>
                  </div>
                  <Select
                    value={newSkill.level || 'none'}
                    onValueChange={(value) => setNewSkill({...newSkill, level: value === 'none' ? undefined : value as SkillLevel})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {proficiencyLevels.map(level => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">You can leave this blank if you prefer not to specify your proficiency level</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setIsAdding(false)}
                >
                  Cancel
                </Button>
                <Button 
                  size="sm"
                  onClick={handleAddSkill}
                  disabled={!newSkill.name}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Skill
                </Button>
              </CardFooter>
            </Card>
          ) : editingSkill ? (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Edit Skill</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Skill Name</label>
                  <Input
                    placeholder="e.g. JavaScript, Project Management"
                    value={editingSkill.name}
                    onChange={(e) => setEditingSkill({...editingSkill, name: e.target.value})}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <Select
                    value={editingSkill.category || ''}
                    onValueChange={(value) => setEditingSkill({...editingSkill, category: value as SkillCategory})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {skillCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {editingSkill.category === 'Other' && (
                    <div className="mt-2">
                      <Input
                        placeholder="Enter custom category"
                        value={editingCustomCategory}
                        onChange={(e) => setEditingCustomCategory(e.target.value)}
                      />
                    </div>
                  )}
                </div>
                
                <div>
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium mb-1">Proficiency Level (Optional)</label>
                  </div>
                  <Select
                    value={editingSkill.level || 'none'}
                    onValueChange={(value) => setEditingSkill({...editingSkill, level: value === 'none' ? undefined : value as SkillLevel})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      {proficiencyLevels.map(level => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-gray-500 mt-1">You can leave this blank if you prefer not to specify your proficiency level</p>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setEditingSkill(null)}
                >
                  Cancel
                </Button>
                <div className="space-x-2">
                  <Button 
                    variant="destructive" 
                    size="sm"
                    onClick={() => handleDeleteSkill(editingSkill.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete
                  </Button>
                  <Button 
                    size="sm"
                    onClick={handleUpdateSkill}
                    disabled={!editingSkill.name}
                  >
                    <Save className="h-4 w-4 mr-1" />
                    Save
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ) : (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-lg font-medium mb-4">Skills Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700 list-disc pl-4">
                <li>Group similar skills by category for better organization</li>
                <li>Include both technical and soft skills</li>
                <li>Be honest about your proficiency levels</li>
                <li>Prioritize skills that are relevant to your target role</li>
                <li>Include technologies and tools you're familiar with</li>
                <li>For technical roles, specify skills by specific technologies (e.g., "React.js" instead of just "JavaScript")</li>
              </ul>
            </div>
          )}
        </div>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="flex justify-between pt-8">
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button type="submit">
            Next Step
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SkillsForm;