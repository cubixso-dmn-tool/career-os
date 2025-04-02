import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle, FileText, ArrowRight } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Define schemas for different sections
const personalInfoSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  location: z.string().min(2, "Location must be at least 2 characters"),
  linkedIn: z.string().optional(),
  portfolio: z.string().optional(),
});

const educationItemSchema = z.object({
  institution: z.string().min(2, "Institution name is required"),
  degree: z.string().min(2, "Degree is required"),
  fieldOfStudy: z.string().min(2, "Field of study is required"),
  startDate: z.string().min(2, "Start date is required"),
  endDate: z.string().min(2, "End date is required"),
  grade: z.string().optional(),
});

const experienceItemSchema = z.object({
  company: z.string().min(2, "Company name is required"),
  position: z.string().min(2, "Position is required"),
  location: z.string().optional(),
  startDate: z.string().min(2, "Start date is required"),
  endDate: z.string().min(2, "End date is required"),
  description: z.string().min(10, "Please provide at least 10 characters of description"),
});

const projectItemSchema = z.object({
  title: z.string().min(2, "Project title is required"),
  description: z.string().min(10, "Please provide at least 10 characters of description"),
  technologies: z.string().min(2, "Technologies used are required"),
  link: z.string().optional(),
});

const skillsSchema = z.object({
  skills: z.string().min(5, "Please add some skills"),
});

// Combined schema
const resumeSchema = z.object({
  personal: personalInfoSchema,
  education: z.array(educationItemSchema).min(1, "Add at least one education entry"),
  experience: z.array(experienceItemSchema).min(1, "Add at least one experience entry"),
  projects: z.array(projectItemSchema).optional(),
  skills: skillsSchema,
  templateId: z.string().default("modern"),
});

type ResumeFormValues = z.infer<typeof resumeSchema>;

interface ResumeBuilderProps {
  userId: number;
  existingResume?: any;
}

