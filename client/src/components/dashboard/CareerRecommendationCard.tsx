import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface CareerPathData {
  title: string;
  match: number;
  niches: string[];
}

interface CareerRecommendationCardProps {
  careerPath: CareerPathData | null;
}

export default function CareerRecommendationCard({ careerPath }: CareerRecommendationCardProps) {
  if (!careerPath) {
    return (
      <div className="bg-gradient-to-br from-primary to-indigo-700 rounded-xl shadow-md p-6 text-white col-span-1 md:col-span-2">
        <h2 className="text-lg font-semibold mb-4">Discover Your Ideal Career Path</h2>
        <p className="mb-6">Take our AI-powered career assessment to find the perfect match for your skills and interests.</p>
        <Button variant="secondary" className="bg-white text-primary hover:bg-indigo-50">
          Start Career Assessment
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary to-indigo-700 rounded-xl shadow-md p-6 text-white col-span-1 md:col-span-2">
      <h2 className="text-lg font-semibold mb-2">Your Career Path</h2>
      <div className="mb-4">
        <p className="text-indigo-100 mb-1">Based on your assessment, you're a perfect fit for</p>
        <div className="flex items-center space-x-2">
          <h3 className="text-2xl font-bold">{careerPath.title}</h3>
          <Badge variant="secondary" className="bg-indigo-600 text-white">
            {careerPath.match}% Match
          </Badge>
        </div>
      </div>
      <div className="bg-white/10 rounded-lg p-4 mb-4">
        <h4 className="font-medium mb-1">Recommended Focus Areas:</h4>
        <div className="flex flex-wrap gap-2 mt-2">
          {careerPath.niches.map((niche, index) => (
            <Badge key={index} variant="outline" className="bg-white/20 text-white border-none">
              {niche}
            </Badge>
          ))}
        </div>
      </div>
      <Button variant="secondary" className="bg-white text-primary hover:bg-indigo-50">
        View Detailed Report
      </Button>
    </div>
  );
}
