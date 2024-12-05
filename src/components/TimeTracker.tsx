import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { PlayCircle, PauseCircle, StopCircle, Plus } from "lucide-react";

interface Task {
  id: string;
  name: string;
  project: string;
  timeElapsed: number;
  isRunning: boolean;
  startTime: number | null;
}

const TimeTracker = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskName, setNewTaskName] = useState("");
  const [newProject, setNewProject] = useState("");
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

  const addTask = () => {
    if (!newTaskName.trim() || !newProject.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, preencha todos os campos",
        variant: "destructive",
      });
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      name: newTaskName,
      project: newProject,
      timeElapsed: 0,
      isRunning: false,
      startTime: null,
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskName("");
    setNewProject("");
    
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

  return (
    <div className="container mx-auto p-6 max-w-3xl animate-slide-up">
      <div className="space-y-6">
        <div className="glass-card rounded-lg p-6 space-y-4">
          <h2 className="text-2xl font-semibold tracking-tight">Novo Registro</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="taskName">Nome da Tarefa</Label>
              <Input
                id="taskName"
                placeholder="Digite o nome da tarefa"
                value={newTaskName}
                onChange={(e) => setNewTaskName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project">Projeto</Label>
              <Input
                id="project"
                placeholder="Nome do projeto"
                value={newProject}
                onChange={(e) => setNewProject(e.target.value)}
              />
            </div>
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
                  <p className="text-sm text-muted-foreground">{task.project}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="timer-text text-lg font-mono">
                    {formatTime(task.timeElapsed)}
                  </span>
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