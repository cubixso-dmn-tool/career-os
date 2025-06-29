import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, 
  Calendar, 
  Video, 
  Star, 
  MapPin, 
  Clock,
  ExternalLink,
  Filter,
  Search,
  BookOpen,
  Award,
  TrendingUp,
  MessageCircle,
  Heart,
  Eye,
  CheckCircle2,
  UserPlus,
  Sparkles,
  Building,
  GraduationCap,
  Target
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';

interface IndustryExpert {
  id: number;
  name: string;
  title: string;
  company: string;
  industry: string;
  specializations: string[];
  experience: number;
  bio: string;
  avatar?: string;
  linkedinUrl?: string;
  expertise: string[];
  rating: number;
  totalSessions: number;
  isActive: boolean;
}

interface ExpertSession {
  id: number;
  expertId: number;
  title: string;
  description: string;
  sessionType: 'lecture' | 'qa' | 'workshop' | 'mentoring';
  category: string;
  scheduledAt: Date;
  duration: number;
  maxAttendees: number;
  currentAttendees: number;
  meetingLink?: string;
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  tags: string[];
  isFree: boolean;
  price: number;
  expert: {
    name: string;
    title: string;
    company: string;
    avatar?: string;
  };
}

interface SuccessStory {
  id: number;
  title: string;
  story: string;
  careerPath: string;
  industryFrom?: string;
  industryTo: string;
  timeframe?: string;
  keyLearnings: string[];
  challenges: string[];
  advice: string[];
  salaryGrowth?: string;
  companyProgression: string[];
  skillsGained: string[];
  certifications: string[];
  isFeatured: boolean;
  views: number;
  likes: number;
  author?: {
    name: string;
    avatar?: string;
  };
}

interface NetworkingEvent {
  id: number;
  title: string;
  description: string;
  eventType: string;
  industry?: string;
  targetAudience: string[];
  organizer: string;
  scheduledAt: Date;
  endTime: Date;
  location?: string;
  meetingLink?: string;
  maxAttendees?: number;
  currentAttendees: number;
  isOnline: boolean;
  isFree: boolean;
  registrationDeadline?: Date;
  tags: string[];
  status: 'upcoming' | 'live' | 'completed' | 'cancelled';
  expert?: {
    name: string;
    title: string;
    company: string;
  };
}

