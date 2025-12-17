// pages/api/admin/reset-password.ts
import { createClient } from '@supabase/supabase-js';

// สร้าง Client แบบ Admin (ใช้ Service Role Key)
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: any, res: any) {
  // รับค่า userId และ password ใหม่จากหน้าบ้าน
  const { userId, newPassword } = req.body;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // สั่งเปลี่ยนรหัสผ่าน
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword
    });

    if (error) throw error;

    return res.status(200).json({ success: true, data });
  } catch (error: any) {
    return res.status(500).json({ success: false, message: error.message });
  }
}