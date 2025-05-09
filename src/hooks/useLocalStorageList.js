
    import React, { useState, useEffect, useCallback } from 'react';
    import { useToast } from "@/components/ui/use-toast";

    export const useLocalStorageList = (storageKeyBase, identifier) => {
      const [items, setItems] = useState([]);
      const [loading, setLoading] = useState(false); // Added for consistency
      const { toast } = useToast();

      const getStorageKey = useCallback(() => {
        return `${storageKeyBase}-${identifier}`;
      }, [storageKeyBase, identifier]);

      const loadItems = useCallback(() => {
        setLoading(true);
        try {
          const key = getStorageKey();
          const storedItems = localStorage.getItem(key);
          setItems(storedItems ? JSON.parse(storedItems) : []);
        } catch (error) {
          console.error("Error loading items from localStorage:", error);
          toast({
            title: "Error loading items",
            description: "Could not load data from local storage.",
            variant: "destructive",
          });
          setItems([]);
        } finally {
           setLoading(false);
        }
      }, [getStorageKey, toast]);

      useEffect(() => {
        loadItems();
      }, [loadItems]); // Depend on the memoized loadItems

      const saveItems = useCallback((updatedItems) => {
        try {
          const key = getStorageKey();
          localStorage.setItem(key, JSON.stringify(updatedItems));
        } catch (error) {
           console.error("Error saving items to localStorage:", error);
           toast({
             title: "Error saving items",
             description: "Could not save data to local storage.",
             variant: "destructive",
           });
        }
      }, [getStorageKey, toast]);

      const addItem = (content) => {
        if (!content.trim()) {
          toast({ title: "Cannot add empty item", variant: "destructive" });
          return false;
        }
        const newItem = {
          id: Date.now(), // Simple unique ID for local items
          content: content.trim(),
          is_completed: false,
          // No need for user_id or date/month here as it's tied to the identifier/key
        };
        const updatedItems = [...items, newItem];
        setItems(updatedItems);
        saveItems(updatedItems);
        toast({ title: "Item added successfully!" });
        return true;
      };

      const deleteItem = (id) => {
        const updatedItems = items.filter((item) => item.id !== id);
        setItems(updatedItems);
        saveItems(updatedItems);
        toast({ title: "Item deleted" });
      };

      const toggleItem = (id, currentState) => {
        const updatedItems = items.map((item) =>
          item.id === id ? { ...item, is_completed: !currentState } : item
        );
        setItems(updatedItems);
        saveItems(updatedItems);
      };

      const editItem = (id, newContent) => {
        if (!newContent.trim()) {
           toast({ title: "Cannot update to empty item", variant: "destructive" });
           return false;
        }
        const updatedItems = items.map((item) =>
          item.id === id ? { ...item, content: newContent.trim() } : item
        );
        setItems(updatedItems);
        saveItems(updatedItems);
        toast({ title: "Item updated" });
        return true;
      };

       // Placeholder for local storage - might not be fully applicable
      const applyTasksToFuture = (currentDate, tasksToApply, replace) => {
         if (!currentDate || tasksToApply.length === 0) return;
         setLoading(true);
         toast({ title: "Applying tasks locally...", description: "Copying to next 30 days." });
          try {
             const startDate = new Date(currentDate);
             for (let i = 1; i <= 30; i++) {
               const futureDate = new Date(startDate);
               futureDate.setDate(startDate.getDate() + i);
               const futureDateString = futureDate.toISOString().split("T")[0];
               const futureKey = `${storageKeyBase}-${futureDateString}`;

               let existingItems = [];
               if (!replace) {
                  const stored = localStorage.getItem(futureKey);
                  existingItems = stored ? JSON.parse(stored) : [];
               }

               // Prevent duplicates if not replacing
               const itemsToAdd = tasksToApply
                  .filter(task => replace || !existingItems.some(existing => existing.content === task.content))
                  .map(task => ({
                     id: Date.now() + i * 1000 + Math.random(), // Unique ID
                     content: task.content,
                     is_completed: false,
                  }));

               const futureItems = replace ? itemsToAdd : [...existingItems, ...itemsToAdd];
               localStorage.setItem(futureKey, JSON.stringify(futureItems));
             }
             toast({ title: "Tasks applied locally!", description: "Tasks copied for the next 30 days." });
          } catch (error) {
              console.error("Error applying tasks locally:", error);
              toast({
                 title: "Error applying tasks locally",
                 description: error.message,
                 variant: "destructive",
              });
          } finally {
             setLoading(false);
          }
       };

      // Placeholder - Not applicable to local storage in the same way
       const removeFutureTasks = (currentDate) => {
          if (!currentDate) return;
          setLoading(true);
          toast({ title: "Removing future tasks locally...", description: "Clearing next 30 days." });
          try {
             const startDate = new Date(currentDate);
              for (let i = 1; i <= 30; i++) {
                  const futureDate = new Date(startDate);
                  futureDate.setDate(startDate.getDate() + i);
                  const futureDateString = futureDate.toISOString().split("T")[0];
                  const futureKey = `${storageKeyBase}-${futureDateString}`;
                  localStorage.removeItem(futureKey);
              }
              toast({ title: "Future tasks removed locally!" });
          } catch (error) {
             console.error("Error removing future tasks locally:", error);
             toast({
                title: "Error removing future tasks",
                description: error.message,
                variant: "destructive",
             });
          } finally {
             setLoading(false);
          }
       };


      return { items, loading, addItem, deleteItem, toggleItem, editItem, applyTasksToFuture, removeFutureTasks };
    };
  