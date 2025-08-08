import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageCircle, 
  Users, 
  Clock, 
  CheckCircle2, 
  Loader2,
  Building,
  Star,
  Video
} from 'lucide-react';
import { motion } from 'framer-motion';

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

interface ExpertConnectionModalProps {
  expert: IndustryExpert | null;
  isOpen: boolean;
  onClose: () => void;
  onConnect: (connectionId: number) => void;
}

export default function ExpertConnectionModal({ expert, isOpen, onClose, onConnect }: ExpertConnectionModalProps) {
  const [connectionType, setConnectionType] = useState<string>('chat');
  const [purpose, setPurpose] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  if (!expert) return null;

  const handleConnect = async () => {
    if (!purpose.trim()) {
      toast({
        title: "Purpose Required",
        description: "Please specify your purpose for connecting with this expert.",
        variant: "destructive"
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      const response = await fetch('/api/industry-experts/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          expertId: expert.id,
          connectionType,
          purpose,
          message
        })
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Connection Successful!",
          description: `You're now connected with ${expert.name}. Start chatting!`
        });
        onConnect(data.connectionId);
        onClose();
        resetForm();
      } else {
        throw new Error('Failed to connect');
      }
    } catch (error) {
      toast({
        title: "Connection Failed",
        description: "Please try again or contact support.",
        variant: "destructive"
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const resetForm = () => {
    setConnectionType('chat');
    setPurpose('');
    setMessage('');
  };

  const connectionTypes = [
    {
      id: 'chat',
      title: 'Direct Chat',
      description: 'Have a conversation with the expert',
      icon: <MessageCircle className="h-5 w-5" />
    },
    {
      id: 'mentorship',
      title: 'Mentorship',
      description: 'Ongoing guidance and career advice',
      icon: <Users className="h-5 w-5" />
    },
    {
      id: 'consultation',
      title: 'Quick Consultation',
      description: 'Brief discussion on specific topics',
      icon: <Clock className="h-5 w-5" />
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Connect with Expert</DialogTitle>
          <DialogDescription>
            Start a conversation with {expert.name} and get personalized career guidance.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Expert Profile Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg border"
          >
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={expert.avatar} alt={expert.name} />
                <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-lg">
                  {expert.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{expert.name}</h3>
                <p className="text-gray-600">{expert.title}</p>
                <div className="flex items-center gap-1 mt-1">
                  <Building className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">{expert.company}</span>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{expert.rating}%</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Video className="h-4 w-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{expert.totalSessions} sessions</span>
                  </div>
                  <Badge variant="secondary">{expert.experience}+ years</Badge>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex flex-wrap gap-1">
                {expert.expertise.slice(0, 4).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {expert.expertise.length > 4 && (
                  <Badge variant="outline" className="text-xs">
                    +{expert.expertise.length - 4}
                  </Badge>
                )}
              </div>
            </div>
          </motion.div>

          {/* Connection Type Selection */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Choose Connection Type</Label>
            <RadioGroup value={connectionType} onValueChange={setConnectionType} className="space-y-3">
              {connectionTypes.map((type) => (
                <div key={type.id} className="flex items-center space-x-3">
                  <RadioGroupItem value={type.id} id={type.id} />
                  <Label htmlFor={type.id} className="flex items-center gap-3 cursor-pointer flex-1 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-md">
                      {type.icon}
                    </div>
                    <div>
                      <div className="font-medium">{type.title}</div>
                      <div className="text-sm text-gray-600">{type.description}</div>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Purpose Input */}
          <div className="space-y-2">
            <Label htmlFor="purpose" className="text-base font-medium">
              Purpose of Connection <span className="text-red-500">*</span>
            </Label>
            <Input
              id="purpose"
              placeholder="e.g., Career guidance, Interview preparation, Industry insights..."
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full"
            />
          </div>

          {/* Initial Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-base font-medium">
              Initial Message (Optional)
            </Label>
            <Textarea
              id="message"
              placeholder="Introduce yourself and explain what you'd like to discuss..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full min-h-[100px]"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button 
              variant="outline" 
              onClick={onClose} 
              className="flex-1"
              disabled={isConnecting}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleConnect} 
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
              disabled={isConnecting || !purpose.trim()}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Connect Now
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}