import { supabase } from '@/integrations/supabase/client';

export class AdminService {
  static async getAllUsers() {
    try {
      // Get profiles first
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (profilesError) throw profilesError;

      // Get user roles separately
      const { data: userRoles, error: rolesError } = await supabase
        .from('user_roles')
        .select('user_id, role, created_at');

      if (rolesError) throw rolesError;

      // Combine the data
      const usersWithRoles = profiles?.map(profile => ({
        ...profile,
        user_roles: userRoles?.filter(role => role.user_id === profile.user_id) || []
      })) || [];

      return { success: true, data: usersWithRoles };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async updateUserRole(userId: string, newRole: 'admin' | 'user') {
    try {
      const { error } = await supabase
        .from('user_roles')
        .update({ role: newRole })
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async deleteUser(userId: string) {
    try {
      // Delete from profiles (user_roles will cascade)
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getSystemStats() {
    try {
      // Get user count
      const { count: userCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Get admin count
      const { count: adminCount } = await supabase
        .from('user_roles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'admin');

      // Get practice sessions count from Supabase
      const { count: practiceCount } = await supabase
        .from('practice_results')
        .select('*', { count: 'exact', head: true });

      // Get survey submissions count from Supabase
      const { count: surveyCount } = await supabase
        .from('survey_responses')
        .select('*', { count: 'exact', head: true });

      // Get recent practice sessions
      const { data: recentPractice } = await supabase
        .from('practice_results')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      // Get monthly user registrations for the last 6 months
      const { data: profiles } = await supabase
        .from('profiles')
        .select('created_at')
        .order('created_at', { ascending: true });

      // Process monthly data
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
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static processMonthlyUserData(profiles: any[]) {
    const monthlyMap = new Map<string, number>();
    const now = new Date();
    
    // Initialize last 6 months
    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyMap.set(key, 0);
    }

    // Count users per month
    profiles.forEach(profile => {
      const date = new Date(profile.created_at);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (monthlyMap.has(key)) {
        monthlyMap.set(key, (monthlyMap.get(key) || 0) + 1);
      }
    });

    // Convert to array for chart
    return Array.from(monthlyMap.entries()).map(([month, count]) => {
      const [year, monthNum] = month.split('-');
      const monthNames = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
      return {
        month: `${monthNames[parseInt(monthNum) - 1]} ${year}`,
        users: count
      };
    });
  }

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
          recentSessions: allResults.slice(0, 10)
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}