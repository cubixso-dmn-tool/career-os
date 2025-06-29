import { motion } from 'framer-motion';
import Layout from '@/components/layout/Layout';
import MobileNavigation from '@/components/layout/MobileNavigation';
import AICareerCoach from '@/components/career/AICareerCoach';
import { Bot, Sparkles, Target, FileText, GraduationCap, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function AICareerCoachPage() {
  const features = [
    {
      icon: <Bot className="h-6 w-6" />,
      title: "Intelligent Career Guidance",
      description: "Get personalized career advice tailored to the Indian job market",
      benefits: ["Career path exploration", "Industry insights", "Salary expectations", "Growth planning"]
    },
    {
      icon: <Target className="h-6 w-6" />,
      title: "Mock Interview Practice",
      description: "Practice with AI-generated interview questions specific to your role",
      benefits: ["Technical interviews", "Behavioral questions", "Company-specific prep", "Real-time feedback"]
    },
    {
      icon: <FileText className="h-6 w-6" />,
      title: "Resume Optimization",
      description: "AI-powered analysis and suggestions for your resume",
      benefits: ["ATS compatibility check", "Keyword optimization", "Structure improvements", "Industry-specific tips"]
    },
    {
      icon: <GraduationCap className="h-6 w-6" />,
      title: "Personalized Learning Paths",
      description: "Custom roadmaps to reach your career goals",
      benefits: ["Skill gap analysis", "Resource recommendations", "Timeline planning", "Progress tracking"]
    }
  ];

  return (
    <>
      <Layout title="AI Career Coach">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 rounded-full">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Career Coach
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your intelligent career companion powered by advanced AI. Get personalized guidance, 
            practice interviews, optimize your resume, and create learning paths tailored for 
            Indian students and professionals.
          </p>
          
          <div className="flex items-center justify-center gap-2 mt-6">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <Sparkles className="h-3 w-3 mr-1" />
              Powered by GPT-4
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <TrendingUp className="h-3 w-3 mr-1" />
              Indian Job Market Focused
            </Badge>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              className="group"
            >
              <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></div>
                        {benefit}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Main AI Career Coach Component */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <AICareerCoach />
        </motion.div>

        {/* Success Stories Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold mb-2">Why Choose AI Career Coach?</CardTitle>
              <CardDescription className="text-lg">
                Designed specifically for Indian students and professionals
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-blue-600">10,000+</div>
                  <div className="text-sm text-gray-600">Career Recommendations Generated</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-purple-600">95%</div>
                  <div className="text-sm text-gray-600">Interview Success Rate</div>
                </div>
                <div className="text-center space-y-2">
                  <div className="text-3xl font-bold text-green-600">85%</div>
                  <div className="text-sm text-gray-600">Resume Improvement Score</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-12"
        >
          <p className="text-gray-600 max-w-2xl mx-auto">
            Ready to accelerate your career? Start chatting with your AI Career Coach above and 
            discover personalized insights that can transform your professional journey.
          </p>
        </motion.div>
      </Layout>
      
      {/* Mobile Navigation */}
      <MobileNavigation />
    </>
  );
}