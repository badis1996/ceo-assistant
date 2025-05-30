import { auth } from './firebase';

// API base URL configuration
// In development, it points to localhost
// In production, it will use relative URLs (same domain)
const API_URL = process.env.NODE_ENV === 'production' 
  ? '/api' 
  : '/api'; // Use relative URL since API is now part of the same Next.js app
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // milliseconds

// Add network status detection
const checkOnlineStatus = () => {
  if (typeof navigator !== 'undefined' && 'onLine' in navigator) {
    return navigator.onLine;
  }
  return true; // Default to online if we can't detect
};

// Helper function to get headers with user ID
const getAuthHeaders = async () => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('User not authenticated');
  }
  
  return {
    'Content-Type': 'application/json',
    'x-user-id': user.uid
  };
};

// Helper function to add retry logic
const fetchWithRetry = async (url: string, options: RequestInit, retries = MAX_RETRIES) => {
  if (!checkOnlineStatus()) {
    throw new Error('You are currently offline. Please check your connection and try again.');
  }
  
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }
    return response;
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    
    // Check network again before retry
    if (!checkOnlineStatus()) {
      throw new Error('You are currently offline. Please check your connection and try again.');
    }
    
    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
    return fetchWithRetry(url, options, retries - 1);
  }
};

// Task API endpoints
export const fetchTasks = async () => {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/tasks`, { headers });
  return response.json();
};

export const createTask = async (taskData: any) => {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/tasks`, {
    method: 'POST',
    headers,
    body: JSON.stringify(taskData)
  });
  return response.json();
};

export const updateTask = async (id: string, taskData: any) => {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/tasks/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(taskData)
  });
  return response.json();
};

export const deleteTask = async (id: string) => {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
    headers
  });
  return response.json();
};

export const toggleTaskCompletion = async (id: string) => {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/tasks/${id}/toggle`, {
    method: 'PATCH',
    headers
  });
  return response.json();
};

// LinkedIn Post API endpoints
export const fetchLinkedInPosts = async () => {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/linkedin-posts`, {
    headers
  });
  return response.json();
};

export const createLinkedInPost = async (postData: any) => {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/linkedin-posts`, {
    method: 'POST',
    headers,
    body: JSON.stringify(postData)
  });
  return response.json();
};

export const updateLinkedInPost = async (id: string, postData: any) => {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/linkedin-posts/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(postData)
  });
  return response.json();
};

export const deleteLinkedInPost = async (id: string) => {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/linkedin-posts/${id}`, {
    method: 'DELETE',
    headers
  });
  return response.json();
};

// Weekly Goals API endpoints
export const fetchWeeklyGoals = async () => {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/weekly-goals`, {
    headers
  });
  return response.json();
};

export const createWeeklyGoal = async (goalData: any) => {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/weekly-goals`, {
    method: 'POST',
    headers,
    body: JSON.stringify(goalData)
  });
  return response.json();
};

export const updateWeeklyGoal = async (id: string, goalData: any) => {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/weekly-goals/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(goalData)
  });
  return response.json();
};

export const deleteWeeklyGoal = async (id: string) => {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/weekly-goals/${id}`, {
    method: 'DELETE',
    headers
  });
  return response.json();
};

export const toggleWeeklyGoalCompletion = async (id: string) => {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/weekly-goals/${id}/toggle`, {
    method: 'PATCH',
    headers
  });
  return response.json();
};

// Daily Goals API endpoints
export const fetchDailyGoals = async () => {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/daily-goals`, {
    headers
  });
  return response.json();
};

export const createDailyGoal = async (goalData: any) => {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/daily-goals`, {
    method: 'POST',
    headers,
    body: JSON.stringify(goalData)
  });
  return response.json();
};

export const updateDailyGoal = async (id: string, goalData: any) => {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/daily-goals/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(goalData)
  });
  return response.json();
};

export const deleteDailyGoal = async (id: string) => {
  const headers = await getAuthHeaders();
  const response = await fetchWithRetry(`${API_URL}/daily-goals/${id}`, {
    method: 'DELETE',
    headers
  });
  return response.json();
}; 