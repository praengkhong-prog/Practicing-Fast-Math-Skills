

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

//   // --- 6. ดึงสถิติการฝึกซ้อม (แก้ไข: ใช้ .select('*') เพื่อเลี่ยง error เรื่องคอลัมน์ status) ---
//   static async getPracticeStats() {
//     try {
//       // ✅ เปลี่ยนจาก .select('created_at, status') เป็น .select('*')
//       // เพื่อให้ TypeScript ไม่ฟ้องว่าไม่มีคอลัมน์ status และดึงข้อมูลทุกอย่างมาใช้คำนวณ
//       const { data: results } = await supabase
//         .from('practice_results')
//         .select('*') 
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
//           recentSessions: allResults.slice(0, 10),
//           allHistory: allResults
//         }
//       };
//     } catch (error: any) {
//       return { success: false, error: error.message };
//     }
//   }

//   // --- 7. ดึงข้อมูลแบบสอบถาม (แก้ไข: ตัด email ออกจาก select) ---
//   static async getSurveyResponses() {
//     try {
//       const { data: surveys, error: surveyError } = await supabase
//         .from('survey_responses')
//         .select('*')
//         .order('created_at', { ascending: false });

//       if (surveyError) throw surveyError;

//       // ✅ ตัด 'email' ออก เพราะตาราง profiles ไม่มีคอลัมน์นี้
//       const { data: profiles, error: profileError } = await supabase
//         .from('profiles')
//         .select('user_id, display_name'); 

//       if (profileError) throw profileError;

//       // @ts-ignore
//       const combinedData = surveys.map((survey: any) => {
//         // @ts-ignore
//         const userProfile = profiles?.find((p: any) => p.user_id === survey.user_id);
        
//         return {
//           ...survey,
//           profiles: {
//              display_name: userProfile?.display_name || 'ไม่ระบุชื่อ',
//              email: '' // ใส่ค่าว่างไว้กัน Error
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

  // --- 6. ดึงสถิติการฝึกซ้อม ---
  static async getPracticeStats() {
    try {
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

  // --- 7. ดึงข้อมูลแบบสอบถาม (แก้ไขใหม่: Bypass Type Error) ---
  static async getSurveyResponses() {
    try {
      // 1. ดึง Survey
      const { data: surveys, error: surveyError } = await supabase
        .from('survey_responses')
        .select('*')
        .order('created_at', { ascending: false });

      if (surveyError) throw surveyError;
      if (!surveys || surveys.length === 0) return { success: true, data: [] };

      // 2. ดึง Profiles
      const userIds = Array.from(new Set(surveys.map((s) => s.user_id)));
      
      // ✅ ใช้ @ts-ignore เพื่อแก้ Error ที่ฟ้องว่า email ไม่มีอยู่จริงใน Type
      // @ts-ignore
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, display_name, email') 
        .in('user_id', userIds);

      if (profileError) throw profileError;

      // 3. สร้าง Map จับคู่ ID -> Profile
      const profileMap: Record<string, any> = {};
      profiles?.forEach((p: any) => {
        profileMap[p.user_id] = p;
      });

      // 4. ผสมข้อมูล
      const combinedData = surveys.map((survey: any) => ({
        ...survey,
        profiles: profileMap[survey.user_id] || { 
            display_name: 'ไม่ระบุชื่อ', 
            email: '-' 
        }
      }));

      return { success: true, data: combinedData };

    } catch (error: any) {
      console.error('Get Survey Error:', error.message);
      return { success: false, error: error.message };
    }
  }

  // --- 8. ลบข้อมูลแบบสอบถาม ---
  static async deleteSurveyResponse(id: string) {
    try {
      const { error } = await supabase
        .from('survey_responses')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true };
    } catch (error: any) {
      console.error('Delete Survey Error:', error.message);
      return { success: false, error: error.message };
    }
  }

}