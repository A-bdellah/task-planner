
    import React from 'react';
    import TaskList from "@/components/TaskList";
    import DatePicker from "@/components/DatePicker";
    import { motion } from "framer-motion";

    const TaskDashboard = ({
      selectedDate,
      setSelectedDate,
      selectedMonth,
      setSelectedMonth,
      storageMode,
      user
    }) => {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          <div className="bg-card rounded-lg p-6 shadow-md border border-border flex flex-col">
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
              listTitle=""
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

          <div className="bg-card rounded-lg p-6 shadow-md border border-border flex flex-col">
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
              listTitle=""
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

    export default TaskDashboard;
  