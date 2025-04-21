// API base URL configuration
// In development, it points to localhost
// In production, it will use the deployed backend URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Task API endpoints
export const fetchTasks = async () => {
  const response = await fetch(`${API_URL}/tasks`);
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return response.json();
};

export const createTask = async (taskData: any) => {
  const response = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  if (!response.ok) throw new Error('Failed to create task');
  return response.json();
};

export const updateTask = async (id: string, taskData: any) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(taskData)
  });
  if (!response.ok) throw new Error('Failed to update task');
  return response.json();
};

export const deleteTask = async (id: string) => {
  const response = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete task');
  return response.json();
};

export const toggleTaskCompletion = async (id: string) => {
  const response = await fetch(`${API_URL}/tasks/${id}/toggle`, {
    method: 'PUT'
  });
  if (!response.ok) throw new Error('Failed to toggle task completion');
  return response.json();
};

// LinkedIn Post API endpoints
export const fetchLinkedInPosts = async () => {
  const response = await fetch(`${API_URL}/linkedin-posts`);
  if (!response.ok) throw new Error('Failed to fetch LinkedIn posts');
  return response.json();
};

export const createLinkedInPost = async (postData: any) => {
  const response = await fetch(`${API_URL}/linkedin-posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  });
  if (!response.ok) throw new Error('Failed to create LinkedIn post');
  return response.json();
};

export const updateLinkedInPost = async (id: string, postData: any) => {
  const response = await fetch(`${API_URL}/linkedin-posts/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(postData)
  });
  if (!response.ok) throw new Error('Failed to update LinkedIn post');
  return response.json();
};

export const deleteLinkedInPost = async (id: string) => {
  const response = await fetch(`${API_URL}/linkedin-posts/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete LinkedIn post');
  return response.json();
};

// Weekly Goals API endpoints
export const fetchWeeklyGoals = async () => {
  const response = await fetch(`${API_URL}/weekly-goals`);
  if (!response.ok) throw new Error('Failed to fetch weekly goals');
  return response.json();
};

export const createWeeklyGoal = async (goalData: any) => {
  const response = await fetch(`${API_URL}/weekly-goals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goalData)
  });
  if (!response.ok) throw new Error('Failed to create weekly goal');
  return response.json();
};

export const updateWeeklyGoal = async (id: string, goalData: any) => {
  const response = await fetch(`${API_URL}/weekly-goals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goalData)
  });
  if (!response.ok) throw new Error('Failed to update weekly goal');
  return response.json();
};

export const deleteWeeklyGoal = async (id: string) => {
  const response = await fetch(`${API_URL}/weekly-goals/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete weekly goal');
  return response.json();
};

// Daily Goals API endpoints
export const fetchDailyGoals = async () => {
  const response = await fetch(`${API_URL}/daily-goals`);
  if (!response.ok) throw new Error('Failed to fetch daily goals');
  return response.json();
};

export const createDailyGoal = async (goalData: any) => {
  const response = await fetch(`${API_URL}/daily-goals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goalData)
  });
  if (!response.ok) throw new Error('Failed to create daily goal');
  return response.json();
};

export const updateDailyGoal = async (id: string, goalData: any) => {
  const response = await fetch(`${API_URL}/daily-goals/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(goalData)
  });
  if (!response.ok) throw new Error('Failed to update daily goal');
  return response.json();
};

export const deleteDailyGoal = async (id: string) => {
  const response = await fetch(`${API_URL}/daily-goals/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete daily goal');
  return response.json();
}; 