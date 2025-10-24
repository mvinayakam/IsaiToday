import { Switch, Route, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import FloatingAddButton from "@/components/FloatingAddButton";
import Home from "@/pages/Home";
import Discover from "@/pages/Discover";
import Profile from "@/pages/Profile";
import MyPosts from "@/pages/MyPosts";
import MyLikes from "@/pages/MyLikes";
import NotFound from "@/pages/not-found";
import { Home as HomeIcon, Compass, User } from "lucide-react";
import { Button } from "@/components/ui/button";

function BottomNav() {
  const [location] = useLocation();
  
  const navItems = [
    { path: "/", label: "Home", icon: HomeIcon },
    { path: "/discover", label: "Discover", icon: Compass },
    { path: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/10 backdrop-blur-xl bg-background/80">
      <div className="flex items-center justify-around h-16 px-4">
        {navItems.map(({ path, label, icon: Icon }) => {
          const isActive = location === path;
          return (
            <Link key={path} href={path}>
              <Button
                variant="ghost"
                size="sm"
                className={`flex flex-col items-center gap-1 h-auto py-2 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
                data-testid={`nav-${label.toLowerCase()}`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs">{label}</span>
              </Button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

function DesktopNav() {
  const [location] = useLocation();
  
  const navItems = [
    { path: "/", label: "Home" },
    { path: "/discover", label: "Discover" },
    { path: "/profile", label: "Profile" },
  ];

  return (
    <div className="hidden md:flex items-center gap-1 mr-4">
      {navItems.map(({ path, label }) => {
        const isActive = location === path;
        return (
          <Link key={path} href={path}>
            <Button
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              data-testid={`nav-${label.toLowerCase()}`}
            >
              {label}
            </Button>
          </Link>
        );
      })}
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/discover" component={Discover} />
      <Route path="/profile" component={Profile} />
      <Route path="/my-posts" component={MyPosts} />
      <Route path="/my-likes" component={MyLikes} />
      <Route component={NotFound} />
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Navbar
            onSearchChange={(value) => console.log('Search:', value)}
          />
          
          <div className="hidden md:block fixed top-16 md:top-20 left-0 right-0 z-40 border-b border-white/10 backdrop-blur-xl bg-background/80">
            <div className="max-w-7xl mx-auto px-4 md:px-6 h-12 flex items-center">
              <DesktopNav />
            </div>
          </div>
          
          <div className="md:pt-12">
            <Router />
          </div>
          
          <FloatingAddButton />
          <BottomNav />
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
