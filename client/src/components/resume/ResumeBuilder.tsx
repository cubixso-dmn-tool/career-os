import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  FileText, 
  Download, 
  Share2, 
  Edit3, 
  Eye, 
  ArrowLeft,
  ArrowRight,
  Save,
  PlusCircle
} from 'lucide-react';

import TemplateSelector from './TemplateSelector';
import { 
  resumeTemplates, 
  ResumeData,
  ProfessionalTemplate, 
  CreativeTemplate, 
  TechnicalTemplate, 
  AcademicTemplate, 
  StartupTemplate 
} from './ResumeTemplates';
import PersonalInfoForm from './forms/PersonalInfoForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';
import ProjectsForm from './forms/ProjectsForm';

// Sample data for demonstration
const sampleResumeData: ResumeData = {
  personalInfo: {
    name: 'Priya Sharma',
    title: 'Full Stack Developer',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    location: 'Bangalore, Karnataka',
    website: 'github.com/priyasharma',
    summary: 'Full Stack Developer with 3+ years of experience in MERN stack, building responsive web applications and RESTful APIs. Passionate about clean code and user-centric design.',
    profileImage: 'https://ui-avatars.com/api/?name=Priya+Sharma&background=3949AB&color=fff'
  },
  experience: [
    {
      id: 'exp1',
      title: 'Full Stack Developer',
      company: 'TechSolutions India',
      location: 'Bangalore, India',
      startDate: 'Jun 2022',
      endDate: 'Present',
      current: true,
      description: 'Leading development of customer-facing web applications using React, Node.js, and MongoDB.',
      highlights: [
        'Improved application performance by 40% through code optimization and implementing efficient data fetching strategies',
        'Developed and maintained RESTful APIs serving over 10,000 daily users',
        'Implemented CI/CD pipeline reducing deployment time by 60%',
        'Mentored 4 junior developers on best practices and coding standards'
      ]
    },
    {
      id: 'exp2',
      title: 'Frontend Developer',
      company: 'Innovative Web Services',
      location: 'Hyderabad, India',
      startDate: 'Jan 2020',
      endDate: 'May 2022',
      current: false,
      description: 'Designed and implemented responsive user interfaces for various client projects.',
      highlights: [
        'Built interactive dashboards using React and Redux that improved user engagement by 35%',
        'Collaborated with UX designers to implement pixel-perfect interfaces across 15+ projects',
        'Reduced load time by 50% through lazy loading and code splitting techniques',
        'Integrated third-party APIs for payment processing and data visualization'
      ]
    }
  ],
  education: [
    {
      id: 'edu1',
      institution: 'Indian Institute of Technology, Delhi',
      degree: 'B.Tech',
      field: 'Computer Science',
      location: 'New Delhi, India',
      startDate: 'Aug 2016',
      endDate: 'May 2020',
      current: false,
      gpa: '8.5/10',
      achievements: [
        'Graduated with First Class Honors',
        'Lead developer for university student portal',
        'Published research paper on efficient algorithms in distributed systems'
      ]
    }
  ],
  skills: [
    { id: 'sk1', name: 'JavaScript', level: 'Expert', category: 'Frontend' },
    { id: 'sk2', name: 'React.js', level: 'Expert', category: 'Frontend' },
    { id: 'sk3', name: 'Node.js', level: 'Advanced', category: 'Backend' },
    { id: 'sk4', name: 'Express.js', level: 'Advanced', category: 'Backend' },
    { id: 'sk5', name: 'MongoDB', level: 'Intermediate', category: 'Database' },
    { id: 'sk6', name: 'TypeScript', level: 'Intermediate', category: 'Languages' },
    { id: 'sk7', name: 'GraphQL', level: 'Intermediate', category: 'API' },
    { id: 'sk8', name: 'Docker', level: 'Beginner', category: 'DevOps' },
    { id: 'sk9', name: 'AWS', level: 'Beginner', category: 'Cloud' },
    { id: 'sk10', name: 'Agile Methodologies', level: 'Advanced', category: 'Soft Skills' },
    { id: 'sk11', name: 'CI/CD', level: 'Intermediate', category: 'DevOps' },
    { id: 'sk12', name: 'Git', level: 'Advanced', category: 'Tools' }
  ],
  projects: [
    {
      id: 'prj1',
      name: 'E-commerce Platform',
      description: 'A full-stack e-commerce application with product catalog, shopping cart, and payment processing.',
      url: 'github.com/priyasharma/ecommerce-platform',
      technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redux', 'Stripe API'],
      highlights: [
        'Implemented JWT authentication and role-based access control',
        'Built a responsive UI that works across desktop and mobile devices',
        'Integrated payment gateway with secure checkout process',
        'Implemented real-time order tracking using WebSockets'
      ],
      startDate: 'Jan 2022',
      endDate: 'Apr 2022'
    },
    {
      id: 'prj2',
      name: 'Task Management Dashboard',
      description: 'A collaborative task management tool with real-time updates and analytics dashboard.',
      url: 'github.com/priyasharma/task-manager',
      technologies: ['React', 'TypeScript', 'Firebase', 'Material UI', 'Chart.js'],
      highlights: [
        'Built a real-time collaboration system with Firebase',
        'Implemented drag-and-drop task management interface',
        'Created interactive charts and reports for project progress',
        'Designed and implemented notification system for task assignments and deadlines'
      ],
      startDate: 'Aug 2021',
      endDate: 'Nov 2021'
    }
  ],
  certifications: [
    {
      id: 'cert1',
      name: 'AWS Certified Developer - Associate',
      issuer: 'Amazon Web Services',
      date: 'Oct 2022',
      url: 'aws.amazon.com/certification/certified-developer-associate/',
      description: 'Demonstrated knowledge of core AWS services, uses, and best practices for developing, deploying, and debugging cloud-based applications.'
    },
    {
      id: 'cert2',
      name: 'MongoDB Certified Developer',
      issuer: 'MongoDB, Inc.',
      date: 'May 2021',
      url: 'university.mongodb.com/certification',
      description: 'Verified expertise in MongoDB application development with knowledge of schema design, querying, indexing, and application architecture.'
    }
  ],
  languages: [
    { id: 'lang1', language: 'English', proficiency: 'Fluent' },
    { id: 'lang2', language: 'Hindi', proficiency: 'Native' },
    { id: 'lang3', language: 'Tamil', proficiency: 'Conversational' }
  ],
  achievements: [
    {
      id: 'ach1',
      title: 'Hackathon Winner',
      date: 'March 2023',
      description: 'First place at CodeFest 2023 for developing an AI-powered accessibility tool for visually impaired users.'
    },
    {
      id: 'ach2',
      title: 'Open Source Contributor',
      date: '2021 - Present',
      description: 'Active contributor to React and Node.js open source projects with over 50 accepted pull requests.'
    }
  ]
};

