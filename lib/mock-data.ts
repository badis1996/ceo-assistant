/**
 * Provides mock data for development and testing
 */

export const mockTasks = [
  {
    id: '1',
    title: 'Finish API integration',
    description: 'Connect the frontend to the backend API',
    date: new Date().toISOString(),
    category: 'product',
    priority: 'high',
    completed: false,
    userId: 'mock-user-id'
  },
  {
    id: '2',
    title: 'Prepare presentation',
    description: 'Create slides for the quarterly review',
    date: new Date().toISOString(),
    category: 'sales',
    priority: 'medium',
    completed: true,
    userId: 'mock-user-id'
  },
  {
    id: '3',
    title: 'Review marketing campaign',
    description: 'Analyze results from the latest ads',
    date: new Date().toISOString(),
    category: 'marketing',
    priority: 'low',
    completed: false,
    userId: 'mock-user-id'
  }
];

export const mockWeeklyGoals = [
  {
    id: '1',
    title: 'Increase customer retention by 5%',
    date: new Date().toISOString(),
    completed: false,
    userId: 'mock-user-id'
  },
  {
    id: '2',
    title: 'Complete platform migration',
    date: new Date().toISOString(),
    completed: true,
    userId: 'mock-user-id'
  }
];

export const mockDailyGoals = [
  {
    id: '1',
    title: 'Send follow-up emails',
    date: new Date().toISOString(),
    completed: false,
    userId: 'mock-user-id'
  },
  {
    id: '2',
    title: 'Update website content',
    date: new Date().toISOString(),
    completed: true,
    userId: 'mock-user-id'
  }
];

export const mockLinkedInPosts = [
  {
    id: '1',
    title: 'Company achievements in Q2',
    content: 'Proud to announce our team has exceeded sales targets by 20% this quarter...',
    date: new Date().toISOString(),
    userId: 'mock-user-id'
  },
  {
    id: '2',
    title: 'New features released',
    content: 'We are excited to introduce our latest product update with enhanced analytics...',
    date: new Date().toISOString(),
    userId: 'mock-user-id'
  }
]; 