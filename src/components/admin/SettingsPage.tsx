// import { useState } from 'react';
// import { User, Lock, Settings as SettingsIcon, Save, ShieldAlert } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Switch } from '@/components/ui/switch';
// import { Label } from '@/components/ui/label';
// import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { useAuth } from '@/contexts/AuthContext'; // เรียกใช้ Auth Context (ถ้ามี)

// export default function SettingsPage() {
//   const { user } = useAuth(); // ดึงข้อมูล user ปัจจุบัน (ถ้ามี)
//   const [isLoading, setIsLoading] = useState(false);

//   // --- State: ข้อมูลส่วนตัว ---
//   const [profile, setProfile] = useState({
//     displayName: 'Admin User', // ค่าเริ่มต้น (รอผูกกับ DB)
//     email: user?.email || 'admin@example.com'
//   });

//   // --- State: รหัสผ่าน ---
//   const [passwords, setPasswords] = useState({
//     current: '',
//     new: '',
//     confirm: ''
//   });

//   // --- State: การจัดการระบบ ---
//   const [systemConfig, setSystemConfig] = useState({
//     allowRegistration: true, // เปิดรับสมัครสมาชิก
//     maintenanceMode: false   // ปิดปรับปรุง
//   });

//   // --- Functions (จำลองการทำงาน) ---
//   const handleSaveProfile = async () => {
//     setIsLoading(true);
//     // TODO: เขียนโค้ดอัปเดต Profile ลง Supabase ตรงนี้
//     console.log('Update Profile:', profile);
//     setTimeout(() => {
//         setIsLoading(false);
//         alert('บันทึกข้อมูลส่วนตัวเรียบร้อย');
//     }, 1000);
//   };

//   const handleChangePassword = async () => {
//     if (passwords.new !== passwords.confirm) {
//         alert('รหัสผ่านใหม่ไม่ตรงกัน');
//         return;
//     }
//     setIsLoading(true);
//     // TODO: เขียนโค้ดเปลี่ยนรหัสผ่าน Supabase (supabase.auth.updateUser)
//     console.log('Update Password:', passwords);
//     setTimeout(() => {
//         setIsLoading(false);
//         setPasswords({ current: '', new: '', confirm: '' }); // Reset form
//         alert('เปลี่ยนรหัสผ่านเรียบร้อย');
//     }, 1000);
//   };

//   const handleSystemConfigChange = (key: keyof typeof systemConfig, value: boolean) => {
//     setSystemConfig(prev => ({ ...prev, [key]: value }));
//     // TODO: เขียนโค้ดบันทึกสถานะลงตาราง settings ใน Supabase ทันทีที่มีการกด Switch
//     console.log(`System Config [${key}] changed to:`, value);
//   };

//   return (
//     <div className="space-y-6 max-w-4xl mx-auto pb-10">
      
//       {/* =========================================================
//           ส่วนที่ 1: การตั้งค่าบัญชี (Admin Account)
//       ========================================================= */}
      
//       {/* 1.1 แก้ไขข้อมูลส่วนตัว */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <User className="w-5 h-5 text-blue-600" />
//             <CardTitle>ข้อมูลส่วนตัว (Profile)</CardTitle>
//           </div>
//           <CardDescription>จัดการข้อมูลพื้นฐานของผู้ดูแลระบบ</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>ชื่อที่แสดง (Display Name)</Label>
//               <Input 
//                 value={profile.displayName}
//                 onChange={(e) => setProfile({...profile, displayName: e.target.value})}
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>อีเมลติดต่อ</Label>
//               <Input 
//                 value={profile.email}
//                 disabled // อีเมลอาจจะห้ามแก้ หรือแก้ได้ตาม Logic ระบบ
//                 className="bg-gray-100 cursor-not-allowed"
//               />
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter className="bg-gray-50/50 border-t p-4 flex justify-end">
//           <Button onClick={handleSaveProfile} disabled={isLoading}>
//             {isLoading ? 'กำลังบันทึก...' : <><Save className="w-4 h-4 mr-2" /> บันทึกข้อมูล</>}
//           </Button>
//         </CardFooter>
//       </Card>

