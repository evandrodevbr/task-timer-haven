interface User {
  id: number;
  name: string;
}

interface Task {
  id: string;
  name: string;
  timeElapsed: number;
  isRunning: boolean;
}

interface UserData {
  name: string;
  tasks: Task[];
}

let lastUserId = 0;

// Load the last user ID from localStorage
const loadLastUserId = () => {
  const storedLastUserId = localStorage.getItem('lastUserId');
  if (storedLastUserId) {
    lastUserId = parseInt(storedLastUserId);
  }
};

const getUserKey = (userId: number) => `user_${userId}`;

export const initDatabase = async () => {
  loadLastUserId();
  return Promise.resolve();
};

export const getUserByName = (name: string): User | null => {
  for (let i = 0; i <= lastUserId; i++) {
    const userKey = getUserKey(i);
    const userData = localStorage.getItem(userKey);
    if (userData) {
      const parsedData = JSON.parse(userData) as UserData;
      if (parsedData.name === name) {
        return { id: i, name };
      }
    }
  }
  return null;
};

export const createUser = (name: string): number => {
  lastUserId++;
  const userId = lastUserId;
  const userData: UserData = {
    name,
    tasks: []
  };
  localStorage.setItem(getUserKey(userId), JSON.stringify(userData));
  localStorage.setItem('lastUserId', userId.toString());
  return userId;
};

export const getTasks = (userId: number): Task[] => {
  const userKey = getUserKey(userId);
  const userData = localStorage.getItem(userKey);
  if (!userData) {
    return [];
  }
  const parsedData = JSON.parse(userData) as UserData;
  return parsedData.tasks || [];
};

export const createTask = (userId: number, name: string): string => {
  const userKey = getUserKey(userId);
  const userData = localStorage.getItem(userKey);
  const parsedData: UserData = userData 
    ? JSON.parse(userData)
    : { name: '', tasks: [] };
  
  const taskId = Date.now().toString();
  const newTask: Task = {
    id: taskId,
    name,
    timeElapsed: 0,
    isRunning: false
  };
  
  parsedData.tasks.unshift(newTask);
  localStorage.setItem(userKey, JSON.stringify(parsedData));
  return taskId;
};

export const updateTaskTime = (userId: number, taskId: string, timeElapsed: number) => {
  const userKey = getUserKey(userId);
  const userData = localStorage.getItem(userKey);
  if (!userData) return;
  
  const parsedData = JSON.parse(userData) as UserData;
  parsedData.tasks = parsedData.tasks.map(task => 
    task.id === taskId ? { ...task, timeElapsed } : task
  );
  
  localStorage.setItem(userKey, JSON.stringify(parsedData));
};

export const deleteTask = (userId: number, taskId: string) => {
  const userKey = getUserKey(userId);
  const userData = localStorage.getItem(userKey);
  if (!userData) return;
  
  const parsedData = JSON.parse(userData) as UserData;
  parsedData.tasks = parsedData.tasks.filter(task => task.id !== taskId);
  localStorage.setItem(userKey, JSON.stringify(parsedData));
};

export const updateTaskRunningState = (userId: number, taskId: string, isRunning: boolean) => {
  const userKey = getUserKey(userId);
  const userData = localStorage.getItem(userKey);
  if (!userData) return;
  
  const parsedData = JSON.parse(userData) as UserData;
  parsedData.tasks = parsedData.tasks.map(task => 
    task.id === taskId ? { ...task, isRunning } : task
  );
  
  localStorage.setItem(userKey, JSON.stringify(parsedData));
};