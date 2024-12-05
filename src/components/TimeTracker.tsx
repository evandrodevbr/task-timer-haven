import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Plus } from "lucide-react";
import TaskItem from './TaskItem';
import UserLogin from './UserLogin';
import * as db from '../services/database';

interface Task {
  id: string;
  name: string;
  timeElapsed: number;
  isRunning: boolean;
  isEditing: boolean;
  startTime?: number | null;
}

const TimeTracker = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [currentUser, setCurrentUser] = useState<{ id: number; name: string } | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const initDb = async () => {
      await db.initDatabase();
    };
    initDb();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadTasks();
    }
  }, [currentUser]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(currentTasks =>
        currentTasks.map(task => {
          if (task.isRunning && task.startTime) {
            const timeElapsed = task.timeElapsed + (Date.now() - task.startTime);
            if (currentUser) {
              db.updateTaskTime(currentUser.id, task.id, timeElapsed);
            }
            return { ...task, timeElapsed, startTime: Date.now() };
          }
          return task;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [currentUser]);

  const loadTasks = async () => {
    if (!currentUser) return;
    const dbTasks = await db.getTasks(currentUser.id);
    setTasks(dbTasks.map(task => ({
      ...task,
      startTime: null,
      isEditing: false
    })));
  };

  const handleLogin = async (username: string) => {
    let user = await db.getUserByName(username);
    if (!user) {
      const userId = await db.createUser(username);
      user = { id: userId, name: username };
    }
    setCurrentUser(user);
    toast({
      title: "Bem-vindo",
      description: `Olá, ${username}!`,
    });
  };

  const formatTime = (ms: number) => {
    const seconds = Math.floor((ms / 1000) % 60);
    const minutes = Math.floor((ms / (1000 * 60)) % 60);
    const hours = Math.floor(ms / (1000 * 60 * 60));

    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const parseTime = (timeString: string): number => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return ((hours * 60 * 60) + (minutes * 60) + seconds) * 1000;
  };

  const addTask = async () => {
    if (!currentUser) return;
    if (!newTaskName.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira o nome da tarefa",
        variant: "destructive",
      });
      return;
    }

    const taskId = await db.createTask(currentUser.id, newTaskName);
    const newTask: Task = {
      id: taskId.toString(),
      name: newTaskName,
      timeElapsed: 0,
      isRunning: false,
      startTime: null,
      isEditing: false,
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskName("");
    
    toast({
      title: "Tarefa adicionada",
      description: "Nova tarefa criada com sucesso!",
    });
  };

  const toggleTimer = async (taskId: string) => {
    if (!currentUser) return;
    setTasks(currentTasks =>
      currentTasks.map(task => {
        if (task.id === taskId) {
          const newIsRunning = !task.isRunning;
          db.updateTaskRunningState(currentUser.id, taskId, newIsRunning);
          if (newIsRunning) {
            return { ...task, isRunning: true, startTime: Date.now() };
          } else {
            return { ...task, isRunning: false, startTime: null };
          }
        }
        return task;
      })
    );
  };

  const deleteTask = async (taskId: string) => {
    if (!currentUser) return;
    await db.deleteTask(currentUser.id, taskId);
    setTasks(currentTasks => currentTasks.filter(task => task.id !== taskId));
    toast({
      title: "Tarefa excluída",
      description: "A tarefa foi removida com sucesso",
    });
  };

  const toggleEditMode = (taskId: string) => {
    setTasks(currentTasks =>
      currentTasks.map(task => {
        if (task.id === taskId) {
          return { ...task, isEditing: !task.isEditing };
        }
        return task;
      })
    );
  };

  const updateTaskTime = async (taskId: string, timeString: string) => {
    const newTime = parseTime(timeString);
    if (currentUser) {
      await db.updateTaskTime(parseInt(taskId), newTime);
    }
    setTasks(currentTasks =>
      currentTasks.map(task => {
        if (task.id === taskId) {
          return { ...task, timeElapsed: newTime, isEditing: false };
        }
        return task;
      })
    );
  };

  if (!currentUser) {
    return <UserLogin onLogin={handleLogin} />;
  }

  return (
    <div className="container mx-auto p-6 max-w-3xl animate-slide-up">
      <div className="space-y-6">
        <div className="glass-card rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Novo Registro</h2>
          <div className="space-y-2">
            <Label htmlFor="taskName">Nome da Tarefa</Label>
            <Input
              id="taskName"
              placeholder="Digite o nome da tarefa"
              value={newTaskName}
              onChange={(e) => setNewTaskName(e.target.value)}
            />
          </div>
          <Button onClick={addTask} className="w-full">
            <Plus className="mr-2 h-4 w-4" /> Adicionar Tarefa
          </Button>
        </div>

        <div className="space-y-4">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              formatTime={formatTime}
              onToggleTimer={toggleTimer}
              onDeleteTask={deleteTask}
              onToggleEdit={toggleEditMode}
              onUpdateTime={updateTaskTime}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeTracker;
