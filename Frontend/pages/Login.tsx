import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../App";
import { Button, Input, Card } from "../components/ui/Components";
import { Trophy, AlertCircle } from "lucide-react";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isAdminLogin, setIsAdminLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      if (isRegister) {
        await register(name, email, password);
        navigate("/dashboard");
      } else {
        await login(email, password);
        navigate("/dashboard");
      }
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden p-4">
      {/* Abstract Background */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-accent/10 rounded-full blur-[100px]" />

      <Card className="w-full max-w-md relative z-10 border-neutral-700 bg-surface/90 backdrop-blur">
        <div className="text-center mb-8">
          <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold uppercase tracking-tight text-white">
            {isRegister ? "Join the Squad" : "Welcome Back"}
          </h2>
          <p className="text-gray-400 mt-2">
            Sign in to book the best courts in Nepal.
          </p>
        </div>

        {message && (
          <div className="mb-6 p-3 bg-yellow-900/30 border border-yellow-700/50 flex items-center justify-center text-yellow-500 text-sm font-bold uppercase tracking-wide">
            <AlertCircle size={16} className="mr-2" />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 bg-red-900/30 border border-red-700/50 flex items-center justify-center text-red-400 text-sm font-bold uppercase tracking-wide">
            <AlertCircle size={16} className="mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {isRegister && (
            <Input
              label="Full Name"
              type="text"
              placeholder="Aarav Sharma"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          )}
          <Input
            label="Email Address"
            type="email"
            placeholder="aarav@courtsync.np"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {!isRegister && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="admin"
                className="w-4 h-4 rounded-none border-neutral-600 bg-neutral-800 text-primary focus:ring-primary"
                checked={isAdminLogin}
                onChange={(e) => setIsAdminLogin(e.target.checked)}
              />
              <label
                htmlFor="admin"
                className="text-sm text-gray-400 select-none cursor-pointer"
              >
                Login as Admin (Demo)
              </label>
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            size="lg"
            isLoading={isLoading}
          >
            {isRegister ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-primary hover:text-primaryDark font-bold uppercase"
          >
            {isRegister ? "Log In" : "Register"}
          </button>
        </div>
      </Card>
    </div>
  );
};

export default Login;
