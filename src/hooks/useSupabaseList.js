
    import React, { useState, useEffect, useCallback } from 'react';
    import { useToast } from "@/components/ui/use-toast";
    import {
        fetchItemsFromSupabase,
        addItemToSupabase,
        deleteItemFromSupabase,
        toggleItemInSupabase,
        editItemInSupabase,
        applyFutureTasksInSupabase,
        removeFutureTasksFromSupabase
    } from '@/services/supabaseService';

    export const useSupabaseList = (tableName, identifier, user) => {
      const [items, setItems] = useState([]);
      const [loading, setLoading] = useState(false);
      const { toast } = useToast();
      const identifierColumn = tableName === 'tasks' ? 'task_date' : 'goal_month';

      const fetchItems = useCallback(async () => {
        if (!user || !identifier || !tableName) {
          setItems([]);
          return;
        }
        setLoading(true);
        try {
          const data = await fetchItemsFromSupabase(tableName, identifierColumn, identifier, user.id);
          setItems(data);
        } catch (error) {
          toast({
            title: `Error fetching ${tableName}`,
            description: error.message,
            variant: "destructive",
          });
          setItems([]);
        } finally {
          setLoading(false);
        }
      }, [user, identifier, tableName, identifierColumn, toast]);

      useEffect(() => {
        fetchItems();
      }, [fetchItems]);

      const addItem = async (content) => {
        if (!content.trim()) {
          toast({ title: "Cannot add empty item", variant: "destructive" });
          return false;
        }
        if (!user || !tableName) {
          toast({ title: "Cannot add item", description: "User or table information missing.", variant: "destructive" });
          return false;
        }

        try {
          const newItemData = await addItemToSupabase(tableName, identifierColumn, identifier, user.id, content);
          setItems((prevItems) => [...prevItems, newItemData]);
          toast({ title: "Item added successfully!" });
          return true;
        } catch (error) {
          toast({
            title: `Error adding ${tableName}`,
            description: error.message,
            variant: "destructive",
          });
          return false;
        }
      };

      const deleteItem = async (id) => {
         if (!user || !tableName) return;
         try {
           await deleteItemFromSupabase(tableName, id, user.id);
           setItems((prevItems) => prevItems.filter((item) => item.id !== id));
           toast({ title: "Item deleted" });
         } catch (error) {
           toast({
             title: `Error deleting ${tableName}`,
             description: error.message,
             variant: "destructive",
           });
         }
      };

      const toggleItem = async (id, currentState) => {
        if (!user || !tableName) return;
        // Optimistic update
        setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === id ? { ...item, is_completed: !currentState } : item
            )
        );
        try {
          await toggleItemInSupabase(tableName, id, user.id, currentState);
          // Optional: Add success toast notification for toggle
        } catch (error) {
          toast({
            title: `Error updating ${tableName}`,
            description: error.message,
            variant: "destructive",
          });
          // Revert state on error
           setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === id ? { ...item, is_completed: currentState } : item
            )
          );
        }
      };

      const editItem = async (id, newContent) => {
        if (!newContent.trim()) {
          toast({ title: "Cannot update to empty item", variant: "destructive" });
          return false;
        }
        if (!user || !tableName) return false;

        const originalItems = items;
        // Optimistic update
         setItems((prevItems) =>
            prevItems.map((item) =>
              item.id === id ? { ...item, content: newContent.trim() } : item
            )
          );

        try {
          await editItemInSupabase(tableName, id, user.id, newContent);
          toast({ title: "Item updated" });
          return true;
        } catch (error) {
          toast({
            title: `Error editing ${tableName}`,
            description: error.message,
            variant: "destructive",
          });
          // Revert state on error
          setItems(originalItems);
          return false;
        }
      };

      const applyTasksToFuture = async (currentDate, tasksToApply, replace) => {
        if (!user || tableName !== 'tasks' || tasksToApply.length === 0) return;

        setLoading(true);
        toast({ title: "Applying tasks...", description: "This might take a moment." });

        try {
            await applyFutureTasksInSupabase(user.id, currentDate, tasksToApply, replace);
            toast({ title: "Tasks applied successfully!", description: `Tasks copied to the next 30 days.` });
             // Optionally refetch current day's tasks if logic requires it
             // fetchItems();
        } catch (error) {
            toast({
               title: "Error applying tasks",
               description: error.message,
               variant: "destructive",
            });
        } finally {
          setLoading(false);
        }
      };

      const removeFutureTasks = async (currentDate) => {
         if (!user || tableName !== 'tasks') return;
         if (!currentDate) {
            toast({ title: "Cannot remove tasks", description: "Current date not specified.", variant: "destructive" });
            return;
         }

         setLoading(true);
         toast({ title: "Removing future tasks...", description: "Clearing tasks for the next 30 days." });

         try {
            await removeFutureTasksFromSupabase(user.id, currentDate);
            toast({ title: "Future tasks removed successfully!" });
             // If current view is affected, refetch might be needed, but usually not.
             // fetchItems();
         } catch (error) {
             toast({
                title: "Error removing future tasks",
                description: error.message,
                variant: "destructive",
             });
         } finally {
            setLoading(false);
         }
      };


      return { items, loading, addItem, deleteItem, toggleItem, editItem, applyTasksToFuture, removeFutureTasks, fetchItems };
    };
  