//       {/* 1.2 แก้ไขรหัสผ่าน */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <Lock className="w-5 h-5 text-blue-600" />
//             <CardTitle>ความปลอดภัย (Security)</CardTitle>
//           </div>
//           <CardDescription>เปลี่ยนรหัสผ่านสำหรับการเข้าใช้งาน</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="space-y-2">
//              <Label>รหัสผ่านปัจจุบัน</Label>
//              <Input 
//                 type="password" 
//                 placeholder="••••••"
//                 value={passwords.current}
//                 onChange={(e) => setPasswords({...passwords, current: e.target.value})}
//              />
//           </div>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//              <div className="space-y-2">
//                <Label>รหัสผ่านใหม่</Label>
//                <Input 
//                   type="password" 
//                   placeholder="••••••"
//                   value={passwords.new}
//                   onChange={(e) => setPasswords({...passwords, new: e.target.value})}
//                />
//              </div>
//              <div className="space-y-2">
//                <Label>ยืนยันรหัสผ่านใหม่</Label>
//                <Input 
//                   type="password" 
//                   placeholder="••••••"
//                   value={passwords.confirm}
//                   onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
//                />
//              </div>
//           </div>
//         </CardContent>
//         <CardFooter className="bg-gray-50/50 border-t p-4 flex justify-end">
//            <Button variant="outline" onClick={handleChangePassword} disabled={isLoading}>
//              เปลี่ยนรหัสผ่าน
//            </Button>
//         </CardFooter>
//       </Card>

//       {/* =========================================================
//           ส่วนที่ 2: การจัดการระบบ (System Management)
//       ========================================================= */}
//       <Card className="border-orange-200 shadow-sm">
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <SettingsIcon className="w-5 h-5 text-orange-600" />
//             <CardTitle>การจัดการระบบ (System Management)</CardTitle>
//           </div>
//           <CardDescription>ควบคุมการเข้าถึงและสถานะของระบบ</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
          
//           {/* Toggle 1: เปิด/ปิด รับสมัคร */}
//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label className="text-base">เปิดรับสมัครสมาชิกใหม่ (Registration)</Label>
//               <p className="text-sm text-gray-500">
//                 หากปิด (Off) ผู้ใช้งานทั่วไปจะไม่สามารถสร้างบัญชีใหม่ได้
//               </p>
//             </div>
//             <Switch 
//               checked={systemConfig.allowRegistration}
//               onCheckedChange={(checked) => handleSystemConfigChange('allowRegistration', checked)}
//             />
//           </div>

//           <Separator />

//           {/* Toggle 2: Maintenance Mode */}
//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <div className="flex items-center gap-2">
//                 <Label className="text-base text-red-600">โหมดปิดปรับปรุง (Maintenance Mode)</Label>
//                 <ShieldAlert className="w-4 h-4 text-red-500" />
//               </div>
//               <p className="text-sm text-gray-500">
//                 หากเปิด (On) ผู้ใช้งานทั่วไปจะไม่สามารถเข้าสู่ระบบได้ (แสดงหน้าปิดปรับปรุง)
//               </p>
//             </div>
//             <Switch 
//               checked={systemConfig.maintenanceMode}
//               onCheckedChange={(checked) => handleSystemConfigChange('maintenanceMode', checked)}
//               className="data-[state=checked]:bg-red-500" // เปลี่ยนสี Switch เป็นสีแดงเมื่อเปิดโหมดนี้เพื่อเตือนใจ
//             />
//           </div>

//         </CardContent>
//       </Card>

//     </div>
//   );
// }






// import { useState, useEffect } from 'react';
// import { User, Lock, Settings as SettingsIcon, Save, ShieldAlert } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Switch } from '@/components/ui/switch';
// import { Label } from '@/components/ui/label';
// import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { useAuth } from '@/contexts/AuthContext';
// import { supabase } from '@/supabaseClient'; // ⚠️ ตรวจสอบ path ให้ตรงกับโปรเจกต์ของคุณ

// export default function SettingsPage() {
//   const { user } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);

