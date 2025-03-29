
import React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Task } from "@/services/taskService";
import { useToast } from "@/hooks/use-toast";

interface TaskFormProps {
  task?: Partial<Task>;
  onSubmit: (data: Omit<Task, 'id' | 'created_at'>) => Promise<void>;
  onCancel: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ task, onSubmit, onCancel }) => {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      priority: task?.priority || 'Medium',
      status: task?.status || 'Not Started',
      due_date: task?.due_date ? new Date(task.due_date) : new Date(),
      assigned_to: task?.assigned_to || '',
    }
  });
  
  const { toast } = useToast();
  const selectedDate = watch('due_date');

  React.useEffect(() => {
    register('priority', { required: 'Priority is required' });
    register('status', { required: 'Status is required' });
    register('due_date', { required: 'Due date is required' });
  }, [register]);

  const handleFormSubmit = async (data: any) => {
    try {
      // Convert date to string format
      const formattedData = {
        ...data,
        due_date: format(data.due_date, 'yyyy-MM-dd'),
      };
      
      await onSubmit(formattedData);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "There was a problem saving the task.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">
          Task Title*
        </label>
        <Input
          id="title"
          {...register('title', { required: 'Title is required' })}
          placeholder="Enter task title"
        />
        {errors.title && (
          <p className="text-sm text-red-500 mt-1">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium mb-1">
          Description
        </label>
        <Textarea
          id="description"
          {...register('description')}
          placeholder="Enter task description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="priority" className="block text-sm font-medium mb-1">
            Priority*
          </label>
          <Select
            defaultValue={task?.priority || 'Medium'}
            onValueChange={(value) => setValue('priority', value as 'High' | 'Medium' | 'Low')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="High">High</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Low">Low</SelectItem>
            </SelectContent>
          </Select>
          {errors.priority && (
            <p className="text-sm text-red-500 mt-1">{errors.priority.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status*
          </label>
          <Select
            defaultValue={task?.status || 'Not Started'}
            onValueChange={(value) => setValue('status', value as 'Not Started' | 'In Progress' | 'Completed')}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Not Started">Not Started</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
            </SelectContent>
          </Select>
          {errors.status && (
            <p className="text-sm text-red-500 mt-1">{errors.status.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="due_date" className="block text-sm font-medium mb-1">
            Due Date*
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, 'PPP') : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => setValue('due_date', date!)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.due_date && (
            <p className="text-sm text-red-500 mt-1">{errors.due_date.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="assigned_to" className="block text-sm font-medium mb-1">
            Assigned To
          </label>
          <Input
            id="assigned_to"
            {...register('assigned_to')}
            placeholder="Enter assignee name"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {task?.id ? 'Update Task' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
};

export default TaskForm;
