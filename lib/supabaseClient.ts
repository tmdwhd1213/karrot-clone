import { createClient } from "@supabase/supabase-js";
import { SUPABASE_PUBLIC_KEY, SUPABASE_URL } from "./constants";

// const SUPABASE_URL = "https://nkyaktziufxaarjfjnoa.supabase.co";
// const SUPABASE_PUBLIC_KEY =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5reWFrdHppdWZ4YWFyamZqbm9hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ3ODMzMTEsImV4cCI6MjAzMDM1OTMxMX0.WC97hwlePJ8BPkbuh4gT7vkHGG6MkqRcVHIP5-Rub7A";

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLIC_KEY);