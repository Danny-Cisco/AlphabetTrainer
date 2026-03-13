import { Switch, Route, Router } from "wouter"; // Import Router
import { useHashLocation } from "wouter/use-hash-location"; // Import this hook
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";

function AppRouter() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Wrap everything in the <Router> component 
          and provide the useHashLocation hook 
      */}
      <Router hook={useHashLocation}>
        <TooltipProvider>
          <Toaster />
          <AppRouter />
        </TooltipProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
