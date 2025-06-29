import { motion } from 'framer-motion';
import IndustryExpertNetwork from '@/components/experts/IndustryExpertNetwork';
import { Users, Video, BookOpen, Calendar, Star, TrendingUp, MessageCircle, Award } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function IndustryExpertNetworkPage() {
  const features = [
    {
      icon: <Users className="h-6 w-6" />,
      title: "Connect with Industry Leaders",
      description: "Network with professionals from Google, Microsoft, Zomato, and top Indian companies",
      stats: "50+ Experts"
    },
    {
      icon: <Video className="h-6 w-6" />,
      title: "Expert-Led Sessions",
      description: "Attend live lectures, workshops, and Q&A sessions with industry professionals",
      stats: "100+ Sessions"
    },
    {
      icon: <BookOpen className="h-6 w-6" />,
      title: "Success Stories",
      description: "Learn from real career transformation stories and actionable insights",
      stats: "200+ Stories"
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: "Networking Events",
      description: "Join virtual meetups, career fairs, and industry-specific networking events",
      stats: "Weekly Events"
    }
  ];

  const expertHighlights = [
    {
      name: "Priya Sharma",
      title: "Senior Software Engineer at Google",
      achievement: "From Tier-3 college to Google in 3 years",
      expertise: ["Machine Learning", "System Design", "Career Transition"]
    },
    {
      name: "Rahul Gupta", 
      title: "VP of Product at Zomato",
      achievement: "Led products from 0-1 to millions of users",
      expertise: ["Product Strategy", "Growth", "Leadership"]
    },
    {
      name: "Vikram Singh",
      title: "Serial Entrepreneur & CEO",
      achievement: "3 successful exits, raised $50M+ funding",
      expertise: ["Entrepreneurship", "Fundraising", "Business Strategy"]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full">
              <Users className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Industry Expert Network
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Connect directly with industry leaders, learn from their experiences, and accelerate 
            your career growth through expert guidance and real-world insights from India's top professionals.
          </p>
          
          <div className="flex items-center justify-center gap-2 mt-6">
            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
              <Star className="h-3 w-3 mr-1" />
              Top Industry Professionals
            </Badge>
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <TrendingUp className="h-3 w-3 mr-1" />
              Real Career Stories
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <MessageCircle className="h-3 w-3 mr-1" />
              Direct Access
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
                  <div className="mx-auto p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full text-white mb-3 group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg font-semibold">{feature.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{feature.stats}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Expert Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-0">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold mb-2">Featured Experts</CardTitle>
              <CardDescription className="text-lg">
                Learn from professionals who've shaped their industries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {expertHighlights.map((expert, index) => (
                  <div key={index} className="text-center p-4 bg-white rounded-lg shadow-sm">
                    <h3 className="font-semibold text-lg mb-1">{expert.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{expert.title}</p>
                    <p className="text-sm font-medium text-purple-600 mb-3">{expert.achievement}</p>
                    <div className="flex flex-wrap justify-center gap-1">
                      {expert.expertise.map((skill, skillIndex) => (
                        <Badge key={skillIndex} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Industry Expert Network Component */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <IndustryExpertNetwork />
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0">
            <CardContent className="py-12">
              <div className="max-w-2xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Ready to Connect with Industry Leaders?</h2>
                <p className="text-xl opacity-90 mb-6">
                  Join thousands of students who've accelerated their careers through expert guidance, 
                  mentorship, and real-world insights from India's top professionals.
                </p>
                <div className="flex items-center justify-center gap-8 text-center">
                  <div>
                    <div className="text-3xl font-bold">500+</div>
                    <div className="text-sm opacity-80">Students Mentored</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">95%</div>
                    <div className="text-sm opacity-80">Success Rate</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold">50+</div>
                    <div className="text-sm opacity-80">Industry Experts</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}