import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, CheckCircle } from 'lucide-react';
import { 
  resumeTemplates, 
  ResumeData,
  ProfessionalTemplate, 
  CreativeTemplate, 
  TechnicalTemplate, 
  AcademicTemplate, 
  StartupTemplate 
} from './ResumeTemplates';

interface TemplateSelectorProps {
  sampleData: ResumeData;
  onSelectTemplate: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ sampleData, onSelectTemplate }) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('professional');
  
  const handleTemplateChange = (value: string) => {
    setSelectedTemplate(value);
  };
  
  const handleSelect = () => {
    onSelectTemplate(selectedTemplate);
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Choose Your Resume Template</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <RadioGroup 
            value={selectedTemplate} 
            onValueChange={handleTemplateChange}
            className="space-y-4"
          >
            {resumeTemplates.map((template) => (
              <div key={template.id} className="flex">
                <RadioGroupItem 
                  value={template.id} 
                  id={template.id}
                  className="mt-1"
                />
                <div className="ml-3 flex-1">
                  <Label 
                    htmlFor={template.id} 
                    className="text-lg font-medium flex items-center cursor-pointer"
                  >
                    {template.name}
                    {selectedTemplate === template.id && (
                      <CheckCircle className="ml-2 h-4 w-4 text-primary" />
                    )}
                  </Label>
                  <p className="text-gray-600 mt-1">{template.description}</p>
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {template.bestFor.map((item, idx) => (
                      <Badge 
                        key={idx} 
                        variant="outline" 
                        className="bg-primary/5 text-primary border-primary/20"
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
          
          <Button 
            className="mt-8 w-full"
            onClick={handleSelect}
          >
            Use This Template
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
        
        <div>
          <Tabs defaultValue="preview" className="w-full">
            <TabsList className="w-full mb-4">
              <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
              <TabsTrigger value="details" className="flex-1">Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="mt-0">
              <Card className="border-2 border-primary/10 overflow-hidden">
                <CardContent className="p-0">
                  <div className="max-h-[500px] overflow-auto p-2 scale-[0.7] origin-top-left">
                    {selectedTemplate === 'professional' && (
                      <ProfessionalTemplate data={sampleData} />
                    )}
                    {selectedTemplate === 'creative' && (
                      <CreativeTemplate data={sampleData} />
                    )}
                    {selectedTemplate === 'technical' && (
                      <TechnicalTemplate data={sampleData} />
                    )}
                    {selectedTemplate === 'academic' && (
                      <AcademicTemplate data={sampleData} />
                    )}
                    {selectedTemplate === 'startup' && (
                      <StartupTemplate data={sampleData} />
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  {resumeTemplates.find(t => t.id === selectedTemplate)?.id === 'professional' && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">Professional Template</h3>
                      <p>The Professional Template offers a clean, traditional format that's perfect for corporate environments and formal industries. It emphasizes your work experience and accomplishments in a structured, easy-to-scan format.</p>
                      
                      <h4 className="font-medium text-lg mt-4">Key Features:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Classic, conservative layout respected across all industries</li>
                        <li>Clear section hierarchy with prominent work experience</li>
                        <li>Balanced white space with optimized readability</li>
                        <li>ATS-friendly design that passes automated screening</li>
                        <li>Elegant typography and minimal design elements</li>
                      </ul>
                      
                      <h4 className="font-medium text-lg mt-4">Ideal For:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Corporate positions and traditional industries</li>
                        <li>Finance, banking, and consulting roles</li>
                        <li>Management positions and executive roles</li>
                        <li>Government and administrative positions</li>
                        <li>Candidates with established career histories</li>
                      </ul>
                    </div>
                  )}
                  
                  {resumeTemplates.find(t => t.id === selectedTemplate)?.id === 'creative' && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">Creative Template</h3>
                      <p>The Creative Template uses modern design elements and a two-column layout to showcase your personality alongside your professional qualifications. Perfect for creative industries where visual presentation matters.</p>
                      
                      <h4 className="font-medium text-lg mt-4">Key Features:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Modern two-column layout with visual emphasis</li>
                        <li>Attractive timeline for work experience</li>
                        <li>Prominent skills and project showcase sections</li>
                        <li>Strategic use of color to highlight important elements</li>
                        <li>Balanced professional appearance with creative touches</li>
                      </ul>
                      
                      <h4 className="font-medium text-lg mt-4">Ideal For:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Design professionals (UI/UX, graphic, product)</li>
                        <li>Marketing and digital media specialists</li>
                        <li>Content creators and communications roles</li>
                        <li>Advertising and brand management</li>
                        <li>Creative directors and art directors</li>
                      </ul>
                    </div>
                  )}
                  
                  {resumeTemplates.find(t => t.id === selectedTemplate)?.id === 'technical' && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">Technical Template</h3>
                      <p>The Technical Template highlights your technical skills, projects, and development experience. It organizes information in a structured way that emphasizes your technical proficiency and accomplishments.</p>
                      
                      <h4 className="font-medium text-lg mt-4">Key Features:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Prominent technical skills section with categorization</li>
                        <li>Detailed project sections with tech stack highlights</li>
                        <li>Clean code-like structure for easy scanning</li>
                        <li>Emphasis on technical achievements and contributions</li>
                        <li>Space for certifications and technical qualifications</li>
                      </ul>
                      
                      <h4 className="font-medium text-lg mt-4">Ideal For:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Software engineers and developers</li>
                        <li>Data scientists and analysts</li>
                        <li>IT professionals and system administrators</li>
                        <li>DevOps and cloud specialists</li>
                        <li>Technical support and QA engineers</li>
                      </ul>
                    </div>
                  )}
                  
                  {resumeTemplates.find(t => t.id === selectedTemplate)?.id === 'academic' && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">Academic Template</h3>
                      <p>The Academic Template is designed for research positions and academic applications. It emphasizes your educational background, research experience, and publications in a formal, scholarly format.</p>
                      
                      <h4 className="font-medium text-lg mt-4">Key Features:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Emphasis on educational background and qualifications</li>
                        <li>Dedicated sections for research experience and publications</li>
                        <li>Formal, scholarly presentation style</li>
                        <li>Space for teaching experience and academic achievements</li>
                        <li>Traditional serif typography for readability</li>
                      </ul>
                      
                      <h4 className="font-medium text-lg mt-4">Ideal For:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Academic positions and research roles</li>
                        <li>PhD candidates and postdoctoral researchers</li>
                        <li>Fellowship and grant applications</li>
                        <li>Teaching positions at colleges and universities</li>
                        <li>Research scientists in public and private sectors</li>
                      </ul>
                    </div>
                  )}
                  
                  {resumeTemplates.find(t => t.id === selectedTemplate)?.id === 'startup' && (
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold">Entrepreneurial Template</h3>
                      <p>The Entrepreneurial Template is designed to highlight achievements, business impact, and growth metrics. Perfect for startup environments, business development roles, and positions requiring demonstrated results.</p>
                      
                      <h4 className="font-medium text-lg mt-4">Key Features:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Bold header with strong personal branding</li>
                        <li>Achievement-focused sections with metrics and outcomes</li>
                        <li>Prominent value proposition statement</li>
                        <li>Visual distinction between business and technical skills</li>
                        <li>Impact-oriented presentation of experience</li>
                      </ul>
                      
                      <h4 className="font-medium text-lg mt-4">Ideal For:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Startup founders and entrepreneurs</li>
                        <li>Business development and sales professionals</li>
                        <li>Product managers and growth specialists</li>
                        <li>Venture capital and investment roles</li>
                        <li>Innovation and strategy consultants</li>
                      </ul>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default TemplateSelector;