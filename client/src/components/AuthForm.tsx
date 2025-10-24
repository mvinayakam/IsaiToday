import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Music2 } from "lucide-react";
import { SiGoogle, SiGithub } from "react-icons/si";

interface AuthFormProps {
  mode?: "login" | "register";
  onSubmit?: (email: string, password: string) => void;
  onGoogleAuth?: () => void;
  onGithubAuth?: () => void;
  onToggleMode?: () => void;
}

export default function AuthForm({
  mode = "login",
  onSubmit,
  onGoogleAuth,
  onGithubAuth,
  onToggleMode
}: AuthFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const isLogin = mode === "login";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(email, password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="backdrop-blur-md bg-card/50 border border-white/10 rounded-2xl p-8 shadow-xl">
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Music2 className="w-8 h-8 text-primary" />
              <span className="text-2xl font-bold">IsaiToday</span>
            </div>
            <h1 className="text-2xl font-semibold mb-2">
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-muted-foreground text-center">
              {isLogin 
                ? "Sign in to discover your song of the day" 
                : "Join to start discovering and sharing music"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="bg-card/50 border-white/10"
                  data-testid="input-name"
                  required
                />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-card/50 border-white/10"
                data-testid="input-email"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-card/50 border-white/10"
                data-testid="input-password"
                required
              />
            </div>

            <Button type="submit" className="w-full" data-testid="button-submit">
              {isLogin ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card/50 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={onGoogleAuth}
              data-testid="button-google"
            >
              <SiGoogle className="w-4 h-4" />
              <span>Google</span>
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full gap-2"
              onClick={onGithubAuth}
              data-testid="button-github"
            >
              <SiGithub className="w-4 h-4" />
              <span>GitHub</span>
            </Button>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={onToggleMode}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-toggle-mode"
            >
              {isLogin 
                ? "Don't have an account? Sign up" 
                : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