//   // --- State: ข้อมูลส่วนตัว ---
//   const [profile, setProfile] = useState({
//     displayName: '', 
//     email: user?.email || ''
//   });

//   // --- State: รหัสผ่าน ---
//   const [passwords, setPasswords] = useState({
//     current: '',
//     new: '',
//     confirm: ''
//   });

//   // --- State: การจัดการระบบ ---
//   const [systemConfig, setSystemConfig] = useState({
//     allowRegistration: true,
//     maintenanceMode: false
//   });

//   // 1. ดึงข้อมูลชื่อปัจจุบันมาแสดงตอนโหลดหน้าเว็บ
//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!user) return;
//       try {
//         // ดึงจาก Database
//         const { data, error } = await supabase
//           .from('profiles') 
//           .select('display_name')
//           .eq('id', user.id) // หรือ .eq('user_id', user.id) แล้วแต่โครงสร้างตาราง
//           .single();

//         if (data) {
//           setProfile(prev => ({ ...prev, displayName: data.display_name || '' }));
//         } else {
//             // ถ้าใน DB ไม่มี ให้ลองดึงจาก User Metadata
//             const metaName = user.user_metadata?.full_name || user.user_metadata?.display_name;
//             if (metaName) setProfile(prev => ({ ...prev, displayName: metaName }));
//         }
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//       }
//     };
//     fetchProfile();
//   }, [user]);

//   // --- Function: บันทึกข้อมูลส่วนตัว (แก้ไขสมบูรณ์) ---
//   const handleSaveProfile = async () => {
//     if (!user) return;
//     setIsLoading(true);

//     try {
//       // 1. อัปเดตลงฐานข้อมูล (Table: profiles)
//       const { error: dbError } = await supabase
//         .from('profiles')
//         .update({ display_name: profile.displayName })
//         .eq('id', user.id); // หรือ .eq('user_id', user.id)

//       if (dbError) throw dbError;
      
//       // 2. ✅ อัปเดต Auth Metadata (สำคัญ! ต้องใช้ key 'full_name' ตามที่ Header เรียกใช้)
//       const { error: authError } = await supabase.auth.updateUser({
//         data: { full_name: profile.displayName } 
//       });

//       if (authError) throw authError;

//       alert('บันทึกข้อมูลส่วนตัวเรียบร้อย');

//       // 3. ✅ รีเฟรชหน้าจอเพื่อให้ Header อัปเดตชื่อทันที
//       window.location.reload(); 

//     } catch (error: any) {
//       console.error('Update Profile Error:', error);
//       alert('เกิดข้อผิดพลาด: ' + (error.message || 'ไม่สามารถบันทึกได้'));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // --- Function: เปลี่ยนรหัสผ่าน ---
//   const handleChangePassword = async () => {
//     if (passwords.new !== passwords.confirm) {
//         alert('รหัสผ่านใหม่ไม่ตรงกัน');
//         return;
//     }
//     if (passwords.new.length < 6) {
//         alert('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
//         return;
//     }

//     setIsLoading(true);
//     try {
//         const { error } = await supabase.auth.updateUser({ 
//             password: passwords.new 
//         });

//         if (error) throw error;

//         alert('เปลี่ยนรหัสผ่านเรียบร้อย');
//         setPasswords({ current: '', new: '', confirm: '' }); // Reset form

//     } catch (error: any) {
//         console.error('Update Password Error:', error);
//         alert('เปลี่ยนรหัสผ่านไม่สำเร็จ: ' + error.message);
//     } finally {
//         setIsLoading(false);
//     }
//   };

//   // --- Function: จัดการระบบ (Mockup) ---
//   const handleSystemConfigChange = (key: keyof typeof systemConfig, value: boolean) => {
//     setSystemConfig(prev => ({ ...prev, [key]: value }));
//     console.log(`System Config [${key}] changed to:`, value);
//   };

//   return (
//     <div className="space-y-6 max-w-4xl mx-auto pb-10">
      
