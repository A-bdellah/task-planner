
    import React, { useState, useEffect } from 'react';
    import TaskList from '@/components/TaskList';
    import DatePicker from '@/components/DatePicker';
    import { motion } from 'framer-motion';

    const MainContent = ({ storageMode, user }) => {
      const [selectedDate, setSelectedDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0];
      });

      const [selectedMonth, setSelectedMonth] = useState(() => {
        const today = new Date();
        return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
      });

      useEffect(() => {
        // Reset date/month if storageMode changes (e.g., user logs out and logs in again)
        // This ensures they see fresh data for the current day/month
        if (storageMode) {
            setSelectedDate(new Date().toISOString().split("T")[0]);
            setSelectedMonth(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}`);
        }
      }, [storageMode]);

      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="bg-card rounded-lg p-6 shadow-md border border-border">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-primary">Daily Tasks</h2>
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
              <h2 className="text-2xl font-bold text-primary">Monthly Goals</h2>
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
      );
    };

    export default MainContent;
  