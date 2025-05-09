
import React from "react";
import { ModeToggle } from "@/components/ui/mode-toggle";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";

const Header = ({ onSignOut, isAuthenticated, userEmail, isAnonymous }) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
      <div className="container flex h-14 max-w-screen-2xl items-center mx-auto px-4">
        <div className="mr-4 hidden md:flex">
          <a className="mr-6 flex items-center space-x-2" href="/">
            <span className="hidden font-bold sm:inline-block">
              Task Planner
            </span>
          </a>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
           {isAuthenticated && (
              <span className="text-sm text-muted-foreground hidden sm:inline-block items-center">
                  {isAnonymous ? (
                      <>
                         <User className="inline-block h-4 w-4 mr-1"/> Anonymous Mode
                      </>
                  ) : (
                      userEmail
                  )}
              </span>
           )}
          <ModeToggle />
          {isAuthenticated && (
            <Button variant="ghost" size="sm" onClick={onSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
