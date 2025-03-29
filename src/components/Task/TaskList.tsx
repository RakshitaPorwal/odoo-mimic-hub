
import React from "react";
import { Task } from "@/services/taskService";
import { Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TaskListProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onStatusChange: (id: number, status: 'Not Started' | 'In Progress' | 'Completed') => void;
}

const TaskList: React.FC<TaskListProps> = ({ 
  tasks, 
  onEdit, 
  onDelete,
  onStatusChange
}) => {
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

  return (
    <div className="space-y-3">
      {tasks.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No tasks available. Create a new task to get started.
        </div>
      ) : (
        tasks.map((task) => (
          <div key={task.id} className="p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <div className="space-y-1 flex-1">
                <div className="flex items-center">
                  <h3 className="font-medium">{task.title}</h3>
                  <Badge className={`ml-2 ${getPriorityColor(task.priority)}`}>
                    {task.priority}
                  </Badge>
                </div>
                {task.description && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {task.description}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 mt-2">
                  <div className="text-xs text-muted-foreground">
                    Due: {format(new Date(task.due_date), 'MMM d, yyyy')}
                  </div>
                  {task.assigned_to && (
                    <div className="text-xs text-muted-foreground">
                      Assigned to: {task.assigned_to}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Select
                  value={task.status}
                  onValueChange={(value) => onStatusChange(task.id, value as 'Not Started' | 'In Progress' | 'Completed')}
                >
                  <SelectTrigger className={getStatusColor(task.status)}>
                    <SelectValue placeholder={task.status} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onEdit(task)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => onDelete(task.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default TaskList;
