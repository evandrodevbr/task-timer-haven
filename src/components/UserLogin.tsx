import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface UserLoginProps {
  onLogin: (username: string) => void;
}

const UserLogin = ({ onLogin }: UserLoginProps) => {
  const [username, setUsername] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      toast({
        title: "Erro",
        description: "Por favor, insira seu nome de usuário",
        variant: "destructive",
      });
      return;
    }
    onLogin(username);
  };

  return (
    <div className="container mx-auto p-6 max-w-md animate-slide-up">
      <Card className="p-6 space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">Nome de Usuário</Label>
            <Input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Digite seu nome de usuário"
            />
          </div>
          <Button type="submit" className="w-full">
            Entrar
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default UserLogin;