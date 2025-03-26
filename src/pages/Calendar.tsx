import React, { useState } from "react";
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

interface Event {
  id: number;
  title: string;
  start: Date;
  end: Date;
  location?: string;
  description?: string;
  attendees?: string[];
  tags?: string[];
}

interface EventDetailsDialogProps {
  event: Event;
  onClose: () => void;
}

const eventsData: Event[] = [
  {
    id: 1,
    title: "Team Meeting",
    start: new Date("2023-08-15T10:00:00"),
    end: new Date("2023-08-15T11:00:00"),
    location: "Conference Room A",
    description: "Discuss project progress and next steps.",
    attendees: ["John Doe", "Jane Smith", "Alice Johnson"],
    tags: ["team", "meeting"]
  },
  {
    id: 2,
    title: "Client Presentation",
    start: new Date("2023-08-16T14:00:00"),
    end: new Date("2023-08-16T15:30:00"),
    location: "Online",
    description: "Present the new product features to the client.",
    attendees: ["John Doe", "Client Contact"],
    tags: ["sales", "presentation"]
  },
  {
    id: 3,
    title: "Workshop: React Best Practices",
    start: new Date("2023-08-18T09:00:00"),
    end: new Date("2023-08-18T17:00:00"),
    location: "Training Center",
    description: "Hands-on workshop on React best practices.",
    attendees: ["All Developers"],
    tags: ["training", "react"]
  },
  {
    id: 4,
    title: "Product Demo",
    start: new Date("2023-08-20T11:00:00"),
    end: new Date("2023-08-20T12:00:00"),
    location: "Showroom",
    description: "Demonstrate the latest product features.",
    attendees: ["Sales Team", "Marketing Team"],
    tags: ["product", "demo"]
  },
  {
    id: 5,
    title: "One-on-One Meeting",
    start: new Date("2023-08-21T15:00:00"),
    end: new Date("2023-08-21T16:00:00"),
    location: "Manager's Office",
    description: "Discuss performance and career goals.",
    attendees: ["Employee", "Manager"],
    tags: ["one-on-one", "meeting"]
  },
  {
    id: 6,
    title: "Team Lunch",
    start: new Date("2023-08-22T12:00:00"),
    end: new Date("2023-08-22T13:00:00"),
    location: "Local Restaurant",
    description: "Casual lunch with the team.",
    attendees: ["All Team Members"],
    tags: ["team", "social"]
  },
  {
    id: 7,
    title: "Code Review Session",
    start: new Date("2023-08-23T16:00:00"),
    end: new Date("2023-08-23T17:00:00"),
    location: "Developer's Corner",
    description: "Review the latest code changes and provide feedback.",
    attendees: ["Developers"],
    tags: ["code review", "development"]
  },
  {
    id: 8,
    title: "Project Planning Meeting",
    start: new Date("2023-08-24T10:00:00"),
    end: new Date("2023-08-24T11:30:00"),
    location: "Project Room",
    description: "Plan the next phase of the project.",
    attendees: ["Project Team"],
    tags: ["project", "planning"]
  },
  {
    id: 9,
    title: "Training Session: New Hires",
    start: new Date("2023-08-25T14:00:00"),
    end: new Date("2023-08-25T16:00:00"),
    location: "Training Room B",
    description: "Onboarding session for new employees.",
    attendees: ["New Hires"],
    tags: ["training", "onboarding"]
  },
  {
    id: 10,
    title: "End of Month Review",
    start: new Date("2023-08-28T15:00:00"),
    end: new Date("2023-08-28T16:00:00"),
    location: "Board Room",
    description: "Review the achievements and challenges of the month.",
    attendees: ["Management Team"],
    tags: ["review", "management"]
  },
  {
    id: 11,
    title: "Client Meeting",
    start: new Date("2023-09-01T11:00:00"),
    end: new Date("2023-09-01T12:00:00"),
    location: "Client's Office",
    description: "Discuss project requirements and timeline.",
    attendees: ["Project Team", "Client Representatives"],
    tags: ["client", "meeting"]
  },
  {
    id: 12,
    title: "Product Launch",
    start: new Date("2023-09-05T18:00:00"),
    end: new Date("2023-09-05T20:00:00"),
    location: "Auditorium",
    description: "Launch the new product to the public.",
    attendees: ["All Employees", "Media", "Customers"],
    tags: ["product", "launch"]
  }
];

