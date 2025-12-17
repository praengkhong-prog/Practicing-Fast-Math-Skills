// // import { supabase } from '@/integrations/supabase/client';

// // export class AdminService {
// //   static async getAllUsers() {
// //     try {
// //       // Get profiles first
// //       const { data: profiles, error: profilesError } = await supabase
// //         .from('profiles')
// //         .select('*')
// //         .order('created_at', { ascending: false });

// //       if (profilesError) throw profilesError;

// //       // Get user roles separately
// //       const { data: userRoles, error: rolesError } = await supabase
// //         .from('user_roles')
// //         .select('user_id, role, created_at');

// //       if (rolesError) throw rolesError;

// //       // Combine the data
// //       const usersWithRoles = profiles?.map(profile => ({
// //         ...profile,
// //         user_roles: userRoles?.filter(role => role.user_id === profile.user_id) || []
// //       })) || [];

// //       return { success: true, data: usersWithRoles };
// //     } catch (error) {
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   static async updateUserRole(userId: string, newRole: 'admin' | 'user') {
// //     try {
// //       const { error } = await supabase
// //         .from('user_roles')
// //         .update({ role: newRole })
// //         .eq('user_id', userId);

// //       if (error) throw error;
// //       return { success: true };
// //     } catch (error) {
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   static async deleteUser(userId: string) {
// //     try {
// //       const { data, error } = await supabase.functions.invoke('delete-user', {
// //         body: { userId }
// //       });

// //       if (error) {
// //         console.error('Edge function error:', error);
// //         throw error;
// //       }

// //       if (!data?.success) {
// //         throw new Error(data?.error || 'Failed to delete user');
// //       }

// //       return { success: true };
// //     } catch (error) {
// //       console.error('Delete user error:', error);
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   static async getSystemStats() {
// //     try {
// //       // Get user count
// //       const { count: userCount } = await supabase
// //         .from('profiles')
// //         .select('*', { count: 'exact', head: true });

// //       // Get admin count
// //       const { count: adminCount } = await supabase
// //         .from('user_roles')
// //         .select('*', { count: 'exact', head: true })
// //         .eq('role', 'admin');

// //       // Get practice sessions count from Supabase
// //       const { count: practiceCount } = await supabase
// //         .from('practice_results')
// //         .select('*', { count: 'exact', head: true });

// //       // Get survey submissions count from Supabase
// //       const { count: surveyCount } = await supabase
// //         .from('survey_responses')
// //         .select('*', { count: 'exact', head: true });

// //       // Get recent practice sessions
// //       const { data: recentPractice } = await supabase
// //         .from('practice_results')
// //         .select('*')
// //         .order('created_at', { ascending: false })
// //         .limit(5);

// //       // Get monthly user registrations for the last 6 months
// //       const { data: profiles } = await supabase
// //         .from('profiles')
// //         .select('created_at')
// //         .order('created_at', { ascending: true });

// //       // Process monthly data
// //       const monthlyData = this.processMonthlyUserData(profiles || []);

// //       return {
// //         success: true,
// //         data: {
// //           totalUsers: userCount || 0,
// //           totalAdmins: adminCount || 0,
// //           practiceSessionsCount: practiceCount || 0,
// //           surveySubmissions: surveyCount || 0,
// //           recentActivity: recentPractice || [],
// //           monthlyUsers: monthlyData
// //         }
// //       };
// //     } catch (error) {
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   static processMonthlyUserData(profiles: any[]) {
// //     const monthlyMap = new Map<string, number>();
// //     const now = new Date();
    
// //     // Initialize last 6 months
// //     for (let i = 5; i >= 0; i--) {
// //       const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
// //       const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
// //       monthlyMap.set(key, 0);
// //     }

// //     // Count users per month
// //     profiles.forEach(profile => {
// //       const date = new Date(profile.created_at);
// //       const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
// //       if (monthlyMap.has(key)) {
// //         monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1);
// //       }
// //     });

// //     // Convert to array for chart
// //     return Array.from(monthlyMap.entries()).map(([month, count]) => {
// //       const [year, monthNum] = month.split('-');
// //       const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
// //       return {
// //         month: `${monthNames[parseInt(monthNum) - 1]} ${year}`,
// //         users: count
// //       };
// //     });
// //   }

// //   static async getPracticeStats() {
// //     try {
// //       const { data: results } = await supabase
// //         .from('practice_results')
// //         .select('*')
// //         .order('created_at', { ascending: false });
      
// //       const allResults = results || [];
      
// //       const modeStats = allResults.reduce((acc: any, result: any) => {
// //         const mode = result.mode || 'unknown';
// //         if (!acc[mode]) {
// //           acc[mode] = { count: 0, totalScore: 0, totalTime: 0 };
// //         }
// //         acc[mode].count++;
// //         acc[mode].totalScore += result.score || 0;
// //         acc[mode].totalTime += result.avg_time_ms || 0;
// //         return acc;
// //       }, {});

// //       return {
// //         success: true,
// //         data: {
// //           totalSessions: allResults.length,
// //           modeStats,
// //           recentSessions: allResults.slice(0, 10)
// //         }
// //       };
// //     } catch (error) {
// //       return { success: false, error: error.message };
// //     }
// //   }
// // }
// // // services/AdminService.ts



// //   // แก้ไขฟังก์ชันนี้
// //   updateUserPassword: async (userId: string, newPassword: string) => {
// //     try {
// //       // ยิง Request ไปหา API ของเราเอง (ไฟล์ในข้อ 2)
// //       const response = await fetch('/api/admin/reset-password', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ userId, newPassword }),
// //       });

// //       const result = await response.json();

// //       if (!result.success) {
// //         return { success: false, message: result.message };
// //       }

// //       return { success: true };
// //     } catch (error: any) {
// //       return { success: false, message: error.message };
// //     }
// //   }

// // // services/AdminService.ts




// // import { supabase } from '@/integrations/supabase/client';

// // export class AdminService {
// //   static async getAllUsers() {
// //     // ... (โค้ดเดิมของคุณ)
// //     try {
// //       const { data: profiles, error: profilesError } = await supabase
// //         .from('profiles')
// //         .select('*')
// //         .order('created_at', { ascending: false });

// //       if (profilesError) throw profilesError;

// //       const { data: userRoles, error: rolesError } = await supabase
// //         .from('user_roles')
// //         .select('user_id, role, created_at');

// //       if (rolesError) throw rolesError;

// //       const usersWithRoles = profiles?.map(profile => ({
// //         ...profile,
// //         user_roles: userRoles?.filter(role => role.user_id === profile.user_id) || []
// //       })) || [];

// //       return { success: true, data: usersWithRoles };
// //     } catch (error: any) {
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   static async updateUserRole(userId: string, newRole: 'admin' | 'user') {
// //     // ... (โค้ดเดิมของคุณ)
// //     try {
// //       const { error } = await supabase
// //         .from('user_roles')
// //         .update({ role: newRole })
// //         .eq('user_id', userId);

// //       if (error) throw error;
// //       return { success: true };
// //     } catch (error: any) {
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   static async deleteUser(userId: string) {
// //     // ... (โค้ดเดิมของคุณ)
// //     try {
// //       const { data, error } = await supabase.functions.invoke('delete-user', {
// //         body: { userId }
// //       });

// //       if (error) {
// //         console.error('Edge function error:', error);
// //         throw error;
// //       }

// //       if (!data?.success) {
// //         throw new Error(data?.error || 'Failed to delete user');
// //       }

// //       return { success: true };
// //     } catch (error: any) {
// //       console.error('Delete user error:', error);
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   static async getSystemStats() {
// //     // ... (โค้ดเดิมของคุณ)
// //     try {
// //       const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
// //       const { count: adminCount } = await supabase.from('user_roles').select('*', { count: 'exact', head: true }).eq('role', 'admin');
// //       const { count: practiceCount } = await supabase.from('practice_results').select('*', { count: 'exact', head: true });
// //       const { count: surveyCount } = await supabase.from('survey_responses').select('*', { count: 'exact', head: true });
      
// //       const { data: recentPractice } = await supabase
// //         .from('practice_results')
// //         .select('*')
// //         .order('created_at', { ascending: false })
// //         .limit(5);

// //       const { data: profiles } = await supabase
// //         .from('profiles')
// //         .select('created_at')
// //         .order('created_at', { ascending: true });

// //       const monthlyData = this.processMonthlyUserData(profiles || []);

// //       return {
// //         success: true,
// //         data: {
// //           totalUsers: userCount || 0,
// //           totalAdmins: adminCount || 0,
// //           practiceSessionsCount: practiceCount || 0,
// //           surveySubmissions: surveyCount || 0,
// //           recentActivity: recentPractice || [],
// //           monthlyUsers: monthlyData
// //         }
// //       };
// //     } catch (error: any) {
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   static processMonthlyUserData(profiles: any[]) {
// //     // ... (โค้ดเดิมของคุณ)
// //     const monthlyMap = new Map<string, number>();
// //     const now = new Date();
    
// //     for (let i = 5; i >= 0; i--) {
// //       const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
// //       const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
// //       monthlyMap.set(key, 0);
// //     }

// //     profiles.forEach(profile => {
// //       const date = new Date(profile.created_at);
// //       const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
// //       if (monthlyMap.has(key)) {
// //         monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1);
// //       }
// //     });

// //     return Array.from(monthlyMap.entries()).map(([month, count]) => {
// //       const [year, monthNum] = month.split('-');
// //       const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
// //       return {
// //         month: `${monthNames[parseInt(monthNum) - 1]} ${year}`,
// //         users: count
// //       };
// //     });
// //   }

// //   static async getPracticeStats() {
// //     // ... (โค้ดเดิมของคุณ)
// //     try {
// //       const { data: results } = await supabase
// //         .from('practice_results')
// //         .select('*')
// //         .order('created_at', { ascending: false });
      
// //       const allResults = results || [];
      
// //       const modeStats = allResults.reduce((acc: any, result: any) => {
// //         const mode = result.mode || 'unknown';
// //         if (!acc[mode]) {
// //           acc[mode] = { count: 0, totalScore: 0, totalTime: 0 };
// //         }
// //         acc[mode].count++;
// //         acc[mode].totalScore += result.score || 0;
// //         acc[mode].totalTime += result.avg_time_ms || 0;
// //         return acc;
// //       }, {});

// //       return {
// //         success: true,
// //         data: {
// //           totalSessions: allResults.length,
// //           modeStats,
// //           recentSessions: allResults.slice(0, 10)
// //         }
// //       };
// //     } catch (error: any) {
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   // --- เพิ่มฟังก์ชันใหม่ตรงนี้ (ภายใน Class) ---
// //   static async updateUserPassword(userId: string, newPassword: string) {
// //     try {
// //       const response = await fetch('/api/admin/reset-password', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify({ userId, newPassword }),
// //       });

// //       const result = await response.json();

// //       if (!result.success) {
// //         // ใช้ error ให้ตรงกับ return type ของฟังก์ชันอื่นใน class นี้
// //         return { success: false, error: result.message }; 
// //       }

// //       return { success: true };
// //     } catch (error: any) {
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   // ใน AdminService.ts
// // static async getSurveyResponses() {
// //   try {
// //     // ลองใช้ profiles!inner หรือ profiles เฉยๆ แทน profiles:user_id
// //     // ถ้า Foreign Key ตั้งชื่อถูกต้อง Supabase จะรู้เอง
// //     const { data, error } = await supabase
// //       .from('survey_responses')
// //       .select(`
// //         *,
// //         profiles (
// //           display_name,
// //           email
// //         )
// //       `)
// //       .order('created_at', { ascending: false });

// //     if (error) throw error;
// //     return { success: true, data };
// //   } catch (error: any) {
// //     return { success: false, error: error.message };
// //   }
// // }


// // } // ปิด Class ตรงนี้


// // import { supabase } from '@/integrations/supabase/client';

// // export class AdminService {

// //   // --- 1. ดึงข้อมูล User ทั้งหมด (ใช้แบบ Join ตาราง มีประสิทธิภาพกว่า) ---
// //   static async getAllUsers() {
// //     try {
// //       // ดึง profiles และ join กับ user_roles ในคำสั่งเดียว
// //       const { data, error } = await supabase
// //         .from('profiles')
// //         .select(`
// //           *,
// //           user_roles (
// //             role,
// //             created_at
// //           )
// //         `)
// //         .order('created_at', { ascending: false });

// //       if (error) throw error;
      
// //       // แปลงข้อมูลเล็กน้อยเพื่อให้ใช้ง่ายขึ้น (ถ้าจำเป็น)
// //       // แต่ปกติ data ที่ได้จาก join จะอยู่ในรูป profile.user_roles (array)
// //       return { success: true, data };
// //     } catch (error: any) {
// //       console.error("Get Users Error:", error.message);
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   // --- 2. อัปเดต Role ---
// //   static async updateUserRole(userId: string, newRole: 'admin' | 'user') {
// //     try {
// //       // วิธีที่ปลอดภัย: ลบ Role เดิมก่อน แล้วค่อยใส่ Role ใหม่ 
// //       // (ป้องกันกรณี User ยังไม่มี Role หรือมี Role ซ้ำซ้อน)
// //       await supabase.from('user_roles').delete().eq('user_id', userId);

// //       const { error } = await supabase.from('user_roles').insert([
// //         { user_id: userId, role: newRole }
// //       ]);

// //       if (error) throw error;
// //       return { success: true };
// //     } catch (error: any) {
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   // --- 3. ลบ User ---
// //   static async deleteUser(userId: string) {
// //     try {
// //       // หมายเหตุ: การลบจาก profiles เป็นแค่การลบข้อมูลส่วนตัว
// //       // User จะยังล็อกอินได้อยู่ (เพราะยังอยู่ใน Supabase Auth)
// //       // ถ้าต้องการลบถาวรต้องใช้ Edge Function (supabase.functions.invoke)
      
// //       const { error } = await supabase.from('profiles').delete().eq('user_id', userId);
      
// //       if (error) throw error;
// //       return { success: true };
// //     } catch (error: any) {
// //       console.error('Delete user error:', error);
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   // --- 4. เปลี่ยนรหัสผ่าน ---
// //   static async updateUserPassword(userId: string, newPassword: string) {
// //     try {
// //       // แจ้งเตือน: Supabase Client เปลี่ยนรหัสให้คนอื่นไม่ได้โดยตรง
// //       console.warn("Client-side cannot update other user's password directly.");
// //       return { 
// //         success: false, 
// //         error: "ระบบยังไม่รองรับการเปลี่ยนรหัสผ่านให้ผู้อื่น (ต้องตั้งค่า Server Function เพิ่มเติม)" 
// //       };
// //     } catch (error: any) {
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   // --- 5. ดึงสถิติระบบ ---
// //   static async getSystemStats() {
// //     try {
// //       const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
// //       // นับเฉพาะคนที่เป็น admin
// //       const { count: adminCount } = await supabase.from('user_roles').select('*', { count: 'exact', head: true }).eq('role', 'admin');
// //       const { count: practiceCount } = await supabase.from('practice_results').select('*', { count: 'exact', head: true });
// //       const { count: surveyCount } = await supabase.from('survey_responses').select('*', { count: 'exact', head: true });
      
// //       const { data: recentPractice } = await supabase
// //         .from('practice_results')
// //         .select('*')
// //         .order('created_at', { ascending: false })
// //         .limit(5);

// //       const { data: profiles } = await supabase
// //         .from('profiles')
// //         .select('created_at')
// //         .order('created_at', { ascending: true });

// //       const monthlyData = this.processMonthlyUserData(profiles || []);

// //       return {
// //         success: true,
// //         data: {
// //           totalUsers: userCount || 0,
// //           totalAdmins: adminCount || 0,
// //           practiceSessionsCount: practiceCount || 0,
// //           surveySubmissions: surveyCount || 0,
// //           recentActivity: recentPractice || [],
// //           monthlyUsers: monthlyData
// //         }
// //       };
// //     } catch (error: any) {
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   // Helper function สำหรับกราฟ
// //   static processMonthlyUserData(profiles: any[]) {
// //     const monthlyMap = new Map<string, number>();
// //     const now = new Date();
    
// //     for (let i = 5; i >= 0; i--) {
// //       const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
// //       const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
// //       monthlyMap.set(key, 0);
// //     }

// //     profiles.forEach(profile => {
// //       const date = new Date(profile.created_at);
// //       const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
// //       if (monthlyMap.has(key)) {
// //         monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1);
// //       }
// //     });

// //     return Array.from(monthlyMap.entries()).map(([month, count]) => {
// //       const [year, monthNum] = month.split('-');
// //       const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
// //       return {
// //         month: `${monthNames[parseInt(monthNum) - 1]} ${year}`,
// //         users: count
// //       };
// //     });
// //   }

// //   // --- 6. ดึงสถิติการฝึกซ้อม ---
// //   static async getPracticeStats() {
// //     try {
// //       const { data: results } = await supabase
// //         .from('practice_results')
// //         .select('*')
// //         .order('created_at', { ascending: false });
      
// //       const allResults = results || [];
      
// //       const modeStats = allResults.reduce((acc: any, result: any) => {
// //         const mode = result.mode || 'unknown';
// //         if (!acc[mode]) {
// //           acc[mode] = { count: 0, totalScore: 0, totalTime: 0 };
// //         }
// //         acc[mode].count++;
// //         acc[mode].totalScore += result.score || 0;
// //         acc[mode].totalTime += result.avg_time_ms || 0;
// //         return acc;
// //       }, {});

// //       return {
// //         success: true,
// //         data: {
// //           totalSessions: allResults.length,
// //           modeStats,
// //           recentSessions: allResults.slice(0, 10)
// //         }
// //       };
// //     } catch (error: any) {
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   // --- 7. ดึงข้อมูลแบบสอบถาม ---
// //   static async getSurveyResponses() {
// //     try {
// //       const { data, error } = await supabase
// //         .from('survey_responses')
// //         .select(`
// //           *,
// //           profiles (
// //             display_name,
// //             email
// //           )
// //         `)
// //         .order('created_at', { ascending: false });

// //       if (error) throw error;
// //       return { success: true, data };
// //     } catch (error: any) {
// //       return { success: false, error: error.message };
// //     }
// //   }

// // } // End Class
  


// // import { supabase } from '@/integrations/supabase/client';

// // export class AdminService {

// //   // --- 1. ดึงข้อมูล User ทั้งหมด (แก้ไข: ใช้แบบ Manual Merge เพื่อแก้ปัญหา Relation Not Found) ---
// //   static async getAllUsers() {
// //     try {
// //       // 1. ดึงข้อมูล Profiles ทั้งหมดมาก่อน
// //       const { data: profiles, error: profileError } = await supabase
// //         .from('profiles')
// //         .select('*')
// //         .order('created_at', { ascending: false });

// //       if (profileError) throw profileError;

// //       // 2. ดึงข้อมูล Roles ทั้งหมดมา
// //       const { data: roles, error: roleError } = await supabase
// //         .from('user_roles')
// //         .select('*');
        
// //       if (roleError) throw roleError;

// //       // 3. เอา Profiles กับ Roles มารวมร่างกันด้วย JavaScript
// //       // (วิธีนี้ไม่ง้อ Foreign Key ใน Database)
// //       const combinedData = profiles.map((profile) => {
// //         // หา role ที่ user_id ตรงกับ profile นี้
// //         const userRole = roles?.find(r => r.user_id === profile.user_id);
        
// //         return {
// //           ...profile,
// //           user_roles: userRole ? [userRole] : [] // ใส่เป็น Array เพื่อให้ตรงกับโครงสร้างเดิม
// //         };
// //       });

// //       return { success: true, data: combinedData };

// //     } catch (error: any) {
// //       console.error("Get Users Error:", error.message);
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   // --- 2. อัปเดต Role ---
// //   static async updateUserRole(userId: string, newRole: 'admin' | 'user') {
// //     try {
// //       // ลบ Role เดิมก่อน แล้วค่อยใส่ Role ใหม่ 
// //       await supabase.from('user_roles').delete().eq('user_id', userId);

// //       const { error } = await supabase.from('user_roles').insert([
// //         { user_id: userId, role: newRole }
// //       ]);

// //       if (error) throw error;
// //       return { success: true };
// //     } catch (error: any) {
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   // --- 3. ลบ User ---
// //   static async deleteUser(userId: string) {
// //     try {
// //       const { error } = await supabase.from('profiles').delete().eq('user_id', userId);
      
// //       if (error) throw error;
// //       return { success: true };
// //     } catch (error: any) {
// //       console.error('Delete user error:', error);
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   // --- 4. เปลี่ยนรหัสผ่าน ---
// //   static async updateUserPassword(userId: string, newPassword: string) {
// //     try {
// //       console.warn("Client-side cannot update other user's password directly.");
// //       return { 
// //         success: false, 
// //         error: "ระบบยังไม่รองรับการเปลี่ยนรหัสผ่านให้ผู้อื่น (ต้องตั้งค่า Server Function เพิ่มเติม)" 
// //       };
// //     } catch (error: any) {
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   // --- 5. ดึงสถิติระบบ ---
// //   static async getSystemStats() {
// //     try {
// //       const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
// //       const { count: adminCount } = await supabase.from('user_roles').select('*', { count: 'exact', head: true }).eq('role', 'admin');
// //       const { count: practiceCount } = await supabase.from('practice_results').select('*', { count: 'exact', head: true });
// //       const { count: surveyCount } = await supabase.from('survey_responses').select('*', { count: 'exact', head: true });
      
// //       const { data: recentPractice } = await supabase
// //         .from('practice_results')
// //         .select('*')
// //         .order('created_at', { ascending: false })
// //         .limit(5);

// //       const { data: profiles } = await supabase
// //         .from('profiles')
// //         .select('created_at')
// //         .order('created_at', { ascending: true });

// //       const monthlyData = this.processMonthlyUserData(profiles || []);

// //       return {
// //         success: true,
// //         data: {
// //           totalUsers: userCount || 0,
// //           totalAdmins: adminCount || 0,
// //           practiceSessionsCount: practiceCount || 0,
// //           surveySubmissions: surveyCount || 0,
// //           recentActivity: recentPractice || [],
// //           monthlyUsers: monthlyData
// //         }
// //       };
// //     } catch (error: any) {
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   // Helper function สำหรับกราฟ
// //   static processMonthlyUserData(profiles: any[]) {
// //     const monthlyMap = new Map<string, number>();
// //     const now = new Date();
    
// //     for (let i = 5; i >= 0; i--) {
// //       const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
// //       const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
// //       monthlyMap.set(key, 0);
// //     }

// //     profiles.forEach(profile => {
// //       const date = new Date(profile.created_at);
// //       const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
// //       if (monthlyMap.has(key)) {
// //         monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1);
// //       }
// //     });

// //     return Array.from(monthlyMap.entries()).map(([month, count]) => {
// //       const [year, monthNum] = month.split('-');
// //       const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
// //       return {
// //         month: `${monthNames[parseInt(monthNum) - 1]} ${year}`,
// //         users: count
// //       };
// //     });
// //   }

// //   // --- 6. ดึงสถิติการฝึกซ้อม ---
// //   static async getPracticeStats() {
// //     try {
// //       const { data: results } = await supabase
// //         .from('practice_results')
// //         .select('*')
// //         .order('created_at', { ascending: false });
      
// //       const allResults = results || [];
      
// //       const modeStats = allResults.reduce((acc: any, result: any) => {
// //         const mode = result.mode || 'unknown';
// //         if (!acc[mode]) {
// //           acc[mode] = { count: 0, totalScore: 0, totalTime: 0 };
// //         }
// //         acc[mode].count++;
// //         acc[mode].totalScore += result.score || 0;
// //         acc[mode].totalTime += result.avg_time_ms || 0;
// //         return acc;
// //       }, {});

// //       return {
// //         success: true,
// //         data: {
// //           totalSessions: allResults.length,
// //           modeStats,
// //           recentSessions: allResults.slice(0, 10)
// //         }
// //       };
// //     } catch (error: any) {
// //       return { success: false, error: error.message };
// //     }
// //   }

// //   // --- 7. ดึงข้อมูลแบบสอบถาม ---
// //   static async getSurveyResponses() {
// //     try {
// //       // หมายเหตุ: ตรงนี้ถ้า error อีก อาจจะต้องใช้วิธี Manual Merge เหมือน getAllUsers
// //       // แต่ปกติ survey_responses มักจะมี FK เชื่อม profiles อยู่แล้ว ลองดูก่อนครับ
// //       const { data, error } = await supabase
// //         .from('survey_responses')
// //         .select(`
// //           *,
// //           profiles (
// //             display_name,
// //             email
// //           )
// //         `)
// //         .order('created_at', { ascending: false });

// //       if (error) throw error;
// //       return { success: true, data };
// //     } catch (error: any) {
// //       return { success: false, error: error.message };
// //     }
// //   }

// // } // End Class




// import { supabase } from '@/integrations/supabase/client';

// export class AdminService {

//   // --- 1. ดึงข้อมูล User ทั้งหมด ---
//   static async getAllUsers() {
//     try {
//       const { data: profiles, error: profileError } = await supabase
//         .from('profiles')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (profileError) throw profileError;

//       const { data: roles, error: roleError } = await supabase
//         .from('user_roles')
//         .select('*');
        
//       if (roleError) throw roleError;

//       const combinedData = profiles.map((profile) => {
//         const userRole = roles?.find(r => r.user_id === profile.user_id);
        
//         return {
//           ...profile,
//           user_roles: userRole ? [userRole] : [] 
//         };
//       });

//       return { success: true, data: combinedData };

//     } catch (error: any) {
//       console.error("Get Users Error:", error.message);
//       return { success: false, error: error.message };
//     }
//   }

//   // --- 2. อัปเดต Role ---
//   static async updateUserRole(userId: string, newRole: 'admin' | 'user') {
//     try {
//       await supabase.from('user_roles').delete().eq('user_id', userId);

//       const { error } = await supabase.from('user_roles').insert([
//         { user_id: userId, role: newRole }
//       ]);

//       if (error) throw error;
//       return { success: true };
//     } catch (error: any) {
//       return { success: false, error: error.message };
//     }
//   }

//   // --- 3. ลบ User ---
//   static async deleteUser(userId: string) {
//     try {
//       const { error } = await supabase.from('profiles').delete().eq('user_id', userId);
      
//       if (error) throw error;
//       return { success: true };
//     } catch (error: any) {
//       return { success: false, error: error.message };
//     }
//   }

//   // --- 4. เปลี่ยนรหัสผ่าน ---
//   static async updateUserPassword(userId: string, newPassword: string) {
//     try {
//       console.warn("Client-side cannot update other user's password directly.");
//       return { 
//         success: false, 
//         error: "ระบบยังไม่รองรับการเปลี่ยนรหัสผ่านให้ผู้อื่น (ต้องตั้งค่า Server Function)" 
//       };
//     } catch (error: any) {
//       return { success: false, error: error.message };
//     }
//   }

//   // --- 5. ดึงสถิติระบบ ---
//   static async getSystemStats() {
//     try {
//       const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
//       const { count: adminCount } = await supabase.from('user_roles').select('*', { count: 'exact', head: true }).eq('role', 'admin');
//       const { count: practiceCount } = await supabase.from('practice_results').select('*', { count: 'exact', head: true });
//       const { count: surveyCount } = await supabase.from('survey_responses').select('*', { count: 'exact', head: true });
      
//       const { data: recentPractice } = await supabase
//         .from('practice_results')
//         .select('*')
//         .order('created_at', { ascending: false })
//         .limit(5);

//       const { data: profiles } = await supabase
//         .from('profiles')
//         .select('created_at')
//         .order('created_at', { ascending: true });

//       const monthlyData = this.processMonthlyUserData(profiles || []);

//       return {
//         success: true,
//         data: {
//           totalUsers: userCount || 0,
//           totalAdmins: adminCount || 0,
//           practiceSessionsCount: practiceCount || 0,
//           surveySubmissions: surveyCount || 0,
//           recentActivity: recentPractice || [],
//           monthlyUsers: monthlyData
//         }
//       };
//     } catch (error: any) {
//       return { success: false, error: error.message };
//     }
//   }

//   static processMonthlyUserData(profiles: any[]) {
//     const monthlyMap = new Map<string, number>();
//     const now = new Date();
    
//     for (let i = 5; i >= 0; i--) {
//       const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
//       const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
//       monthlyMap.set(key, 0);
//     }

//     profiles.forEach(profile => {
//       const date = new Date(profile.created_at);
//       const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
//       if (monthlyMap.has(key)) {
//         monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1);
//       }
//     });

//     return Array.from(monthlyMap.entries()).map(([month, count]) => {
//       const [year, monthNum] = month.split('-');
//       const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
//       return {
//         month: `${monthNames[parseInt(monthNum) - 1]} ${year}`,
//         users: count
//       };
//     });
//   }

//   // --- 6. ดึงสถิติการฝึกซ้อม ---
//   static async getPracticeStats() {
//     try {
//       const { data: results } = await supabase
//         .from('practice_results')
//         .select('created_at, status')
//         .order('created_at', { ascending: false });
      
//       const allResults = results || [];
      
//       const modeStats = allResults.reduce((acc: any, result: any) => {
//         const mode = result.mode || 'unknown';
//         if (!acc[mode]) {
//           acc[mode] = { count: 0, totalScore: 0, totalTime: 0 };
//         }
//         acc[mode].count++;
//         acc[mode].totalScore += result.score || 0;
//         acc[mode].totalTime += result.avg_time_ms || 0;
//         return acc;
//       }, {});

//       return {
//         success: true,
//         data: {
//           totalSessions: allResults.length,
//           modeStats,
//           recentSessions: allResults.slice(0, 10)
//         }
//       };
//     } catch (error: any) {
//       return { success: false, error: error.message };
//     }
//   }

//   // --- 7. ดึงข้อมูลแบบสอบถาม (แก้ไข: ลบ email ออกจาก select เพื่อแก้ Error) ---
//   static async getSurveyResponses() {
//     try {
//       // 1. ดึงข้อมูล Survey
//       const { data: surveys, error: surveyError } = await supabase
//         .from('survey_responses')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (surveyError) throw surveyError;

//       // 2. ดึงข้อมูล Profiles (✅ เอา email ออกจากคำสั่ง select เพราะตารางจริงไม่มีคอลัมน์นี้)
//       const { data: profiles, error: profileError } = await supabase
//         .from('profiles')
//         .select('user_id, display_name'); 

//       if (profileError) throw profileError;

//       // 3. จับคู่ข้อมูล
//       // @ts-ignore: Bypass type check if survey types mismatch
//       const combinedData = surveys.map((survey: any) => {
//         // หา Profile ที่ user_id ตรงกัน
//         // @ts-ignore
//         const userProfile = profiles?.find((p: any) => p.user_id === survey.user_id);
        
//         return {
//           ...survey,
//           profiles: {
//              display_name: userProfile?.display_name || 'ไม่ระบุชื่อ',
//              email: '' // ⚠️ ไม่สามารถดึงอีเมลได้เพราะตาราง profiles ไม่มีคอลัมน์นี้
//           }
//         };
//       });

//       return { success: true, data: combinedData };

//     } catch (error: any) {
//       console.error('Get Survey Error:', error.message);
//       return { success: false, error: error.message };
//     }
//   }

// }


import { supabase } from '@/integrations/supabase/client';

export class AdminService {

  // --- 1. ดึงข้อมูล User ทั้งหมด ---
  static async getAllUsers() {
    try {
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profileError) throw profileError;

      const { data: roles, error: roleError } = await supabase
        .from('user_roles')
        .select('*');
        
      if (roleError) throw roleError;

      const combinedData = profiles.map((profile) => {
        const userRole = roles?.find(r => r.user_id === profile.user_id);
        
        return {
          ...profile,
          user_roles: userRole ? [userRole] : [] 
        };
      });

      return { success: true, data: combinedData };

    } catch (error: any) {
      console.error("Get Users Error:", error.message);
      return { success: false, error: error.message };
    }
  }

  // --- 2. อัปเดต Role ---
  static async updateUserRole(userId: string, newRole: 'admin' | 'user') {
    try {
      await supabase.from('user_roles').delete().eq('user_id', userId);

      const { error } = await supabase.from('user_roles').insert([
        { user_id: userId, role: newRole }
      ]);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // --- 3. ลบ User ---
  static async deleteUser(userId: string) {
    try {
      const { error } = await supabase.from('profiles').delete().eq('user_id', userId);
      
      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // --- 4. เปลี่ยนรหัสผ่าน ---
  static async updateUserPassword(userId: string, newPassword: string) {
    try {
      console.warn("Client-side cannot update other user's password directly.");
      return { 
        success: false, 
        error: "ระบบยังไม่รองรับการเปลี่ยนรหัสผ่านให้ผู้อื่น (ต้องตั้งค่า Server Function)" 
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // --- 5. ดึงสถิติระบบ ---
  static async getSystemStats() {
    try {
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      const { count: adminCount } = await supabase.from('user_roles').select('*', { count: 'exact', head: true }).eq('role', 'admin');
      const { count: practiceCount } = await supabase.from('practice_results').select('*', { count: 'exact', head: true });
      const { count: surveyCount } = await supabase.from('survey_responses').select('*', { count: 'exact', head: true });
      
      const { data: recentPractice } = await supabase
        .from('practice_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      const { data: profiles } = await supabase
        .from('profiles')
        .select('created_at')
        .order('created_at', { ascending: true });

      const monthlyData = this.processMonthlyUserData(profiles || []);

      return {
        success: true,
        data: {
          totalUsers: userCount || 0,
          totalAdmins: adminCount || 0,
          practiceSessionsCount: practiceCount || 0,
          surveySubmissions: surveyCount || 0,
          recentActivity: recentPractice || [],
          monthlyUsers: monthlyData
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  static processMonthlyUserData(profiles: any[]) {
    const monthlyMap = new Map<string, number>();
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap.set(key, 0);
    }

    profiles.forEach(profile => {
      const date = new Date(profile.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyMap.has(key)) {
        monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1);
      }
    });

    return Array.from(monthlyMap.entries()).map(([month, count]) => {
      const [year, monthNum] = month.split('-');
      const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
      return {
        month: `${monthNames[parseInt(monthNum) - 1]} ${year}`,
        users: count
      };
    });
  }

  // --- 6. ดึงสถิติการฝึกซ้อม (แก้ไข: ใช้ .select('*') เพื่อเลี่ยง error เรื่องคอลัมน์ status) ---
  static async getPracticeStats() {
    try {
      // ✅ เปลี่ยนจาก .select('created_at, status') เป็น .select('*')
      // เพื่อให้ TypeScript ไม่ฟ้องว่าไม่มีคอลัมน์ status และดึงข้อมูลทุกอย่างมาใช้คำนวณ
      const { data: results } = await supabase
        .from('practice_results')
        .select('*') 
        .order('created_at', { ascending: false });
      
      const allResults = results || [];
      
      const modeStats = allResults.reduce((acc: any, result: any) => {
        const mode = result.mode || 'unknown';
        if (!acc[mode]) {
          acc[mode] = { count: 0, totalScore: 0, totalTime: 0 };
        }
        acc[mode].count++;
        acc[mode].totalScore += result.score || 0;
        acc[mode].totalTime += result.avg_time_ms || 0;
        return acc;
      }, {});

      return {
        success: true,
        data: {
          totalSessions: allResults.length,
          modeStats,
          recentSessions: allResults.slice(0, 10),
          allHistory: allResults
        }
      };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }

  // --- 7. ดึงข้อมูลแบบสอบถาม (แก้ไข: ตัด email ออกจาก select) ---
  static async getSurveyResponses() {
    try {
      const { data: surveys, error: surveyError } = await supabase
        .from('survey_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (surveyError) throw surveyError;

      // ✅ ตัด 'email' ออก เพราะตาราง profiles ไม่มีคอลัมน์นี้
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, display_name'); 

      if (profileError) throw profileError;

      // @ts-ignore
      const combinedData = surveys.map((survey: any) => {
        // @ts-ignore
        const userProfile = profiles?.find((p: any) => p.user_id === survey.user_id);
        
        return {
          ...survey,
          profiles: {
             display_name: userProfile?.display_name || 'ไม่ระบุชื่อ',
             email: '' // ใส่ค่าว่างไว้กัน Error
          }
        };
      });

      return { success: true, data: combinedData };

    } catch (error: any) {
      console.error('Get Survey Error:', error.message);
      return { success: false, error: error.message };
    }
  }

}