export default function IndustryExpertNetwork() {
  const [experts, setExperts] = useState<IndustryExpert[]>([]);
  const [sessions, setSessions] = useState<ExpertSession[]>([]);
  const [successStories, setSuccessStories] = useState<SuccessStory[]>([]);
  const [networkingEvents, setNetworkingEvents] = useState<NetworkingEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExpert, setSelectedExpert] = useState<IndustryExpert | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      const [expertsRes, sessionsRes, storiesRes, eventsRes] = await Promise.all([
        fetch('/api/industry-experts/experts', { credentials: 'include' }),
        fetch('/api/industry-experts/sessions', { credentials: 'include' }),
        fetch('/api/industry-experts/success-stories', { credentials: 'include' }),
        fetch('/api/industry-experts/networking-events', { credentials: 'include' })
      ]);

      if (expertsRes.ok) {
        const expertsData = await expertsRes.json();
        setExperts(expertsData.experts || []);
      }

      if (sessionsRes.ok) {
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData.sessions?.map((session: any) => ({
          ...session,
          scheduledAt: new Date(session.scheduledAt)
        })) || []);
      }

      if (storiesRes.ok) {
        const storiesData = await storiesRes.json();
        setSuccessStories(storiesData.stories || []);
      }

      if (eventsRes.ok) {
        const eventsData = await eventsRes.json();
        setNetworkingEvents(eventsData.events?.map((event: any) => ({
          ...event,
          scheduledAt: new Date(event.scheduledAt),
          endTime: new Date(event.endTime),
          registrationDeadline: event.registrationDeadline ? new Date(event.registrationDeadline) : undefined
        })) || []);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load expert network data. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const registerForSession = async (sessionId: number) => {
    try {
      const response = await fetch(`/api/industry-experts/sessions/${sessionId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ questions: [] })
      });

      if (response.ok) {
        toast({
          title: "Registration Successful",
          description: "You've been registered for the session. Check your email for details."
        });
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    }
  };

  const registerForEvent = async (eventId: number) => {
    try {
      const response = await fetch(`/api/industry-experts/networking-events/${eventId}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          networkingGoals: ['learn', 'network', 'career_growth'],
          interests: ['technology', 'career_development']
        })
      });

      if (response.ok) {
        toast({
          title: "Registration Successful",
          description: "You've been registered for the networking event."
        });
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    }
  };

  const filteredExperts = experts.filter(expert => {
    const matchesSearch = expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         expert.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === '' || expert.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const industries = Array.from(new Set(experts.map(expert => expert.industry)));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading expert network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-center gap-3"
        >
          <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-full">
            <Users className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Industry Expert Network
          </h1>
        </motion.div>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Connect with industry leaders, attend expert sessions, learn from success stories, 
          and network with professionals across India's top companies.
        </p>
      </div>

      <Tabs defaultValue="experts" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="experts" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Experts
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Sessions
          </TabsTrigger>
          <TabsTrigger value="stories" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Success Stories
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Networking
          </TabsTrigger>
        </TabsList>

        <TabsContent value="experts" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex gap-4 flex-wrap">
                <div className="flex-1 min-w-[200px]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search experts by name, title, or company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="px-3 py-2 border rounded-md min-w-[150px]"
                >
                  <option value="">All Industries</option>
                  {industries.map(industry => (
                    <option key={industry} value={industry}>{industry}</option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Experts Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredExperts.map((expert) => (
                <motion.div
                  key={expert.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={expert.avatar} alt={expert.name} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-lg">
                            {expert.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-lg leading-tight">{expert.name}</h3>
                          <p className="text-sm text-gray-600">{expert.title}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Building className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{expert.company}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 text-yellow-500 fill-current" />
                            <span className="text-sm font-medium">{expert.rating}%</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Video className="h-4 w-4 text-gray-400" />
                            <span className="text-sm text-gray-600">{expert.totalSessions}</span>
                          </div>
                        </div>
                        <Badge variant="secondary">{expert.experience}+ years</Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{expert.bio}</p>
                      
                      <div className="space-y-3">
                        <div>
                          <p className="text-xs font-medium text-gray-500 mb-2">Expertise</p>
                          <div className="flex flex-wrap gap-1">
                            {expert.expertise.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {expert.expertise.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{expert.expertise.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => setSelectedExpert(expert)}
                          >
                            <UserPlus className="h-4 w-4 mr-1" />
                            Connect
                          </Button>
                          {expert.linkedinUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <a href={expert.linkedinUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </TabsContent>

        <TabsContent value="sessions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sessions.map((session) => (
              <Card key={session.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{session.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(session.scheduledAt, 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {session.duration} min
                        </div>
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={session.expert.avatar} alt={session.expert.name} />
                          <AvatarFallback>
                            {session.expert.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{session.expert.name}</p>
                          <p className="text-xs text-gray-600">{session.expert.title} at {session.expert.company}</p>
                        </div>
                      </div>
                    </div>
                    <Badge 
                      variant={session.sessionType === 'lecture' ? 'default' : 
                               session.sessionType === 'workshop' ? 'secondary' : 
                               session.sessionType === 'qa' ? 'outline' : 'destructive'}
                    >
                      {session.sessionType}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{session.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {session.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{session.currentAttendees}/{session.maxAttendees} registered</span>
                      {session.isFree ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Free</Badge>
                      ) : (
                        <Badge variant="secondary">₹{session.price}</Badge>
                      )}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full"
                    onClick={() => registerForSession(session.id)}
                    disabled={session.currentAttendees >= session.maxAttendees}
                  >
                    {session.currentAttendees >= session.maxAttendees ? 'Full' : 'Register'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stories" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {successStories.map((story) => (
              <Card key={story.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-3">
                    {story.author && (
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={story.author.avatar} alt={story.author.name} />
                        <AvatarFallback>
                          {story.author.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{story.title}</CardTitle>
                      <p className="text-sm text-gray-600 mb-2">{story.careerPath}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {story.views}
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          {story.likes}
                        </div>
                        {story.timeframe && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {story.timeframe}
                          </div>
                        )}
                      </div>
                    </div>
                    {story.isFeatured && (
                      <Badge className="bg-gradient-to-r from-purple-500 to-blue-600">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-3">{story.story}</p>
                  
                  {story.salaryGrowth && (
                    <div className="flex items-center gap-2 mb-3">
                      <TrendingUp className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-600">{story.salaryGrowth}</span>
                    </div>
                  )}
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">Key Skills Gained</p>
                      <div className="flex flex-wrap gap-1">
                        {story.skillsGained.slice(0, 4).map((skill, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {story.skillsGained.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{story.skillsGained.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <Button variant="outline" className="w-full">
                      Read Full Story
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {networkingEvents.map((event) => (
              <Card key={event.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{event.title}</CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {format(event.scheduledAt, 'MMM dd, yyyy')}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {format(event.scheduledAt, 'HH:mm')} - {format(event.endTime, 'HH:mm')}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mb-3">
                        <MapPin className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {event.isOnline ? 'Online' : event.location}
                        </span>
                      </div>
                    </div>
                    <Badge variant={event.eventType === 'career_fair' ? 'default' : 'secondary'}>
                      {event.eventType.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">{event.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {event.tags.map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{event.currentAttendees}{event.maxAttendees ? `/${event.maxAttendees}` : ''} registered</span>
                      {event.isFree && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">Free</Badge>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">by {event.organizer}</span>
                  </div>
                  
                  {event.expert && (
                    <div className="flex items-center gap-2 mb-4 p-2 bg-gray-50 rounded-md">
                      <GraduationCap className="h-4 w-4 text-gray-600" />
                      <div className="text-sm">
                        <span className="font-medium">{event.expert.name}</span>
                        <span className="text-gray-600"> - {event.expert.title}</span>
                      </div>
                    </div>
                  )}
                  
                  <Button 
                    className="w-full"
                    onClick={() => registerForEvent(event.id)}
                    disabled={event.maxAttendees ? event.currentAttendees >= event.maxAttendees : false}
                  >
                    {event.maxAttendees && event.currentAttendees >= event.maxAttendees ? 'Full' : 'Register'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}