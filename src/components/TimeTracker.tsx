import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { PlayCircle, PauseCircle, StopCircle, Plus, Trash2, Pencil } from "lucide-react";

interface Task {
  id: string;
  name: string;
  timeElapsed: number;
  isRunning: boolean;
  startTime: number | null;
  isEditing: boolean;
}

const TimeTracker = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      setTasks(currentTasks =>
        currentTasks.map(task => {
          if (task.isRunning && task.startTime) {
            const timeElapsed = task.timeElapsed + (Date.now() - task.startTime);
            return { ...task, timeElapsed, startTime: Date.now() };
          }
          return task;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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

  const addTask = () => {
    if (!newTaskName.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira o nome da tarefa",
        variant: "destructive",
      });
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
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

  const toggleTimer = (taskId: string) => {
    setTasks(currentTasks =>
      currentTasks.map(task => {
        if (task.id === taskId) {
          if (task.isRunning) {
            return { ...task, isRunning: false, startTime: null };
          } else {
            return { ...task, isRunning: true, startTime: Date.now() };
          }
        }
        return task;
      })
    );
  };

  const stopTask = (taskId: string) => {
    setTasks(currentTasks =>
      currentTasks.map(task => {
        if (task.id === taskId) {
          return { ...task, isRunning: false, startTime: null };
        }
        return task;
      })
    );
  };

  const deleteTask = (taskId: string) => {
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

  const updateTaskTime = (taskId: string, timeString: string) => {
    const newTime = parseTime(timeString);
    setTasks(currentTasks =>
      currentTasks.map(task => {
        if (task.id === taskId) {
          return { ...task, timeElapsed: newTime, isEditing: false };
        }
        return task;
      })
    );
  };

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
            <Card key={task.id} className="p-4 glass-card">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-medium">{task.name}</h3>
                </div>
                <div className="flex items-center space-x-4">
                  {task.isEditing ? (
                    <Input
                      type="text"
                      defaultValue={formatTime(task.timeElapsed)}
                      className="w-32 text-center font-mono"
                      onBlur={(e) => updateTaskTime(task.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          updateTaskTime(task.id, e.currentTarget.value);
                        }
                      }}
                    />
                  ) : (
                    <span 
                      className="timer-text text-lg font-mono cursor-pointer"
                      onClick={() => toggleEditMode(task.id)}
                    >
                      {formatTime(task.timeElapsed)}
                    </span>
                  )}
                  <div className="flex space-x-2">
                    <Button
                      variant={task.isRunning ? "destructive" : "default"}
                      size="icon"
                      onClick={() => toggleTimer(task.id)}
                    >
                      {task.isRunning ? (
                        <PauseCircle className="h-5 w-5" />
                      ) : (
                        <PlayCircle className="h-5 w-5" />
                      )}
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      onClick={() => stopTask(task.id)}
                    >
                      <StopCircle className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteTask(task.id)}
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimeTracker;