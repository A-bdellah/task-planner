
import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { CalendarPlus as CalendarIcon } from 'lucide-react';

const DatePicker = ({ value, onChange, className }) => {
  return (
    <div className={cn("relative", className)}>
      <Input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="pr-10"
      />
      <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
    </div>
  );
};

export default DatePicker;
