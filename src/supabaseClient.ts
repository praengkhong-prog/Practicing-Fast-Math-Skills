// import { createClient } from '@supabase/supabase-js';

// // แนะนำให้เก็บค่าเหล่านี้ไว้ใน .env file
// const supabaseUrl = 'https://khnenudatuczlxslxzgq.supabase.co'; 
// const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtobmVudWRhdHVjemx4c2x4emdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NTkxOTgsImV4cCI6MjA3MjEzNTE5OH0.AhdqPNeNKfU5WrVwTgbBGD-dH1x0oKwqrR2aswyjGSk';
// const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtobmVudWRhdHVjemx4c2x4emdxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NjU1OTE5OCwiZXhwIjoyMDcyMTM1MTk4fQ.DIovf-a-KYhmND0e2iM87iXewXV4S_taZ2RU5joan6I'
// export const supabase = createClient(supabaseUrl, supabaseAnonKey);


import { createClient } from '@supabase/supabase-js';

// ค่า Config (ใช้ Anon Key เท่านั้น ห้ามใช้ Service Role Key เด็ดขาด)
const supabaseUrl = 'https://khnenudatuczlxslxzgq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtobmVudWRhdHVjemx4c2x4emdxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY1NTkxOTgsImV4cCI6MjA3MjEzNTE5OH0.AhdqPNeNKfU5WrVwTgbBGD-dH1x0oKwqrR2aswyjGSk';

// ✅ สร้าง client นอก Function (Global Scope) เพื่อให้มีแค่ Instance เดียวตลอดการใช้งาน
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // ให้จำการล็อกอินไว้
    autoRefreshToken: true, // ต่ออายุ Token อัตโนมัติ
    detectSessionInUrl: true, // จับลิงก์ยืนยัน Email
  }
});