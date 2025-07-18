import React from 'react';
import { useLocation } from 'wouter';
import { useAuthContext } from '@/hooks/use-auth-context';
import {
  ChevronRight,
  Rocket,
  BookOpen,
  Compass,
  Code,
  Users,
  BarChart,
  Sparkles,
  Target,
  Brain,
  Hammer,
  Bot,
  Check,
  Play,
  School,
  Medal
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const LandingPage: React.FC = () => {
  const [_, navigate] = useLocation();
  const { isAuthenticated, loading } = useAuthContext();

  const features = [
    {
      title: "Career Discovery",
      description: "Not sure what fits you best? Our smart tests & insights help you find a path that feels right.",
      icon: <Target className="h-10 w-10 text-primary" />
    },
    {
      title: "Learning, Your Way",
      description: "No boring long courses. Learn via snackable content, AI tips, projects, and 5-min challenges.",
      icon: <Brain className="h-10 w-10 text-primary" />
    },
    {
      title: "Build Real Stuff",
      description: "From resumes to side-projects, work on things you can actually show off.",
      icon: <Hammer className="h-10 w-10 text-primary" />
    },
    {
      title: "Mentorship + Community",
      description: "Get matched with mentors. Team up with peers. You're not alone here.",
      icon: <Users className="h-10 w-10 text-primary" />
    },
    {
      title: "AI-Powered Everything",
      description: "Smart suggestions, flashcards, personalized goals, even project feedback – all handled by your AI buddy.",
      icon: <Bot className="h-10 w-10 text-primary" />
    }
  ];

  const benefits = [
    "Bite-sized, binge-worthy content",
    "AI-generated notes & cheat sheets",
    "Unlockable rewards and badges",
    "Resume, mock interviews & more",
    "Made for Indian students, by young builders"
  ];

  const steps = [
    {
      title: "Take a 5-minute quiz to find your niche",
      icon: <Compass className="h-6 w-6 text-primary" />
    },
    {
      title: "Start your personalized learning journey",
      icon: <BookOpen className="h-6 w-6 text-primary" />
    },
    {
      title: "Build & showcase real projects",
      icon: <Code className="h-6 w-6 text-primary" />
    },
    {
      title: "Earn rewards, mentorships & prep for jobs",
      icon: <Medal className="h-6 w-6 text-primary" />
    }
  ];

  const audienceGroups = [
    "College students who feel stuck",
    "Hustlers looking to upskill fast",
    "Career switchers who want clarity",
    "Final years prepping for placements"
  ];

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Rocket className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold">CareerOS</span>
          </div>
          <div className="space-x-2">
            {loading ? (
              <div className="w-24 h-9 bg-gray-200 animate-pulse rounded"></div>
            ) : isAuthenticated ? (
              <Button onClick={() => navigate('/dashboard')}>Open Dashboard</Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => navigate('/login')}>Login</Button>
                <Button onClick={() => navigate('/register')}>Sign Up</Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-24">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 mb-12 lg:mb-0">
            <Badge className="mb-4 bg-primary/20 text-primary border-primary/30 px-3 py-1 text-sm">Your AI-powered Career Companion</Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Not Sure What To Do With Your Life?
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-primary mb-6">
              Let's figure it out — and build it — together.
            </h2>
            <p className="text-gray-700 text-lg mb-8 max-w-lg">
              CareerOS is your all-in-one AI-powered dashboard to find your niche, learn the right skills, build real projects, and get ready for life after college. All gamified, all chill.
            </p>
            <div className="space-x-4">
              <Button size="lg" onClick={handleGetStarted} className="px-8">
                {isAuthenticated ? 'Open Dashboard' : 'Start Your Journey – It\'s Free'}
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-6" 
                onClick={() => navigate('/how-it-works')}
              >
                <Play className="mr-2 h-4 w-4" />
                Watch How It Works
              </Button>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -left-6 -top-6 w-80 h-80 bg-primary/20 rounded-full filter blur-3xl opacity-50"></div>
              <div className="absolute -right-6 -bottom-6 w-80 h-80 bg-primary/20 rounded-full filter blur-3xl opacity-50"></div>
              <div className="relative z-10 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                {/* Mockup UI */}
                <div className="p-5 bg-primary/10 border-b border-gray-200">
                  <div className="flex items-center">
                    <Rocket className="h-5 w-5 text-primary mr-2" />
                    <span className="font-medium">CareerOS Dashboard</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="h-64 flex flex-col items-center justify-center text-center">
                    <Compass className="h-16 w-16 text-primary mb-4" />
                    <h3 className="text-xl font-medium mb-2">Find Your Path</h3>
                    <p className="text-sm text-gray-500 mb-6">Take our 5-minute quiz to discover careers that match your skills and passion</p>
                    <Button className="w-full mb-3" onClick={() => navigate('/career-guide')}>Start Career Quiz</Button>
                    <p className="text-xs text-gray-400">95% of students find their ideal path in under 10 minutes</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What You Get Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center mb-3">
              <Sparkles className="h-5 w-5 text-primary mr-2" />
              <h3 className="text-xl font-semibold text-primary">What You Get</h3>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Discover. Learn. Launch. Repeat.</h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              "It's like Duolingo met LinkedIn and made it fun."
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="mb-3">{feature.icon}</div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center mb-3">
              <Play className="h-5 w-5 text-primary mr-2" />
              <h3 className="text-xl font-semibold text-primary">How It Works</h3>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Career Journey, Simplified</h2>
          </div>
          
          <div className="max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={index} className="flex mb-8 last:mb-0">
                <div className="mr-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    {step.icon}
                  </div>
                  {index < steps.length - 1 && (
                    <div className="w-0.5 h-12 bg-primary/20 mx-auto mt-2"></div>
                  )}
                </div>
                <div className="pt-3">
                  <h4 className="text-xl font-medium">{step.title}</h4>
                  {index === steps.length - 1 && (
                    <p className="text-primary font-medium mt-2">Share your journey with the world 🌍</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Students Love It */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center mb-3">
              <Medal className="h-5 w-5 text-primary mr-2" />
              <h3 className="text-xl font-semibold text-primary">Why Students Love CareerOS</h3>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Built For Gen Z, By Gen Z</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <div className="mr-3 bg-primary/10 text-primary rounded-full p-1 mt-0.5">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-bold mb-4">Perfect For</h4>
              <div className="grid grid-cols-1 gap-3">
                {audienceGroups.map((audience, index) => (
                  <Card key={index} className="border-primary/20 bg-primary/5">
                    <CardContent className="p-4">
                      <p className="font-medium">{audience}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center mb-3">
              <Users className="h-5 w-5 text-primary mr-2" />
              <h3 className="text-xl font-semibold text-primary">Student Success Stories</h3>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Join Thousands of Happy Students</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-primary font-bold text-xl">PR</span>
                  </div>
                  <p className="mb-4 text-gray-700">
                    "CareerOS helped me discover my passion for data science and guided me through every step of my learning journey."
                  </p>
                  <p className="font-medium">Priya Rai</p>
                  <p className="text-sm text-gray-500">Data Scientist, Bangalore</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-primary font-bold text-xl">AK</span>
                  </div>
                  <p className="mb-4 text-gray-700">
                    "The project-based learning approach gave me real-world experience that helped me stand out in job interviews."
                  </p>
                  <p className="font-medium">Arjun Kumar</p>
                  <p className="text-sm text-gray-500">Full Stack Developer, Delhi</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-primary font-bold text-xl">SM</span>
                  </div>
                  <p className="mb-4 text-gray-700">
                    "As a non-technical student, I was lost until CareerOS helped me identify my strengths and find the right tech career path."
                  </p>
                  <p className="font-medium">Sneha Mehta</p>
                  <p className="text-sm text-gray-500">UI/UX Designer, Mumbai</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Your career deserves more than guesswork.</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8 text-lg">
            Let's build it together.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={handleGetStarted}
            className="bg-white text-primary hover:bg-gray-100 px-8 py-6 text-lg"
          >
            {isAuthenticated ? 'Open Dashboard' : 'Start Your Journey – It\'s Free'}
            <ChevronRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-8 md:mb-0">
              <div className="flex items-center mb-4">
                <Rocket className="h-6 w-6 text-primary mr-2" />
                <span className="text-xl font-bold">CareerOS</span>
              </div>
              <p className="text-gray-400 max-w-xs">
                Empowering Indian students to discover and pursue their ideal careers with confidence.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Platform</h3>
                <ul className="space-y-2">
                  <li><span onClick={() => navigate('/how-it-works')} className="text-gray-400 hover:text-white cursor-pointer">Features</span></li>
                  <li><span onClick={() => navigate('/career-guide')} className="text-gray-400 hover:text-white cursor-pointer">Career Paths</span></li>
                  <li><span onClick={() => navigate('/courses')} className="text-gray-400 hover:text-white cursor-pointer">Courses</span></li>
                  <li><span onClick={() => navigate('/projects')} className="text-gray-400 hover:text-white cursor-pointer">Projects</span></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><span onClick={() => navigate('/blog')} className="text-gray-400 hover:text-white cursor-pointer">Blog</span></li>
                  <li><span onClick={() => navigate('/community')} className="text-gray-400 hover:text-white cursor-pointer">Community</span></li>
                  <li><span onClick={() => navigate('/success-stories')} className="text-gray-400 hover:text-white cursor-pointer">Success Stories</span></li>
                  <li><span onClick={() => navigate('/events')} className="text-gray-400 hover:text-white cursor-pointer">Events</span></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><span onClick={() => navigate('/about')} className="text-gray-400 hover:text-white cursor-pointer">About Us</span></li>
                  <li><span onClick={() => navigate('/company-careers')} className="text-gray-400 hover:text-white cursor-pointer">Careers</span></li>
                  <li><span onClick={() => navigate('/contact')} className="text-gray-400 hover:text-white cursor-pointer">Contact</span></li>
                  <li><span onClick={() => navigate('/privacy')} className="text-gray-400 hover:text-white cursor-pointer">Privacy Policy</span></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} CareerOS. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;