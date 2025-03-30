import React, { useState, useEffect } from "react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Plus,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Users,
  Map, // Changed from MapPin to Map
  MoreVertical,
  Check,
  X,
  Filter
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { eventService, Event } from "@/services/eventService";
import { documentService } from "@/services/documentService";

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

const formatEventDate = (start: string, end: string): string => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const startDay = startDate.getDate();
  const startMonth = startDate.toLocaleString('default', { month: 'short' });
  const endDay = endDate.getDate();
  const endMonth = endDate.toLocaleString('default', { month: 'short' });

  if (startDate.toDateString() === endDate.toDateString()) {
    return `${startMonth} ${startDay}`;
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`;
  }
};

const formatEventTime = (start: string, end: string): string => {
  const startTime = new Date(start).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const endTime = new Date(end).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${startTime} - ${endTime}`;
};

const Calendar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedView, setSelectedView] = useState("month");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);
  const [isEventDetailsDialogOpen, setIsEventDetailsDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditEventDialogOpen, setIsEditEventDialogOpen] = useState(false);
  const [eventToEdit, setEventToEdit] = useState<Event | null>(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await eventService.getEvents();
        setEvents(fetchedEvents);
      } catch (error) {
        console.error('Error fetching events:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const openCreateEventDialog = () => setIsCreateEventDialogOpen(true);
  const closeCreateEventDialog = () => setIsCreateEventDialogOpen(false);

  const openEventDetailsDialog = (event: Event) => {
    setSelectedEvent(event);
    setIsEventDetailsDialogOpen(true);
  };

  const closeEventDetailsDialog = () => {
    setIsEventDetailsDialogOpen(false);
    setSelectedEvent(null);
  };

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  const handleViewChange = (view: string) => {
    setSelectedView(view);
  };

  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (event.description && event.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (event.location && event.location.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (event.attendees && event.attendees.some(attendee => attendee.toLowerCase().includes(searchQuery.toLowerCase()))) ||
    (event.tags && event.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const getDaysInMonth = (date: Date): number => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date): number => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const goToPreviousMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + 1, 1));
  };

  const currentYear = selectedDate.getFullYear();
  const currentMonth = selectedDate.getMonth();
  const daysInMonth = getDaysInMonth(selectedDate);
  const firstDayOfMonth = getFirstDayOfMonth(selectedDate);

  const calendarDays = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  const handleCreateEvent = async (eventData: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => {
    try {
      const newEvent = await eventService.createEvent(eventData);
      setEvents(prevEvents => [...prevEvents, newEvent]);
      closeCreateEventDialog();
    } catch (error) {
      console.error('Error creating event:', error);
      alert('Failed to create event. Please try again.');
    }
  };

  const handleUpdateEvent = async (id: string, eventData: Partial<Event>) => {
    try {
      const updatedEvent = await eventService.updateEvent(id, eventData);
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === id ? updatedEvent : event
        )
      );
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event. Please try again.');
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      await eventService.deleteEvent(id);
      setEvents(prevEvents => prevEvents.filter(event => event.id !== id));
      setIsEventDetailsDialogOpen(false);
      setSelectedEvent(null);
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Failed to delete event. Please try again.');
    }
  };

  const handleEditEvent = async (id: string, eventData: Partial<Event>) => {
    try {
      const updatedEvent = await eventService.updateEvent(id, eventData);
      setEvents(prevEvents => 
        prevEvents.map(event => 
          event.id === id ? updatedEvent : event
        )
      );
      setIsEditEventDialogOpen(false);
      setEventToEdit(null);
    } catch (error) {
      console.error('Error updating event:', error);
      alert('Failed to update event. Please try again.');
    }
  };

  const handleDateClick = (date: Date) => {
    const eventForDay = filteredEvents.find(event => 
      new Date(event.start_time).toDateString() === date.toDateString()
    );
    
    if (eventForDay) {
      setSelectedEvent(eventForDay);
      setIsEventDetailsDialogOpen(true);
    } else {
      // If no event exists, open create event dialog with pre-filled date
      setStartDate(date.toISOString().slice(0, 16)); // Format: YYYY-MM-DDThh:mm
      setEndDate(new Date(date.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16)); // Add 1 hour
      setIsCreateEventDialogOpen(true);
    }
  };

  return (
    <Layout>
      <Header
        title="Calendar"
        description="Manage your schedule and events."
      >
        <Button size="sm" onClick={openCreateEventDialog}>
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </Header>

      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Select value={selectedView} onValueChange={handleViewChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Month View</SelectItem>
              <SelectItem value="week">Week View</SelectItem>
              <SelectItem value="day">Day View</SelectItem>
              <SelectItem value="agenda">Agenda View</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      ) : (
        selectedView === "month" && (
          <div className="rounded-md border">
            <div className="flex items-center justify-between p-4">
              <Button variant="ghost" size="icon" onClick={goToPreviousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-lg font-semibold">
                {new Date(currentYear, currentMonth, 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
              </h2>
              <Button variant="ghost" size="icon" onClick={goToNextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-7">
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                <div key={index} className="px-4 py-2 text-center font-medium">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map((day, index) => {
                const date = day ? new Date(currentYear, currentMonth, day) : null;
                const isToday = date ? date.toDateString() === new Date().toDateString() : false;
                const hasEvent = date ? filteredEvents.some(event => 
                  new Date(event.start_time).toDateString() === date.toDateString()
                ) : false;

                return (
                  <div
                    key={index}
                    className={`px-4 py-2 text-center border-t ${day ? 'border-r' : ''} relative ${isToday ? 'font-semibold' : ''} ${day ? 'cursor-pointer hover:bg-accent' : 'bg-gray-100 text-gray-400'}`}
                    onClick={() => {
                      if (date) {
                        handleDateClick(date);
                      }
                    }}
                  >
                    {day}
                    {hasEvent && (
                      <div className="absolute top-1 right-1">
                        <Badge variant="secondary" className="text-[0.6rem]">Event</Badge>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )
      )}

      {selectedView === "agenda" && (
        <div className="space-y-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div key={event.id} className="rounded-md border p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{event.title}</h3>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <User className="h-4 w-4 mr-2" />
                        View Attendees
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CalendarIcon className="h-4 w-4 mr-2" />
                        Add to Calendar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="text-sm text-muted-foreground">
                  {formatEventDate(event.start_time, event.end_time)} • {formatEventTime(event.start_time, event.end_time)}
                </div>
                {event.location && (
                  <div className="flex items-center mt-2 text-sm">
                    <Map className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span>{event.location}</span>
                  </div>
                )}
                <p className="mt-2 text-sm">{event.description}</p>
                <div className="mt-4 flex gap-2">
                  {event.tags && event.tags.map((tag, i) => (
                    <Badge key={i} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
              <h3 className="font-medium text-lg">No events found</h3>
              <p className="text-muted-foreground mt-1">Create a new event or adjust your search filters.</p>
            </div>
          )}
        </div>
      )}

      <CreateEventDialog 
        isOpen={isCreateEventDialogOpen} 
        onClose={closeCreateEventDialog}
        onSubmit={handleCreateEvent}
      />
      
      {selectedEvent && (
        <EventDetailsDialog 
          event={selectedEvent} 
          onClose={() => {
            setIsEventDetailsDialogOpen(false);
            setSelectedEvent(null);
          }}
          onDelete={handleDeleteEvent}
          onEdit={() => {
            setEventToEdit(selectedEvent);
            setIsEditEventDialogOpen(true);
            setIsEventDetailsDialogOpen(false);
          }}
        />
      )}

      {eventToEdit && (
        <EditEventDialog
          event={eventToEdit}
          isOpen={isEditEventDialogOpen}
          onClose={() => {
            setIsEditEventDialogOpen(false);
            setEventToEdit(null);
          }}
          onSubmit={handleEditEvent}
        />
      )}
    </Layout>
  );
};

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: Omit<Event, 'id' | 'created_at' | 'updated_at' | 'user_id'>) => Promise<void>;
}

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({ isOpen, onClose, onSubmit }) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [attendees, setAttendees] = useState("");
  const [tags, setTags] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      if (!title || !startDate || !endDate) {
        throw new Error("Please fill in all required fields.");
      }

      const startDateTime = new Date(startDate);
      const endDateTime = new Date(endDate);

      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        throw new Error("Invalid date format.");
      }

      if (endDateTime <= startDateTime) {
        throw new Error("End time must be after start time.");
      }

      await onSubmit({
        title,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        location,
        description,
        attendees: attendees ? attendees.split(",").map(s => s.trim()) : [],
        tags: tags ? tags.split(",").map(s => s.trim()) : []
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogDescription>
            Schedule events, meetings, and appointments with ease.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="title" className="text-right text-sm font-medium leading-none text-right">
              Title *
            </label>
            <Input
              id="title"
              className="col-span-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="startDate" className="text-right text-sm font-medium leading-none text-right">
              Start Date *
            </label>
            <Input
              type="datetime-local"
              id="startDate"
              className="col-span-3"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="endDate" className="text-right text-sm font-medium leading-none text-right">
              End Date *
            </label>
            <Input
              type="datetime-local"
              id="endDate"
              className="col-span-3"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="location" className="text-right text-sm font-medium leading-none text-right">
              Location
            </label>
            <Input
              id="location"
              className="col-span-3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter event location"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="description" className="text-right text-sm font-medium leading-none text-right">
              Description
            </label>
            <Textarea
              id="description"
              className="col-span-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="attendees" className="text-right text-sm font-medium leading-none text-right">
              Attendees
            </label>
            <Input
              id="attendees"
              className="col-span-3"
              placeholder="john.doe@example.com, jane.doe@example.com"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="tags" className="text-right text-sm font-medium leading-none text-right">
              Tags
            </label>
            <Input
              id="tags"
              className="col-span-3"
              placeholder="meeting, work, important"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Creating...' : 'Create Event'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface EventDetailsDialogProps {
  event: Event;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
  onEdit: () => void;
}

const EventDetailsDialog: React.FC<EventDetailsDialogProps> = ({ 
  event, 
  onClose, 
  onDelete,
  onEdit
}) => {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl">{event.title}</DialogTitle>
          <DialogDescription>
            <div className="mt-2 space-y-2">
              <div className="flex items-center text-sm">
                <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{formatEventDate(event.start_time, event.end_time)}</span>
              </div>
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                <span>{formatEventTime(event.start_time, event.end_time)}</span>
              </div>
              {event.location && (
                <div className="flex items-center text-sm">
                  <Map className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{event.location}</span>
                </div>
              )}
              {event.attendees && (
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-muted-foreground" />
                  <span>{event.attendees.join(", ")}</span>
                </div>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        
        {event.description && (
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-1">Description</h4>
            <p className="text-sm text-muted-foreground">{event.description}</p>
          </div>
        )}
        
        <div className="mt-4 flex gap-2">
          {event.tags && event.tags.map((tag, i) => (
            <Badge key={i} variant="outline" className="bg-muted">{tag}</Badge>
          ))}
        </div>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={() => onDelete(event.id)}
          >
            Delete
          </Button>
          <Button size="sm" onClick={onEdit}>Edit Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

interface EditEventDialogProps {
  event: Event;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (id: string, event: Partial<Event>) => Promise<void>;
}

const EditEventDialog: React.FC<EditEventDialogProps> = ({ 
  event, 
  isOpen, 
  onClose, 
  onSubmit 
}) => {
  const [title, setTitle] = useState(event.title);
  const [startDate, setStartDate] = useState(event.start_time.slice(0, 16));
  const [endDate, setEndDate] = useState(event.end_time.slice(0, 16));
  const [location, setLocation] = useState(event.location || "");
  const [description, setDescription] = useState(event.description || "");
  const [attendees, setAttendees] = useState(event.attendees?.join(", ") || "");
  const [tags, setTags] = useState(event.tags?.join(", ") || "");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      if (!title || !startDate || !endDate) {
        throw new Error("Please fill in all required fields.");
      }

      const startDateTime = new Date(startDate);
      const endDateTime = new Date(endDate);

      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        throw new Error("Invalid date format.");
      }

      if (endDateTime <= startDateTime) {
        throw new Error("End time must be after start time.");
      }

      await onSubmit(event.id, {
        title,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        location,
        description,
        attendees: attendees ? attendees.split(",").map(s => s.trim()) : [],
        tags: tags ? tags.split(",").map(s => s.trim()) : []
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to update event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Edit Event</DialogTitle>
          <DialogDescription>
            Update your event details below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md">
              {error}
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="title" className="text-right text-sm font-medium leading-none text-right">
              Title *
            </label>
            <Input
              id="title"
              className="col-span-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter event title"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="startDate" className="text-right text-sm font-medium leading-none text-right">
              Start Date *
            </label>
            <Input
              type="datetime-local"
              id="startDate"
              className="col-span-3"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="endDate" className="text-right text-sm font-medium leading-none text-right">
              End Date *
            </label>
            <Input
              type="datetime-local"
              id="endDate"
              className="col-span-3"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="location" className="text-right text-sm font-medium leading-none text-right">
              Location
            </label>
            <Input
              id="location"
              className="col-span-3"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Enter event location"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="description" className="text-right text-sm font-medium leading-none text-right">
              Description
            </label>
            <Textarea
              id="description"
              className="col-span-3"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter event description"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="attendees" className="text-right text-sm font-medium leading-none text-right">
              Attendees
            </label>
            <Input
              id="attendees"
              className="col-span-3"
              placeholder="john.doe@example.com, jane.doe@example.com"
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="tags" className="text-right text-sm font-medium leading-none text-right">
              Tags
            </label>
            <Input
              id="tags"
              className="col-span-3"
              placeholder="meeting, work, important"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default Calendar;