//       {/* ส่วนที่ 1: ข้อมูลส่วนตัว */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <User className="w-5 h-5 text-blue-600" />
//             <CardTitle>ข้อมูลส่วนตัว (Profile)</CardTitle>
//           </div>
//           <CardDescription>จัดการข้อมูลพื้นฐานของผู้ดูแลระบบ</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>ชื่อที่แสดง (Display Name)</Label>
//               <Input 
//                 value={profile.displayName}
//                 onChange={(e) => setProfile({...profile, displayName: e.target.value})}
//                 placeholder="กรอกชื่อที่ต้องการแสดง"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>อีเมลติดต่อ</Label>
//               <Input 
//                 value={profile.email}
//                 disabled 
//                 className="bg-gray-100 cursor-not-allowed"
//               />
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter className="bg-gray-50/50 border-t p-4 flex justify-end">
//           <Button onClick={handleSaveProfile} disabled={isLoading}>
//             {isLoading ? 'กำลังบันทึก...' : <><Save className="w-4 h-4 mr-2" /> บันทึกข้อมูล</>}
//           </Button>
//         </CardFooter>
//       </Card>

//       {/* ส่วนที่ 2: ความปลอดภัย */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <Lock className="w-5 h-5 text-blue-600" />
//             <CardTitle>ความปลอดภัย (Security)</CardTitle>
//           </div>
//           <CardDescription>เปลี่ยนรหัสผ่านสำหรับการเข้าใช้งาน</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//              <div className="space-y-2">
//                <Label>รหัสผ่านใหม่</Label>
//                <Input 
//                   type="password" 
//                   placeholder="••••••"
//                   value={passwords.new}
//                   onChange={(e) => setPasswords({...passwords, new: e.target.value})}
//                />
//              </div>
//              <div className="space-y-2">
//                <Label>ยืนยันรหัสผ่านใหม่</Label>
//                <Input 
//                   type="password" 
//                   placeholder="••••••"
//                   value={passwords.confirm}
//                   onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
//                />
//              </div>
//           </div>
//         </CardContent>
//         <CardFooter className="bg-gray-50/50 border-t p-4 flex justify-end">
//            <Button variant="outline" onClick={handleChangePassword} disabled={isLoading}>
//              เปลี่ยนรหัสผ่าน
//            </Button>
//         </CardFooter>
//       </Card>

//       {/* ส่วนที่ 3: จัดการระบบ */}
//       <Card className="border-orange-200 shadow-sm">
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <SettingsIcon className="w-5 h-5 text-orange-600" />
//             <CardTitle>การจัดการระบบ (System Management)</CardTitle>
//           </div>
//           <CardDescription>ควบคุมการเข้าถึงและสถานะของระบบ</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label className="text-base">เปิดรับสมัครสมาชิกใหม่ (Registration)</Label>
//               <p className="text-sm text-gray-500">หากปิด ผู้ใช้งานทั่วไปจะไม่สามารถสร้างบัญชีใหม่ได้</p>
//             </div>
//             <Switch 
//               checked={systemConfig.allowRegistration}
//               onCheckedChange={(checked) => handleSystemConfigChange('allowRegistration', checked)}
//             />
//           </div>

//           <Separator />

//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <div className="flex items-center gap-2">
//                 <Label className="text-base text-red-600">โหมดปิดปรับปรุง (Maintenance Mode)</Label>
//                 <ShieldAlert className="w-4 h-4 text-red-500" />
//               </div>
//               <p className="text-sm text-gray-500">หากเปิด ผู้ใช้งานทั่วไปจะไม่สามารถเข้าสู่ระบบได้</p>
//             </div>
//             <Switch 
//               checked={systemConfig.maintenanceMode}
//               onCheckedChange={(checked) => handleSystemConfigChange('maintenanceMode', checked)}
//               className="data-[state=checked]:bg-red-500" 
//             />
//           </div>
//         </CardContent>
//       </Card>

//     </div>
//   );
// }



// import { useState, useEffect } from 'react';
// import { User, Lock, Settings as SettingsIcon, Save, ShieldAlert } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Switch } from '@/components/ui/switch';
// import { Label } from '@/components/ui/label';
// import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
// import { Separator } from '@/components/ui/separator';
// import { useAuth } from '@/contexts/AuthContext';
// import { supabase } from '@/supabaseClient'; // ⚠️ ตรวจสอบ path ให้ตรงกับโปรเจกต์ของคุณ

