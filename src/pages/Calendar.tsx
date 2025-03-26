
import React, { useState } from "react";
import { format, addDays, startOfWeek, addWeeks, subWeeks, isSameDay, isSameMonth, parseISO } from "date-fns";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  User,
  Calendar as CalendarIcon
} from "lucide-react";

// Sample event data
const events = [
  {
    id: 1,
    title: "Team Meeting",
    date: "2023-07-15T10:00:00",
    endDate: "2023-07-15T11:30:00",
    description: "Weekly team sync",
    attendees: ["John Doe", "Jane Smith", "Robert Johnson"],
    location: "Conference Room A",
    color: "blue"
  },
  {
    id: 2,
    title: "Project Kickoff",
    date: "2023-07-15T14:00:00",
    endDate: "2023-07-15T15:00:00",
    description: "New project kickoff meeting",
    attendees: ["John Doe", "Emily Davis", "Michael Wilson"],
    location: "Meeting Room B",
    color: "green"
  },
  {
    id: 3,
    title: "Client Call",
    date: "2023-07-17T11:00:00",
    endDate: "2023-07-17T12:00:00",
    description: "Monthly status update",
    attendees: ["John Doe", "Sarah Brown"],
    location: "Zoom",
    color: "purple"
  },
  {
    id: 4,
    title: "Product Demo",
    date: "2023-07-18T15:30:00",
    endDate: "2023-07-18T16:30:00",
    description: "Demo of new features",
    attendees: ["Jane Smith", "Emily Davis", "All stakeholders"],
    location: "Main Hall",
    color: "orange"
  },
  {
    id: 5,
    title: "Training Session",
    date: "2023-07-20T09:00:00",
    endDate: "2023-07-20T12:00:00",
    description: "New tool training",
    attendees: ["All team members"],
    location: "Training Room",
    color: "red"
  }
];

// Make today's date adjustable for demo purposes
const adjustDate = (date: Date) => {
  const today = new Date();
  return new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() + date.getDate() - new Date().getDate()
  );
};

const eventsWithAdjustedDates = events.map(event => ({
  ...event,
  date: format(adjustDate(parseISO(event.date)), "yyyy-MM-dd'T'HH:mm:ss"),
  endDate: format(adjustDate(parseISO(event.endDate)), "yyyy-MM-dd'T'HH:mm:ss")
}));

