import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  User,
  Briefcase,
  GraduationCap,
  Award,
  Rocket,
  Code,
  Languages,
  BookOpen,
  CheckCircle,
  Star,
  Phone,
  Mail,
  MapPin,
  Globe,
  Zap,
  Target,
  LineChart,
  GitBranch,
  Server
} from 'lucide-react';

export interface ResumeData {
  personalInfo: {
    name: string;
    title: string;
    email: string;
    phone: string;
    location: string;
    website?: string;
    summary: string;
    profileImage?: string;
  };
  experience: Array<{
    id: string;
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description: string;
    highlights?: string[];
  }>;
  education: Array<{
    id: string;
    institution: string;
    degree: string;
    field?: string;
    location?: string;
    startDate: string;
    endDate?: string;
    current?: boolean;
    description?: string;
    gpa?: string;
    achievements?: string[];
  }>;
  skills: Array<{
    id: string;
    name: string;
    level?: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
    category?: string;
  }>;
  projects: Array<{
    id: string;
    name: string;
    description: string;
    url?: string;
    technologies?: string[];
    highlights?: string[];
    startDate?: string;
    endDate?: string;
  }>;
  certifications?: Array<{
    id: string;
    name: string;
    issuer: string;
    date: string;
    url?: string;
    description?: string;
  }>;
  languages?: Array<{
    id: string;
    language: string;
    proficiency: string;
  }>;
  interests?: string[];
  references?: Array<{
    id: string;
    name: string;
    relationship: string;
    company?: string;
    contact?: string;
  }>;
  achievements?: Array<{
    id: string;
    title: string;
    date?: string;
    description?: string;
  }>;
}

export interface ResumeTemplateProps {
  data: ResumeData;
  editable?: boolean;
  onEdit?: (section: string, id?: string) => void;
}

