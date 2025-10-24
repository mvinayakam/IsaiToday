import AuthForm from '../AuthForm';
import { useState } from 'react';

export default function AuthFormExample() {
  const [mode, setMode] = useState<"login" | "register">("login");

  return (
    <AuthForm
      mode={mode}
      onSubmit={(email, password) => console.log('Submit:', email, password)}
      onGoogleAuth={() => console.log('Google auth')}
      onGithubAuth={() => console.log('GitHub auth')}
      onToggleMode={() => setMode(mode === "login" ? "register" : "login")}
    />
  );
}