// Calendar page component
const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentView, setCurrentView] = useState("month");
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  
  // Get today's events
  const todayEvents = eventsWithAdjustedDates.filter(event => 
    isSameDay(parseISO(event.date), new Date())
  );
  
  // Get selected date's events
  const selectedDateEvents = eventsWithAdjustedDates.filter(event => 
    isSameDay(parseISO(event.date), selectedDate)
  );
  
  // Get current week
  const startOfCurrentWeek = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));
  
  // Navigate to previous/next week
  const goToPreviousWeek = () => setSelectedDate(subWeeks(selectedDate, 1));
  const goToNextWeek = () => setSelectedDate(addWeeks(selectedDate, 1));
  
  // Week view time slots
  const timeSlots = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 7 PM

  // Format date for display
  const formatEventTime = (dateString: string) => {
    return format(parseISO(dateString), "h:mm a");
  };

  // Generate an array of days for the month view
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Get the day of the week for the first day (0 = Sunday, 1 = Monday, etc.)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Create an array to hold all the days we need to display
    const daysArray = [];
    
    // Add days from the previous month to fill the first row
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      daysArray.push({
        date: new Date(year, month - 1, prevMonthLastDay - i),
        isCurrentMonth: false
      });
    }
    
    // Add all days of the current month
    for (let day = 1; day <= lastDayOfMonth.getDate(); day++) {
      daysArray.push({
        date: new Date(year, month, day),
        isCurrentMonth: true
      });
    }
    
    // Add days from the next month to complete the grid (6 rows x 7 days = 42 cells)
    const daysNeededFromNextMonth = 42 - daysArray.length;
    for (let day = 1; day <= daysNeededFromNextMonth; day++) {
      daysArray.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false
      });
    }
    
    return daysArray;
  };

  const daysInMonth = getDaysInMonth(selectedDate);
  
  // Get events for a specific day
  const getEventsForDay = (date: Date) => {
    return eventsWithAdjustedDates.filter(event => 
      isSameDay(parseISO(event.date), date)
    );
  };

  return (
    <Layout>
      <Header 
        title="Calendar" 
        description="Schedule and manage your appointments."
      >
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Event
        </Button>
      </Header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 h-[calc(100vh-12rem)]">
        {/* Sidebar */}
        <div className="lg:col-span-1 grid grid-cols-1 gap-4">
          <div className="border rounded-lg bg-white shadow-sm p-4">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="w-full"
            />
          </div>
          
          <div className="border rounded-lg bg-white shadow-sm p-4 overflow-hidden">
            <h3 className="font-semibold mb-3">Today's Events</h3>
            <div className="space-y-3 overflow-y-auto max-h-[300px]">
              {todayEvents.length > 0 ? (
                todayEvents.map((event) => (
                  <div 
                    key={event.id} 
                    className="p-2 rounded-md border cursor-pointer hover:bg-muted"
                    onClick={() => setSelectedEvent(event)}
                  >
                    <div className={`w-full h-1 bg-${event.color}-500 rounded-full mb-2`}></div>
                    <h4 className="font-medium">{event.title}</h4>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>
                        {formatEventTime(event.date)} - {formatEventTime(event.endDate)}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">No events scheduled for today</p>
              )}
            </div>
          </div>
        </div>
        
        {/* Main Calendar View */}
        <div className="lg:col-span-3 border rounded-lg bg-white shadow-sm overflow-hidden">
          <div className="p-3 border-b flex justify-between items-center">
            <div className="flex items-center">
              <Button variant="outline" size="icon" onClick={() => setSelectedDate(new Date())}>
                <span className="text-xs font-medium">Today</span>
              </Button>
              <div className="flex items-center mx-2">
                <Button variant="ghost" size="icon" onClick={goToPreviousWeek}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={goToNextWeek}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="font-semibold">
                {format(selectedDate, "MMMM yyyy")}
              </h3>
            </div>
            
            <Tabs value={currentView} onValueChange={setCurrentView} className="w-auto">
              <TabsList>
                <TabsTrigger value="month">Month</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="day">Day</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          
          <div className="overflow-y-auto max-h-[calc(100vh-16rem)]">
            <TabsContent value="month" className="m-0">
              {/* Month View */}
              <div className="grid grid-cols-7 text-center py-2 border-b">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div key={day} className="text-sm font-medium">
                    {day}
                  </div>
                ))}
              </div>
              
              <div className="grid grid-cols-7 auto-rows-fr gap-[1px] bg-border">
                {daysInMonth.map((day, index) => {
                  const dayEvents = getEventsForDay(day.date);
                  const isToday = isSameDay(day.date, new Date());
                  const isSelected = isSameDay(day.date, selectedDate);
                  
                  return (
                    <div 
                      key={index} 
                      className={`min-h-[100px] bg-white p-1 ${!day.isCurrentMonth ? 'text-muted-foreground' : ''} ${isSelected ? 'bg-muted' : ''}`}
                      onClick={() => setSelectedDate(day.date)}
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className={`text-sm font-medium rounded-full h-6 w-6 flex items-center justify-center ${isToday ? 'bg-primary text-primary-foreground' : ''}`}>
                          {format(day.date, "d")}
                        </span>
                        {dayEvents.length > 0 && (
                          <span className="text-xs font-medium text-muted-foreground">
                            {dayEvents.length} event{dayEvents.length > 1 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      
                      <div className="space-y-1 overflow-hidden max-h-[80px]">
                        {dayEvents.slice(0, 3).map((event) => (
                          <div 
                            key={event.id}
                            className={`px-1 py-0.5 text-xs truncate rounded bg-${event.color}-100 text-${event.color}-800 border-l-2 border-${event.color}-500 cursor-pointer`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedEvent(event);
                            }}
                          >
                            {formatEventTime(event.date)} {event.title}
                          </div>
                        ))}
                        
                        {dayEvents.length > 3 && (
                          <div className="text-xs text-muted-foreground px-1">
                            +{dayEvents.length - 3} more
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </TabsContent>
            
            <TabsContent value="week" className="m-0">
              {/* Week View */}
              <div className="grid grid-cols-8 border-b">
                <div className="border-r p-2 min-w-[60px]"></div>
                {weekDays.map((day, index) => (
                  <div 
                    key={index} 
                    className={`text-center p-2 ${isSameDay(day, new Date()) ? 'bg-muted' : ''}`}
                  >
                    <p className="text-sm font-medium">{format(day, "EEE")}</p>
                    <p className={`text-sm ${isSameDay(day, new Date()) ? 'bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center mx-auto' : ''}`}>
                      {format(day, "d")}
                    </p>
                  </div>
                ))}
              </div>
              
              <div className="relative">
                {timeSlots.map((hour) => (
                  <div key={hour} className="grid grid-cols-8 border-b min-h-[60px]">
                    <div className="border-r p-2 text-xs text-muted-foreground text-right min-w-[60px]">
                      {hour}:00
                    </div>
                    {weekDays.map((day, dayIndex) => {
                      const dayEvents = eventsWithAdjustedDates.filter(event => {
                        const eventDate = parseISO(event.date);
                        return isSameDay(eventDate, day) && eventDate.getHours() === hour;
                      });
                      
                      return (
                        <div key={dayIndex} className="relative border-r min-w-[120px]">
                          {dayEvents.map((event) => (
                            <div
                              key={event.id}
                              className={`absolute left-0 right-0 mx-1 p-1 rounded text-xs bg-${event.color}-100 text-${event.color}-800 border-l-2 border-${event.color}-500 cursor-pointer z-10 overflow-hidden`}
                              style={{
                                top: '0px',
                                height: '58px' // Fixed height for demo
                              }}
                              onClick={() => setSelectedEvent(event)}
                            >
                              <div className="font-medium truncate">{event.title}</div>
                              <div className="truncate">
                                {formatEventTime(event.date)} - {formatEventTime(event.endDate)}
                              </div>
                            </div>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="day" className="m-0">
              {/* Day View */}
              <div className="p-3 border-b text-center">
                <h3 className="font-semibold">{format(selectedDate, "EEEE, MMMM d, yyyy")}</h3>
              </div>
              
              <div className="p-4">
                {selectedDateEvents.length > 0 ? (
                  <div className="space-y-3">
                    {selectedDateEvents.map((event) => (
                      <div 
                        key={event.id}
                        className={`p-3 rounded-md border border-${event.color}-200 bg-${event.color}-50 cursor-pointer hover:bg-${event.color}-100`}
                        onClick={() => setSelectedEvent(event)}
                      >
                        <div className="flex justify-between items-start">
                          <h4 className="font-medium">{event.title}</h4>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full bg-${event.color}-100 text-${event.color}-800`}>
                            {formatEventTime(event.date)} - {formatEventTime(event.endDate)}
                          </span>
                        </div>
                        
                        <p className="text-sm mt-2">{event.description}</p>
                        
                        <div className="mt-3 flex items-start gap-4">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm">{event.attendees.length} attendees</span>
                          </div>
                          
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-1 text-muted-foreground" />
                            <span className="text-sm">{event.location}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 text-muted-foreground">
                    <CalendarIcon className="h-12 w-12 mx-auto mb-3 text-muted-foreground/50" />
                    <h3 className="font-medium text-lg">No events scheduled</h3>
                    <p className="text-sm mt-1">Click the "New Event" button to create an event.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </div>
        </div>
      </div>
      
      {/* Event Detail Modal - Would be implemented with a Dialog component */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedEvent(null)}>
          <div className="bg-white rounded-lg w-full max-w-lg overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className={`p-4 bg-${selectedEvent.color}-100 border-b border-${selectedEvent.color}-200`}>
              <h3 className="font-semibold text-lg">{selectedEvent.title}</h3>
              <div className="flex items-center text-sm mt-1">
                <Clock className="h-4 w-4 mr-1 text-muted-foreground" />
                <span>
                  {formatEventTime(selectedEvent.date)} - {formatEventTime(selectedEvent.endDate)}
                </span>
              </div>
            </div>
            
            <div className="p-4">
              <p className="mb-4">{selectedEvent.description}</p>
              
              <div className="space-y-3">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">{selectedEvent.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <User className="h-4 w-4 mr-2 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-sm font-medium">Attendees</p>
                    <div className="text-sm text-muted-foreground">
                      {selectedEvent.attendees.map((attendee: string, index: number) => (
                        <p key={index}>{attendee}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-3 border-t flex justify-end gap-2">
              <Button variant="outline" onClick={() => setSelectedEvent(null)}>
                Close
              </Button>
              <Button>
                Edit Event
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default CalendarPage;