enum BuilderStep {
  SELECT_TEMPLATE = 'select_template',
  PERSONAL_INFO = 'personal_info',
  EXPERIENCE = 'experience',
  EDUCATION = 'education',
  SKILLS = 'skills',
  PROJECTS = 'projects',
  ADDITIONAL_INFO = 'additional_info',
  PREVIEW = 'preview'
}

// Map template IDs to their respective components
const templateComponentMap: Record<string, React.FC<any>> = {
  professional: ProfessionalTemplate,
  creative: CreativeTemplate,
  technical: TechnicalTemplate,
  academic: AcademicTemplate,
  startup: StartupTemplate
};

const ResumeBuilder: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  const [step, setStep] = useState<BuilderStep>(BuilderStep.SELECT_TEMPLATE);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('professional');
  const [resumeData, setResumeData] = useState<ResumeData>(sampleResumeData);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  
  // If we have a real user, update the personal info with their data
  useEffect(() => {
    if (user) {
      setResumeData(prevData => ({
        ...prevData,
        personalInfo: {
          ...prevData.personalInfo,
          name: user.name || prevData.personalInfo.name,
          email: user.email || prevData.personalInfo.email,
          // Only set profile image if user has one
          ...(user.avatar ? { profileImage: user.avatar } : {})
        }
      }));
    }
  }, [user]);
  
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setStep(BuilderStep.PERSONAL_INFO);
  };
  
  const handleUpdatePersonalInfo = (personalInfo: ResumeData['personalInfo']) => {
    setResumeData(prevData => ({
      ...prevData,
      personalInfo
    }));
    setStep(BuilderStep.EXPERIENCE);
  };
  
  const handleUpdateExperience = (experience: ResumeData['experience']) => {
    setResumeData(prevData => ({
      ...prevData,
      experience
    }));
    setStep(BuilderStep.EDUCATION);
  };
  
  const handleUpdateEducation = (education: ResumeData['education']) => {
    setResumeData(prevData => ({
      ...prevData,
      education
    }));
    setStep(BuilderStep.SKILLS);
  };
  
  const handleUpdateSkills = (skills: ResumeData['skills']) => {
    setResumeData(prevData => ({
      ...prevData,
      skills
    }));
    setStep(BuilderStep.PROJECTS);
  };
  
  const handleUpdateProjects = (projects: ResumeData['projects']) => {
    setResumeData(prevData => ({
      ...prevData,
      projects
    }));
    setStep(BuilderStep.ADDITIONAL_INFO);
  };
  
  const handleUpdateAdditionalInfo = (data: Pick<ResumeData, 'certifications' | 'languages' | 'achievements'>) => {
    setResumeData(prevData => ({
      ...prevData,
      ...data
    }));
    setStep(BuilderStep.PREVIEW);
  };
  
  const handleSaveResume = async () => {
    setIsSaving(true);
    
    try {
      // In a real app, you would save the resume to the database here
      // For now, we'll just simulate a successful save
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Resume saved successfully",
        description: "Your resume has been saved to your profile.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error saving resume:', error);
      toast({
        title: "Error saving resume",
        description: "There was an error saving your resume. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleDownloadResume = () => {
    // In a real app, this would generate a PDF and trigger a download
    toast({
      title: "Download feature",
      description: "This feature will be implemented to generate and download a PDF of your resume.",
      variant: "default",
    });
  };
  
  const handleShareResume = () => {
    // In a real app, this would generate a shareable link
    toast({
      title: "Share feature",
      description: "This feature will be implemented to generate a shareable link to your resume.",
      variant: "default",
    });
  };
  
  const renderStep = () => {
    switch (step) {
      case BuilderStep.SELECT_TEMPLATE:
        return (
          <TemplateSelector 
            sampleData={resumeData} 
            onSelectTemplate={handleSelectTemplate} 
          />
        );
        
      case BuilderStep.PERSONAL_INFO:
        return (
          <PersonalInfoForm 
            initialData={resumeData.personalInfo}
            onSubmit={handleUpdatePersonalInfo}
            onBack={() => setStep(BuilderStep.SELECT_TEMPLATE)}
          />
        );
        
      case BuilderStep.EXPERIENCE:
        return (
          <ExperienceForm 
            initialData={resumeData.experience}
            onSubmit={handleUpdateExperience}
            onBack={() => setStep(BuilderStep.PERSONAL_INFO)}
          />
        );
        
      case BuilderStep.EDUCATION:
        return (
          <EducationForm 
            initialData={resumeData.education}
            onSubmit={handleUpdateEducation}
            onBack={() => setStep(BuilderStep.EXPERIENCE)}
          />
        );
        
      case BuilderStep.SKILLS:
        return (
          <SkillsForm 
            initialData={resumeData.skills}
            onSubmit={handleUpdateSkills}
            onBack={() => setStep(BuilderStep.EDUCATION)}
          />
        );
        
      case BuilderStep.PROJECTS:
        return (
          <ProjectsForm 
            initialData={resumeData.projects}
            onSubmit={handleUpdateProjects}
            onBack={() => setStep(BuilderStep.SKILLS)}
          />
        );
        
      case BuilderStep.ADDITIONAL_INFO:
        // This would be a form for certifications, languages, etc.
        // For now, we'll just simulate it by moving to the preview step
        return (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Additional Information</h2>
            <p className="text-gray-600 mb-8">This section would contain forms for certifications, languages, and achievements.</p>
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(BuilderStep.PROJECTS)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              <Button
                onClick={() => setStep(BuilderStep.PREVIEW)}
              >
                Preview Resume
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        );
        
      case BuilderStep.PREVIEW:
        const SelectedTemplate = templateComponentMap[selectedTemplateId];
        return (
          <div>
            <div className="flex justify-between mb-6">
              <Button
                variant="outline"
                onClick={() => setStep(BuilderStep.ADDITIONAL_INFO)}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Editing
              </Button>
              <div className="space-x-2">
                <Button
                  variant="outline"
                  onClick={handleDownloadResume}
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button
                  variant="outline"
                  onClick={handleShareResume}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button
                  onClick={handleSaveResume}
                  disabled={isSaving}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isSaving ? 'Saving...' : 'Save Resume'}
                </Button>
              </div>
            </div>
            
            <Card className="border-2 border-primary/10 p-4">
              <SelectedTemplate data={resumeData} editable={true} onEdit={() => {}} />
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  return (
    <div className="container mx-auto py-8">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <FileText className="mr-2 h-6 w-6 text-primary" />
                Resume Builder
              </CardTitle>
              <CardDescription>
                Create a professional resume in minutes with our easy-to-use builder
              </CardDescription>
            </div>
            
            {step !== BuilderStep.SELECT_TEMPLATE && (
              <Tabs defaultValue="edit" className="w-[300px]">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="edit" onClick={() => step === BuilderStep.PREVIEW && setStep(BuilderStep.PERSONAL_INFO)}>
                    <Edit3 className="mr-2 h-4 w-4" />
                    Edit
                  </TabsTrigger>
                  <TabsTrigger value="preview" onClick={() => step !== BuilderStep.PREVIEW && setStep(BuilderStep.PREVIEW)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>
        </CardHeader>
        
        <CardContent>
          {renderStep()}
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeBuilder;