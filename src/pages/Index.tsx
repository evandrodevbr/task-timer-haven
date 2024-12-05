import TimeTracker from "@/components/TimeTracker";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <div className="container mx-auto py-8">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-4xl font-bold tracking-tight">Rastreador de Tempo</h1>
          <p className="text-muted-foreground">
            Acompanhe o tempo gasto em suas tarefas de programação
          </p>
        </div>
        <TimeTracker />
      </div>
    </div>
  );
};

export default Index;