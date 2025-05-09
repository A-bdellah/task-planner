
    import React, { useState, useRef, useEffect } from "react";
    import { Checkbox } from "@/components/ui/checkbox";
    import { Button } from "@/components/ui/button";
    import { Input } from "@/components/ui/input";
    import { Trash2, Edit, Save, X } from "lucide-react";
    import { motion } from "framer-motion";

    const TaskItem = ({ task, checked, onDelete, onToggle, onEdit }) => {
      const [isEditing, setIsEditing] = useState(false);
      const [editedTask, setEditedTask] = useState(task);
      const inputRef = useRef(null);

      useEffect(() => {
        if (isEditing && inputRef.current) {
          inputRef.current.focus();
          inputRef.current.select();
        }
      }, [isEditing]);

      const handleEditClick = () => {
        setEditedTask(task); // Reset edit field to current task name
        setIsEditing(true);
      };

      const handleSaveClick = () => {
        if (editedTask.trim() !== task && editedTask.trim() !== "") {
          if (onEdit(editedTask.trim())) { // onEdit now returns boolean success
             setIsEditing(false);
          }
          // If onEdit fails (e.g., validation error), stay in edit mode
        } else {
          setIsEditing(false); // Exit edit mode if no change or empty
        }
      };

      const handleCancelClick = () => {
        setIsEditing(false);
        setEditedTask(task); // Revert changes
      };

      const handleKeyDown = (e) => {
        if (e.key === "Enter") {
          handleSaveClick();
        } else if (e.key === "Escape") {
          handleCancelClick();
        }
      };

      return (
        <motion.div
          layout
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className={`flex items-center gap-3 p-3 rounded-md mb-2 transition-colors duration-200 ${
            checked ? "bg-muted/50" : "bg-card hover:bg-muted/30"
          } border border-border`}
        >
          <Checkbox
            id={`task-${task}-${Math.random()}`} // Keep random for unique ID if needed, though DB id is better
            checked={checked}
            onCheckedChange={onToggle}
            className="transition-transform duration-200 ease-in-out transform hover:scale-110"
            aria-label={`Mark task ${task} as ${checked ? 'incomplete' : 'complete'}`}
          />
          {isEditing ? (
            <Input
              ref={inputRef}
              value={editedTask}
              onChange={(e) => setEditedTask(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 h-8 text-sm"
              aria-label="Edit task name"
            />
          ) : (
            <label
              htmlFor={`task-${task}-${Math.random()}`}
              className={`flex-1 text-sm font-medium cursor-pointer ${
                checked ? "line-through text-muted-foreground" : "text-foreground"
              }`}
            >
              {task}
            </label>
          )}
          <div className="flex gap-1 ml-auto">
            {isEditing ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleSaveClick}
                  className="h-7 w-7 text-green-600 hover:text-green-700"
                  aria-label="Save changes"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleCancelClick}
                  className="h-7 w-7 text-gray-500 hover:text-gray-600"
                  aria-label="Cancel editing"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEditClick}
                className="h-7 w-7 text-blue-600 hover:text-blue-700"
                aria-label="Edit task"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
              className="h-7 w-7 text-red-600 hover:text-red-700"
              aria-label="Delete task"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      );
    };

    export default TaskItem;
  