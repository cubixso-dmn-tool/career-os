import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, MapPin, Users, Edit, Trash2, Plus, Eye } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ExpertSession {
  id: number;
  expertId: number;
  expertName?: string;
  title: string;
  description: string;
  sessionType: 'one-on-one' | 'group' | 'workshop';
  scheduledAt: string;
  duration: number;
  maxParticipants?: number;
  currentParticipants: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  meetingLink?: string;
  price?: number;
  createdAt: string;
}

interface NetworkingEvent {
  id: number;
  title: string;
  description: string;
  eventType: 'webinar' | 'workshop' | 'networking' | 'conference';
  scheduledAt: string;
  duration: number;
  location: string;
  maxParticipants?: number;
  currentParticipants: number;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  registrationRequired: boolean;
  price?: number;
  createdAt: string;
}

interface SessionForm {
  expertId: number;
  title: string;
  description: string;
  sessionType: 'one-on-one' | 'group' | 'workshop';
  scheduledAt: string;
  duration: number;
  maxParticipants?: number;
  price?: number;
  meetingLink?: string;
}

interface EventForm {
  title: string;
  description: string;
  eventType: 'webinar' | 'workshop' | 'networking' | 'conference';
  scheduledAt: string;
  duration: number;
  location: string;
  maxParticipants?: number;
  registrationRequired: boolean;
  price?: number;
}

