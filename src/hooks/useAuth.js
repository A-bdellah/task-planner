
    import { useState, useEffect, useCallback, useMemo } from 'react';
    import { supabase } from '@/lib/supabaseClient';
    import { useToast } from "@/components/ui/use-toast";

    const ANONYMOUS_FLAG_KEY = "task-planner-anonymous";

    export const useAuth = () => {
        const [session, setSession] = useState(null);
        const [user, setUser] = useState(null);
        const [isAnonymous, setIsAnonymous] = useState(() => localStorage.getItem(ANONYMOUS_FLAG_KEY) === "true");
        const [loadingAuth, setLoadingAuth] = useState(true);
        const { toast } = useToast();

        const refreshSessionData = useCallback(async () => {
            setLoadingAuth(true);
            try {
                const { data: { session: currentSession }, error } = await supabase.auth.getSession();
                if (error) throw error;

                if (currentSession) {
                    setSession(currentSession);
                    setUser(currentSession.user);
                    if (isAnonymous) {
                        setIsAnonymous(false);
                        localStorage.removeItem(ANONYMOUS_FLAG_KEY);
                    }
                } else {
                    setSession(null);
                    setUser(null);
                    // Only set anonymous if explicitly stored, otherwise default to not anonymous
                    setIsAnonymous(localStorage.getItem(ANONYMOUS_FLAG_KEY) === "true");
                }
            } catch (error) {
                console.error("Error refreshing session data:", error);
                // Fallback to checking local storage for anonymous status on error
                setIsAnonymous(localStorage.getItem(ANONYMOUS_FLAG_KEY) === "true");
            } finally {
                setLoadingAuth(false);
            }
        }, [isAnonymous, toast]);


        useEffect(() => {
            refreshSessionData(); // Initial session check

            const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
                setSession(currentSession);
                setUser(currentSession?.user ?? null);

                if (currentSession) {
                    if (isAnonymous) {
                        setIsAnonymous(false);
                        localStorage.removeItem(ANONYMOUS_FLAG_KEY);
                    }
                }

                switch (_event) {
                    case 'SIGNED_IN':
                        toast({ title: "Signed in successfully!", description: `Welcome back ${currentSession?.user?.email || ''}` });
                        break;
                    case 'SIGNED_OUT':
                        toast({ title: "Signed out successfully." });
                        // After sign out, we might want to explicitly set to not anonymous unless user chooses again
                        // setIsAnonymous(false); 
                        // localStorage.removeItem(ANONYMOUS_FLAG_KEY);
                        break;
                    case 'PASSWORD_RECOVERY':
                        toast({ title: "Check your email for password reset instructions." });
                        break;
                    case 'USER_UPDATED':
                        break;
                    default:
                        break;
                }
            });
            
            const handleVisibilityChange = () => {
                if (document.visibilityState === 'visible') {
                    refreshSessionData();
                }
            };

            document.addEventListener('visibilitychange', handleVisibilityChange);

            return () => {
                subscription.unsubscribe();
                document.removeEventListener('visibilitychange', handleVisibilityChange);
            };
        }, [toast, refreshSessionData, isAnonymous]);

        useEffect(() => {
            if (isAnonymous) {
                localStorage.setItem(ANONYMOUS_FLAG_KEY, "true");
            } else {
                localStorage.removeItem(ANONYMOUS_FLAG_KEY);
            }
        }, [isAnonymous]);

        const handleSignUp = useCallback(async (credentials) => {
            setLoadingAuth(true);
            try {
                const { error } = await supabase.auth.signUp({
                    email: credentials.email,
                    password: credentials.password,
                });
                if (error) throw error;
                toast({
                    title: "Account created!",
                    description: "Please check your email to confirm your account.",
                });
            } catch (error) {
                console.error("Sign up error:", error);
                toast({
                    title: "Sign up failed",
                    description: error.message || "Could not create account.",
                    variant: "destructive",
                });
            } finally {
                setLoadingAuth(false);
            }
        }, [toast]);

        const handleSignIn = useCallback(async (credentials) => {
            setLoadingAuth(true);
            try {
                const { error } = await supabase.auth.signInWithPassword({
                    email: credentials.email,
                    password: credentials.password,
                });
                if (error) throw error;
            } catch (error) {
                console.error("Sign in error:", error);
                toast({
                    title: "Sign in failed",
                    description: error.message || "Invalid email or password.",
                    variant: "destructive",
                });
            } finally {
                setLoadingAuth(false);
            }
        }, [toast]);

        const handlePasswordReset = useCallback(async (email) => {
            if (!email) {
                toast({ title: "Please enter your email address", variant: "destructive" });
                return;
            }
            setLoadingAuth(true);
            try {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: window.location.origin,
                });
                if (error) throw error;
            } catch (error) {
                console.error("Password reset error:", error);
                toast({
                    title: "Password reset failed",
                    description: error.message || "Could not send reset instructions.",
                    variant: "destructive",
                });
            } finally {
                setLoadingAuth(false);
            }
        }, [toast]);

        const handleAnonymousSignIn = useCallback(() => {
            setLoadingAuth(true);
            setSession(null);
            setUser(null);
            setIsAnonymous(true);
            toast({ title: "Continuing anonymously", description: "Data saved locally." });
            setLoadingAuth(false);
        }, [toast]);

        const handleSignOut = useCallback(async () => {
            setLoadingAuth(true);
            const wasAnonymous = isAnonymous;
            setIsAnonymous(false); // Clear anonymous state immediately
            
            if (wasAnonymous) {
                toast({ title: "Stopped anonymous session." });
                 setLoadingAuth(false);
            } else {
                try {
                    const { error } = await supabase.auth.signOut();
                    if (error) throw error;
                } catch (error) {
                    console.error("Sign out error:", error);
                    toast({
                        title: "Sign out failed",
                        description: error.message || "Could not sign out.",
                        variant: "destructive",
                    });
                } finally {
                    setLoadingAuth(false);
                }
            }
        }, [isAnonymous, toast]);

        const storageMode = useMemo(() => (user ? 'supabase' : (isAnonymous ? 'local' : null)), [user, isAnonymous]);

        return {
            session,
            user,
            isAnonymous,
            loadingAuth,
            storageMode,
            handleSignUp,
            handleSignIn,
            handlePasswordReset,
            handleAnonymousSignIn,
            handleSignOut,
            refreshAuthStatus: refreshSessionData 
        };
    };
  