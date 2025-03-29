
import React from "react";
import { Layout } from "@/components/Layout/Layout";
import { Header } from "@/components/Header/Header";
import { useQuery } from "@tanstack/react-query";
import { getTasks, Task } from "@/services/taskService";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarIcon, Search, Filter } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";

interface TaskFilter {
  searchQuery: string;
  status: string;
  startDate: Date | undefined;
  endDate: Date | undefined;
}

const TaskReport = () => {
  const [filters, setFilters] = useState<TaskFilter>({
    searchQuery: '',
    status: 'all',
    startDate: undefined,
    endDate: undefined
  });

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: getTasks
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800';
      case 'Not Started':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredTasks = tasks.filter((task: Task) => {
    // Apply search filter
    const matchesSearch = 
      task.title.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ?? false) ||
      (task.assigned_to?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ?? false);
    
    // Apply status filter
    const matchesStatus = filters.status === 'all' || task.status === filters.status;
    
    // Apply date range filter
    let matchesDateRange = true;
    if (filters.startDate && filters.endDate) {
      const taskDate = new Date(task.due_date);
      matchesDateRange = 
        taskDate >= filters.startDate && 
        taskDate <= filters.endDate;
    }
    
    return matchesSearch && matchesStatus && matchesDateRange;
  });

  const taskCountByStatus = {
    total: tasks.length,
    notStarted: tasks.filter((task: Task) => task.status === 'Not Started').length,
    inProgress: tasks.filter((task: Task) => task.status === 'In Progress').length,
    completed: tasks.filter((task: Task) => task.status === 'Completed').length,
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({...filters, searchQuery: e.target.value});
  };

  const handleStatusChange = (value: string) => {
    setFilters({...filters, status: value});
  };

  const handleDateRangeChange = (range: { from: Date, to: Date }) => {
    setFilters({
      ...filters, 
      startDate: range.from,
      endDate: range.to
    });
  };

  const clearFilters = () => {
    setFilters({
      searchQuery: '',
      status: 'all',
      startDate: undefined,
      endDate: undefined
    });
  };

  return (
    <Layout>
      <Header 
        title="Task Report" 
        description="View and monitor all tasks in the system"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCountByStatus.total}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Not Started</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCountByStatus.notStarted}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCountByStatus.inProgress}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{taskCountByStatus.completed}</div>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Task Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search tasks..." 
                className="pl-10"
                value={filters.searchQuery}
                onChange={handleSearchChange}
              />
            </div>
            
            <Select
              value={filters.status}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Not Started">Not Started</SelectItem>
                <SelectItem value="In Progress">In Progress</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
            
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[240px] justify-start">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {filters.startDate && filters.endDate ? (
                    `${format(filters.startDate, 'PP')} - ${format(filters.endDate, 'PP')}`
                  ) : (
                    "Date Range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: filters.startDate as Date,
                    to: filters.endDate as Date
                  }}
                  onSelect={handleDateRangeChange as any}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Task List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading tasks...</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Task</TableHead>
                  <TableHead>Priority</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Assigned To</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTasks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No tasks found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTasks.map((task: Task) => (
                    <TableRow key={task.id}>
                      <TableCell className="font-medium">
                        <div>
                          {task.title}
                          {task.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
                              {task.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getPriorityColor(task.priority)}>
                          {task.priority}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(task.status)}>
                          {task.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {format(new Date(task.due_date), 'MMM d, yyyy')}
                      </TableCell>
                      <TableCell>
                        {task.assigned_to || '—'}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Layout>
  );
};

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'High':
      return 'bg-red-100 text-red-800';
    case 'Medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'Low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default TaskReport;