// export default function SettingsPage() {
//   const { user } = useAuth();
//   const [isLoading, setIsLoading] = useState(false);

//   // --- State: ข้อมูลส่วนตัว ---
//   const [profile, setProfile] = useState({
//     displayName: '', 
//     email: user?.email || ''
//   });

//   // --- State: รหัสผ่าน ---
//   const [passwords, setPasswords] = useState({
//     current: '',
//     new: '',
//     confirm: ''
//   });

//   // --- State: การจัดการระบบ ---
//   const [systemConfig, setSystemConfig] = useState({
//     allowRegistration: true,
//     maintenanceMode: false
//   });

//   // 1. ดึงข้อมูลชื่อปัจจุบันมาแสดงตอนโหลดหน้าเว็บ
//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!user) return;
//       try {
//         // ดึงจาก Database
//         const { data, error } = await supabase
//           .from('profiles') 
//           .select('display_name')
//           .eq('id', user.id) // หรือ .eq('user_id', user.id) แล้วแต่โครงสร้างตาราง
//           .single();

//         if (data) {
//           setProfile(prev => ({ ...prev, displayName: data.display_name || '' }));
//         } else {
//             // ถ้าใน DB ไม่มี ให้ลองดึงจาก User Metadata
//             const metaName = user.user_metadata?.full_name || user.user_metadata?.display_name;
//             if (metaName) setProfile(prev => ({ ...prev, displayName: metaName }));
//         }
//       } catch (error) {
//         console.error("Error fetching profile:", error);
//       }
//     };
//     fetchProfile();
//   }, [user]);

//   // --- Function: บันทึกข้อมูลส่วนตัว (แก้ไขสมบูรณ์) ---
//   const handleSaveProfile = async () => {
//     if (!user) return;
//     setIsLoading(true);

//     try {
//       // 1. อัปเดตลงฐานข้อมูล (Table: profiles)
//       // ✅ แก้ไข: ลบ .select() ออก และเรียงลำดับ from -> update -> eq ให้ถูกต้อง
//       const { error: dbError } = await supabase
//         .from('profiles')
//         .update({ display_name: profile.displayName })
//         .eq('id', user.id); // หรือ .eq('user_id', user.id)

//       if (dbError) throw dbError;
      
//       // 2. ✅ อัปเดต Auth Metadata (สำคัญ! ต้องใช้ key 'full_name' ตามที่ Header เรียกใช้)
//       const { error: authError } = await supabase.auth.updateUser({
//         data: { full_name: profile.displayName } 
//       });

//       if (authError) throw authError;

//       alert('บันทึกข้อมูลส่วนตัวเรียบร้อย');

//       // 3. ✅ รีเฟรชหน้าจอเพื่อให้ Header อัปเดตชื่อทันที
//       window.location.reload(); 

//     } catch (error: any) {
//       console.error('Update Profile Error:', error);
//       alert('เกิดข้อผิดพลาด: ' + (error.message || 'ไม่สามารถบันทึกได้'));
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // --- Function: เปลี่ยนรหัสผ่าน ---
//   const handleChangePassword = async () => {
//     if (passwords.new !== passwords.confirm) {
//         alert('รหัสผ่านใหม่ไม่ตรงกัน');
//         return;
//     }
//     if (passwords.new.length < 6) {
//         alert('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
//         return;
//     }

//     setIsLoading(true);
//     try {
//         const { error } = await supabase.auth.updateUser({ 
//             password: passwords.new 
//         });

//         if (error) throw error;

//         alert('เปลี่ยนรหัสผ่านเรียบร้อย');
//         setPasswords({ current: '', new: '', confirm: '' }); // Reset form

//     } catch (error: any) {
//         console.error('Update Password Error:', error);
//         alert('เปลี่ยนรหัสผ่านไม่สำเร็จ: ' + error.message);
//     } finally {
//         setIsLoading(false);
//     }
//   };

