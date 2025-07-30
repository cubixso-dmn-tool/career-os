import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from '@/components/ui/select';
import { 
  ArrowLeft, 
  ArrowRight, 
  PlusCircle, 
  Trash2, 
  Edit, 
  School, 
  Calendar, 
  GraduationCap, 
  MapPin, 
  Award,
  MoreHorizontal,
  ChevronUp,
  ChevronDown,
  Save,
  X
} from 'lucide-react';
import { ResumeData } from '../ResumeTemplates';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';

interface EducationFormProps {
  initialData: ResumeData['education'];
  onSubmit: (data: ResumeData['education']) => void;
  onBack: () => void;
}

type Education = ResumeData['education'][0];

// Indian Education degree types
const degreeTypes = [
  'BTech/BE',
  'MTech/ME',
  'BSc',
  'MSc',
  'BCA',
  'MCA',
  'BCom',
  'MCom',
  'BBA',
  'MBA',
  'PhD',
  'Diploma',
  'HSC/12th',
  'SSC/10th',
  'Certificate Course',
  'Other'
];

// Common fields of study for Indian students
const fieldsOfStudy = [
  'Computer Science',
  'Information Technology',
  'Electrical Engineering',
  'Electronics Engineering',
  'Mechanical Engineering',
  'Civil Engineering',
  'Business Administration',
  'Commerce',
  'Economics',
  'Science',
  'Arts',
  'Design',
  'Medicine',
  'Pharmacy',
  'Law',
  'Other'
];

