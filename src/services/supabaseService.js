
    import { supabase } from '@/lib/supabaseClient';

    export const fetchItemsFromSupabase = async (tableName, identifierColumn, identifier, userId) => {
      const { data, error } = await supabase
        .from(tableName)
        .select('id, content, is_completed')
        .eq('user_id', userId)
        .eq(identifierColumn, identifier)
        .order('created_at', { ascending: true });

      if (error) {
        console.error(`Error fetching ${tableName}:`, error);
        throw error;
      }
      return data || [];
    };

    export const addItemToSupabase = async (tableName, identifierColumn, identifier, userId, content) => {
      const newItem = {
        user_id: userId,
        content: content.trim(),
        [identifierColumn]: identifier,
        is_completed: false,
      };
      const { data, error } = await supabase
        .from(tableName)
        .insert(newItem)
        .select('id, content, is_completed')
        .single();

      if (error) {
        console.error(`Error adding ${tableName}:`, error);
        throw error;
      }
      return data;
    };

    export const deleteItemFromSupabase = async (tableName, itemId, userId) => {
      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', itemId)
        .eq('user_id', userId);

      if (error) {
        console.error(`Error deleting ${tableName}:`, error);
        throw error;
      }
    };

    export const toggleItemInSupabase = async (tableName, itemId, userId, currentState) => {
      const { error } = await supabase
        .from(tableName)
        .update({ is_completed: !currentState })
        .eq('id', itemId)
        .eq('user_id', userId);

      if (error) {
        console.error(`Error toggling ${tableName}:`, error);
        throw error;
      }
    };

    export const editItemInSupabase = async (tableName, itemId, userId, newContent) => {
      const { error } = await supabase
        .from(tableName)
        .update({ content: newContent.trim() })
        .eq('id', itemId)
        .eq('user_id', userId);

      if (error) {
        console.error(`Error editing ${tableName}:`, error);
        throw error;
      }
    };

    export const applyFutureTasksInSupabase = async (userId, currentDate, tasksToApply, replace) => {
        const startDate = new Date(currentDate);
        const dateStringsForUpsert = [];

        for (let i = 1; i <= 30; i++) {
           const futureDate = new Date(startDate);
           futureDate.setDate(startDate.getDate() + i);
           dateStringsForUpsert.push(futureDate.toISOString().split("T")[0]);
        }

        if (replace) {
           const { error: deleteError } = await supabase
             .from('tasks')
             .delete()
             .eq('user_id', userId)
             .in('task_date', dateStringsForUpsert);
           if (deleteError) throw new Error(`Failed to clear future tasks for replacement: ${deleteError.message}`);
        }

        const tasksToInsert = [];
        for (const futureDateString of dateStringsForUpsert) {
           tasksToApply.forEach(task => {
              tasksToInsert.push({
                user_id: userId,
                content: task.content,
                is_completed: false,
                task_date: futureDateString,
              });
           });
        }
        
        if (tasksToInsert.length > 0) {
          const options = replace ? {} : { onConflict: 'user_id,task_date,content' };
          const { error: insertError } = await supabase
            .from('tasks')
            .upsert(tasksToInsert, options);

          if (insertError) {
            console.error("Error upserting future tasks:", insertError);
            throw insertError;
          }
        }
    };

    export const removeFutureTasksFromSupabase = async (userId, currentDate) => {
       const startDate = new Date(currentDate);
       const dateStrings = [];
       for (let i = 1; i <= 30; i++) {
          const futureDate = new Date(startDate);
          futureDate.setDate(startDate.getDate() + i);
          dateStrings.push(futureDate.toISOString().split("T")[0]);
       }

       if (dateStrings.length === 0) return;

       const { error } = await supabase
          .from('tasks')
          .delete()
          .eq('user_id', userId)
          .in('task_date', dateStrings);

       if (error) {
         console.error("Error removing future tasks:", error);
         throw error;
       }
    };
  