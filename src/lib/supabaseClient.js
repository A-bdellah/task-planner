
    import { createClient } from '@supabase/supabase-js';

    const supabaseUrl = 'https://sxrkwmxnrygtwppoiqfr.supabase.co';
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN4cmt3bXhucnlndHdwcG9pcWZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY0NjkwMjYsImV4cCI6MjA2MjA0NTAyNn0.Ky9_5TY4P2C7D3ibhpFX5iSStwNCOycDEHSNRyYDLm0';

    export const supabase = createClient(supabaseUrl, supabaseAnonKey);
  