const EducationForm: React.FC<EducationFormProps> = ({ initialData, onSubmit, onBack }) => {
  const [educations, setEducations] = useState<Education[]>(initialData);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentEducation, setCurrentEducation] = useState<Education | null>(null);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  
  // State for custom "Other" inputs
  const [customDegree, setCustomDegree] = useState('');
  const [customField, setCustomField] = useState('');
  
  // Empty education template
  const emptyEducation: Education = {
    id: '',
    institution: '',
    degree: '',
    field: '',
    startDate: '',
    endDate: '',
    location: '',
    description: '',
    gpa: '',
    highlights: []
  };
  
  // Function to handle adding a new education entry
  const handleAddEducation = () => {
    setCurrentEducation({
      ...emptyEducation,
      id: `edu-${Date.now()}`
    });
    setEditIndex(null);
    setCustomDegree('');
    setCustomField('');
    setIsDialogOpen(true);
  };
  
  // Function to handle editing an existing education entry
  const handleEditEducation = (index: number) => {
    const education = educations[index];
    setCurrentEducation({...education});
    setEditIndex(index);
    
    // Check if degree or field has custom "Other" values
    if (education.degree?.startsWith('Other - ')) {
      setCustomDegree(education.degree.replace('Other - ', ''));
    } else {
      setCustomDegree('');
    }
    
    if (education.field?.startsWith('Other - ')) {
      setCustomField(education.field.replace('Other - ', ''));
    } else {
      setCustomField('');
    }
    
    setIsDialogOpen(true);
  };
  
  // Function to handle moving an education up in the list
  const handleMoveUp = (index: number) => {
    if (index > 0) {
      const newEducations = [...educations];
      [newEducations[index], newEducations[index - 1]] = [
        newEducations[index - 1],
        newEducations[index]
      ];
      setEducations(newEducations);
      if (expandedIndex === index) {
        setExpandedIndex(index - 1);
      } else if (expandedIndex === index - 1) {
        setExpandedIndex(index);
      }
    }
  };
  
  // Function to handle moving an education down in the list
  const handleMoveDown = (index: number) => {
    if (index < educations.length - 1) {
      const newEducations = [...educations];
      [newEducations[index], newEducations[index + 1]] = [
        newEducations[index + 1],
        newEducations[index]
      ];
      setEducations(newEducations);
      if (expandedIndex === index) {
        setExpandedIndex(index + 1);
      } else if (expandedIndex === index + 1) {
        setExpandedIndex(index);
      }
    }
  };
  
  // Function to handle deleting an education entry
  const handleDeleteEducation = (index: number) => {
    const newEducations = [...educations];
    newEducations.splice(index, 1);
    setEducations(newEducations);
    if (expandedIndex === index) {
      setExpandedIndex(null);
    } else if (expandedIndex !== null && expandedIndex > index) {
      setExpandedIndex(expandedIndex - 1);
    }
  };
  
  // Function to handle toggling the expanded state of an education
  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  
  // Handle degree selection with custom "Other" support
  const handleDegreeChange = (value: string) => {
    if (!currentEducation) return;
    
    if (value === 'Other') {
      setCurrentEducation({
        ...currentEducation,
        degree: customDegree ? `Other - ${customDegree}` : 'Other'
      });
    } else {
      setCurrentEducation({
        ...currentEducation,
        degree: value
      });
      setCustomDegree(''); // Clear custom input when selecting predefined option
    }
  };

  // Handle field selection with custom "Other" support
  const handleFieldChange = (value: string) => {
    if (!currentEducation) return;
    
    if (value === 'Other') {
      setCurrentEducation({
        ...currentEducation,
        field: customField ? `Other - ${customField}` : 'Other'
      });
    } else {
      setCurrentEducation({
        ...currentEducation,
        field: value
      });
      setCustomField(''); // Clear custom input when selecting predefined option
    }
  };

  // Handle custom degree input
  const handleCustomDegreeChange = (value: string) => {
    setCustomDegree(value);
    if (currentEducation && currentEducation.degree === 'Other') {
      setCurrentEducation({
        ...currentEducation,
        degree: value ? `Other - ${value}` : 'Other'
      });
    }
  };

  // Handle custom field input
  const handleCustomFieldChange = (value: string) => {
    setCustomField(value);
    if (currentEducation && currentEducation.field === 'Other') {
      setCurrentEducation({
        ...currentEducation,
        field: value ? `Other - ${value}` : 'Other'
      });
    }
  };

  // Function to handle saving a new or edited education
  const handleSaveEducation = () => {
    if (!currentEducation) return;
    
    const newEducations = [...educations];
    if (editIndex !== null) {
      newEducations[editIndex] = currentEducation;
    } else {
      newEducations.push(currentEducation);
    }
    
    // Sort by most recent education first
    newEducations.sort((a, b) => {
      const dateA = a.endDate === 'Present' ? new Date().getTime() : new Date(a.endDate).getTime();
      const dateB = b.endDate === 'Present' ? new Date().getTime() : new Date(b.endDate).getTime();
      return dateB - dateA;
    });
    
    setEducations(newEducations);
    setIsDialogOpen(false);
    setCurrentEducation(null);
    setEditIndex(null);
  };
  
  // Function to handle adding a highlight to the current education
  const addHighlight = () => {
    if (!currentEducation) return;
    setCurrentEducation({
      ...currentEducation,
      highlights: [...(currentEducation.highlights || []), '']
    });
  };
  
  // Function to handle updating a highlight
  const updateHighlight = (index: number, value: string) => {
    if (!currentEducation) return;
    const newHighlights = [...(currentEducation.highlights || [])];
    newHighlights[index] = value;
    setCurrentEducation({
      ...currentEducation,
      highlights: newHighlights
    });
  };
  
  // Function to handle removing a highlight
  const removeHighlight = (index: number) => {
    if (!currentEducation) return;
    const newHighlights = [...(currentEducation.highlights || [])];
    newHighlights.splice(index, 1);
    setCurrentEducation({
      ...currentEducation,
      highlights: newHighlights
    });
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(educations);
  };
  
  // Determine if the current education is in progress
  const [isCurrentlyStudying, setIsCurrentlyStudying] = useState(false);
  
  // Handle currently studying toggle
  const handleCurrentlyStudyingChange = (checked: boolean) => {
    if (!currentEducation) return;
    
    setIsCurrentlyStudying(checked);
    if (checked) {
      setCurrentEducation({
        ...currentEducation,
        endDate: 'Present'
      });
    } else {
      setCurrentEducation({
        ...currentEducation,
        endDate: ''
      });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Education</h2>
      <p className="text-gray-600 mb-6">
        Add your educational qualifications, starting with the most recent. Include degrees, diplomas, certifications, and other relevant educational achievements.
      </p>
      
      <Card className="mb-8">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle>Your Education History</CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={handleAddEducation}
            >
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Education
            </Button>
          </div>
          <CardDescription>Add your degrees, certifications, and relevant coursework</CardDescription>
        </CardHeader>
        
        <CardContent>
          {educations.length === 0 ? (
            <div className="text-center py-10 border-2 border-dashed border-gray-200 rounded-lg">
              <School className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-1">No education added yet</h3>
              <p className="text-gray-500 mb-4">Add your educational background to enhance your resume</p>
              <Button onClick={handleAddEducation}>
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Education
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {educations.map((education, index) => (
                <Card 
                  key={education.id} 
                  className={`border ${expandedIndex === index ? 'border-primary/30' : 'border-gray-200'}`}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <div className="flex items-center">
                          <School className="h-4 w-4 mr-2 text-gray-500" />
                          <h3 className="font-medium">{education.institution}</h3>
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <GraduationCap className="h-3.5 w-3.5 mr-1.5" />
                          <span>
                            {education.degree}
                            {education.field && `, ${education.field}`}
                          </span>
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
                            <Button 
                              variant="ghost" 
                              size="sm"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-52 p-2" align="end">
                            <div className="grid gap-1">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start"
                                onClick={() => handleEditEducation(index)}
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="justify-start"
                                onClick={() => handleDeleteEducation(index)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
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
                                disabled={index === educations.length - 1}
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
                    <CardContent className="px-4 pt-0 pb-3">
                      <div className="space-y-3 border-t border-gray-100 pt-3 mt-1 text-sm">
                        <div className="flex items-center">
                          <Calendar className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                          <span>
                            {education.startDate} - {education.endDate}
                          </span>
                        </div>
                        
                        {education.location && (
                          <div className="flex items-center">
                            <MapPin className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                            <span>{education.location}</span>
                          </div>
                        )}
                        
                        {education.gpa && (
                          <div className="flex items-center">
                            <Award className="h-3.5 w-3.5 mr-1.5 text-gray-500" />
                            <span>GPA/Percentage: {education.gpa}</span>
                          </div>
                        )}
                        
                        {education.description && (
                          <div className="mt-2">
                            <p className="text-gray-700">{education.description}</p>
                          </div>
                        )}
                        
                        {education.highlights && education.highlights.length > 0 && (
                          <div className="mt-2">
                            <h4 className="text-xs font-medium uppercase text-gray-500 mb-1">Achievements & Activities</h4>
                            <ul className="list-disc pl-5 space-y-1">
                              {education.highlights.map((highlight, i) => (
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
      
      {/* Education Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editIndex !== null ? "Edit Education" : "Add Education"}
            </DialogTitle>
            <DialogDescription>
              Add details about your educational background, including degrees, institutions, and achievements.
            </DialogDescription>
          </DialogHeader>
          
          {currentEducation && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Institution Name</label>
                  <Input
                    placeholder="e.g. Indian Institute of Technology, Delhi"
                    value={currentEducation.institution}
                    onChange={(e) => setCurrentEducation({
                      ...currentEducation,
                      institution: e.target.value
                    })}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Degree</label>
                    <Select
                      value={currentEducation.degree?.startsWith('Other - ') ? 'Other' : currentEducation.degree}
                      onValueChange={handleDegreeChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select degree" />
                      </SelectTrigger>
                      <SelectContent>
                        {degreeTypes.map((degree) => (
                          <SelectItem key={degree} value={degree}>
                            {degree}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Custom degree input when "Other" is selected */}
                    {(currentEducation.degree === 'Other' || currentEducation.degree?.startsWith('Other - ')) && (
                      <div className="mt-2">
                        <Input
                          placeholder="Enter custom degree (e.g., BArch, BSW)"
                          value={customDegree}
                          onChange={(e) => handleCustomDegreeChange(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Field of Study</label>
                    <Select
                      value={currentEducation.field?.startsWith('Other - ') ? 'Other' : currentEducation.field}
                      onValueChange={handleFieldChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select field" />
                      </SelectTrigger>
                      <SelectContent>
                        {fieldsOfStudy.map((field) => (
                          <SelectItem key={field} value={field}>
                            {field}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    
                    {/* Custom field input when "Other" is selected */}
                    {(currentEducation.field === 'Other' || currentEducation.field?.startsWith('Other - ')) && (
                      <div className="mt-2">
                        <Input
                          placeholder="Enter custom field (e.g., Data Science, Psychology)"
                          value={customField}
                          onChange={(e) => handleCustomFieldChange(e.target.value)}
                        />
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Date</label>
                    <Input
                      placeholder="e.g. Aug 2018"
                      value={currentEducation.startDate}
                      onChange={(e) => setCurrentEducation({
                        ...currentEducation,
                        startDate: e.target.value
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium">End Date</label>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="currently-studying"
                          checked={isCurrentlyStudying || currentEducation.endDate === 'Present'}
                          onCheckedChange={handleCurrentlyStudyingChange}
                        />
                        <Label htmlFor="currently-studying" className="text-xs">
                          Currently Studying
                        </Label>
                      </div>
                    </div>
                    
                    <Input
                      placeholder="e.g. May 2022"
                      value={currentEducation.endDate}
                      onChange={(e) => setCurrentEducation({
                        ...currentEducation,
                        endDate: e.target.value
                      })}
                      disabled={isCurrentlyStudying || currentEducation.endDate === 'Present'}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Location</label>
                    <Input
                      placeholder="e.g. New Delhi, India"
                      value={currentEducation.location}
                      onChange={(e) => setCurrentEducation({
                        ...currentEducation,
                        location: e.target.value
                      })}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">GPA / Percentage</label>
                    <Input
                      placeholder="e.g. 3.8/4.0 or 85%"
                      value={currentEducation.gpa}
                      onChange={(e) => setCurrentEducation({
                        ...currentEducation,
                        gpa: e.target.value
                      })}
                    />
                    <p className="text-xs text-gray-500">
                      Format: 8.5/10 CGPA or 85% or First Class with Distinction
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium">Description (Optional)</label>
                  <Textarea
                    placeholder="Brief description of your program or notable coursework"
                    value={currentEducation.description}
                    onChange={(e) => setCurrentEducation({
                      ...currentEducation,
                      description: e.target.value
                    })}
                    rows={2}
                  />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Achievements & Activities (Optional)</label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addHighlight}
                    >
                      <PlusCircle className="h-3.5 w-3.5 mr-1.5" />
                      Add
                    </Button>
                  </div>
                  
                  {(!currentEducation.highlights || currentEducation.highlights.length === 0) && (
                    <p className="text-xs text-gray-500 italic">
                      Add notable achievements, honors, extracurricular activities, or relevant coursework
                    </p>
                  )}
                  
                  {currentEducation.highlights && currentEducation.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={highlight}
                        onChange={(e) => updateHighlight(index, e.target.value)}
                        placeholder="e.g. Dean's List (All semesters) or Class Representative"
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
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEducation}
              disabled={!currentEducation?.institution || !currentEducation?.degree}
            >
              <Save className="h-4 w-4 mr-2" />
              Save Education
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <div className="border-t pt-6 mt-2">
        <div className="bg-gray-50 p-5 rounded-lg border border-gray-200 mb-6">
          <h3 className="text-base font-medium mb-2">Education Tips for Indian Students:</h3>
          <ul className="space-y-2 text-sm text-gray-700 list-disc pl-4">
            <li>Include your 10th and 12th board results if they were particularly strong</li>
            <li>For degrees, mention your specialization (e.g., BTech in Computer Science)</li>
            <li>Include your CGPA/percentage and the scale (e.g., 8.7/10 CGPA or 87%)</li>
            <li>Mention any competitive exams cleared (JEE, GATE, CAT, etc.) with good ranks</li>
            <li>Include relevant coursework that aligns with your target job</li>
            <li>List scholarships, dean's list appearances, or other academic achievements</li>
            <li>For recent graduates, education should typically come before work experience</li>
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

export default EducationForm;