//   // --- Function: จัดการระบบ (Mockup) ---
//   const handleSystemConfigChange = (key: keyof typeof systemConfig, value: boolean) => {
//     setSystemConfig(prev => ({ ...prev, [key]: value }));
//     console.log(`System Config [${key}] changed to:`, value);
//   };

//   return (
//     <div className="space-y-6 max-w-4xl mx-auto pb-10">
      
//       {/* ส่วนที่ 1: ข้อมูลส่วนตัว */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <User className="w-5 h-5 text-blue-600" />
//             <CardTitle>ข้อมูลส่วนตัว (Profile)</CardTitle>
//           </div>
//           <CardDescription>จัดการข้อมูลพื้นฐานของผู้ดูแลระบบ</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             <div className="space-y-2">
//               <Label>ชื่อที่แสดง (Display Name)</Label>
//               <Input 
//                 value={profile.displayName}
//                 onChange={(e) => setProfile({...profile, displayName: e.target.value})}
//                 placeholder="กรอกชื่อที่ต้องการแสดง"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>อีเมลติดต่อ</Label>
//               <Input 
//                 value={profile.email}
//                 disabled 
//                 className="bg-gray-100 cursor-not-allowed"
//               />
//             </div>
//           </div>
//         </CardContent>
//         <CardFooter className="bg-gray-50/50 border-t p-4 flex justify-end">
//           <Button onClick={handleSaveProfile} disabled={isLoading}>
//             {isLoading ? 'กำลังบันทึก...' : <><Save className="w-4 h-4 mr-2" /> บันทึกข้อมูล</>}
//           </Button>
//         </CardFooter>
//       </Card>

//       {/* ส่วนที่ 2: ความปลอดภัย */}
//       <Card>
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <Lock className="w-5 h-5 text-blue-600" />
//             <CardTitle>ความปลอดภัย (Security)</CardTitle>
//           </div>
//           <CardDescription>เปลี่ยนรหัสผ่านสำหรับการเข้าใช้งาน</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-4">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//              <div className="space-y-2">
//                <Label>รหัสผ่านใหม่</Label>
//                <Input 
//                   type="password" 
//                   placeholder="••••••"
//                   value={passwords.new}
//                   onChange={(e) => setPasswords({...passwords, new: e.target.value})}
//                />
//              </div>
//              <div className="space-y-2">
//                <Label>ยืนยันรหัสผ่านใหม่</Label>
//                <Input 
//                   type="password" 
//                   placeholder="••••••"
//                   value={passwords.confirm}
//                   onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
//                />
//              </div>
//           </div>
//         </CardContent>
//         <CardFooter className="bg-gray-50/50 border-t p-4 flex justify-end">
//            <Button variant="outline" onClick={handleChangePassword} disabled={isLoading}>
//              เปลี่ยนรหัสผ่าน
//            </Button>
//         </CardFooter>
//       </Card>

//       {/* ส่วนที่ 3: จัดการระบบ */}
//       <Card className="border-orange-200 shadow-sm">
//         <CardHeader>
//           <div className="flex items-center gap-2">
//             <SettingsIcon className="w-5 h-5 text-orange-600" />
//             <CardTitle>การจัดการระบบ (System Management)</CardTitle>
//           </div>
//           <CardDescription>ควบคุมการเข้าถึงและสถานะของระบบ</CardDescription>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <Label className="text-base">เปิดรับสมัครสมาชิกใหม่ (Registration)</Label>
//               <p className="text-sm text-gray-500">หากปิด ผู้ใช้งานทั่วไปจะไม่สามารถสร้างบัญชีใหม่ได้</p>
//             </div>
//             <Switch 
//               checked={systemConfig.allowRegistration}
//               onCheckedChange={(checked) => handleSystemConfigChange('allowRegistration', checked)}
//             />
//           </div>

//           <Separator />

//           <div className="flex items-center justify-between">
//             <div className="space-y-0.5">
//               <div className="flex items-center gap-2">
//                 <Label className="text-base text-red-600">โหมดปิดปรับปรุง (Maintenance Mode)</Label>
//                 <ShieldAlert className="w-4 h-4 text-red-500" />
//               </div>
//               <p className="text-sm text-gray-500">หากเปิด ผู้ใช้งานทั่วไปจะไม่สามารถเข้าสู่ระบบได้</p>
//             </div>
//             <Switch 
//               checked={systemConfig.maintenanceMode}
//               onCheckedChange={(checked) => handleSystemConfigChange('maintenanceMode', checked)}
//               className="data-[state=checked]:bg-red-500" 
//             />
//           </div>
//         </CardContent>
//       </Card>

