
import { supabase } from '@/lib/supabase';

export interface Task {
  id: number;
  title: string;
  description?: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Not Started' | 'In Progress' | 'Completed';
  due_date: string;
  assigned_to?: string;
  created_at: string;
}

// Get all tasks
export async function getTasks() {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .order('due_date');

  if (error) {
    console.error('Error fetching tasks:', error);
    throw error;
  }

  return data;
}

// Get a single task
export async function getTask(id: number) {
  const { data, error } = await supabase
    .from('tasks')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error('Error fetching task:', error);
    throw error;
  }

  return data;
}

// Create a new task
export async function createTask(task: Omit<Task, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('tasks')
    .insert([task])
    .select()
    .single();

  if (error) {
    console.error('Error creating task:', error);
    throw error;
  }

  return data;
}

// Update a task
export async function updateTask(id: number, updates: Partial<Task>) {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating task:', error);
    throw error;
  }

  return data;
}

// Delete a task
export async function deleteTask(id: number) {
  const { error } = await supabase
    .from('tasks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting task:', error);
    throw error;
  }

  return true;
}
