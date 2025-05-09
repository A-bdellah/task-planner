
    import React, { useState, useEffect } from "react";
    import AuthPage from "@/pages/AuthPage";
    import MainDashboardPage from "@/pages/MainDashboardPage";

    const AppContent = ({
      user,
      isAnonymous,
      loadingAuth,
      storageMode,
      handleSignUp,
      handleSignIn,
      handlePasswordReset,
      handleAnonymousSignIn,
      refreshAuthStatus
    }) => {
      const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
      });

      const [selectedMonth, setSelectedMonth] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
      });

      useEffect(() => {
         if (!loadingAuth && !storageMode) {
             setSelectedDate(new Date().toISOString().split("T")[0]);
             setSelectedMonth(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`);
         }
      }, [storageMode, loadingAuth]);

      useEffect(() => {
        const handleFocus = () => {
          if (document.visibilityState === 'visible') {
            refreshAuthStatus();
          }
        };
        
        window.addEventListener('focus', handleFocus);
        document.addEventListener('visibilitychange', handleFocus); 

        return () => {
          window.removeEventListener('focus', handleFocus);
          document.removeEventListener('visibilitychange', handleFocus);
        };
      }, [refreshAuthStatus]);

      if (!storageMode) {
        return (
          <AuthPage
            onSignIn={handleSignIn}
            onSignUp={handleSignUp}
            onPasswordReset={handlePasswordReset}
            onAnonymousSignIn={handleAnonymousSignIn}
            isLoading={loadingAuth}
          />
        );
      }

      return (
        <MainDashboardPage
          storageMode={storageMode}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          selectedMonth={selectedMonth}
          setSelectedMonth={setSelectedMonth}
          user={user}
        />
      );
    };

    export default AppContent;
  