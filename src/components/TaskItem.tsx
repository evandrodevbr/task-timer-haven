import React from 'react';
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlayCircle, PauseCircle, Trash2 } from "lucide-react";

interface TaskItemProps {
  task: {
    id: string;
    name: string;
    timeElapsed: number;
    isRunning: boolean;
    isEditing: boolean;
  };
  formatTime: (ms: number) => string;
  onToggleTimer: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleEdit: (taskId: string) => void;
  onUpdateTime: (taskId: string, timeString: string) => void;
}

const TaskItem = ({
  task,
  formatTime,
  onToggleTimer,
  onDeleteTask,
  onToggleEdit,
  onUpdateTime,
}: TaskItemProps) => {
  return (
    <Card className="p-4 glass-card">
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
              onBlur={(e) => onUpdateTime(task.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  onUpdateTime(task.id, e.currentTarget.value);
                }
              }}
            />
          ) : (
            <span 
              className="timer-text text-lg font-mono cursor-pointer"
              onClick={() => onToggleEdit(task.id)}
            >
              {formatTime(task.timeElapsed)}
            </span>
          )}
          <div className="flex space-x-2">
            <Button
              variant={task.isRunning ? "destructive" : "default"}
              size="icon"
              onClick={() => onToggleTimer(task.id)}
            >
              {task.isRunning ? (
                <PauseCircle className="h-5 w-5" />
              ) : (
                <PlayCircle className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="destructive"
              size="icon"
              onClick={() => onDeleteTask(task.id)}
            >
              <Trash2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TaskItem;