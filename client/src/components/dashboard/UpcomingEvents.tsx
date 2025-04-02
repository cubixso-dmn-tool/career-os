import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { formatRelative } from "date-fns";

interface Event {
  id: number;
  title: string;
  description: string;
  type: string;
  date: string;
  duration: number;
  isRegistrationRequired: boolean;
}

interface UpcomingEventsProps {
  events: Event[];
}

export default function UpcomingEvents({ events }: UpcomingEventsProps) {
  const getEventTypeStyles = (type: string) => {
    switch (type.toLowerCase()) {
      case 'webinar':
        return {
          bgColor: 'bg-indigo-100',
          textColor: 'text-primary'
        };
      case 'workshop':
        return {
          bgColor: 'bg-amber-100',
          textColor: 'text-amber-500'
        };
      case 'hackathon':
        return {
          bgColor: 'bg-green-100',
          textColor: 'text-green-600'
        };
      default:
        return {
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600'
        };
    }
  };

  const formatEventDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return formatRelative(date, new Date()).replace(/^./, str => str.toUpperCase());
    } catch (e) {
      return "Soon";
    }
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
        <Link href="/events">
          <a className="text-sm text-primary font-medium hover:underline cursor-pointer">
            View Calendar
          </a>
        </Link>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((event) => {
          const { bgColor, textColor } = getEventTypeStyles(event.type);
          
          return (
            <Card key={event.id} className="p-4 border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-3">
                <div className={`${bgColor} ${textColor} px-3 py-1 rounded-md text-sm font-medium`}>
                  {event.type}
                </div>
                <span className="text-sm text-gray-500">{formatEventDate(event.date)}</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">{event.title}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
              <Link href={`/events/${event.id}`}>
                <a className="text-primary hover:text-primary/80 text-sm font-medium">
                  {event.isRegistrationRequired ? "Register Now" : "Learn More"}
                </a>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
