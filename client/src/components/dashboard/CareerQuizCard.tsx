import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function CareerQuizCard() {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-2">Not sure about your career path?</h2>
        <p className="text-gray-600 mb-4">
          Take our AI-powered career assessment quiz to discover the perfect career path based on your skills and interests.
        </p>
        <Link href="/career-guide">
          <Button className="bg-primary text-white hover:bg-primary/90">
            Take Career Quiz
          </Button>
        </Link>
      </div>
      <div className="bg-indigo-50 px-6 py-3 flex justify-between items-center">
        <span className="text-sm text-gray-600">Takes only 10 minutes</span>
        <div className="flex space-x-1">
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <div className="w-2 h-2 rounded-full bg-primary"></div>
          <div className="w-2 h-2 rounded-full bg-primary/30"></div>
          <div className="w-2 h-2 rounded-full bg-primary/30"></div>
        </div>
      </div>
    </div>
  );
}
