import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ResumeData } from '../ResumeTemplates';

interface ExperienceFormProps {
  initialData: ResumeData['experience'];
  onSubmit: (data: ResumeData['experience']) => void;
  onBack: () => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({ initialData, onSubmit, onBack }) => {
  // For now, we'll just use a placeholder form and pass through the initial data
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(initialData);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Work Experience</h2>
      <p className="text-gray-600 mb-8">
        This would be a form to add and edit work experience entries.
        For now, we'll just display a placeholder and use the sample data.
      </p>
      
      <div className="bg-gray-50 p-4 rounded-md mb-8">
        <h3 className="font-medium text-lg mb-2">Sample Experience Data:</h3>
        <pre className="text-xs overflow-auto p-2 bg-gray-100 rounded">
          {JSON.stringify(initialData, null, 2)}
        </pre>
      </div>
      
      <form onSubmit={handleSubmit}>
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
    </div>
  );
};

export default ExperienceForm;