
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, Eye, EyeOff } from "lucide-react";

const AuthForm = ({ onSignIn, onSignUp, onPasswordReset, onAnonymousSignIn, isLoading }) => {
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [isPasswordReset, setIsPasswordReset] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;

    if (isPasswordReset) {
       onPasswordReset(email);
       return;
    }

    if (!email || !password) {
      toast({
        title: "Missing information",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    if (isSigningUp) {
      if (password !== confirmPassword) {
        toast({
          title: "Passwords do not match",
          description: "Please ensure both passwords are the same",
          variant: "destructive",
        });
        return;
      }
      onSignUp({ email, password });
    } else {
      onSignIn({ email, password });
    }
  };

  const toggleAuthMode = () => {
    setIsSigningUp(!isSigningUp);
    setIsPasswordReset(false);
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const togglePasswordReset = () => {
    setIsPasswordReset(!isPasswordReset);
    setIsSigningUp(false);
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setShowConfirmPassword(false);
  }

  const getTitle = () => {
    if (isPasswordReset) return "Reset Password";
    if (isSigningUp) return "Create Account";
    return "Task Planner";
  }

  const getButtonText = () => {
    if (isLoading) return <Loader2 className="mr-2 h-4 w-4 animate-spin" />;
    if (isPasswordReset) return "Send Reset Link";
    if (isSigningUp) return "Sign Up";
    return "Sign In";
  }

  return (
    <motion.div
      key={isPasswordReset ? 'reset' : (isSigningUp ? 'signup' : 'signin')}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="max-w-md w-full mx-auto p-6 bg-card rounded-lg shadow-lg border border-border"
    >
      <motion.h2
        className="text-3xl font-bold text-center mb-6 text-primary"
        initial={{ y: -10 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.1 }}
      >
        {getTitle()}
      </motion.h2>

      <motion.p
        className="text-center mb-6 text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {isPasswordReset ? "Enter your email to receive a password reset link." : (isSigningUp ? "Sign up to save your tasks online" : "Sign in to get started")}
      </motion.p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </div>

        {!isPasswordReset && (
          <>
            <div className="relative flex items-center">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {isSigningUp && (
              <div className="relative flex items-center">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 p-1 text-muted-foreground hover:text-foreground transition-colors"
                  tabIndex={-1}
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            )}
          </>
        )}

        <Button type="submit" className="w-full" disabled={isLoading}>
          {getButtonText()}
          {!isLoading && (isPasswordReset ? "" : (isSigningUp ? "" : ""))}
        </Button>
      </form>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        {!isPasswordReset && (
           <p>
             {isSigningUp ? "Already have an account?" : "Don't have an account?"}{" "}
             <button
               onClick={toggleAuthMode}
               className="text-primary hover:underline font-medium"
               disabled={isLoading}
             >
               {isSigningUp ? "Sign In" : "Sign Up"}
             </button>
           </p>
        )}
         {!isSigningUp && (
            <p className="mt-2">
                <button
                   onClick={togglePasswordReset}
                   className="text-primary hover:underline text-xs"
                   disabled={isLoading}
                >
                   {isPasswordReset ? "Back to Sign In" : "Forgot Password?"}
                </button>
             </p>
        )}
      </div>

      <div className="mt-6 relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">or</span>
        </div>
      </div>

      <Button
        variant="outline"
        className="w-full mt-6"
        onClick={onAnonymousSignIn}
        disabled={isLoading}
      >
        Continue anonymously
      </Button>

    </motion.div>
  );
};

export default AuthForm;
