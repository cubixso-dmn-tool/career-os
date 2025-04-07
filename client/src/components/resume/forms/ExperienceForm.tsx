import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  ArrowRight, 
  PlusCircle, 
  Building, 
  Briefcase, 
  Calendar, 
  MapPin, 
  Edit, 
  Trash2,
  ChevronUp,
  ChevronDown,
  Save,
  X
} from 'lucide-react';
import { ResumeData } from '../ResumeTemplates';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

interface ExperienceFormProps {
  initialData: ResumeData['experience'];
  onSubmit: (data: ResumeData['experience']) => void;
  onBack: () => void;
}

type Experience = ResumeData['experience'][0];

const ExperienceForm: React.FC<ExperienceFormProps> = ({ initialData, onSubmit, onBack }) => {
  const [experiences, setExperiences] = useState<Experience[]>(initialData);
  const [isOpen, setIsOpen] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<Experience | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Initial empty experience
  const emptyExperience: Experience = {
    id: '',
    company: '',
    position: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
    highlights: []
  };

  // Function to handle adding a new experience
  const handleAddExperience = () => {
    setCurrentExperience({ 
      ...emptyExperience, 
      id: `exp-${Date.now()}` 
    });
    setEditIndex(null);
    setIsOpen(true);
  };

  // Function to handle editing an existing experience
  const handleEditExperience = (index: number) => {
    setCurrentExperience(experiences[index]);
    setEditIndex(index);
    setIsOpen(true);
  };

  // Function to handle moving an experience up in the list
  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newExperiences = [...experiences];
      [newExperiences[index], newExperiences[index - 1]] = [newExperiences[index - 1], newExperiences[index]];
      setExperiences(newExperiences);
    }
  };

  // Function to handle moving an experience down in the list
  const handleMoveDown = (index: number) => {
    if (index < experiences.length - 1) {
      const newExperiences = [...experiences];
      [newExperiences[index], newExperiences[index + 1]] = [newExperiences[index + 1], newExperiences[index]];
      setExperiences(newExperiences);
    }
  };

  // Function to handle deleting an experience
  const handleDeleteExperience = (index: number) => {
    const newExperiences = [...experiences];
    newExperiences.splice(index, 1);
    setExperiences(newExperiences);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };

  // Function to handle toggling the expanded state of an experience
  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  // Function to handle saving a new or edited experience
  const handleSaveExperience = () => {
    if (!currentExperience) return;

    const newExperiences = [...experiences];
    if (editIndex !== null) {
      newExperiences[editIndex] = currentExperience;
    } else {
      newExperiences.push(currentExperience);
    }
    
    // Sort experiences by start date (newest first)
    newExperiences.sort((a, b) => {
      const dateA = a.endDate === 'Present' ? new Date().getTime() : new Date(a.endDate).getTime();
      const dateB = b.endDate === 'Present' ? new Date().getTime() : new Date(b.endDate).getTime();
      return dateB - dateA;
    });
    
    setExperiences(newExperiences);
    setIsOpen(false);
    setCurrentExperience(null);
    setEditIndex(null);
  };

  // Function to handle adding a highlight to the current experience
  const addHighlight = () => {
    if (!currentExperience) return;
    setCurrentExperience({
      ...currentExperience,
      highlights: [...(currentExperience.highlights || []), '']
    });
  };

  // Function to handle updating a highlight
  const updateHighlight = (index: number, value: string) => {
    if (!currentExperience) return;
    const newHighlights = [...(currentExperience.highlights || [])];
    newHighlights[index] = value;
    setCurrentExperience({
      ...currentExperience,
      highlights: newHighlights
    });
  };

  // Function to handle removing a highlight
  const removeHighlight = (index: number) => {
    if (!currentExperience) return;
    const newHighlights = [...(currentExperience.highlights || [])];
    newHighlights.splice(index, 1);
    setCurrentExperience({
      ...currentExperience,
      highlights: newHighlights
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(experiences);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Work Experience</h2>
      <p className="text-gray-600 mb-6">
        Add your relevant work experience, starting with the most recent. For each position, include accomplishments that demonstrate your skills and expertise.
      </p>
      
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Your Experience History</CardTitle>
            <Button 
              onClick={handleAddExperience}
              variant="outline"
              size="sm"
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {experiences.length === 0 ? (
            <div className="text-center py-6 text-gray-500 border-2 border-dashed border-gray-200 rounded-lg">
              <Briefcase className="h-12 w-12 mx-auto mb-3 text-gray-400" />
              <p className="mb-1">No work experience added yet</p>
              <p className="text-sm">Click "Add Experience" to include your work history</p>
            </div>
          ) : (
            <div className="space-y-4">
              {experiences.map((experience, index) => (
                <Card 
                  key={experience.id} 
                  className={`border ${expandedIndex === index ? 'border-primary/30' : 'border-gray-200'}`}
                >
                  <CardHeader className="py-3 px-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-gray-500" />
                          <h3 className="font-medium">{experience.company}</h3>
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Briefcase className="h-3.5 w-3.5 mr-1.5" />
                          <span>{experience.position}</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          className="h-8 w-8 p-0"
                          onClick={() => toggleExpanded(index)}
                        >
                          {expandedIndex === index ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-52 p-2" align="end">
                            <div className="grid gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start"
                                onClick={() => handleEditExperience(index)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start"
                                onClick={() => handleDeleteExperience(index)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                              <Separator className="my-1" />
                              <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start"
                                onClick={() => handleMoveUp(index)}
                                disabled={index === 0}
                              >
                                <ChevronUp className="h-4 w-4 mr-2" />
                                Move Up
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start"
                                onClick={() => handleMoveDown(index)}
                                disabled={index === experiences.length - 1}
                              >
                                <ChevronDown className="h-4 w-4 mr-2" />
                                Move Down
                              </Button>
                            </div>
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>
                  </CardHeader>
                  
                  {expandedIndex === index && (
                    <CardContent>
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center text-sm">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                          <span>
                            {experience.startDate} - {experience.endDate}
                          </span>
                        </div>
                        
                        {experience.location && (
                          <div className="flex items-center text-sm">
                            <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                            <span>{experience.location}</span>
                          </div>
                        )}
                        
                        {experience.description && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-700">{experience.description}</p>
                          </div>
                        )}
                        
                        {experience.highlights && experience.highlights.length > 0 && (
                          <div className="mt-3">
                            <h4 className="text-xs font-medium uppercase text-gray-500 mb-2">Key Achievements</h4>
                            <ul className="space-y-1.5 list-disc pl-5 text-sm">
                              {experience.highlights.map((highlight, i) => (
                                <li key={i}>{highlight}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editIndex !== null ? 'Edit Experience' : 'Add Experience'}
            </DialogTitle>
            <DialogDescription>
              Add the details of your work experience. Be specific about your role, responsibilities, and achievements.
            </DialogDescription>
          </DialogHeader>
          
          {currentExperience && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <Input
                    placeholder="e.g. ABC Corporation"
                    value={currentExperience.company}
                    onChange={(e) => setCurrentExperience({...currentExperience, company: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Job Title</label>
                  <Input
                    placeholder="e.g. Senior Software Engineer"
                    value={currentExperience.position}
                    onChange={(e) => setCurrentExperience({...currentExperience, position: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Start Date</label>
                  <Input
                    placeholder="e.g. Jan 2020"
                    value={currentExperience.startDate}
                    onChange={(e) => setCurrentExperience({...currentExperience, startDate: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">End Date</label>
                  <Input
                    placeholder="e.g. Dec 2022 or Present"
                    value={currentExperience.endDate}
                    onChange={(e) => setCurrentExperience({...currentExperience, endDate: e.target.value})}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  placeholder="e.g. Mumbai, India or Remote"
                  value={currentExperience.location}
                  onChange={(e) => setCurrentExperience({...currentExperience, location: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium">Job Description</label>
                <Textarea
                  placeholder="Briefly describe your role and responsibilities"
                  value={currentExperience.description}
                  onChange={(e) => setCurrentExperience({...currentExperience, description: e.target.value})}
                  rows={3}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium">Key Achievements & Responsibilities</label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addHighlight}
                  >
                    <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                    Add Point
                  </Button>
                </div>
                
                {(!currentExperience.highlights || currentExperience.highlights.length === 0) && (
                  <div className="text-sm text-gray-500 border border-dashed border-gray-200 rounded p-4 text-center">
                    <p>No achievements added yet</p>
                    <p className="text-xs">Click "Add Point" to highlight your key accomplishments</p>
                  </div>
                )}
                
                {currentExperience.highlights && currentExperience.highlights.map((highlight, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={highlight}
                      onChange={(e) => updateHighlight(index, e.target.value)}
                      placeholder="e.g. Increased team productivity by 25% through implementation of new processes"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeHighlight(index)}
                      className="h-9 w-9"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                
                {currentExperience.highlights && currentExperience.highlights.length > 0 && (
                  <div className="text-xs text-gray-500 italic">
                    <p>Tips: Start with strong action verbs (Developed, Led, Implemented, etc.)</p>
                    <p>Include metrics and specific results where possible</p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveExperience}
              disabled={!currentExperience || !currentExperience.company || !currentExperience.position}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Experience
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="border-t pt-6 mt-2">
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-base font-medium mb-2">Experience Tips:</h3>
          <ul className="space-y-2 text-sm text-gray-700 list-disc pl-4">
            <li>Focus on achievements rather than just responsibilities</li>
            <li>Use numbers and metrics to quantify your impact (e.g., "Increased sales by 20%")</li>
            <li>Include relevant experience only, especially if you have a lengthy work history</li>
            <li>For each role, include 3-5 bullet points highlighting your most significant contributions</li>
            <li>Use action verbs to start your bullet points (e.g., Developed, Managed, Led, Created)</li>
            <li>Tailor your experience to match the requirements of your target job</li>
          </ul>
        </div>
      
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between">
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
    </div>
  );
};

export default ExperienceForm;