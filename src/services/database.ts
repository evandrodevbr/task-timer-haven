import fs from 'fs';
import path from 'path';

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

const DATABASE_DIR = path.join(process.cwd(), 'database');

// Ensure database directory exists
if (!fs.existsSync(DATABASE_DIR)) {
  fs.mkdirSync(DATABASE_DIR, { recursive: true });
}

const getUserFilePath = (userId: number) => {
  return path.join(DATABASE_DIR, `user_${userId}.json`);
};

let lastUserId = 0;

// Load the last user ID from existing files
const userFiles = fs.readdirSync(DATABASE_DIR);
userFiles.forEach(file => {
  if (file.startsWith('user_') && file.endsWith('.json')) {
    const userId = parseInt(file.replace('user_', '').replace('.json', ''));
    if (userId > lastUserId) {
      lastUserId = userId;
    }
  }
});

export const initDatabase = async () => {
  // No initialization needed for JSON files
  return Promise.resolve();
};

export const getUserByName = (name: string): User | null => {
  const userFiles = fs.readdirSync(DATABASE_DIR);
  for (const file of userFiles) {
    if (file.endsWith('.json')) {
      const userData = JSON.parse(fs.readFileSync(path.join(DATABASE_DIR, file), 'utf-8'));
      if (userData.name === name) {
        return { id: parseInt(file.split('_')[1].replace('.json', '')), name };
      }
    }
  }
  return null;
};

export const createUser = (name: string): number => {
  lastUserId++;
  const userId = lastUserId;
  const userData = {
    name,
    tasks: []
  };
  fs.writeFileSync(getUserFilePath(userId), JSON.stringify(userData, null, 2));
  return userId;
};

export const getTasks = (userId: number): Task[] => {
  const filePath = getUserFilePath(userId);
  if (!fs.existsSync(filePath)) {
    return [];
  }
  const userData: UserData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  return userData.tasks || [];
};

export const createTask = (userId: number, name: string): string => {
  const filePath = getUserFilePath(userId);
  const userData: UserData = fs.existsSync(filePath) 
    ? JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    : { name: '', tasks: [] };
  
  const taskId = Date.now().toString();
  const newTask: Task = {
    id: taskId,
    name,
    timeElapsed: 0,
    isRunning: false
  };
  
  userData.tasks.unshift(newTask);
  fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
  return taskId;
};

export const updateTaskTime = (userId: number, taskId: string, timeElapsed: number) => {
  const filePath = getUserFilePath(userId);
  const userData: UserData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  userData.tasks = userData.tasks.map(task => 
    task.id === taskId ? { ...task, timeElapsed } : task
  );
  
  fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
};

export const deleteTask = (userId: number, taskId: string) => {
  const filePath = getUserFilePath(userId);
  const userData: UserData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  userData.tasks = userData.tasks.filter(task => task.id !== taskId);
  fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
};

export const updateTaskRunningState = (userId: number, taskId: string, isRunning: boolean) => {
  const filePath = getUserFilePath(userId);
  const userData: UserData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  userData.tasks = userData.tasks.map(task => 
    task.id === taskId ? { ...task, isRunning } : task
  );
  
  fs.writeFileSync(filePath, JSON.stringify(userData, null, 2));
};
