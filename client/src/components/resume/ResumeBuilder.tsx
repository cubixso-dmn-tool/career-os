import React, { useState, useEffect, useRef, useCallback } from 'react';
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
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import resumeService, { SavedResume } from '@/services/resumeService';
import { StorageIndicator, LocalStorageWarning } from '@/components/ui/storage-indicator';
import { useResumeStorage } from '@/hooks/useResumeStorage';

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
  const { storageInfo } = useResumeStorage();
  const resumeRef = useRef<HTMLDivElement>(null);
  
  const [step, setStep] = useState<BuilderStep>(BuilderStep.SELECT_TEMPLATE);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('professional');
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      summary: '',
      profileImage: ''
    },
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: [],
    languages: [],
    achievements: []
  });
  const [hasStartedEditing, setHasStartedEditing] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [currentResumeId, setCurrentResumeId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  // Load existing resume data on component mount
  useEffect(() => {
    const loadResumeData = async () => {
      try {
        if (user) {
          console.log('Loading resume data for user:', user.id);
          const userResumes = await resumeService.getUserResumes();
          console.log('Found resumes:', userResumes.length);
          
          if (userResumes.length > 0) {
            // Load the most recent resume
            const latestResume = userResumes[0];
            console.log('Loading latest resume:', latestResume.id, 'with data:', latestResume.data.personalInfo);
            setCurrentResumeId(latestResume.id);
            setSelectedTemplateId(latestResume.templateId);
            setResumeData(latestResume.data);
            setHasStartedEditing(true);
            
            // If we have data, advance to a meaningful step
            if (latestResume.data.personalInfo.name) {
              setStep(BuilderStep.PERSONAL_INFO);
            }
          } else {
            console.log('No existing resumes found, setting up with user basic info');
            // No existing resume, set up with user's basic info
            setResumeData(prevData => ({
              ...prevData,
              personalInfo: {
                ...prevData.personalInfo,
                name: user.name || '',
                email: user.email || '',
                ...(user.avatar ? { profileImage: user.avatar } : {})
              }
            }));
          }
        } else {
          console.log('No user found, checking localStorage for resumes');
          // No user, but check localStorage for any local resumes
          const localResumes = await resumeService.getUserResumes();
          if (localResumes.length > 0) {
            const latestResume = localResumes[0];
            console.log('Loading local resume:', latestResume.id);
            setCurrentResumeId(latestResume.id);
            setSelectedTemplateId(latestResume.templateId);
            setResumeData(latestResume.data);
            setHasStartedEditing(true);
            
            // If we have data, advance to a meaningful step
            if (latestResume.data.personalInfo.name) {
              setStep(BuilderStep.PERSONAL_INFO);
            }
          }
        }
      } catch (error) {
        console.error('Error loading resume data:', error);
        toast({
          title: "Error loading resume",
          description: "Could not load your existing resume data. Starting fresh.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadResumeData();
  }, [user, toast]);

  // Auto-save functionality - debounced save after data changes
  const triggerAutoSave = useCallback(() => {
    if (!hasStartedEditing) {
      return; // Don't auto-save until user has started editing
    }
    
    // Only require a name if we're creating a new resume (no currentResumeId)
    if (!currentResumeId && (!resumeData.personalInfo.name || resumeData.personalInfo.name.trim() === '')) {
      return; // Don't auto-save new resumes without a name
    }

    setAutoSaveStatus('saving');
    
    console.log('Triggering auto-save for resume:', currentResumeId, 'with title:', resumeData.personalInfo.title);
    
    resumeService.autoSave(
      currentResumeId,
      selectedTemplateId,
      resumeData,
      (savedResume: SavedResume) => {
        console.log('Auto-save successful, saved resume:', savedResume.id);
        setCurrentResumeId(savedResume.id);
        setAutoSaveStatus('saved');
        
        // Reset to idle after showing saved status
        setTimeout(() => setAutoSaveStatus('idle'), 2000);
      },
      (error: Error) => {
        console.error('Auto-save error:', error);
        setAutoSaveStatus('error');
        
        // Reset to idle after showing error status
        setTimeout(() => setAutoSaveStatus('idle'), 3000);
      }
    );
  }, [currentResumeId, selectedTemplateId, resumeData, hasStartedEditing]);

  // Trigger auto-save when resume data changes
  useEffect(() => {
    if (hasStartedEditing) {
      triggerAutoSave();
    }
  }, [resumeData, triggerAutoSave, hasStartedEditing]);

  // Cleanup auto-save timeout on unmount
  useEffect(() => {
    return () => {
      resumeService.cancelAutoSave();
    };
  }, []);
  
  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setStep(BuilderStep.PERSONAL_INFO);
    
    // Only clear the form data if we don't have existing resume data
    // This prevents data loss when user changes template on existing resume
    if (!currentResumeId && !hasStartedEditing) {
      setResumeData({
        personalInfo: {
          name: user?.name || '',
          title: '',
          email: user?.email || '',
          phone: '',
          location: '',
          website: '',
          summary: '',
          profileImage: user?.avatar || ''
        },
        experience: [],
        education: [],
        skills: [],
        projects: [],
        certifications: [],
        languages: [],
        achievements: []
      });
    }
    
    setHasStartedEditing(true);
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
      let savedResume: SavedResume;
      
      if (currentResumeId) {
        // Update existing resume
        savedResume = await resumeService.updateResume(currentResumeId, selectedTemplateId, resumeData);
      } else {
        // Create new resume
        savedResume = await resumeService.saveResume(selectedTemplateId, resumeData);
        setCurrentResumeId(savedResume.id);
      }
      
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
  
  const handleDownloadResume = async () => {
    if (!resumeRef.current) {
      toast({
        title: "Error",
        description: "Unable to generate PDF. Please try again.",
        variant: "destructive",
      });
      return;
    }

    try {
      toast({
        title: "Generating PDF...",
        description: "Please wait while we generate your resume PDF.",
        variant: "default",
      });

      // Create a temporary element for PDF generation with proper styling
      const tempDiv = document.createElement('div');
      tempDiv.style.position = 'absolute';
      tempDiv.style.left = '-9999px';
      tempDiv.style.top = '0';
      tempDiv.style.width = '210mm'; // A4 width
      tempDiv.style.backgroundColor = '#ffffff';
      tempDiv.style.fontFamily = 'system-ui, -apple-system, sans-serif';
      tempDiv.style.fontSize = '12px';
      tempDiv.style.lineHeight = '1.4';
      tempDiv.style.color = '#000000';
      
      // Clone the resume content
      const resumeClone = resumeRef.current.cloneNode(true) as HTMLElement;
      
      // Reset any transforms and scaling
      resumeClone.style.transform = 'none';
      resumeClone.style.transformOrigin = 'unset';
      resumeClone.style.width = '100%';
      resumeClone.style.maxWidth = 'none';
      resumeClone.style.padding = '20px';
      resumeClone.style.margin = '0';
      resumeClone.style.boxSizing = 'border-box';
      
      // Fix all child elements positioning
      const allElements = resumeClone.querySelectorAll('*');
      allElements.forEach((element: any) => {
        if (element.style) {
          // Reset problematic CSS properties
          element.style.transform = 'none';
          element.style.position = 'static';
          element.style.float = 'none';
          element.style.clear = 'none';
          
          // Ensure proper box model
          if (element.style.display === 'flex') {
            element.style.display = 'flex';
          } else if (element.style.display === 'grid') {
            element.style.display = 'block'; // Convert grid to block for PDF
          }
          
          // Fix text properties
          if (element.style.color === 'transparent' || element.style.opacity === '0') {
            element.style.color = '#000000';
            element.style.opacity = '1';
          }
        }
      });
      
      tempDiv.appendChild(resumeClone);
      document.body.appendChild(tempDiv);

      // Create canvas with proper options
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: tempDiv.scrollWidth,
        height: tempDiv.scrollHeight,
        onclone: (clonedDoc) => {
          // Additional cleanup for cloned document
          const clonedElement = clonedDoc.querySelector('div') as HTMLElement;
          if (clonedElement) {
            clonedElement.style.transform = 'none';
            clonedElement.style.width = '100%';
          }
        }
      });

      // Clean up temporary element
      document.body.removeChild(tempDiv);

      // Calculate proper dimensions for PDF
      const imgData = canvas.toDataURL('image/png', 1.0);
      const pdfWidth = 210; // A4 width in mm
      const pdfHeight = 297; // A4 height in mm
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      
      // Calculate scaling to fit content properly
      const ratio = Math.min(pdfWidth / (imgWidth * 0.264583), pdfHeight / (imgHeight * 0.264583));
      const scaledWidth = imgWidth * 0.264583 * ratio;
      const scaledHeight = imgHeight * 0.264583 * ratio;

      // Create PDF with proper positioning
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      // Center the content on the page
      const xOffset = (pdfWidth - scaledWidth) / 2;
      const yOffset = Math.max(10, (pdfHeight - scaledHeight) / 2); // At least 10mm from top

      // Add the image to PDF
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, scaledWidth, scaledHeight);

      // Handle multi-page content if needed
      if (scaledHeight > pdfHeight - 20) {
        // Content is too tall, split into multiple pages
        const pageHeight = pdfHeight - 20; // Leave margins
        let remainingHeight = scaledHeight;
        let currentY = yOffset;
        let pageNum = 1;

        while (remainingHeight > pageHeight && pageNum < 5) { // Limit to 5 pages max
          pdf.addPage();
          currentY = -pageHeight * pageNum + yOffset;
          pdf.addImage(imgData, 'PNG', xOffset, currentY, scaledWidth, scaledHeight);
          remainingHeight -= pageHeight;
          pageNum++;
        }
      }

      // Download the PDF
      const fileName = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.pdf` || 'Resume.pdf';
      pdf.save(fileName);

      toast({
        title: "PDF Downloaded",
        description: "Your resume has been successfully downloaded as a PDF.",
        variant: "default",
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Error",
        description: "Failed to generate PDF. Please try again.",
        variant: "destructive",
      });
    }
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
            sampleData={sampleResumeData} 
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
            
            <Card className="border-2 border-primary/10 p-4 overflow-hidden">
              <div className="overflow-auto max-h-[800px]">
                <div 
                  ref={resumeRef} 
                  className="bg-white shadow-lg mx-auto"
                  style={{ 
                    width: '210mm', 
                    minHeight: '297mm',
                    maxWidth: '100%',
                    transform: 'scale(0.75)',
                    transformOrigin: 'top center',
                    padding: '20px',
                    boxSizing: 'border-box'
                  }}
                >
                  <SelectedTemplate data={resumeData} editable={true} onEdit={() => {}} />
                </div>
              </div>
            </Card>
          </div>
        );
        
      default:
        return null;
    }
  };
  
  // Show loading state while fetching resume data
  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <h3 className="text-lg font-medium mb-2">Loading your resume...</h3>
              <p className="text-gray-600 text-center">We're fetching your saved resume data</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      {/* Local Storage Warning */}
      {storageInfo.localResumeCount > 0 && (
        <LocalStorageWarning 
          resumeCount={storageInfo.localResumeCount} 
          className="mb-6"
        />
      )}
      
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl flex items-center">
                <FileText className="mr-2 h-6 w-6 text-primary" />
                Resume Builder
                {currentResumeId && (
                  <StorageIndicator 
                    isLocal={currentResumeId.startsWith('local_')} 
                    className="ml-3"
                  />
                )}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                Create a professional resume in minutes with our easy-to-use builder
                {autoSaveStatus === 'saving' && (
                  <span className="text-xs text-gray-500 flex items-center">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-primary mr-1"></div>
                    Saving...
                  </span>
                )}
                {autoSaveStatus === 'saved' && (
                  <span className="text-xs text-green-600 flex items-center">
                    ✓ Saved
                    {currentResumeId?.startsWith('local_') && (
                      <span className="ml-1 text-orange-600">(locally)</span>
                    )}
                  </span>
                )}
                {autoSaveStatus === 'error' && (
                  <span className="text-xs text-red-600">⚠ Save failed</span>
                )}
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