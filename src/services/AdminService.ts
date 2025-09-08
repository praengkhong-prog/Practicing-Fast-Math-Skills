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

      // Get practice sessions from localStorage
      const practiceResults = JSON.parse(localStorage.getItem("bmb:results") || "[]");
      const surveyResults = JSON.parse(localStorage.getItem("bmb:survey") || "[]");

      return {
        success: true,
        data: {
          totalUsers: userCount || 0,
          totalAdmins: adminCount || 0,
          practiceSessionsCount: practiceResults.length,
          surveySubmissions: surveyResults.length,
          recentActivity: practiceResults.slice(-5).reverse()
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  static async getPracticeStats() {
    const results = JSON.parse(localStorage.getItem("bmb:results") || "[]");
    
    const modeStats = results.reduce((acc: any, result: any) => {
      const mode = result.mode || 'unknown';
      if (!acc[mode]) {
        acc[mode] = { count: 0, totalScore: 0, totalTime: 0 };
      }
      acc[mode].count++;
      acc[mode].totalScore += result.score || 0;
      acc[mode].totalTime += result.timeElapsed || 0;
      return acc;
    }, {});

    return {
      success: true,
      data: {
        totalSessions: results.length,
        modeStats,
        recentSessions: results.slice(-10).reverse()
      }
    };
  }
}