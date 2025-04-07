import React from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, ArrowRight, User, Mail, Phone, MapPin, Globe, FileText } from 'lucide-react';
import { ResumeData } from '../ResumeTemplates';

interface PersonalInfoFormProps {
  initialData: ResumeData['personalInfo'];
  onSubmit: (data: ResumeData['personalInfo']) => void;
  onBack: () => void;
}

const personalInfoSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  title: z.string().min(2, { message: 'Title must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(5, { message: 'Phone number must be at least 5 characters' }),
  location: z.string().min(2, { message: 'Location must be at least 2 characters' }),
  website: z.string().optional(),
  summary: z.string().min(20, { message: 'Summary must be at least 20 characters' }),
  profileImage: z.string().optional(),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;

const PersonalInfoForm: React.FC<PersonalInfoFormProps> = ({ initialData, onSubmit, onBack }) => {
  const form = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: initialData.name || '',
      title: initialData.title || '',
      email: initialData.email || '',
      phone: initialData.phone || '',
      location: initialData.location || '',
      website: initialData.website || '',
      summary: initialData.summary || '',
      profileImage: initialData.profileImage || '',
    },
  });

  const handleSubmit = (values: PersonalInfoValues) => {
    onSubmit(values);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Personal Information</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <User className="h-4 w-4 mr-2 text-primary" />
                    Full Name
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-primary" />
                    Professional Title
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="Full Stack Developer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-primary" />
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="john.doe@example.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-primary" />
                    Phone
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="+91 98765 43210" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    Location
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="New Delhi, India" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center">
                    <Globe className="h-4 w-4 mr-2 text-primary" />
                    Website (Optional)
                  </FormLabel>
                  <FormControl>
                    <Input placeholder="github.com/username" {...field} />
                  </FormControl>
                  <FormDescription>
                    Portfolio, LinkedIn, or GitHub profile
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="summary"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-primary" />
                  Professional Summary
                </FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="A brief summary of your skills, experience, and career objectives..." 
                    rows={5} 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Write a concise summary that highlights your key qualifications and career goals
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex justify-between pt-4">
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
      </Form>
    </div>
  );
};

export default PersonalInfoForm;