const formatDate = (date: Date): string => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

const formatEventDate = (start: Date, end: Date): string => {
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

const formatEventTime = (start: Date, end: Date): string => {
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
  const [events, setEvents] = useState<Event[]>(eventsData);

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

      {selectedView === "month" && (
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
              const hasEvent = date ? filteredEvents.some(event => formatDate(event.start) === formatDate(date)) : false;

              return (
                <div
                  key={index}
                  className={`px-4 py-2 text-center border-t ${day ? 'border-r' : ''} relative ${isToday ? 'font-semibold' : ''} ${day ? 'cursor-pointer hover:bg-accent' : 'bg-gray-100 text-gray-400'}`}
                  onClick={() => {
                    if (date) {
                      const eventForDay = filteredEvents.find(event => formatDate(event.start) === formatDate(date));
                      if (eventForDay) {
                        openEventDetailsDialog(eventForDay);
                      }
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
                  {formatEventDate(event.start, event.end)} • {formatEventTime(event.start, event.end)}
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

      <CreateEventDialog isOpen={isCreateEventDialogOpen} onClose={closeCreateEventDialog} />
      {selectedEvent && (
        <EventDetailsDialog event={selectedEvent} onClose={closeEventDetailsDialog} />
      )}
    </Layout>
  );
};

interface CreateEventDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const CreateEventDialog: React.FC<CreateEventDialogProps> = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [attendees, setAttendees] = useState("");
  const [tags, setTags] = useState("");

  const handleCreateEvent = () => {
    // Basic validation
    if (!title || !startDate || !endDate) {
      alert("Please fill in all required fields.");
      return;
    }

    // Create a new event object
    const newEvent: Event = {
      id: Date.now(), // Generate a unique ID
      title: title,
      start: startDate,
      end: endDate,
      location: location,
      description: description,
      attendees: attendees.split(",").map(s => s.trim()),
      tags: tags.split(",").map(s => s.trim())
    };

    // Add the new event to the events list (you'll need to manage this state)
    // setEvents(prevEvents => [...prevEvents, newEvent]);

    // Close the dialog
    onClose();
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
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="title" className="text-right text-sm font-medium leading-none text-right">
              Title
            </label>
            <Input
              id="title"
              className="col-span-3"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="startDate" className="text-right text-sm font-medium leading-none text-right">
              Start Date
            </label>
            {/* <DatePicker
              id="startDate"
              className="col-span-3"
              selected={startDate}
              onChange={(date: Date) => setStartDate(date)}
              placeholderText="Select start date"
            /> */}
            <Input
              type="datetime-local"
              id="startDate"
              className="col-span-3"
              onChange={(e) => setStartDate(new Date(e.target.value))}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <label htmlFor="endDate" className="text-right text-sm font-medium leading-none text-right">
              End Date
            </label>
            {/* <DatePicker
              id="endDate"
              className="col-span-3"
              selected={endDate}
              onChange={(date: Date) => setEndDate(date)}
              placeholderText="Select end date"
            /> */}
            <Input
              type="datetime-local"
              id="endDate"
              className="col-span-3"
              onChange={(e) => setEndDate(new Date(e.target.value))}
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
          <Button type="submit" onClick={handleCreateEvent}>Create Event</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const EventDetailsDialog = ({ event, onClose }: EventDetailsDialogProps) => {
  return (
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle className="text-xl">{event.title}</DialogTitle>
        <DialogDescription>
          <div className="mt-2 space-y-2">
            <div className="flex items-center text-sm">
              <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{formatEventDate(event.start, event.end)}</span>
            </div>
            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{formatEventTime(event.start, event.end)}</span>
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
        {event.location && (
          <Button size="sm" variant="outline" className="gap-1">
            <Map className="h-3.5 w-3.5" />
            Open Map
          </Button>
        )}
        <Button size="sm">Edit Event</Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default Calendar;
