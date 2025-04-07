import { useLocation } from "wouter";
import { 
  ArrowLeft, 
  Compass, 
  BookOpen, 
  Code, 
  Medal,
  Play,
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorks() {
  const [_, navigate] = useLocation();

  const steps = [
    {
      title: "Take a 5-minute quiz to find your niche",
      description: "Answer a few simple questions about your interests, strengths, and goals. Our AI will analyze your responses and suggest career paths that match your unique profile.",
      icon: <Compass className="h-12 w-12 text-primary" />
    },
    {
      title: "Start your personalized learning journey",
      description: "Get a custom learning plan with bite-sized content, interactive exercises, and AI-powered feedback. Learn at your own pace with guidance every step of the way.",
      icon: <BookOpen className="h-12 w-12 text-primary" />
    },
    {
      title: "Build & showcase real projects",
      description: "Apply what you've learned by working on practical projects that solve real problems. Add these to your portfolio to demonstrate your skills to future employers.",
      icon: <Code className="h-12 w-12 text-primary" />
    },
    {
      title: "Earn rewards, mentorships & prep for jobs",
      description: "Track your progress, earn badges, and unlock special features as you advance. Connect with mentors in your field and prepare for job interviews with AI-powered mock interviews.",
      icon: <Medal className="h-12 w-12 text-primary" />
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back button */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </header>

      {/* Main content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center mb-3">
              <Play className="h-5 w-5 text-primary mr-2" />
              <h3 className="text-xl font-semibold text-primary">How CareerOS Works</h3>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Your Career Journey, Simplified</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              CareerOS guides you from confusion to career confidence through a simple, personalized process.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-16">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="shrink-0 w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                  {step.icon}
                  <div className="absolute w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-3 text-center md:text-left">{step.title}</h2>
                  <p className="text-gray-600 text-lg text-center md:text-left">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Video Placeholder */}
          <div className="mt-20 bg-gray-100 aspect-video rounded-xl flex flex-col items-center justify-center border border-gray-200">
            <Play className="h-16 w-16 text-primary mb-4" />
            <h3 className="text-xl font-medium">Watch the Demo Video</h3>
            <p className="text-gray-500 mb-4">See how CareerOS works in action</p>
            <Button className="mt-2">
              Play Video
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>

          {/* CTA */}
          <div className="mt-20 text-center">
            <h2 className="text-2xl font-bold mb-4">Ready to start your journey?</h2>
            <Button 
              size="lg" 
              onClick={() => navigate('/register')}
              className="mt-4"
            >
              Create Your Free Account
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}