const AdminSessionManagement = () => {
  const [activeTab, setActiveTab] = useState('sessions');
  const [sessionDialog, setSessionDialog] = useState(false);
  const [eventDialog, setEventDialog] = useState(false);
  const [editingSession, setEditingSession] = useState<ExpertSession | null>(null);
  const [editingEvent, setEditingEvent] = useState<NetworkingEvent | null>(null);
  
  const queryClient = useQueryClient();

  // Session form state
  const [sessionForm, setSessionForm] = useState<SessionForm>({
    expertId: 0,
    title: '',
    description: '',
    sessionType: 'one-on-one',
    scheduledAt: '',
    duration: 60,
    maxParticipants: undefined,
    price: undefined,
    meetingLink: ''
  });

  // Event form state
  const [eventForm, setEventForm] = useState<EventForm>({
    title: '',
    description: '',
    eventType: 'webinar',
    scheduledAt: '',
    duration: 90,
    location: '',
    maxParticipants: undefined,
    registrationRequired: true,
    price: undefined
  });

  // Fetch sessions
  const { data: sessions = [], isLoading: sessionsLoading } = useQuery({
    queryKey: ['admin-sessions'],
    queryFn: async (): Promise<ExpertSession[]> => {
      const response = await fetch('/api/admin/sessions');
      if (!response.ok) throw new Error('Failed to fetch sessions');
      const data = await response.json();
      return data.data || [];
    }
  });

  // Fetch events
  const { data: events = [], isLoading: eventsLoading } = useQuery({
    queryKey: ['admin-events'],
    queryFn: async (): Promise<NetworkingEvent[]> => {
      const response = await fetch('/api/admin/events');
      if (!response.ok) throw new Error('Failed to fetch events');
      const data = await response.json();
      return data.data || [];
    }
  });

  // Fetch experts for session creation
  const { data: experts = [] } = useQuery({
    queryKey: ['admin-experts-list'],
    queryFn: async () => {
      const response = await fetch('/api/admin/experts');
      if (!response.ok) throw new Error('Failed to fetch experts');
      const data = await response.json();
      return data.data || [];
    }
  });

  // Create session mutation
  const createSessionMutation = useMutation({
    mutationFn: async (sessionData: SessionForm) => {
      const response = await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
      if (!response.ok) throw new Error('Failed to create session');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
      setSessionDialog(false);
      resetSessionForm();
      toast({ title: 'Success', description: 'Session created successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Update session mutation
  const updateSessionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<SessionForm> }) => {
      const response = await fetch(`/api/admin/sessions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update session');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
      setSessionDialog(false);
      setEditingSession(null);
      resetSessionForm();
      toast({ title: 'Success', description: 'Session updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Delete session mutation
  const deleteSessionMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/sessions/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete session');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-sessions'] });
      toast({ title: 'Success', description: 'Session deleted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Create event mutation
  const createEventMutation = useMutation({
    mutationFn: async (eventData: EventForm) => {
      const response = await fetch('/api/admin/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData)
      });
      if (!response.ok) throw new Error('Failed to create event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      setEventDialog(false);
      resetEventForm();
      toast({ title: 'Success', description: 'Event created successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Update event mutation
  const updateEventMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<EventForm> }) => {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) throw new Error('Failed to update event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      setEventDialog(false);
      setEditingEvent(null);
      resetEventForm();
      toast({ title: 'Success', description: 'Event updated successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  // Delete event mutation
  const deleteEventMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/events/${id}`, {
        method: 'DELETE'
      });
      if (!response.ok) throw new Error('Failed to delete event');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-events'] });
      toast({ title: 'Success', description: 'Event deleted successfully' });
    },
    onError: (error: any) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    }
  });

  const resetSessionForm = () => {
    setSessionForm({
      expertId: 0,
      title: '',
      description: '',
      sessionType: 'one-on-one',
      scheduledAt: '',
      duration: 60,
      maxParticipants: undefined,
      price: undefined,
      meetingLink: ''
    });
  };

  const resetEventForm = () => {
    setEventForm({
      title: '',
      description: '',
      eventType: 'webinar',
      scheduledAt: '',
      duration: 90,
      location: '',
      maxParticipants: undefined,
      registrationRequired: true,
      price: undefined
    });
  };

  const handleEditSession = (session: ExpertSession) => {
    setEditingSession(session);
    setSessionForm({
      expertId: session.expertId,
      title: session.title,
      description: session.description,
      sessionType: session.sessionType,
      scheduledAt: new Date(session.scheduledAt).toISOString().slice(0, 16),
      duration: session.duration,
      maxParticipants: session.maxParticipants,
      price: session.price,
      meetingLink: session.meetingLink || ''
    });
    setSessionDialog(true);
  };

  const handleEditEvent = (event: NetworkingEvent) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      eventType: event.eventType,
      scheduledAt: new Date(event.scheduledAt).toISOString().slice(0, 16),
      duration: event.duration,
      location: event.location,
      maxParticipants: event.maxParticipants,
      registrationRequired: event.registrationRequired,
      price: event.price
    });
    setEventDialog(true);
  };

  const handleSessionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSession) {
      updateSessionMutation.mutate({ id: editingSession.id, data: sessionForm });
    } else {
      createSessionMutation.mutate(sessionForm);
    }
  };

  const handleEventSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingEvent) {
      updateEventMutation.mutate({ id: editingEvent.id, data: eventForm });
    } else {
      createEventMutation.mutate(eventForm);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
      case 'upcoming':
        return 'bg-blue-100 text-blue-800';
      case 'in-progress':
      case 'ongoing':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-gray-100 text-gray-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Session & Event Management</h1>
          <p className="text-gray-600 mt-2">Manage expert sessions and networking events</p>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="sessions">Expert Sessions ({sessions.length})</TabsTrigger>
          <TabsTrigger value="events">Networking Events ({events.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Expert Sessions</h2>
            <Dialog open={sessionDialog} onOpenChange={(open) => {
              setSessionDialog(open);
              if (!open) {
                setEditingSession(null);
                resetSessionForm();
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Session
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingSession ? 'Edit Session' : 'Create New Session'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSessionSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expertId">Expert</Label>
                      <Select
                        value={sessionForm.expertId.toString()}
                        onValueChange={(value) => setSessionForm(prev => ({ ...prev, expertId: parseInt(value) }))}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select expert" />
                        </SelectTrigger>
                        <SelectContent>
                          {experts.map((expert: any) => (
                            <SelectItem key={expert.id} value={expert.id.toString()}>
                              {expert.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="sessionType">Session Type</Label>
                      <Select
                        value={sessionForm.sessionType}
                        onValueChange={(value: any) => setSessionForm(prev => ({ ...prev, sessionType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="one-on-one">One-on-One</SelectItem>
                          <SelectItem value="group">Group</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="title">Session Title</Label>
                    <Input
                      id="title"
                      value={sessionForm.title}
                      onChange={(e) => setSessionForm(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter session title"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={sessionForm.description}
                      onChange={(e) => setSessionForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Session description"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="scheduledAt">Scheduled Date & Time</Label>
                      <Input
                        id="scheduledAt"
                        type="datetime-local"
                        value={sessionForm.scheduledAt}
                        onChange={(e) => setSessionForm(prev => ({ ...prev, scheduledAt: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="duration">Duration (minutes)</Label>
                      <Input
                        id="duration"
                        type="number"
                        value={sessionForm.duration}
                        onChange={(e) => setSessionForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                        min="15"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="maxParticipants">Max Participants</Label>
                      <Input
                        id="maxParticipants"
                        type="number"
                        value={sessionForm.maxParticipants || ''}
                        onChange={(e) => setSessionForm(prev => ({ 
                          ...prev, 
                          maxParticipants: e.target.value ? parseInt(e.target.value) : undefined 
                        }))}
                        min="1"
                        placeholder="No limit"
                      />
                    </div>
                    <div>
                      <Label htmlFor="price">Price (₹)</Label>
                      <Input
                        id="price"
                        type="number"
                        value={sessionForm.price || ''}
                        onChange={(e) => setSessionForm(prev => ({ 
                          ...prev, 
                          price: e.target.value ? parseFloat(e.target.value) : undefined 
                        }))}
                        min="0"
                        step="0.01"
                        placeholder="Free"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="meetingLink">Meeting Link</Label>
                    <Input
                      id="meetingLink"
                      type="url"
                      value={sessionForm.meetingLink}
                      onChange={(e) => setSessionForm(prev => ({ ...prev, meetingLink: e.target.value }))}
                      placeholder="https://meet.google.com/..."
                    />
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setSessionDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createSessionMutation.isPending || updateSessionMutation.isPending}
                    >
                      {editingSession ? 'Update Session' : 'Create Session'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {sessionsLoading ? (
            <div className="text-center py-8">Loading sessions...</div>
          ) : sessions.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No expert sessions found. Create your first session!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {sessions.map((session) => (
                <Card key={session.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{session.title}</h3>
                          <Badge className={getStatusColor(session.status)}>
                            {session.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{session.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>Expert: {session.expertName || `ID ${session.expertId}`}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{formatDateTime(session.scheduledAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{session.duration} minutes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>
                              {session.currentParticipants}
                              {session.maxParticipants ? `/${session.maxParticipants}` : ''} participants
                            </span>
                          </div>
                        </div>

                        {session.price && (
                          <div className="mt-2 text-sm font-medium text-green-600">
                            Price: ₹{session.price}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditSession(session)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this session?')) {
                              deleteSessionMutation.mutate(session.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Networking Events</h2>
            <Dialog open={eventDialog} onOpenChange={(open) => {
              setEventDialog(open);
              if (!open) {
                setEditingEvent(null);
                resetEventForm();
              }
            }}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Event
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>
                    {editingEvent ? 'Edit Event' : 'Create New Event'}
                  </DialogTitle>
                </DialogHeader>
                <form onSubmit={handleEventSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eventTitle">Event Title</Label>
                      <Input
                        id="eventTitle"
                        value={eventForm.title}
                        onChange={(e) => setEventForm(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter event title"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventType">Event Type</Label>
                      <Select
                        value={eventForm.eventType}
                        onValueChange={(value: any) => setEventForm(prev => ({ ...prev, eventType: value }))}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="webinar">Webinar</SelectItem>
                          <SelectItem value="workshop">Workshop</SelectItem>
                          <SelectItem value="networking">Networking</SelectItem>
                          <SelectItem value="conference">Conference</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="eventDescription">Description</Label>
                    <Textarea
                      id="eventDescription"
                      value={eventForm.description}
                      onChange={(e) => setEventForm(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Event description"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eventScheduledAt">Scheduled Date & Time</Label>
                      <Input
                        id="eventScheduledAt"
                        type="datetime-local"
                        value={eventForm.scheduledAt}
                        onChange={(e) => setEventForm(prev => ({ ...prev, scheduledAt: e.target.value }))}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventDuration">Duration (minutes)</Label>
                      <Input
                        id="eventDuration"
                        type="number"
                        value={eventForm.duration}
                        onChange={(e) => setEventForm(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                        min="15"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={eventForm.location}
                      onChange={(e) => setEventForm(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="Online / Physical address"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="eventMaxParticipants">Max Participants</Label>
                      <Input
                        id="eventMaxParticipants"
                        type="number"
                        value={eventForm.maxParticipants || ''}
                        onChange={(e) => setEventForm(prev => ({ 
                          ...prev, 
                          maxParticipants: e.target.value ? parseInt(e.target.value) : undefined 
                        }))}
                        min="1"
                        placeholder="No limit"
                      />
                    </div>
                    <div>
                      <Label htmlFor="eventPrice">Price (₹)</Label>
                      <Input
                        id="eventPrice"
                        type="number"
                        value={eventForm.price || ''}
                        onChange={(e) => setEventForm(prev => ({ 
                          ...prev, 
                          price: e.target.value ? parseFloat(e.target.value) : undefined 
                        }))}
                        min="0"
                        step="0.01"
                        placeholder="Free"
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="registrationRequired"
                      checked={eventForm.registrationRequired}
                      onChange={(e) => setEventForm(prev => ({ ...prev, registrationRequired: e.target.checked }))}
                    />
                    <Label htmlFor="registrationRequired">Registration Required</Label>
                  </div>

                  <div className="flex justify-end space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setEventDialog(false)}
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit"
                      disabled={createEventMutation.isPending || updateEventMutation.isPending}
                    >
                      {editingEvent ? 'Update Event' : 'Create Event'}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {eventsLoading ? (
            <div className="text-center py-8">Loading events...</div>
          ) : events.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No networking events found. Create your first event!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {events.map((event) => (
                <Card key={event.id}>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{event.title}</h3>
                          <Badge className={getStatusColor(event.status)}>
                            {event.status.replace('-', ' ')}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{event.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-gray-400" />
                            <span>{formatDateTime(event.scheduledAt)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <span>{event.duration} minutes</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gray-400" />
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <span>
                              {event.currentParticipants}
                              {event.maxParticipants ? `/${event.maxParticipants}` : ''} participants
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-4 mt-2 text-sm">
                          {event.registrationRequired && (
                            <span className="text-blue-600">Registration Required</span>
                          )}
                          {event.price && (
                            <span className="font-medium text-green-600">Price: ₹{event.price}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditEvent(event)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this event?')) {
                              deleteEventMutation.mutate(event.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSessionManagement;