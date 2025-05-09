
    import React from 'react';
    import AuthPage from "@/pages/AuthPage";
    import MainDashboardPage from "@/pages/MainDashboardPage";

    const AppContent = ({
      storageMode,
      user,
      handleSignIn,
      handleSignUp,
      handlePasswordReset,
      handleAnonymousSignIn,
      loadingAuth
    }) => {
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
          user={user}
        />
      );
    };

    export default AppContent;
  