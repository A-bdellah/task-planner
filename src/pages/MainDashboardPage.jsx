
    import React, { useState, useEffect } from 'react';
    import TaskList from "@/components/TaskList";
    import DatePicker from "@/components/DatePicker";
    import { motion } from "framer-motion";

    const MainDashboardPage = ({
      storageMode,
      user
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
        // Reset dates if storageMode or user changes, implying a login/logout or mode switch
        const today = new Date();
        setSelectedDate(today.toISOString().split("T")[0]);
        setSelectedMonth(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`);
      }, [storageMode, user]);


      return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, staggerChildren: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <motion.div 
            className="bg-card rounded-xl p-6 shadow-xl border border-border/50 hover:shadow-2xl transition-shadow duration-300"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-500">Daily Tasks</h2>
              <DatePicker
                value={selectedDate}
                onChange={setSelectedDate}
                className="w-auto"
              />
            </div>
            <TaskList
              key={`tasks-${storageMode}-${selectedDate}-${user?.id || 'anon'}`}
              title=""
              inputPlaceholder="Add new daily task..."
              buttonText="Add Task"
              storageMode={storageMode}
              tableName="tasks"
              storageKeyBase="tasks-anonymous"
              identifier={selectedDate}
              user={user}
              isDaily={true}
              currentDate={selectedDate}
            />
          </motion.div>

          <motion.div 
            className="bg-card rounded-xl p-6 shadow-xl border border-border/50 hover:shadow-2xl transition-shadow duration-300"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ type: "spring", stiffness: 50 }}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-teal-500">Monthly Goals</h2>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="bg-background border border-input rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring ring-offset-background"
              />
            </div>
            <TaskList
              key={`goals-${storageMode}-${selectedMonth}-${user?.id || 'anon'}`}
              title=""
              inputPlaceholder="Add new monthly goal..."
              buttonText="Add Goal"
              storageMode={storageMode}
              tableName="goals"
              storageKeyBase="goals-anonymous"
              identifier={selectedMonth}
              user={user}
              isDaily={false}
              currentDate={null}
            />
          </motion.div>
        </motion.div>
      );
    };
    export default MainDashboardPage;
  