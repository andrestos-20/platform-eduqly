import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ModulesProvider } from "./contexts/ModulesContext";
import Home from "./pages/Home";
import Course from "./pages/Course";
import ModuleManager from "./pages/ModuleManager";
import AdminLogin from "./pages/AdminLogin";
import StudentLogin from "./pages/StudentLogin";
import AdminStudents from "./pages/AdminStudents";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/curso"} component={Course} />
      <Route path={"/admin/login"} component={AdminLogin} />
      <Route path={"/admin/modulos"} component={ModuleManager} />
      <Route path={"/login"} component={StudentLogin} />
      <Route path={"/admin/alunos"} component={AdminStudents} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <ModulesProvider>
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ModulesProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

