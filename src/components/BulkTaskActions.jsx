
    import React, { useState } from "react";
    import { Button } from "@/components/ui/button";
    import {
      AlertDialog,
      AlertDialogAction,
      AlertDialogCancel,
      AlertDialogContent,
      AlertDialogDescription,
      AlertDialogFooter,
      AlertDialogHeader,
      AlertDialogTitle,
      AlertDialogTrigger,
    } from "@/components/ui/alert-dialog";


    const BulkTaskActions = ({ onApplyTasks, onRemoveFutureTasks }) => {
       const [isRemoveAlertOpen, setIsRemoveAlertOpen] = useState(false);

      const handleRemoveConfirm = () => {
        if(onRemoveFutureTasks) {
          onRemoveFutureTasks();
        }
        setIsRemoveAlertOpen(false);
      };

      return (
        <div className="mt-6 flex flex-col sm:flex-row gap-2 flex-wrap">
           {onApplyTasks && (
              <>
               <Button variant="secondary" onClick={() => onApplyTasks(false)} className="flex-grow">
                  Apply Tasks for Next 30 Days (Add)
               </Button>
               <Button variant="outline" onClick={() => onApplyTasks(true)} className="flex-grow">
                  Apply Tasks for Next 30 Days (Replace)
               </Button>
              </>
           )}

          {onRemoveFutureTasks && (
            <AlertDialog open={isRemoveAlertOpen} onOpenChange={setIsRemoveAlertOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="flex-grow">
                  Remove All Tasks for Next 30 Days
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all tasks
                    for the next 30 days starting from tomorrow.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleRemoveConfirm} className="bg-destructive hover:bg-destructive/90">
                     Yes, remove future tasks
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}

        </div>
      );
    };

    export default BulkTaskActions;
  