
    import React from 'react';
    import { motion } from 'framer-motion';

    const CompletionProgress = ({ items }) => {
      const completedCount = items.filter(item => item.is_completed).length;
      const totalCount = items.length;
      const percentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

      return (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          {totalCount > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-1">
                Completed: {completedCount} of {totalCount} ({percentage}%)
              </p>
              <div className="w-full bg-muted rounded-full h-2.5 dark:bg-gray-700">
                <motion.div
                  className="bg-gradient-to-r from-primary to-blue-500 h-2.5 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                ></motion.div>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-2">No items to track progress.</p>
          )}
        </motion.div>
      );
    };

    export default CompletionProgress;
  