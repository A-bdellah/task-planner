
import React, { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import TaskList from "@/components/TaskList";
import DatePicker from "@/components/DatePicker";
import AuthForm from "@/components/AuthForm";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";

function App() {
  const {
    user,
    isAnonymous,
    loadingAuth,
    storageMode,
    handleSignUp,
    handleSignIn,
    handlePasswordReset,
    handleAnonymousSignIn,
    handleSignOut,
    refreshAuthStatus
  } = useAuth();

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
      refreshAuthStatus();
    };
    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, [refreshAuthStatus]);

  if (loadingAuth) {
     return (
        <Layout isAuthenticated={false} userEmail={null} isAnonymous={false} onSignOut={() => {}}>
           <div className="flex items-center justify-center h-64">
              <p>Loading...</p>
           </div>
        </Layout>
     );
  }

  return (
    <Layout
        onSignOut={handleSignOut}
        isAuthenticated={!!user || isAnonymous}
        userEmail={user?.email}
        isAnonymous={isAnonymous}
    >
          {!storageMode ? (
            <AuthForm
              onSignIn={handleSignIn}
              onSignUp={handleSignUp}
              onPasswordReset={handlePasswordReset}
              onAnonymousSignIn={handleAnonymousSignIn}
              isLoading={loadingAuth}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="bg-card rounded-lg p-6 shadow-md border border-border">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-taskBlue-from via-taskBlue-via to-taskBlue-to bg-clip-text text-transparent">
                    Daily Tasks
                  </h2>
                  <DatePicker
                    value={selectedDate}
                    onChange={setSelectedDate}
                    className="w-auto"
                  />
                </div>
                <TaskList
                  key={`tasks-${storageMode}-${selectedDate}-${user?.id || 'anon'}`}
                  title=""
                  inputPlaceholder="Add new task"
                  buttonText="Add"
                  storageMode={storageMode}
                  tableName="tasks"
                  storageKeyBase="tasks-anonymous"
                  identifier={selectedDate}
                  user={user}
                  isDaily={true}
                  currentDate={selectedDate}
                />
              </div>

              <div className="bg-card rounded-lg p-6 shadow-md border border-border">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-goalGreen-from via-goalGreen-via to-goalGreen-to bg-clip-text text-transparent">
                    Monthly Goals
                  </h2>
                  <input
                    type="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="bg-background border border-input rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <TaskList
                  key={`goals-${storageMode}-${selectedMonth}-${user?.id || 'anon'}`}
                  title=""
                  inputPlaceholder="Add new goal"
                  buttonText="Add"
                  storageMode={storageMode}
                  tableName="goals"
                  storageKeyBase="goals-anonymous"
                  identifier={selectedMonth}
                  user={user}
                  isDaily={false}
                  currentDate={null}
                />
              </div>
            </motion.div>
          )}
    </Layout>
  );
}

export default App;
