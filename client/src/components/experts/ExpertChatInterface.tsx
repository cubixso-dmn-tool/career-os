import { useState, useEffect, useRef } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useToast } from '@/hooks/use-toast';
import { 
  Send, 
  Phone, 
  Video, 
  MoreVertical, 
  ArrowLeft,
  Clock,
  CheckCircle2,
  User,
  Building,
  MessageCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isYesterday } from 'date-fns';

interface ExpertMessage {
  id: number;
  connectionId: number;
  senderId: number;
  receiverId: number;
  message: string;
  messageType: string;
  attachmentUrl?: string;
  isRead: boolean;
  createdAt: string;
  editedAt?: string;
}

interface ExpertConnection {
  id: number;
  expertId: number;
  connectionType: string;
  status: string;
  purpose: string;
  createdAt: string;
  lastActivityAt: string;
  expertName: string;
  expertTitle: string;
  expertCompany: string;
  expertAvatar?: string;
  expertIndustry: string;
}

interface ExpertChatInterfaceProps {
  connectionId: number | null;
  isOpen: boolean;
  onClose: () => void;
  currentUserId: number;
}

export default function ExpertChatInterface({ connectionId, isOpen, onClose, currentUserId }: ExpertChatInterfaceProps) {
  const [connection, setConnection] = useState<ExpertConnection | null>(null);
  const [messages, setMessages] = useState<ExpertMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (connectionId && isOpen) {
      fetchConnectionData();
      fetchMessages();
    }
  }, [connectionId, isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConnectionData = async () => {
    try {
      const response = await fetch('/api/industry-experts/connections', {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        const conn = data.connections.find((c: ExpertConnection) => c.id === connectionId);
        if (conn) {
          setConnection(conn);
        }
      }
    } catch (error) {
      console.error('Error fetching connection data:', error);
    }
  };

  const fetchMessages = async () => {
    if (!connectionId) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/industry-experts/connections/${connectionId}/messages`, {
        credentials: 'include'
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      } else {
        throw new Error('Failed to fetch messages');
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!connectionId || !newMessage.trim() || isSending) return;

    const messageText = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    try {
      const response = await fetch(`/api/industry-experts/connections/${connectionId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ message: messageText })
      });

      if (response.ok) {
        const data = await response.json();
        setMessages(prev => [...prev, data.message]);
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send message",
        description: "Please try again.",
        variant: "destructive"
      });
      setNewMessage(messageText); // Restore message
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollElement = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  };

  const formatMessageDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return format(date, 'HH:mm');
    } else if (isYesterday(date)) {
      return 'Yesterday ' + format(date, 'HH:mm');
    } else {
      return format(date, 'MMM dd, HH:mm');
    }
  };

  if (!connection) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={onClose}
              className="md:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            
            <Avatar className="h-12 w-12">
              <AvatarImage src={connection.expertAvatar} alt={connection.expertName} />
              <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white">
                {connection.expertName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <DialogTitle className="text-lg">{connection.expertName}</DialogTitle>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <span>{connection.expertTitle}</span>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Building className="h-3 w-3" />
                  <span>{connection.expertCompany}</span>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="secondary" className="text-xs">
                  {connection.connectionType}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {connection.expertIndustry}
                </Badge>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        {/* Chat Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {/* Connection Purpose Banner */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <MessageCircle className="h-4 w-4 text-purple-600" />
                <span className="text-sm font-medium text-purple-800">Connection Purpose</span>
              </div>
              <p className="text-sm text-purple-700">{connection.purpose}</p>
            </motion.div>

            {/* Messages */}
            <AnimatePresence>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>Start the conversation with {connection.expertName}</p>
                </div>
              ) : (
                messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`flex gap-3 ${
                      message.senderId === currentUserId ? 'flex-row-reverse' : ''
                    }`}
                  >
                    <Avatar className="h-8 w-8">
                      {message.senderId === currentUserId ? (
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      ) : (
                        <>
                          <AvatarImage src={connection.expertAvatar} />
                          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-blue-600 text-white text-xs">
                            {connection.expertName.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </>
                      )}
                    </Avatar>
                    
                    <div className={`flex flex-col max-w-[70%] ${
                      message.senderId === currentUserId ? 'items-end' : 'items-start'
                    }`}>
                      <div className={`px-4 py-2 rounded-2xl ${
                        message.senderId === currentUserId
                          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}>
                        <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                      </div>
                      
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-xs text-gray-500">
                          {formatMessageDate(message.createdAt)}
                        </span>
                        {message.senderId === currentUserId && (
                          <CheckCircle2 className={`h-3 w-3 ${
                            message.isRead ? 'text-blue-500' : 'text-gray-400'
                          }`} />
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Message Input */}
        <div className="p-4 border-t bg-white">
          <div className="flex gap-3 items-end">
            <div className="flex-1">
              <Input
                placeholder={`Message ${connection.expertName}...`}
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="min-h-[40px] resize-none"
                disabled={isSending}
              />
            </div>
            <Button
              onClick={sendMessage}
              disabled={!newMessage.trim() || isSending}
              size="icon"
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}