//     </div>
//   );
// }



import { useState, useEffect } from 'react';
import { User, Lock, Settings as SettingsIcon, Save, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/supabaseClient'; 

export default function SettingsPage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  // --- State: ข้อมูลส่วนตัว ---
  const [profile, setProfile] = useState({
    displayName: '', 
    email: user?.email || ''
  });

  // --- State: รหัสผ่าน ---
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  // --- State: การจัดการระบบ ---
  const [systemConfig, setSystemConfig] = useState({
    allowRegistration: true,
    maintenanceMode: false
  });

  // 1. ดึงข้อมูลชื่อปัจจุบันมาแสดงตอนโหลดหน้าเว็บ
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      try {
        // ดึงจาก Database
        const { data, error } = await supabase
          .from('profiles') 
          .select('display_name')
          .eq('user_id', user.id) // ✅ แก้ไข: ต้องใช้ user_id เพื่อจับคู่กับ User
          .single();

        if (data) {
          setProfile(prev => ({ ...prev, displayName: data.display_name || '' }));
        } else {
            // ถ้าใน DB ไม่มี ให้ลองดึงจาก User Metadata
            const metaName = user.user_metadata?.full_name || user.user_metadata?.display_name;
            if (metaName) setProfile(prev => ({ ...prev, displayName: metaName }));
        }
      } catch (error) {
        // console.error("Error fetching profile:", error); 
        // อาจจะไม่ต้อง log error ถ้ายูสเซอร์ใหม่ยังไม่มี profile
      }
    };
    fetchProfile();
  }, [user]);

  // --- Function: บันทึกข้อมูลส่วนตัว (แก้ไขสมบูรณ์) ---
  const handleSaveProfile = async () => {
    if (!user) return;
    setIsLoading(true);

    try {
      // 1. อัปเดตลงฐานข้อมูล (Table: profiles)
      // ✅ แก้ไข: ใช้ upsert แทน update เพื่อรองรับกรณี User ใหม่ที่ยังไม่มี row ในตาราง profiles
      const { error: dbError } = await supabase
        .from('profiles')
        .upsert({ 
            user_id: user.id, // ✅ สำคัญ: ต้องระบุ user_id เพื่อให้รู้ว่าเป็นของใคร
            display_name: profile.displayName,
            email: user.email, // อัปเดต email ลงไปด้วยก็ได้เผื่อไว้
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id' }); // บอกให้เช็คซ้ำที่ user_id

      if (dbError) throw dbError;
      
      // 2. อัปเดต Auth Metadata
      const { error: authError } = await supabase.auth.updateUser({
        data: { full_name: profile.displayName } 
      });

      if (authError) throw authError;

      alert('บันทึกข้อมูลส่วนตัวเรียบร้อย');

      // 3. รีเฟรชหน้าจอเพื่อให้ Header อัปเดตชื่อทันที
      window.location.reload(); 

    } catch (error: any) {
      console.error('Update Profile Error:', error);
      alert('เกิดข้อผิดพลาด: ' + (error.message || 'ไม่สามารถบันทึกได้'));
    } finally {
      setIsLoading(false);
    }
  };

  // --- Function: เปลี่ยนรหัสผ่าน ---
  const handleChangePassword = async () => {
    if (passwords.new !== passwords.confirm) {
        alert('รหัสผ่านใหม่ไม่ตรงกัน');
        return;
    }
    if (passwords.new.length < 6) {
        alert('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
        return;
    }

    setIsLoading(true);
    try {
        const { error } = await supabase.auth.updateUser({ 
            password: passwords.new 
        });

        if (error) throw error;

        alert('เปลี่ยนรหัสผ่านเรียบร้อย');
        setPasswords({ current: '', new: '', confirm: '' }); // Reset form

    } catch (error: any) {
        console.error('Update Password Error:', error);
        alert('เปลี่ยนรหัสผ่านไม่สำเร็จ: ' + error.message);
    } finally {
        setIsLoading(false);
    }
  };

  // --- Function: จัดการระบบ (Mockup) ---
  const handleSystemConfigChange = (key: keyof typeof systemConfig, value: boolean) => {
    setSystemConfig(prev => ({ ...prev, [key]: value }));
    console.log(`System Config [${key}] changed to:`, value);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      
      {/* ส่วนที่ 1: ข้อมูลส่วนตัว */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <CardTitle>ข้อมูลส่วนตัว (Profile)</CardTitle>
          </div>
          <CardDescription>จัดการข้อมูลพื้นฐานของผู้ดูแลระบบ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>ชื่อที่แสดง (Display Name)</Label>
              <Input 
                value={profile.displayName}
                onChange={(e) => setProfile({...profile, displayName: e.target.value})}
                placeholder="กรอกชื่อที่ต้องการแสดง"
              />
            </div>
            <div className="space-y-2">
              <Label>อีเมลติดต่อ</Label>
              <Input 
                value={profile.email}
                disabled 
                className="bg-gray-100 cursor-not-allowed"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50/50 border-t p-4 flex justify-end">
          <Button onClick={handleSaveProfile} disabled={isLoading}>
            {isLoading ? 'กำลังบันทึก...' : <><Save className="w-4 h-4 mr-2" /> บันทึกข้อมูล</>}
          </Button>
        </CardFooter>
      </Card>

      {/* ส่วนที่ 2: ความปลอดภัย */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            <CardTitle>ความปลอดภัย (Security)</CardTitle>
          </div>
          <CardDescription>เปลี่ยนรหัสผ่านสำหรับการเข้าใช้งาน</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
               <Label>รหัสผ่านใหม่</Label>
               <Input 
                  type="password" 
                  placeholder="••••••"
                  value={passwords.new}
                  onChange={(e) => setPasswords({...passwords, new: e.target.value})}
               />
             </div>
             <div className="space-y-2">
               <Label>ยืนยันรหัสผ่านใหม่</Label>
               <Input 
                  type="password" 
                  placeholder="••••••"
                  value={passwords.confirm}
                  onChange={(e) => setPasswords({...passwords, confirm: e.target.value})}
               />
             </div>
          </div>
        </CardContent>
        <CardFooter className="bg-gray-50/50 border-t p-4 flex justify-end">
           <Button variant="outline" onClick={handleChangePassword} disabled={isLoading}>
             เปลี่ยนรหัสผ่าน
           </Button>
        </CardFooter>
      </Card>

      {/* ส่วนที่ 3: จัดการระบบ */}
      <Card className="border-orange-200 shadow-sm">
        <CardHeader>
          <div className="flex items-center gap-2">
            <SettingsIcon className="w-5 h-5 text-orange-600" />
            <CardTitle>การจัดการระบบ (System Management)</CardTitle>
          </div>
          <CardDescription>ควบคุมการเข้าถึงและสถานะของระบบ</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="text-base">เปิดรับสมัครสมาชิกใหม่ (Registration)</Label>
              <p className="text-sm text-gray-500">หากปิด ผู้ใช้งานทั่วไปจะไม่สามารถสร้างบัญชีใหม่ได้</p>
            </div>
            <Switch 
              checked={systemConfig.allowRegistration}
              onCheckedChange={(checked) => handleSystemConfigChange('allowRegistration', checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <Label className="text-base text-red-600">โหมดปิดปรับปรุง (Maintenance Mode)</Label>
                <ShieldAlert className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-sm text-gray-500">หากเปิด ผู้ใช้งานทั่วไปจะไม่สามารถเข้าสู่ระบบได้</p>
            </div>
            <Switch 
              checked={systemConfig.maintenanceMode}
              onCheckedChange={(checked) => handleSystemConfigChange('maintenanceMode', checked)}
              className="data-[state=checked]:bg-red-500" 
            />
          </div>
        </CardContent>
      </Card>

    </div>
  );
}