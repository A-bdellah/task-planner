
    import React from 'react';
    import Header from '@/components/Header';
    import { ThemeProvider } from "@/components/ui/theme-provider";
    import { Toaster } from "@/components/ui/toaster";

    const Layout = ({ children, onSignOut, isAuthenticated, userEmail, isAnonymous }) => {
      return (
        <ThemeProvider defaultTheme="light">
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            <Header
              onSignOut={onSignOut}
              isAuthenticated={isAuthenticated}
              userEmail={userEmail}
              isAnonymous={isAnonymous}
            />
            <main className="flex-1 container mx-auto py-8 px-4">
              {children}
            </main>
            <footer className="py-4 px-6 text-center text-sm text-muted-foreground border-t border-border mt-8">
              <p>© {new Date().getFullYear()} Task Planner. All rights reserved.</p>
            </footer>
          </div>
          <Toaster />
        </ThemeProvider>
      );
    };

    export default Layout;
  