// Template 1: Professional Template
// Purpose: For corporate jobs, formal industries, and traditional roles
// Features: Clean, minimal design with emphasis on professional experience
export const ProfessionalTemplate: React.FC<ResumeTemplateProps> = ({ 
  data, 
  editable = false,
  onEdit 
}) => {
  return (
    <div className="bg-white p-8 font-sans max-w-[800px] mx-auto shadow-lg rounded-md">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6 mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{data.personalInfo.name}</h1>
            <h2 className="text-xl text-primary my-2">{data.personalInfo.title}</h2>
            <p className="text-gray-600 max-w-xl mt-2">{data.personalInfo.summary}</p>
          </div>
          
          {data.personalInfo.profileImage && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-200">
              <img 
                src={data.personalInfo.profileImage} 
                alt={data.personalInfo.name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>
        
        <div className="flex gap-4 flex-wrap mt-4">
          <div className="flex items-center text-gray-600">
            <Mail className="h-4 w-4 mr-2" />
            <span>{data.personalInfo.email}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <Phone className="h-4 w-4 mr-2" />
            <span>{data.personalInfo.phone}</span>
          </div>
          <div className="flex items-center text-gray-600">
            <MapPin className="h-4 w-4 mr-2" />
            <span>{data.personalInfo.location}</span>
          </div>
          {data.personalInfo.website && (
            <div className="flex items-center text-gray-600">
              <Globe className="h-4 w-4 mr-2" />
              <span>{data.personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Professional Experience */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <Briefcase className="h-5 w-5 mr-2 text-primary" />
            Professional Experience
          </h3>
          {editable && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit && onEdit('experience')}
              className="text-gray-500 hover:text-primary"
            >
              Edit
            </Button>
          )}
        </div>
        
        {data.experience.map((job) => (
          <div key={job.id} className="mb-5 last:mb-0">
            <div className="flex justify-between">
              <div>
                <h4 className="text-lg font-medium">{job.title}</h4>
                <div className="text-primary">{job.company}</div>
              </div>
              <div className="text-gray-500 text-sm">
                {job.startDate} - {job.current ? 'Present' : job.endDate}
              </div>
            </div>
            <p className="text-gray-700 my-2">{job.description}</p>
            {job.highlights && job.highlights.length > 0 && (
              <ul className="list-disc ml-5 text-gray-700">
                {job.highlights.map((highlight, idx) => (
                  <li key={idx}>{highlight}</li>
                ))}
              </ul>
            )}
            {editable && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit && onEdit('experience', job.id)}
                className="text-gray-500 hover:text-primary mt-2"
              >
                Edit
              </Button>
            )}
          </div>
        ))}
      </section>
      
      {/* Education */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <GraduationCap className="h-5 w-5 mr-2 text-primary" />
            Education
          </h3>
          {editable && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit && onEdit('education')}
              className="text-gray-500 hover:text-primary"
            >
              Edit
            </Button>
          )}
        </div>
        
        {data.education.map((edu) => (
          <div key={edu.id} className="mb-4 last:mb-0">
            <div className="flex justify-between">
              <div>
                <h4 className="text-lg font-medium">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h4>
                <div className="text-primary">{edu.institution}</div>
              </div>
              <div className="text-gray-500 text-sm">
                {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
              </div>
            </div>
            {edu.gpa && <p className="text-gray-700 my-1">GPA: {edu.gpa}</p>}
            {edu.description && <p className="text-gray-700 my-1">{edu.description}</p>}
            {edu.achievements && edu.achievements.length > 0 && (
              <ul className="list-disc ml-5 text-gray-700">
                {edu.achievements.map((achievement, idx) => (
                  <li key={idx}>{achievement}</li>
                ))}
              </ul>
            )}
            {editable && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit && onEdit('education', edu.id)}
                className="text-gray-500 hover:text-primary mt-2"
              >
                Edit
              </Button>
            )}
          </div>
        ))}
      </section>
      
      {/* Skills */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <CheckCircle className="h-5 w-5 mr-2 text-primary" />
            Skills
          </h3>
          {editable && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit && onEdit('skills')}
              className="text-gray-500 hover:text-primary"
            >
              Edit
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <Badge 
              key={skill.id}
              variant="outline" 
              className="px-3 py-1 text-gray-700 border-gray-300"
            >
              {skill.name} {skill.level && <span className="text-primary ml-1">• {skill.level}</span>}
            </Badge>
          ))}
        </div>
      </section>
      
      {/* Projects (if available) */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center">
              <Rocket className="h-5 w-5 mr-2 text-primary" />
              Projects
            </h3>
            {editable && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit && onEdit('projects')}
                className="text-gray-500 hover:text-primary"
              >
                Edit
              </Button>
            )}
          </div>
          
          {data.projects.map((project) => (
            <div key={project.id} className="mb-4 last:mb-0">
              <div className="flex justify-between">
                <h4 className="text-lg font-medium">{project.name}</h4>
                {project.startDate && (
                  <div className="text-gray-500 text-sm">
                    {project.startDate}{project.endDate ? ` - ${project.endDate}` : ''}
                  </div>
                )}
              </div>
              <p className="text-gray-700 my-1">{project.description}</p>
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 my-1">
                  {project.technologies.map((tech, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
              {project.highlights && project.highlights.length > 0 && (
                <ul className="list-disc ml-5 text-gray-700">
                  {project.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              )}
              {editable && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit && onEdit('projects', project.id)}
                  className="text-gray-500 hover:text-primary mt-2"
                >
                  Edit
                </Button>
              )}
            </div>
          ))}
        </section>
      )}
      
      {/* Certifications (if available) */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center">
              <Award className="h-5 w-5 mr-2 text-primary" />
              Certifications
            </h3>
            {editable && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit && onEdit('certifications')}
                className="text-gray-500 hover:text-primary"
              >
                Edit
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="border border-gray-200 rounded-md p-3">
                <h4 className="font-medium">{cert.name}</h4>
                <div className="text-primary text-sm">{cert.issuer} • {cert.date}</div>
                {cert.description && <p className="text-gray-600 text-sm mt-1">{cert.description}</p>}
                {editable && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit && onEdit('certifications', cert.id)}
                    className="text-gray-500 hover:text-primary mt-2"
                  >
                    Edit
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Languages (if available) */}
      {data.languages && data.languages.length > 0 && (
        <section className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center">
              <Languages className="h-5 w-5 mr-2 text-primary" />
              Languages
            </h3>
            {editable && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit && onEdit('languages')}
                className="text-gray-500 hover:text-primary"
              >
                Edit
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3">
            {data.languages.map((lang) => (
              <div key={lang.id} className="flex items-center">
                <span className="font-medium mr-2">{lang.language}:</span>
                <span className="text-gray-600">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// Template 2: Creative Template
// Purpose: For design, media, marketing, and creative industries
// Features: Visual emphasis, portfolio showcase, modern layout
export const CreativeTemplate: React.FC<ResumeTemplateProps> = ({ 
  data, 
  editable = false,
  onEdit 
}) => {
  return (
    <div className="bg-gray-50 p-8 font-sans max-w-[800px] mx-auto shadow-lg rounded-md">
      {/* Header with accent background */}
      <div className="bg-primary/10 rounded-lg p-6 mb-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -mr-32 -mt-32 z-0"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary/15 rounded-full -ml-20 -mb-20 z-0"></div>
        
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start relative z-10">
          {data.personalInfo.profileImage && (
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-md flex-shrink-0">
              <img 
                src={data.personalInfo.profileImage} 
                alt={data.personalInfo.name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold text-gray-900">{data.personalInfo.name}</h1>
            <h2 className="text-xl text-primary my-2 font-medium">{data.personalInfo.title}</h2>
            <p className="text-gray-700 max-w-xl mt-2">{data.personalInfo.summary}</p>
            
            <div className="flex gap-4 flex-wrap mt-4 justify-center md:justify-start">
              <div className="flex items-center text-gray-700 bg-white px-3 py-1 rounded-full shadow-sm">
                <Mail className="h-4 w-4 mr-2 text-primary" />
                <span>{data.personalInfo.email}</span>
              </div>
              <div className="flex items-center text-gray-700 bg-white px-3 py-1 rounded-full shadow-sm">
                <Phone className="h-4 w-4 mr-2 text-primary" />
                <span>{data.personalInfo.phone}</span>
              </div>
              <div className="flex items-center text-gray-700 bg-white px-3 py-1 rounded-full shadow-sm">
                <MapPin className="h-4 w-4 mr-2 text-primary" />
                <span>{data.personalInfo.location}</span>
              </div>
              {data.personalInfo.website && (
                <div className="flex items-center text-gray-700 bg-white px-3 py-1 rounded-full shadow-sm">
                  <Globe className="h-4 w-4 mr-2 text-primary" />
                  <span>{data.personalInfo.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Two column layout for main content */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left sidebar */}
        <div className="md:col-span-1">
          {/* Skills */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center text-gray-800">
                <CheckCircle className="h-5 w-5 mr-2 text-primary" />
                Skills
              </h3>
              {editable && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit && onEdit('skills')}
                  className="text-gray-500 hover:text-primary"
                >
                  Edit
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              {data.skills.map((skill) => (
                <div key={skill.id} className="bg-white rounded-md p-2 shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{skill.name}</span>
                    {skill.level && (
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-none">
                        {skill.level}
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
          
          {/* Education */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center text-gray-800">
                <GraduationCap className="h-5 w-5 mr-2 text-primary" />
                Education
              </h3>
              {editable && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit && onEdit('education')}
                  className="text-gray-500 hover:text-primary"
                >
                  Edit
                </Button>
              )}
            </div>
            
            {data.education.map((edu) => (
              <div key={edu.id} className="mb-4 last:mb-0 bg-white p-3 rounded-md shadow-sm">
                <h4 className="font-medium">{edu.institution}</h4>
                <div className="text-primary text-sm">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                <div className="text-gray-500 text-sm mt-1">
                  {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                </div>
                {edu.gpa && <p className="text-gray-600 text-sm mt-1">GPA: {edu.gpa}</p>}
                {editable && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit && onEdit('education', edu.id)}
                    className="text-gray-500 hover:text-primary mt-2"
                  >
                    Edit
                  </Button>
                )}
              </div>
            ))}
          </section>
          
          {/* Languages (if available) */}
          {data.languages && data.languages.length > 0 && (
            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center text-gray-800">
                  <Languages className="h-5 w-5 mr-2 text-primary" />
                  Languages
                </h3>
                {editable && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit && onEdit('languages')}
                    className="text-gray-500 hover:text-primary"
                  >
                    Edit
                  </Button>
                )}
              </div>
              
              {data.languages.map((lang) => (
                <div key={lang.id} className="mb-2 last:mb-0 bg-white p-2 rounded-md shadow-sm">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{lang.language}</span>
                    <span className="text-gray-600 text-sm">{lang.proficiency}</span>
                  </div>
                </div>
              ))}
            </section>
          )}
          
          {/* Interests (if available) */}
          {data.interests && data.interests.length > 0 && (
            <section className="mb-8">
              <h3 className="text-xl font-bold flex items-center text-gray-800 mb-4">
                <Star className="h-5 w-5 mr-2 text-primary" />
                Interests
              </h3>
              
              <div className="flex flex-wrap gap-2">
                {data.interests.map((interest, idx) => (
                  <Badge 
                    key={idx}
                    variant="outline" 
                    className="bg-white px-3 py-1 text-gray-700 border-primary/20"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </section>
          )}
        </div>
        
        {/* Main Content */}
        <div className="md:col-span-2">
          {/* Professional Experience */}
          <section className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold flex items-center text-gray-800">
                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                Professional Experience
              </h3>
              {editable && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit && onEdit('experience')}
                  className="text-gray-500 hover:text-primary"
                >
                  Edit
                </Button>
              )}
            </div>
            
            {data.experience.map((job) => (
              <div key={job.id} className="mb-6 last:mb-0 relative pl-6 border-l-2 border-primary/30">
                <div className="absolute w-4 h-4 bg-primary rounded-full -left-[9px] top-1"></div>
                <div className="flex justify-between">
                  <div>
                    <h4 className="text-lg font-medium">{job.title}</h4>
                    <div className="text-primary font-medium">{job.company}</div>
                    {job.location && <div className="text-gray-500 text-sm">{job.location}</div>}
                  </div>
                  <div className="text-gray-500 text-sm bg-white px-2 py-1 rounded-md shadow-sm">
                    {job.startDate} - {job.current ? 'Present' : job.endDate}
                  </div>
                </div>
                <p className="text-gray-700 my-2">{job.description}</p>
                {job.highlights && job.highlights.length > 0 && (
                  <ul className="space-y-1 text-gray-700">
                    {job.highlights.map((highlight, idx) => (
                      <li key={idx} className="flex items-start">
                        <div className="text-primary mr-2 mt-1">•</div>
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {editable && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit && onEdit('experience', job.id)}
                    className="text-gray-500 hover:text-primary mt-2"
                  >
                    Edit
                  </Button>
                )}
              </div>
            ))}
          </section>
          
          {/* Projects (if available) - Displayed as cards in a grid */}
          {data.projects && data.projects.length > 0 && (
            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center text-gray-800">
                  <Rocket className="h-5 w-5 mr-2 text-primary" />
                  Projects
                </h3>
                {editable && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit && onEdit('projects')}
                    className="text-gray-500 hover:text-primary"
                  >
                    Edit
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.projects.map((project) => (
                  <Card key={project.id} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="bg-primary/5 p-4 border-b">
                        <h4 className="font-medium">{project.name}</h4>
                        {project.startDate && (
                          <div className="text-gray-500 text-sm">
                            {project.startDate}{project.endDate ? ` - ${project.endDate}` : ''}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <p className="text-gray-700 text-sm">{project.description}</p>
                        
                        {project.technologies && project.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1 my-2">
                            {project.technologies.map((tech, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs bg-white">
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {editable && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => onEdit && onEdit('projects', project.id)}
                            className="text-gray-500 hover:text-primary mt-2"
                          >
                            Edit
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          )}
          
          {/* Certifications (if available) */}
          {data.certifications && data.certifications.length > 0 && (
            <section className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center text-gray-800">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Certifications
                </h3>
                {editable && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit && onEdit('certifications')}
                    className="text-gray-500 hover:text-primary"
                  >
                    Edit
                  </Button>
                )}
              </div>
              
              <div className="space-y-3">
                {data.certifications.map((cert) => (
                  <div key={cert.id} className="bg-white rounded-md p-3 shadow-sm">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{cert.name}</h4>
                      <div className="text-gray-500 text-sm">{cert.date}</div>
                    </div>
                    <div className="text-primary text-sm">{cert.issuer}</div>
                    {cert.description && <p className="text-gray-600 text-sm mt-1">{cert.description}</p>}
                    
                    {editable && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onEdit && onEdit('certifications', cert.id)}
                        className="text-gray-500 hover:text-primary mt-2"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
          
          {/* Achievements (if available) */}
          {data.achievements && data.achievements.length > 0 && (
            <section>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold flex items-center text-gray-800">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Achievements
                </h3>
                {editable && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit && onEdit('achievements')}
                    className="text-gray-500 hover:text-primary"
                  >
                    Edit
                  </Button>
                )}
              </div>
              
              <div className="space-y-3">
                {data.achievements.map((achievement) => (
                  <div key={achievement.id} className="bg-white rounded-md p-3 shadow-sm">
                    <div className="flex justify-between">
                      <h4 className="font-medium">{achievement.title}</h4>
                      {achievement.date && <div className="text-gray-500 text-sm">{achievement.date}</div>}
                    </div>
                    {achievement.description && (
                      <p className="text-gray-600 text-sm mt-1">{achievement.description}</p>
                    )}
                    
                    {editable && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => onEdit && onEdit('achievements', achievement.id)}
                        className="text-gray-500 hover:text-primary mt-2"
                      >
                        Edit
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

// Template 3: Technical Template
// Purpose: For software engineers, developers, IT roles
// Features: Focused on technical skills, projects, and technical achievements
export const TechnicalTemplate: React.FC<ResumeTemplateProps> = ({ 
  data, 
  editable = false,
  onEdit 
}) => {
  // Group skills by category
  const skillsByCategory = data.skills.reduce((acc, skill) => {
    const category = skill.category || 'Other';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(skill);
    return acc;
  }, {} as Record<string, typeof data.skills>);

  return (
    <div className="bg-white p-8 font-sans max-w-[800px] mx-auto shadow-lg rounded-md border border-gray-200">
      {/* Header */}
      <div className="border-b-2 border-gray-200 pb-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start">
          <div className="flex items-start gap-4">
            {data.personalInfo.profileImage && (
              <div className="w-20 h-20 rounded-lg overflow-hidden border-2 border-gray-300 flex-shrink-0">
                <img 
                  src={data.personalInfo.profileImage} 
                  alt={data.personalInfo.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{data.personalInfo.name}</h1>
              <h2 className="text-xl text-primary my-2">{data.personalInfo.title}</h2>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-end gap-4 mt-4 md:mt-0">
            <div className="flex items-center text-gray-700">
              <Mail className="h-4 w-4 mr-2 text-primary" />
              <span>{data.personalInfo.email}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <Phone className="h-4 w-4 mr-2 text-primary" />
              <span>{data.personalInfo.phone}</span>
            </div>
            <div className="flex items-center text-gray-700">
              <MapPin className="h-4 w-4 mr-2 text-primary" />
              <span>{data.personalInfo.location}</span>
            </div>
            {data.personalInfo.website && (
              <div className="flex items-center text-gray-700">
                <Globe className="h-4 w-4 mr-2 text-primary" />
                <span>{data.personalInfo.website}</span>
              </div>
            )}
          </div>
        </div>
        
        <p className="text-gray-700 max-w-3xl mt-4">{data.personalInfo.summary}</p>
      </div>
      
      {/* Technical Skills */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center text-gray-800">
            <Code className="h-5 w-5 mr-2 text-primary" />
            Technical Skills
          </h3>
          {editable && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit && onEdit('skills')}
              className="text-gray-500 hover:text-primary"
            >
              Edit
            </Button>
          )}
        </div>
        
        {Object.entries(skillsByCategory).map(([category, skills]) => (
          <div key={category} className="mb-4 last:mb-0">
            <h4 className="font-medium text-gray-700 mb-2">{category}</h4>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge 
                  key={skill.id}
                  variant="outline" 
                  className={`px-3 py-1.5 text-gray-700 ${
                    skill.level === 'Expert' 
                      ? 'bg-primary/10 border-primary/30 font-medium' 
                      : skill.level === 'Advanced'
                        ? 'bg-primary/5 border-primary/20'
                        : 'border-gray-300'
                  }`}
                >
                  {skill.name}
                  {skill.level && (
                    <span className={`ml-1 text-xs ${
                      skill.level === 'Expert' ? 'text-primary' : 'text-gray-500'
                    }`}>
                      • {skill.level}
                    </span>
                  )}
                </Badge>
              ))}
            </div>
          </div>
        ))}
      </section>
      
      {/* Projects - Highlighted for Technical Template */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center text-gray-800">
              <Rocket className="h-5 w-5 mr-2 text-primary" />
              Technical Projects
            </h3>
            {editable && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit && onEdit('projects')}
                className="text-gray-500 hover:text-primary"
              >
                Edit
              </Button>
            )}
          </div>
          
          {data.projects.map((project) => (
            <div key={project.id} className="mb-6 last:mb-0 border-l-4 border-primary/30 pl-4 py-1">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div>
                  <h4 className="text-lg font-medium">{project.name}</h4>
                  {project.url && (
                    <a href={project.url} className="text-primary text-sm hover:underline" target="_blank" rel="noopener noreferrer">
                      {project.url.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
                {project.startDate && (
                  <div className="text-gray-500 text-sm mt-1 md:mt-0 md:ml-4">
                    {project.startDate}{project.endDate ? ` - ${project.endDate}` : ''}
                  </div>
                )}
              </div>
              
              <p className="text-gray-700 my-2">{project.description}</p>
              
              {project.technologies && project.technologies.length > 0 && (
                <div className="flex flex-wrap gap-1 my-2">
                  <span className="text-gray-700 font-medium mr-2">Tech Stack:</span>
                  {project.technologies.map((tech, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {tech}
                    </Badge>
                  ))}
                </div>
              )}
              
              {project.highlights && project.highlights.length > 0 && (
                <div className="mt-2">
                  <span className="text-gray-700 font-medium">Key Contributions:</span>
                  <ul className="list-disc ml-5 text-gray-700 mt-1">
                    {project.highlights.map((highlight, idx) => (
                      <li key={idx}>{highlight}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {editable && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit && onEdit('projects', project.id)}
                  className="text-gray-500 hover:text-primary mt-2"
                >
                  Edit
                </Button>
              )}
            </div>
          ))}
        </section>
      )}
      
      {/* Professional Experience */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center text-gray-800">
            <Briefcase className="h-5 w-5 mr-2 text-primary" />
            Professional Experience
          </h3>
          {editable && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit && onEdit('experience')}
              className="text-gray-500 hover:text-primary"
            >
              Edit
            </Button>
          )}
        </div>
        
        {data.experience.map((job) => (
          <div key={job.id} className="mb-6 last:mb-0">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start border-b border-gray-200 pb-2 mb-2">
              <div>
                <h4 className="text-lg font-medium">{job.title}</h4>
                <div className="flex items-center">
                  <span className="text-primary">{job.company}</span>
                  {job.location && (
                    <>
                      <span className="mx-2 text-gray-400">•</span>
                      <span className="text-gray-600">{job.location}</span>
                    </>
                  )}
                </div>
              </div>
              <div className="text-gray-500 text-sm mt-1 md:mt-0 whitespace-nowrap">
                {job.startDate} - {job.current ? 'Present' : job.endDate}
              </div>
            </div>
            
            <p className="text-gray-700 mb-2">{job.description}</p>
            
            {job.highlights && job.highlights.length > 0 && (
              <ul className="list-disc ml-5 text-gray-700">
                {job.highlights.map((highlight, idx) => (
                  <li key={idx} className="mb-1 last:mb-0">
                    <span className="text-gray-800">{highlight}</span>
                  </li>
                ))}
              </ul>
            )}
            
            {editable && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit && onEdit('experience', job.id)}
                className="text-gray-500 hover:text-primary mt-2"
              >
                Edit
              </Button>
            )}
          </div>
        ))}
      </section>
      
      {/* Education */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center text-gray-800">
            <GraduationCap className="h-5 w-5 mr-2 text-primary" />
            Education
          </h3>
          {editable && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit && onEdit('education')}
              className="text-gray-500 hover:text-primary"
            >
              Edit
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.education.map((edu) => (
            <div key={edu.id} className="border border-gray-200 rounded-md p-4">
              <div className="flex justify-between">
                <h4 className="font-medium">{edu.institution}</h4>
                <div className="text-gray-500 text-sm">
                  {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                </div>
              </div>
              <div className="text-primary">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
              {edu.gpa && <p className="text-gray-600 text-sm mt-1">GPA: {edu.gpa}</p>}
              
              {edu.achievements && edu.achievements.length > 0 && (
                <div className="mt-2">
                  <span className="text-gray-700 text-sm font-medium">Achievements:</span>
                  <ul className="list-disc ml-5 text-gray-600 text-sm mt-1">
                    {edu.achievements.map((achievement, idx) => (
                      <li key={idx}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {editable && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit && onEdit('education', edu.id)}
                  className="text-gray-500 hover:text-primary mt-2"
                >
                  Edit
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>
      
      {/* Certifications (if available) */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center text-gray-800">
              <Award className="h-5 w-5 mr-2 text-primary" />
              Certifications
            </h3>
            {editable && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit && onEdit('certifications')}
                className="text-gray-500 hover:text-primary"
              >
                Edit
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {data.certifications.map((cert) => (
              <div key={cert.id} className="border border-gray-200 rounded-md p-3">
                <h4 className="font-medium">{cert.name}</h4>
                <div className="text-primary text-sm">{cert.issuer}</div>
                <div className="text-gray-500 text-sm">{cert.date}</div>
                
                {editable && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit && onEdit('certifications', cert.id)}
                    className="text-gray-500 hover:text-primary mt-2"
                  >
                    Edit
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// Template 4: Academic / Research Template
// Purpose: For academic positions, research roles, graduate school applications
// Features: Focus on education, research, publications, and teaching experience
export const AcademicTemplate: React.FC<ResumeTemplateProps> = ({ 
  data, 
  editable = false,
  onEdit 
}) => {
  return (
    <div className="bg-white p-8 font-serif max-w-[800px] mx-auto shadow-lg rounded-md">
      {/* Header */}
      <div className="text-center border-b border-gray-300 pb-6 mb-8">
        {data.personalInfo.profileImage && (
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-gray-200 mx-auto mb-4">
            <img 
              src={data.personalInfo.profileImage} 
              alt={data.personalInfo.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{data.personalInfo.name}</h1>
        <h2 className="text-xl text-primary mb-4">{data.personalInfo.title}</h2>
        
        <div className="flex justify-center gap-4 flex-wrap">
          <div className="flex items-center text-gray-700">
            <Mail className="h-4 w-4 mr-2 text-primary" />
            <span>{data.personalInfo.email}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <Phone className="h-4 w-4 mr-2 text-primary" />
            <span>{data.personalInfo.phone}</span>
          </div>
          <div className="flex items-center text-gray-700">
            <MapPin className="h-4 w-4 mr-2 text-primary" />
            <span>{data.personalInfo.location}</span>
          </div>
          {data.personalInfo.website && (
            <div className="flex items-center text-gray-700">
              <Globe className="h-4 w-4 mr-2 text-primary" />
              <span>{data.personalInfo.website}</span>
            </div>
          )}
        </div>
      </div>
      
      {/* Research Summary / Objective */}
      <section className="mb-8">
        <h3 className="text-xl font-bold flex items-center text-gray-800 mb-4">
          <Target className="h-5 w-5 mr-2 text-primary" />
          Research Summary
        </h3>
        <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
      </section>
      
      {/* Education - Emphasized for Academic Template */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center text-gray-800">
            <GraduationCap className="h-5 w-5 mr-2 text-primary" />
            Education
          </h3>
          {editable && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit && onEdit('education')}
              className="text-gray-500 hover:text-primary"
            >
              Edit
            </Button>
          )}
        </div>
        
        {data.education.map((edu) => (
          <div key={edu.id} className="mb-6 last:mb-0">
            <div className="flex justify-between border-b border-gray-200 pb-2 mb-3">
              <div>
                <h4 className="text-lg font-bold">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</h4>
                <div className="text-primary font-medium">{edu.institution}</div>
                {edu.location && <div className="text-gray-600">{edu.location}</div>}
              </div>
              <div className="text-gray-500">
                {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
              </div>
            </div>
            
            {edu.description && <p className="text-gray-700 mb-2">{edu.description}</p>}
            
            {edu.gpa && (
              <div className="text-gray-700 mb-2">
                <span className="font-medium">GPA:</span> {edu.gpa}
              </div>
            )}
            
            {edu.achievements && edu.achievements.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-800 mb-1">Academic Achievements:</h5>
                <ul className="list-disc ml-5 text-gray-700">
                  {edu.achievements.map((achievement, idx) => (
                    <li key={idx}>{achievement}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {editable && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit && onEdit('education', edu.id)}
                className="text-gray-500 hover:text-primary mt-2"
              >
                Edit
              </Button>
            )}
          </div>
        ))}
      </section>
      
      {/* Research Experience - Specialized for Academic Template */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center text-gray-800">
            <BookOpen className="h-5 w-5 mr-2 text-primary" />
            Research Experience
          </h3>
          {editable && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit && onEdit('experience')}
              className="text-gray-500 hover:text-primary"
            >
              Edit
            </Button>
          )}
        </div>
        
        {data.experience.map((job) => (
          <div key={job.id} className="mb-6 last:mb-0">
            <div className="flex justify-between border-b border-gray-200 pb-2 mb-3">
              <div>
                <h4 className="text-lg font-bold">{job.title}</h4>
                <div className="text-primary font-medium">{job.company}</div>
                {job.location && <div className="text-gray-600">{job.location}</div>}
              </div>
              <div className="text-gray-500">
                {job.startDate} - {job.current ? 'Present' : job.endDate}
              </div>
            </div>
            
            <p className="text-gray-700 mb-2">{job.description}</p>
            
            {job.highlights && job.highlights.length > 0 && (
              <div>
                <h5 className="font-medium text-gray-800 mb-1">Key Contributions:</h5>
                <ul className="list-disc ml-5 text-gray-700">
                  {job.highlights.map((highlight, idx) => (
                    <li key={idx}>{highlight}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {editable && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit && onEdit('experience', job.id)}
                className="text-gray-500 hover:text-primary mt-2"
              >
                Edit
              </Button>
            )}
          </div>
        ))}
      </section>
      
      {/* Projects - Treated as Publications/Research Papers */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center text-gray-800">
              <BookOpen className="h-5 w-5 mr-2 text-primary" />
              Publications & Research Papers
            </h3>
            {editable && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit && onEdit('projects')}
                className="text-gray-500 hover:text-primary"
              >
                Edit
              </Button>
            )}
          </div>
          
          <div className="space-y-4">
            {data.projects.map((project) => (
              <div key={project.id} className="border-l-4 border-primary/30 pl-4 py-1">
                <h4 className="text-lg font-medium">{project.name}</h4>
                
                {project.startDate && (
                  <div className="text-gray-600 italic mb-1">
                    Published: {project.startDate}
                  </div>
                )}
                
                <p className="text-gray-700 mb-2">{project.description}</p>
                
                {project.url && (
                  <div className="mb-1">
                    <span className="font-medium">DOI/URL:</span>{' '}
                    <a 
                      href={project.url} 
                      className="text-primary hover:underline" 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {project.url}
                    </a>
                  </div>
                )}
                
                {project.technologies && project.technologies.length > 0 && (
                  <div className="mb-1">
                    <span className="font-medium">Keywords:</span>{' '}
                    <span className="text-gray-700">
                      {project.technologies.join(', ')}
                    </span>
                  </div>
                )}
                
                {editable && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit && onEdit('projects', project.id)}
                    className="text-gray-500 hover:text-primary mt-2"
                  >
                    Edit
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Skills */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center text-gray-800">
            <CheckCircle className="h-5 w-5 mr-2 text-primary" />
            Research Skills & Expertise
          </h3>
          {editable && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit && onEdit('skills')}
              className="text-gray-500 hover:text-primary"
            >
              Edit
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2">
          {data.skills.map((skill) => (
            <Badge 
              key={skill.id}
              variant="outline" 
              className="px-3 py-1 text-gray-700 border-gray-300"
            >
              {skill.name}
            </Badge>
          ))}
        </div>
      </section>
      
      {/* Certifications (if available) */}
      {data.certifications && data.certifications.length > 0 && (
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center text-gray-800">
              <Award className="h-5 w-5 mr-2 text-primary" />
              Certifications & Specialized Training
            </h3>
            {editable && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit && onEdit('certifications')}
                className="text-gray-500 hover:text-primary"
              >
                Edit
              </Button>
            )}
          </div>
          
          <ul className="list-disc ml-5 text-gray-700">
            {data.certifications.map((cert) => (
              <li key={cert.id} className="mb-2 last:mb-0">
                <span className="font-medium">{cert.name}</span> - {cert.issuer} ({cert.date})
                {cert.description && <div className="text-gray-600 ml-5 mt-1">{cert.description}</div>}
                
                {editable && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit && onEdit('certifications', cert.id)}
                    className="text-gray-500 hover:text-primary mt-1 ml-5"
                  >
                    Edit
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}
      
      {/* Languages (if available) */}
      {data.languages && data.languages.length > 0 && (
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center text-gray-800">
              <Languages className="h-5 w-5 mr-2 text-primary" />
              Languages
            </h3>
            {editable && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit && onEdit('languages')}
                className="text-gray-500 hover:text-primary"
              >
                Edit
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4">
            {data.languages.map((lang) => (
              <div key={lang.id} className="flex items-center">
                <span className="font-medium mr-2">{lang.language}:</span>
                <span className="text-gray-700">{lang.proficiency}</span>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* References (if available) */}
      {data.references && data.references.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center text-gray-800">
              <User className="h-5 w-5 mr-2 text-primary" />
              References
            </h3>
            {editable && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit && onEdit('references')}
                className="text-gray-500 hover:text-primary"
              >
                Edit
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.references.map((ref) => (
              <div key={ref.id} className="border border-gray-200 rounded-md p-3">
                <h4 className="font-medium">{ref.name}</h4>
                <div className="text-gray-700">{ref.relationship}</div>
                {ref.company && <div className="text-primary text-sm">{ref.company}</div>}
                {ref.contact && <div className="text-gray-600 text-sm mt-1">{ref.contact}</div>}
                
                {editable && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit && onEdit('references', ref.id)}
                    className="text-gray-500 hover:text-primary mt-2"
                  >
                    Edit
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

// Template 5: Startup / Entrepreneurial Template
// Purpose: For startup, entrepreneurial roles, venture capital, business development
// Features: Focus on achievements, metrics, business impact
export const StartupTemplate: React.FC<ResumeTemplateProps> = ({ 
  data, 
  editable = false,
  onEdit 
}) => {
  return (
    <div className="bg-white p-8 font-sans max-w-[800px] mx-auto shadow-lg rounded-md">
      {/* Header - Bold and impactful */}
      <div className="bg-gradient-to-r from-primary/80 to-primary p-6 -mx-8 mb-8 text-white relative overflow-hidden rounded-t-md">
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20 z-0"></div>
        <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-20 -mb-20 z-0"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-6">
          {data.personalInfo.profileImage && (
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white shadow-lg flex-shrink-0">
              <img 
                src={data.personalInfo.profileImage} 
                alt={data.personalInfo.name} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold">{data.personalInfo.name}</h1>
            <h2 className="text-xl md:text-2xl mt-2 text-white/90">{data.personalInfo.title}</h2>
            
            <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
              <div className="flex items-center text-white/90">
                <Mail className="h-4 w-4 mr-2" />
                <span>{data.personalInfo.email}</span>
              </div>
              <div className="flex items-center text-white/90">
                <Phone className="h-4 w-4 mr-2" />
                <span>{data.personalInfo.phone}</span>
              </div>
              <div className="flex items-center text-white/90">
                <MapPin className="h-4 w-4 mr-2" />
                <span>{data.personalInfo.location}</span>
              </div>
              {data.personalInfo.website && (
                <div className="flex items-center text-white/90">
                  <Globe className="h-4 w-4 mr-2" />
                  <span>{data.personalInfo.website}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Personal Statement - Value Proposition */}
      <section className="mb-8">
        <div className="border-l-4 border-primary p-4 bg-primary/5 rounded-r-md">
          <h3 className="text-xl font-bold mb-2 text-gray-800">Value Proposition</h3>
          <p className="text-gray-700 leading-relaxed">{data.personalInfo.summary}</p>
        </div>
      </section>
      
      {/* Key Achievements - Highlighted for Startup Template */}
      {data.achievements && data.achievements.length > 0 && (
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center text-gray-800">
              <Zap className="h-5 w-5 mr-2 text-primary" />
              Key Achievements & Metrics
            </h3>
            {editable && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit && onEdit('achievements')}
                className="text-gray-500 hover:text-primary"
              >
                Edit
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.achievements.map((achievement) => (
              <div key={achievement.id} className="border border-primary/20 rounded-md p-4 bg-primary/5">
                <h4 className="font-bold text-gray-800">{achievement.title}</h4>
                {achievement.date && <div className="text-primary text-sm">{achievement.date}</div>}
                {achievement.description && (
                  <p className="text-gray-700 mt-2">{achievement.description}</p>
                )}
                
                {editable && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit && onEdit('achievements', achievement.id)}
                    className="text-gray-500 hover:text-primary mt-2"
                  >
                    Edit
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Professional Experience - Impact-focused */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center text-gray-800">
            <LineChart className="h-5 w-5 mr-2 text-primary" />
            Impact & Experience
          </h3>
          {editable && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit && onEdit('experience')}
              className="text-gray-500 hover:text-primary"
            >
              Edit
            </Button>
          )}
        </div>
        
        {data.experience.map((job) => (
          <div key={job.id} className="mb-8 last:mb-0">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b-2 border-gray-200 pb-2 mb-4">
              <div>
                <h4 className="text-xl font-bold text-gray-800">{job.title}</h4>
                <div className="text-primary font-medium text-lg">{job.company}</div>
                {job.location && <div className="text-gray-600">{job.location}</div>}
              </div>
              <div className="mt-2 md:mt-0 bg-gray-100 px-3 py-1 rounded-md text-gray-700 font-medium">
                {job.startDate} - {job.current ? 'Present' : job.endDate}
              </div>
            </div>
            
            <p className="text-gray-700 mb-3">{job.description}</p>
            
            {job.highlights && job.highlights.length > 0 && (
              <div className="space-y-2">
                {job.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start">
                    <div className="text-primary mr-2 mt-1 font-bold">›</div>
                    <p className="text-gray-800">{highlight}</p>
                  </div>
                ))}
              </div>
            )}
            
            {editable && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit && onEdit('experience', job.id)}
                className="text-gray-500 hover:text-primary mt-3"
              >
                Edit
              </Button>
            )}
          </div>
        ))}
      </section>
      
      {/* Projects - Entrepreneurial Ventures */}
      {data.projects && data.projects.length > 0 && (
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center text-gray-800">
              <Rocket className="h-5 w-5 mr-2 text-primary" />
              Ventures & Projects
            </h3>
            {editable && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit && onEdit('projects')}
                className="text-gray-500 hover:text-primary"
              >
                Edit
              </Button>
            )}
          </div>
          
          {data.projects.map((project) => (
            <div key={project.id} className="mb-6 last:mb-0 border border-gray-200 rounded-md p-4">
              <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                <div>
                  <h4 className="text-lg font-bold text-gray-800">{project.name}</h4>
                  {project.url && (
                    <a href={project.url} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      {project.url.replace(/^https?:\/\//, '')}
                    </a>
                  )}
                </div>
                {project.startDate && (
                  <div className="text-gray-500 text-sm bg-gray-100 px-2 py-1 rounded-md mt-2 md:mt-0">
                    {project.startDate}{project.endDate ? ` - ${project.endDate}` : ''}
                  </div>
                )}
              </div>
              
              <p className="text-gray-700 my-3">{project.description}</p>
              
              {project.highlights && project.highlights.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-800 mb-2">Key Outcomes:</h5>
                  <div className="space-y-1">
                    {project.highlights.map((highlight, idx) => (
                      <div key={idx} className="flex items-start">
                        <div className="text-primary mr-2 mt-1">•</div>
                        <p className="text-gray-700">{highlight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {project.technologies && project.technologies.length > 0 && (
                <div className="mt-3">
                  <h5 className="font-medium text-gray-800 mb-1">Technologies/Skills:</h5>
                  <div className="flex flex-wrap gap-1">
                    {project.technologies.map((tech, idx) => (
                      <Badge key={idx} className="bg-primary/10 text-primary border-none">
                        {tech}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {editable && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit && onEdit('projects', project.id)}
                  className="text-gray-500 hover:text-primary mt-3"
                >
                  Edit
                </Button>
              )}
            </div>
          ))}
        </section>
      )}
      
      {/* Skills - Business and Technical */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center text-gray-800">
            <CheckCircle className="h-5 w-5 mr-2 text-primary" />
            Skills & Expertise
          </h3>
          {editable && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit && onEdit('skills')}
              className="text-gray-500 hover:text-primary"
            >
              Edit
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Business Skills</h4>
            <div className="flex flex-wrap gap-2">
              {data.skills
                .filter(skill => 
                  skill.category === 'Business' || 
                  !skill.category && 
                  [
                    'leadership', 'management', 'strategy', 'marketing', 
                    'sales', 'finance', 'operations', 'business', 'entrepreneurship'
                  ].some(term => skill.name.toLowerCase().includes(term))
                )
                .map((skill) => (
                  <Badge 
                    key={skill.id}
                    variant="outline" 
                    className="px-3 py-1 text-gray-700 border-primary/30 bg-primary/5"
                  >
                    {skill.name}
                  </Badge>
                ))
              }
            </div>
          </div>
          
          <div>
            <h4 className="font-medium text-gray-800 mb-2">Technical Skills</h4>
            <div className="flex flex-wrap gap-2">
              {data.skills
                .filter(skill => 
                  skill.category === 'Technical' || 
                  !skill.category && 
                  ![
                    'leadership', 'management', 'strategy', 'marketing', 
                    'sales', 'finance', 'operations', 'business', 'entrepreneurship'
                  ].some(term => skill.name.toLowerCase().includes(term))
                )
                .map((skill) => (
                  <Badge 
                    key={skill.id}
                    variant="outline" 
                    className="px-3 py-1 text-gray-700 border-gray-300"
                  >
                    {skill.name}
                  </Badge>
                ))
              }
            </div>
          </div>
        </div>
      </section>
      
      {/* Education */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold flex items-center text-gray-800">
            <GraduationCap className="h-5 w-5 mr-2 text-primary" />
            Education
          </h3>
          {editable && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => onEdit && onEdit('education')}
              className="text-gray-500 hover:text-primary"
            >
              Edit
            </Button>
          )}
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          {data.education.map((edu) => (
            <div key={edu.id} className="border border-gray-200 rounded-md p-4">
              <div className="flex flex-col md:flex-row md:justify-between">
                <div>
                  <h4 className="font-bold">{edu.institution}</h4>
                  <div className="text-primary">{edu.degree}{edu.field ? ` in ${edu.field}` : ''}</div>
                </div>
                <div className="text-gray-500 mt-1 md:mt-0">
                  {edu.startDate} - {edu.current ? 'Present' : edu.endDate}
                </div>
              </div>
              
              {edu.achievements && edu.achievements.length > 0 && (
                <div className="mt-2">
                  <h5 className="font-medium text-gray-800 mb-1">Achievements:</h5>
                  <ul className="list-disc ml-5 text-gray-700">
                    {edu.achievements.map((achievement, idx) => (
                      <li key={idx}>{achievement}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {editable && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => onEdit && onEdit('education', edu.id)}
                  className="text-gray-500 hover:text-primary mt-2"
                >
                  Edit
                </Button>
              )}
            </div>
          ))}
        </div>
      </section>
      
      {/* Certifications (if available) */}
      {data.certifications && data.certifications.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold flex items-center text-gray-800">
              <Award className="h-5 w-5 mr-2 text-primary" />
              Certifications
            </h3>
            {editable && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onEdit && onEdit('certifications')}
                className="text-gray-500 hover:text-primary"
              >
                Edit
              </Button>
            )}
          </div>
          
          <div className="flex flex-wrap gap-3">
            {data.certifications.map((cert) => (
              <div 
                key={cert.id} 
                className="border border-gray-200 rounded-md p-3 flex-1 min-w-[250px]"
              >
                <h4 className="font-bold">{cert.name}</h4>
                <div className="text-primary text-sm">{cert.issuer}</div>
                <div className="text-gray-500 text-sm">{cert.date}</div>
                
                {editable && (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => onEdit && onEdit('certifications', cert.id)}
                    className="text-gray-500 hover:text-primary mt-2"
                  >
                    Edit
                  </Button>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export const resumeTemplates = [
  {
    id: 'professional',
    name: 'Professional',
    description: 'Clean, traditional format ideal for corporate jobs and formal industries.',
    component: ProfessionalTemplate,
    bestFor: ['Corporate Roles', 'Banking', 'Management', 'Consulting']
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Modern, visually-striking layout perfect for design and creative industries.',
    component: CreativeTemplate,
    bestFor: ['Design', 'Marketing', 'Media', 'Advertising']
  },
  {
    id: 'technical',
    name: 'Technical',
    description: 'Code-focused template with emphasis on skills and technical projects.',
    component: TechnicalTemplate,
    bestFor: ['Software Engineering', 'Data Science', 'IT Roles', 'Technical Support']
  },
  {
    id: 'academic',
    name: 'Academic',
    description: 'Research-oriented format highlighting educational achievements and publications.',
    component: AcademicTemplate,
    bestFor: ['Research Positions', 'Graduate School', 'Teaching', 'Ph.D. Applications']
  },
  {
    id: 'startup',
    name: 'Entrepreneurial',
    description: 'Impact-focused template emphasizing achievements and business metrics.',
    component: StartupTemplate,
    bestFor: ['Startups', 'Business Development', 'Venture Capital', 'Sales']
  }
];

export default resumeTemplates;