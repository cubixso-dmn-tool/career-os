import React from 'react';
import { useLocation } from 'wouter';
import {
  ChevronRight,
  Rocket,
  BookOpen,
  Compass,
  Code,
  Users,
  BarChart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const LandingPage: React.FC = () => {
  const [_, navigate] = useLocation();

  const features = [
    {
      title: "AI-Powered Career Guidance",
      description: "Get personalized career recommendations based on your interests, skills, and preferences with our PathFinder AI assistant.",
      icon: <Compass className="h-10 w-10 text-primary" />
    },
    {
      title: "Curated Learning Resources",
      description: "Access high-quality courses and tutorials tailored specifically for Indian students and job market requirements.",
      icon: <BookOpen className="h-10 w-10 text-primary" />
    },
    {
      title: "Hands-on Projects",
      description: "Build your portfolio with real-world projects that showcase your skills to potential employers.",
      icon: <Code className="h-10 w-10 text-primary" />
    },
    {
      title: "Soft Skills Development",
      description: "Enhance your communication, leadership, and problem-solving abilities through interactive exercises.",
      icon: <Users className="h-10 w-10 text-primary" />
    },
    {
      title: "Progress Tracking",
      description: "Monitor your learning journey with detailed analytics and achievement badges to stay motivated.",
      icon: <BarChart className="h-10 w-10 text-primary" />
    },
    {
      title: "Community Support",
      description: "Connect with peers, mentors, and industry experts to expand your network and get guidance.",
      icon: <Users className="h-10 w-10 text-primary" />
    }
  ];

  const handleGetStarted = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Rocket className="h-8 w-8 text-primary mr-2" />
            <span className="text-xl font-bold">PathFinder</span>
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => navigate('/login')}>Login</Button>
            <Button onClick={() => navigate('/register')}>Sign Up</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary/10 to-primary/5 py-20">
        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 mb-10 lg:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Your Personalized
              <span className="text-primary block">Career Companion</span>
            </h1>
            <p className="text-gray-700 text-lg mb-8 max-w-lg">
              Empowering Indian students with AI-powered career guidance, skill development, and personalized learning pathways.
            </p>
            <div className="space-x-4">
              <Button size="lg" onClick={handleGetStarted}>
                Get Started
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate('/about')}>
                Learn More
              </Button>
            </div>
          </div>
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="relative w-full max-w-md">
              <div className="absolute -left-4 -top-4 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl opacity-50"></div>
              <div className="absolute -right-4 -bottom-4 w-72 h-72 bg-primary/20 rounded-full filter blur-3xl opacity-50"></div>
              <div className="relative z-10 bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
                {/* Mockup UI */}
                <div className="p-5 bg-primary/10 border-b border-gray-200">
                  <div className="flex items-center">
                    <Rocket className="h-5 w-5 text-primary mr-2" />
                    <span className="font-medium">PathFinder Dashboard</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="h-60 flex flex-col items-center justify-center text-center">
                    <Compass className="h-14 w-14 text-primary mb-3" />
                    <h3 className="text-lg font-medium mb-1">Find Your Path</h3>
                    <p className="text-sm text-gray-500 mb-4">Discover the career that matches your skills and passion</p>
                    <Button className="w-full">Explore Career Paths</Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">All-in-One Career Development Platform</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to navigate your career journey, from exploration to landing your dream job
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="mb-2">{feature.icon}</div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-16 text-center">
            <Button size="lg" onClick={handleGetStarted}>
              Start Your Journey
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Student Success Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Hear from students who transformed their careers with PathFinder
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="border-gray-200">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
                    <span className="text-primary font-bold text-xl">PR</span>
                  </div>
                  <p className="mb-4 text-gray-700">
                    "PathFinder helped me discover my passion for data science and guided me through every step of my learning journey."
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
                    "As a non-technical student, I was lost until PathFinder helped me identify my strengths and find the right tech career path."
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
          <h2 className="text-3xl font-bold mb-4">Ready to Discover Your Career Path?</h2>
          <p className="text-white/80 max-w-2xl mx-auto mb-8">
            Join thousands of Indian students who have found their ideal career path and started building their future with PathFinder.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={handleGetStarted}
            className="bg-white text-primary hover:bg-gray-100"
          >
            Get Started For Free
            <ChevronRight className="ml-2 h-4 w-4" />
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
                <span className="text-xl font-bold">PathFinder</span>
              </div>
              <p className="text-gray-400 max-w-xs">
                Empowering Indian students to discover and pursue their ideal careers with confidence.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-medium mb-4">Platform</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Features</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Career Paths</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Courses</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Projects</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Resources</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Community</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Success Stories</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Events</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Company</h3>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white">About Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Careers</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Contact</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} PathFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;