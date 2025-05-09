
import React, { useMemo } from "react";
import TaskItem from "@/components/TaskItem";
import AddItemForm from "@/components/AddItemForm";
import BulkTaskActions from "@/components/BulkTaskActions";
import ProgressIndicator from "@/components/ProgressIndicator";
import { motion, AnimatePresence } from "framer-motion";
import { useSupabaseList } from "@/hooks/useSupabaseList";
import { useLocalStorageList } from "@/hooks/useLocalStorageList";
import { Loader2 } from "lucide-react";

const TaskList = ({
  title,
  inputPlaceholder,
  buttonText,
  storageMode,
  tableName,
  storageKeyBase,
  identifier,
  user,
  isDaily = false,
  currentDate,
}) => {
  const supabaseResult = useSupabaseList(
    storageMode === 'supabase' ? tableName : null,
    storageMode === 'supabase' ? identifier : null,
    storageMode === 'supabase' ? user : null
  );
  
  const localResult = useLocalStorageList(
    storageMode === 'local' ? storageKeyBase : null,
    storageMode === 'local' ? identifier : null
  );

  const hookResult = storageMode === 'supabase' ? supabaseResult : localResult;

  const {
    items,
    loading,
    addItem,
    deleteItem,
    toggleItem,
    editItem,
    applyTasksToFuture,
    removeFutureTasks,
  } = hookResult;

  const completionStats = useMemo(() => {
    const total = items.length;
    const completed = items.filter(item => item.is_completed).length;
    return { total, completed };
  }, [items]);

  const handleApplyTasks = (replace = false) => {
    if (currentDate && isDaily && items.length > 0 && applyTasksToFuture) {
      applyTasksToFuture(currentDate, items, replace);
    } else if (!applyTasksToFuture) {
      console.warn("applyTasksToFuture function is not available in the current mode.");
    }
  };

  const handleRemoveFutureTasks = () => {
    if (currentDate && isDaily && removeFutureTasks) {
      removeFutureTasks(currentDate);
    } else if (!removeFutureTasks) {
      console.warn("removeFutureTasks function is not available in the current mode.");
    }
  };

  return (
    <div className="w-full">
      {title && <h2 className="text-2xl font-bold mb-4 text-foreground">{title}</h2>}

      <AddItemForm
        onAddItem={addItem}
        inputPlaceholder={inputPlaceholder}
        buttonText={buttonText}
      />

      {loading ? (
        <div className="flex justify-center items-center py-4">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {items.length > 0 && (
            <div className="mb-6 mt-4">
              <ProgressIndicator
                completed={completionStats.completed}
                total={completionStats.total}
                variant={isDaily ? "blue" : "green"}
              />
            </div>
          )}

          <AnimatePresence>
            {items.map((item) => (
              <TaskItem
                key={item.id}
                task={item.content}
                checked={item.is_completed}
                onDelete={() => deleteItem(item.id)}
                onToggle={() => toggleItem(item.id, item.is_completed)}
                onEdit={(newContent) => editItem(item.id, newContent)}
              />
            ))}
          </AnimatePresence>

          {items.length === 0 && !loading && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-muted-foreground py-4"
            >
              No items yet. Add some!
            </motion.p>
          )}

          {isDaily && items.length > 0 && !loading && (
            <BulkTaskActions
              onApplyTasks={applyTasksToFuture ? handleApplyTasks : undefined}
              onRemoveFutureTasks={removeFutureTasks ? handleRemoveFutureTasks : undefined}
            />
          )}
        </>
      )}
    </div>
  );
};

export default TaskList;
