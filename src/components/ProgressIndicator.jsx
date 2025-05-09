
import React from "react";
import { motion } from "framer-motion";

const ProgressIndicator = ({ completed, total, variant = "blue" }) => {
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
  
  const gradientClass = variant === "blue" 
    ? "from-taskBlue-from via-taskBlue-via to-taskBlue-to" 
    : "from-goalGreen-from via-goalGreen-via to-goalGreen-to";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <span className="text-sm font-medium text-muted-foreground">
          Progress
        </span>
        <span className={`text-sm font-bold bg-gradient-to-r ${gradientClass} bg-clip-text text-transparent`}>
          {percentage}%
        </span>
      </div>
      <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
        <motion.div
          className={`h-full bg-gradient-to-r ${gradientClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      <div className="text-xs text-muted-foreground text-center">
        {completed} of {total} completed
      </div>
    </div>
  );
};

export default ProgressIndicator;