export default function ResumeBuilder({ userId, existingResume }: ResumeBuilderProps) {
  const [activeTab, setActiveTab] = useState("personal");
  const queryClient = useQueryClient();

  // Default values - using existing resume data if available
  const defaultValues: ResumeFormValues = existingResume || {
    personal: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedIn: "",
      portfolio: "",
    },
    education: [
      {
        institution: "",
        degree: "",
        fieldOfStudy: "",
        startDate: "",
        endDate: "",
        grade: "",
      },
    ],
    experience: [
      {
        company: "",
        position: "",
        location: "",
        startDate: "",
        endDate: "",
        description: "",
      },
    ],
    projects: [
      {
        title: "",
        description: "",
        technologies: "",
        link: "",
      },
    ],
    skills: {
      skills: "",
    },
    templateId: "modern",
  };

  const form = useForm<ResumeFormValues>({
    resolver: zodResolver(resumeSchema),
    defaultValues,
  });

  const { fields: educationFields, append: appendEducation, remove: removeEducation } = 
    form.useFieldArray({ name: "education" });
    
  const { fields: experienceFields, append: appendExperience, remove: removeExperience } = 
    form.useFieldArray({ name: "experience" });
    
  const { fields: projectFields, append: appendProject, remove: removeProject } = 
    form.useFieldArray({ name: "projects" });

  const saveMutation = useMutation({
    mutationFn: async (data: ResumeFormValues) => {
      // Format data for API
      const formattedData = {
        userId,
        education: data.education,
        experience: data.experience,
        projects: data.projects || [],
        skills: data.skills.skills.split(',').map(skill => skill.trim()),
        templateId: data.templateId,
      };
      
      const response = await apiRequest(
        existingResume ? "PATCH" : "POST",
        existingResume ? `/api/resumes/${existingResume.id}` : "/api/resumes",
        formattedData
      );
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/users/${userId}/resume`] });
    },
  });

  const onSubmit = (data: ResumeFormValues) => {
    saveMutation.mutate(data);
  };

  const nextTab = () => {
    const tabs = ["personal", "education", "experience", "projects", "skills", "preview"];
    const currentIndex = tabs.indexOf(activeTab);
    if (currentIndex < tabs.length - 1) {
      setActiveTab(tabs[currentIndex + 1]);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center text-xl font-semibold">
          <FileText className="mr-2 h-5 w-5" />
          Resume Builder
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 md:grid-cols-6">
                <TabsTrigger value="personal">Personal</TabsTrigger>
                <TabsTrigger value="education">Education</TabsTrigger>
                <TabsTrigger value="experience">Experience</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="preview">Preview</TabsTrigger>
              </TabsList>

              {/* Personal Info Tab */}
              <TabsContent value="personal">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="personal.fullName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="personal.email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input placeholder="john.doe@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="personal.phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone</FormLabel>
                          <FormControl>
                            <Input placeholder="+91 9876543210" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="personal.location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Location</FormLabel>
                          <FormControl>
                            <Input placeholder="Mumbai, India" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="personal.linkedIn"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://linkedin.com/in/johndoe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="personal.portfolio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Portfolio/Website (Optional)</FormLabel>
                          <FormControl>
                            <Input placeholder="https://johndoe.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end">
                    <Button type="button" onClick={nextTab} className="bg-primary">
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Education Tab */}
              <TabsContent value="education">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Education</h3>
                    <Button
                      type="button"
                      onClick={() => appendEducation({
                        institution: "",
                        degree: "",
                        fieldOfStudy: "",
                        startDate: "",
                        endDate: "",
                        grade: "",
                      })}
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <PlusCircle className="mr-1 h-4 w-4" /> Add Education
                    </Button>
                  </div>
                  
                  {educationFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Education #{index + 1}</h4>
                        {index > 0 && (
                          <Button
                            type="button"
                            onClick={() => removeEducation(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`education.${index}.institution`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Institution</FormLabel>
                              <FormControl>
                                <Input placeholder="IIT Delhi" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`education.${index}.degree`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Degree</FormLabel>
                              <FormControl>
                                <Input placeholder="B.Tech" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`education.${index}.fieldOfStudy`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Field of Study</FormLabel>
                              <FormControl>
                                <Input placeholder="Computer Science" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`education.${index}.grade`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Grade/CGPA (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="8.5/10" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`education.${index}.startDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Start Date</FormLabel>
                              <FormControl>
                                <Input placeholder="June 2018" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`education.${index}.endDate`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>End Date</FormLabel>
                              <FormControl>
                                <Input placeholder="May 2022" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <Button type="button" onClick={nextTab} className="bg-primary">
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Experience Tab */}
              <TabsContent value="experience">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Work Experience</h3>
                    <Button
                      type="button"
                      onClick={() => appendExperience({
                        company: "",
                        position: "",
                        location: "",
                        startDate: "",
                        endDate: "",
                        description: "",
                      })}
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <PlusCircle className="mr-1 h-4 w-4" /> Add Experience
                    </Button>
                  </div>
                  
                  {experienceFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Experience #{index + 1}</h4>
                        {index > 0 && (
                          <Button
                            type="button"
                            onClick={() => removeExperience(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`experience.${index}.company`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company</FormLabel>
                              <FormControl>
                                <Input placeholder="Google" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`experience.${index}.position`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Position</FormLabel>
                              <FormControl>
                                <Input placeholder="Software Engineer" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`experience.${index}.location`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="Bangalore, India" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name={`experience.${index}.startDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Start Date</FormLabel>
                                <FormControl>
                                  <Input placeholder="June 2022" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`experience.${index}.endDate`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>End Date</FormLabel>
                                <FormControl>
                                  <Input placeholder="Present" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="mt-4">
                        <FormField
                          control={form.control}
                          name={`experience.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe your responsibilities and achievements" 
                                  rows={3}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <Button type="button" onClick={nextTab} className="bg-primary">
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Projects Tab */}
              <TabsContent value="projects">
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Projects</h3>
                    <Button
                      type="button"
                      onClick={() => appendProject({
                        title: "",
                        description: "",
                        technologies: "",
                        link: "",
                      })}
                      variant="outline"
                      size="sm"
                      className="flex items-center"
                    >
                      <PlusCircle className="mr-1 h-4 w-4" /> Add Project
                    </Button>
                  </div>
                  
                  {projectFields.map((field, index) => (
                    <div key={field.id} className="p-4 border rounded-md">
                      <div className="flex justify-between items-center mb-4">
                        <h4 className="font-medium">Project #{index + 1}</h4>
                        {index > 0 && (
                          <Button
                            type="button"
                            onClick={() => removeProject(index)}
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`projects.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Project Title</FormLabel>
                              <FormControl>
                                <Input placeholder="E-commerce Website" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`projects.${index}.technologies`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Technologies Used</FormLabel>
                              <FormControl>
                                <Input placeholder="React, Node.js, MongoDB" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`projects.${index}.link`}
                          render={({ field }) => (
                            <FormItem className="col-span-1 md:col-span-2">
                              <FormLabel>Project Link (Optional)</FormLabel>
                              <FormControl>
                                <Input placeholder="https://github.com/username/project" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="mt-4">
                        <FormField
                          control={form.control}
                          name={`projects.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe the project, your role, and key features" 
                                  rows={3}
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-end">
                    <Button type="button" onClick={nextTab} className="bg-primary">
                      Next <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Skills Tab */}
              <TabsContent value="skills">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Skills</h3>
                  
                  <FormField
                    control={form.control}
                    name="skills.skills"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Skills (comma-separated)</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="React.js, Node.js, Python, Machine Learning, Data Analysis, SQL, MongoDB, etc." 
                            rows={5}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="templateId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resume Template</FormLabel>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-2">
                          <label className={`border rounded-md p-4 flex flex-col items-center ${field.value === 'modern' ? 'border-primary bg-indigo-50' : ''}`}>
                            <input
                              type="radio"
                              value="modern"
                              className="sr-only"
                              checked={field.value === 'modern'}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                            <div className="h-24 w-full bg-gray-100 mb-2 rounded flex items-center justify-center">
                              <span className="text-gray-500">Modern</span>
                            </div>
                            <span className={`text-sm ${field.value === 'modern' ? 'text-primary font-medium' : ''}`}>Modern</span>
                          </label>
                          
                          <label className={`border rounded-md p-4 flex flex-col items-center ${field.value === 'classic' ? 'border-primary bg-indigo-50' : ''}`}>
                            <input
                              type="radio"
                              value="classic"
                              className="sr-only"
                              checked={field.value === 'classic'}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                            <div className="h-24 w-full bg-gray-100 mb-2 rounded flex items-center justify-center">
                              <span className="text-gray-500">Classic</span>
                            </div>
                            <span className={`text-sm ${field.value === 'classic' ? 'text-primary font-medium' : ''}`}>Classic</span>
                          </label>
                          
                          <label className={`border rounded-md p-4 flex flex-col items-center ${field.value === 'creative' ? 'border-primary bg-indigo-50' : ''}`}>
                            <input
                              type="radio"
                              value="creative"
                              className="sr-only"
                              checked={field.value === 'creative'}
                              onChange={(e) => field.onChange(e.target.value)}
                            />
                            <div className="h-24 w-full bg-gray-100 mb-2 rounded flex items-center justify-center">
                              <span className="text-gray-500">Creative</span>
                            </div>
                            <span className={`text-sm ${field.value === 'creative' ? 'text-primary font-medium' : ''}`}>Creative</span>
                          </label>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end">
                    <Button type="button" onClick={nextTab} className="bg-primary">
                      Preview <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Preview Tab */}
              <TabsContent value="preview">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Resume Preview</h3>
                  
                  <div className="border border-dashed rounded-md p-6 bg-gray-50 min-h-[400px] flex flex-col items-center justify-center">
                    <div className="text-center mb-4">
                      <h4 className="text-xl font-semibold mb-1">{form.watch('personal.fullName') || 'Your Name'}</h4>
                      <p className="text-gray-600 text-sm">
                        {form.watch('personal.email') || 'email@example.com'} • {form.watch('personal.phone') || '+91 1234567890'} • {form.watch('personal.location') || 'City, India'}
                      </p>
                      {(form.watch('personal.linkedIn') || form.watch('personal.portfolio')) && (
                        <p className="text-primary text-sm mt-1">
                          {form.watch('personal.linkedIn') && 'LinkedIn'} 
                          {form.watch('personal.linkedIn') && form.watch('personal.portfolio') && ' • '} 
                          {form.watch('personal.portfolio') && 'Portfolio'}
                        </p>
                      )}
                    </div>
                    
                    <div className="w-full max-w-lg space-y-4">
                      {/* Education Preview */}
                      <div>
                        <h5 className="font-semibold border-b pb-1 mb-2">Education</h5>
                        {educationFields.map((field, index) => (
                          <div key={index} className="mb-2">
                            <div className="flex justify-between">
                              <strong>{form.watch(`education.${index}.institution`) || 'Institution Name'}</strong>
                              <span className="text-sm">
                                {form.watch(`education.${index}.startDate`) || 'Start Date'} - {form.watch(`education.${index}.endDate`) || 'End Date'}
                              </span>
                            </div>
                            <div className="text-sm">
                              {form.watch(`education.${index}.degree`) || 'Degree'}, {form.watch(`education.${index}.fieldOfStudy`) || 'Field of Study'}
                              {form.watch(`education.${index}.grade`) && ` • GPA: ${form.watch(`education.${index}.grade`)}`}
                            </div>
                          </div>
                        ))}
                      </div>
                      
                      {/* Experience Preview */}
                      <div>
                        <h5 className="font-semibold border-b pb-1 mb-2">Experience</h5>
                        {experienceFields.map((field, index) => (
                          <div key={index} className="mb-2">
                            <div className="flex justify-between">
                              <strong>{form.watch(`experience.${index}.position`) || 'Position'}</strong>
                              <span className="text-sm">
                                {form.watch(`experience.${index}.startDate`) || 'Start Date'} - {form.watch(`experience.${index}.endDate`) || 'End Date'}
                              </span>
                            </div>
                            <div className="text-sm font-medium">{form.watch(`experience.${index}.company`) || 'Company'}{form.watch(`experience.${index}.location`) && `, ${form.watch(`experience.${index}.location`)}`}</div>
                            <p className="text-sm text-gray-600 mt-1">{form.watch(`experience.${index}.description`) || 'Job description'}</p>
                          </div>
                        ))}
                      </div>
                      
                      {/* Projects Preview */}
                      {projectFields.length > 0 && (
                        <div>
                          <h5 className="font-semibold border-b pb-1 mb-2">Projects</h5>
                          {projectFields.map((field, index) => (
                            <div key={index} className="mb-2">
                              <div className="flex justify-between">
                                <strong>{form.watch(`projects.${index}.title`) || 'Project Title'}</strong>
                                {form.watch(`projects.${index}.link`) && (
                                  <span className="text-sm text-primary">[Link]</span>
                                )}
                              </div>
                              <div className="text-sm font-medium">Technologies: {form.watch(`projects.${index}.technologies`) || 'Tech stack'}</div>
                              <p className="text-sm text-gray-600 mt-1">{form.watch(`projects.${index}.description`) || 'Project description'}</p>
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {/* Skills Preview */}
                      <div>
                        <h5 className="font-semibold border-b pb-1 mb-2">Skills</h5>
                        <p className="text-sm">{form.watch('skills.skills') || 'Your skills'}</p>
                      </div>
                    </div>
                    
                    <p className="text-gray-500 mt-8 text-sm">This is a simplified preview. The final resume will be properly formatted based on the template you selected.</p>
                  </div>
                  
                  <div className="flex justify-end space-x-2">
                    <Button type="submit" className="bg-primary" disabled={saveMutation.isPending}>
                      {saveMutation.isPending ? 'Saving...' : (existingResume ? 'Update Resume' : 'Save Resume')}
                    </Button>
                    <Button type="button" variant="outline">
                      Download PDF
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="border-t pt-6">
        <p className="text-sm text-gray-500">
          Your resume will be automatically saved when you complete all sections. You can come back and edit it anytime.
        </p>
      </CardFooter>
    </Card>
  );
}
