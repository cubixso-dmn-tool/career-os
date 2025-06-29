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
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              AI Career Coach
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Your personal AI-powered career advisor designed specifically for Indian students and professionals. 
            Get expert guidance, practice interviews, optimize your resume, and accelerate your career growth.
          </p>
          
          <div className="flex items-center justify-center gap-2 mt-6">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Sparkles className="h-3 w-3 mr-1" />
              AI-Powered Insights
            </Badge>
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Target className="h-3 w-3 mr-1" />
              Personalized Guidance
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <TrendingUp className="h-3 w-3 mr-1" />
              Career Growth
            </Badge>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
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
                <CardHeader>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full text-white group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                    </div>
                  </div>
                  <CardDescription className="text-sm text-gray-600 mb-4">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {feature.benefits.map((benefit, benefitIndex) => (
                      <li key={benefitIndex} className="flex items-center text-sm text-gray-600">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3 flex-shrink-0"></div>
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
          className="mb-12"
        >
          <AICareerCoach />
        </motion.div>

        {/* Success Stories Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold mb-2">Success Stories</CardTitle>
              <CardDescription className="text-lg">
                Real students who transformed their careers with AI Career Coach
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg mb-2">"Got my dream job at Google!"</h3>
                  <p className="text-sm text-gray-600 mb-2">Arjun, Software Engineer</p>
                  <p className="text-xs text-gray-500">
                    The AI coach helped me prepare for technical interviews and optimize my resume. 
                    I received my Google offer within 3 months!
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg mb-2">"150% salary increase!"</h3>
                  <p className="text-sm text-gray-600 mb-2">Priya, Data Scientist</p>
                  <p className="text-xs text-gray-500">
                    The personalized learning path identified my skill gaps and helped me transition 
                    from software development to data science.
                  </p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg shadow-sm">
                  <h3 className="font-semibold text-lg mb-2">"From college to startup!"</h3>
                  <p className="text-sm text-gray-600 mb-2">Rohit, Product Manager</p>
                  <p className="text-xs text-gray-500">
                    The career guidance helped me understand product management and land my first PM role 
                    straight out of college.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Statistics Section */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
            <CardContent className="py-12">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-2">Transforming Careers Across India</h2>
                <p className="text-xl opacity-90">Join thousands of successful professionals</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
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