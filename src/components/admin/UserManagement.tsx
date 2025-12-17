// import { useState, useEffect } from 'react';
// import { Users, Shield, Trash2, Edit3, UserCheck } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { AdminService } from '@/services/AdminService';
// import { useToast } from '@/hooks/use-toast';
// import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// interface User {
//   id: string;
//   user_id: string;
//   display_name: string;
//   created_at: string;
//   user_roles: Array<{ role: string; created_at: string }>;
// }

// const UserManagement = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { toast } = useToast();

//   const loadUsers = async () => {
//     setLoading(true);
//     const result = await AdminService.getAllUsers();
//     if (result.success) {
//       setUsers(result.data || []);
//     } else {
//       toast({
//         title: "เกิดข้อผิดพลาด",
//         description: "ไม่สามารถโหลดข้อมูลผู้ใช้ได้",
//         variant: "destructive"
//       });
//     }
//     setLoading(false);
//   };

//   const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
//     const result = await AdminService.updateUserRole(userId, newRole);
//     if (result.success) {
//       toast({
//         title: "สำเร็จ",
//         description: `เปลี่ยนบทบาทผู้ใช้เป็น ${newRole} แล้ว`
//       });
//       loadUsers();
//     } else {
//       toast({
//         title: "เกิดข้อผิดพลาด",
//         description: "ไม่สามารถเปลี่ยนบทบาทได้",
//         variant: "destructive"
//       });
//     }
//   };

//   const handleDeleteUser = async (userId: string) => {
//     const result = await AdminService.deleteUser(userId);
//     if (result.success) {
//       toast({
//         title: "สำเร็จ",
//         description: "ลบผู้ใช้แล้ว"
//       });
//       loadUsers();
//     } else {
//       toast({
//         title: "เกิดข้อผิดพลาด",
//         description: "ไม่สามารถลบผู้ใช้ได้",
//         variant: "destructive"
//       });
//     }
//   };

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const getUserRole = (user: User) => {
//     return user.user_roles?.[0]?.role || 'user';
//   };

//   const formatUserId = (userId: string) => {
//     // แสดง 8 ตัวอักษรแรกและ 4 ตัวสุดท้าย
//     return `${userId.slice(0, 8)}...${userId.slice(-4)}`;
//   };

//   if (loading) {
//     return (
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Users className="h-5 w-5" />
//             การจัดการผู้ใช้
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="flex items-center justify-center py-8">
//             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//           </div>
//         </CardContent>
//       </Card>
//     );
//   }

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle className="flex items-center gap-2">
//           <Users className="h-5 w-5" />
//           การจัดการผู้ใช้
//         </CardTitle>
//       </CardHeader>
//       <CardContent>
//         {users.length === 0 ? (
//           <div className="text-center py-8 text-muted-foreground">
//             ไม่มีข้อมูลผู้ใช้
//           </div>
//         ) : (
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>ชื่อผู้ใช้</TableHead>
//                 <TableHead>User ID</TableHead>
//                 <TableHead>บทบาท</TableHead>
//                 <TableHead>วันที่สมัคร</TableHead>
//                 <TableHead>การจัดการ</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {users.map((user) => {
//                 const role = getUserRole(user);
//                 return (
//                   <TableRow key={user.id}>
//                     <TableCell className="font-medium">
//                       {user.display_name || 'ไม่ระบุชื่อ'}
//                     </TableCell>
//                     <TableCell className="font-mono text-sm text-muted-foreground">
//                       <span title={user.user_id} className="cursor-help">
//                         {formatUserId(user.user_id)}
//                       </span>
//                     </TableCell>
//                     <TableCell>
//                       <Badge variant={role === 'admin' ? 'default' : 'secondary'}>
//                         {role === 'admin' ? (
//                           <>
//                             <Shield className="w-3 h-3 mr-1" />
//                             ผู้ดูแล
//                           </>
//                         ) : (
//                           <>
//                             <UserCheck className="w-3 h-3 mr-1" />
//                             ผู้ใช้
//                           </>
//                         )}
//                       </Badge>
//                     </TableCell>
//                     <TableCell>
//                       {new Date(user.created_at).toLocaleDateString('th-TH')}
//                     </TableCell>
//                     <TableCell>
//                       <div className="flex gap-2">
//                         <Button
//                           size="sm"
//                           variant="outline"
//                           onClick={() => handleRoleChange(user.user_id, role === 'admin' ? 'user' : 'admin')}
//                         >
//                           <Edit3 className="w-4 h-4 mr-1" />
//                           {role === 'admin' ? 'ลดบทบาท' : 'เพิ่มผู้ดูแล'}
//                         </Button>
                        
//                         <AlertDialog>
//                           <AlertDialogTrigger asChild>
//                             <Button size="sm" variant="destructive">
//                               <Trash2 className="w-4 h-4 mr-1" />
//                               ลบ
//                             </Button>
//                           </AlertDialogTrigger>
//                           <AlertDialogContent>
//                             <AlertDialogHeader>
//                               <AlertDialogTitle>ยืนยันการลบผู้ใช้</AlertDialogTitle>
//                               <AlertDialogDescription>
//                                 คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ "{user.display_name}" 
//                                 การดำเนินการนี้ไม่สามารถยกเลิกได้
//                               </AlertDialogDescription>
//                             </AlertDialogHeader>
//                             <AlertDialogFooter>
//                               <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
//                               <AlertDialogAction onClick={() => handleDeleteUser(user.user_id)}>
//                                 ลบผู้ใช้
//                               </AlertDialogAction>
//                             </AlertDialogFooter>
//                           </AlertDialogContent>
//                         </AlertDialog>
//                       </div>
//                     </TableCell>
//                   </TableRow>
//                 );
//               })}
//             </TableBody>
//           </Table>
//         )}
//       </CardContent>
//     </Card>
//   );
// };

// export default UserManagement;

// import { useState, useEffect } from 'react';
// import { supabase } from '@/integrations/supabase/client'; // ปรับ path ตามโปรเจกต์ของคุณ
// import { Users, Shield, Trash2, Edit3, UserCheck, Save, Lock, Mail } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { AdminService } from '@/services/AdminService'; // ปรับ path ตามจริง
// import { useToast } from '@/hooks/use-toast';
// import { 
//   AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
//   AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
// } from '@/components/ui/alert-dialog';
// import {
//   Dialog, DialogContent, DialogDescription, DialogFooter, 
//   DialogHeader, DialogTitle
// } from '@/components/ui/dialog';

// // กำหนด Interface ให้ตรงกับข้อมูลที่ AdminService ส่งมา
// interface User {
//   id: string;
//   user_id: string;
//   display_name: string;
//   created_at: string;
  
//   // ทำให้ email เป็น optional (?) เผื่อบาง user ไม่มีข้อมูล
//   email?: string; 
  
//   // field อื่นๆ ที่อาจจะมาจาก profiles
//   avatar_url?: string;
//   bio?: string;
//   updated_at?: string;

//   // รองรับ user_roles
//   user_roles: Array<{ 
//     role: string; 
//     created_at: string;
//     user_id?: string;
//   }>;
// }

// const UserManagement = () => {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState(true);
//   const { toast } = useToast();

//   // --- States สำหรับ Dialog แก้ไข ---
//   const [isEditOpen, setIsEditOpen] = useState(false);
//   const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
//   const [editFormData, setEditFormData] = useState({
//     display_name: '',
//     email: '', // ใช้แสดงผลเท่านั้น
//     role: 'user',
//     new_password: ''
//   });
  
//   const [isSaving, setIsSaving] = useState(false);

//   const loadUsers = async () => {
//     setLoading(true);
//     const result = await AdminService.getAllUsers();
    
//     if (result.success) {
//       // แปลง Type ข้อมูลที่ได้จาก Service ให้เป็น User[]
//       setUsers((result.data as unknown) as User[]);
//     } else {
//       toast({
//         title: "เกิดข้อผิดพลาด",
//         description: "ไม่สามารถโหลดข้อมูลผู้ใช้ได้",
//         variant: "destructive"
//       });
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     loadUsers();
//   }, []);

//   const getUserRole = (user: User) => {
//     // เช็คว่ามี role หรือไม่ ถ้าไม่มีให้เป็น user
//     const roles = user.user_roles || [];
//     return roles.length > 0 ? roles[0].role : 'user';
//   };

//   // --- 1. เปิด Modal และดึงข้อมูลมาแสดง ---
//   const handleEditClick = (user: User) => {
//     setSelectedUser(user);
//     setEditFormData({
//       display_name: user.display_name || '',
//       email: user.email || '', // ดึงอีเมลมาแสดง
//       role: getUserRole(user),
//       new_password: ''
//     });
//     setIsEditOpen(true);
//   };

//   // --- 2. บันทึกข้อมูล ---
//   const handleSaveChanges = async () => {
//     if (!selectedUser) return;
//     setIsSaving(true);

//     try {
//         // 1. อัปเดตข้อมูลทั่วไป (ชื่อ) ในตาราง profiles
//         const { error: profileError } = await supabase
//             .from('profiles') // ตรวจสอบชื่อตารางให้ตรงกับ DB ของคุณ (profiles หรือ users)
//             .update({ display_name: editFormData.display_name })
//             .eq('user_id', selectedUser.user_id);

//         if (profileError) throw profileError;

//         // 2. อัปเดต Role
//         const currentRole = getUserRole(selectedUser);
//         if (editFormData.role !== currentRole) {
//             await AdminService.updateUserRole(selectedUser.user_id, editFormData.role as 'admin' | 'user');
//         }

//         // 3. เปลี่ยนรหัสผ่าน (ถ้ามีการกรอก)
//         if (editFormData.new_password.trim() !== '') {
//             const passResult = await AdminService.updateUserPassword(selectedUser.user_id, editFormData.new_password);
//             // @ts-ignore
//             if (!passResult.success) throw new Error(passResult.error || passResult.message);
//         }

//         toast({
//             title: "บันทึกสำเร็จ",
//             description: "ข้อมูลผู้ใช้ได้รับการแก้ไขเรียบร้อยแล้ว"
//         });

//         setIsEditOpen(false);
//         loadUsers(); 

//     } catch (error: any) {
//         toast({
//             title: "บันทึกไม่สำเร็จ",
//             description: error.message || "เกิดข้อผิดพลาดในการบันทึก",
//             variant: "destructive"
//         });
//     } finally {
//         setIsSaving(false);
//     }
//   };

//   const handleDeleteUser = async (userId: string) => {
//     const result = await AdminService.deleteUser(userId);
//     if (result.success) {
//       toast({ title: "สำเร็จ", description: "ลบผู้ใช้เรียบร้อยแล้ว" });
//       loadUsers();
//     } else {
//       // @ts-ignore
//       toast({ title: "เกิดข้อผิดพลาด", description: result.error || "ไม่สามารถลบผู้ใช้ได้", variant: "destructive" });
//     }
//   };

//   if (loading) return <div className="p-8 text-center">Loading...</div>;

//   return (
//     <>
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <Users className="h-5 w-5" /> การจัดการผู้ใช้
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//             <Table>
//               <TableHeader>
//                 <TableRow>
//                   <TableHead>ชื่อผู้ใช้</TableHead>
//                   <TableHead>อีเมล</TableHead> {/* คอลัมน์อีเมล */}
//                   <TableHead>บทบาท</TableHead>
//                   <TableHead>การจัดการ</TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {users.map((user) => {
//                   const role = getUserRole(user);
//                   return (
//                     <TableRow key={user.id}>
//                       <TableCell className="font-medium">{user.display_name || 'ไม่ระบุชื่อ'}</TableCell>
                      
//                       {/* แสดงอีเมลในตาราง */}
//                       <TableCell>
//                         <div className="flex items-center gap-2 text-gray-600">
//                             <Mail className="w-3 h-3" />
//                             {user.email || <span className="text-gray-400 italic text-xs">ไม่พบข้อมูล</span>}
//                         </div>
//                       </TableCell>

//                       <TableCell>
//                         <Badge variant={role === 'admin' ? 'default' : 'secondary'}>
//                           {role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : <UserCheck className="w-3 h-3 mr-1" />}
//                           {role === 'admin' ? 'ผู้ดูแล' : 'ผู้ใช้'}
//                         </Badge>
//                       </TableCell>
                      
//                       <TableCell>
//                         <div className="flex gap-2">
//                           <Button 
//                             size="sm" variant="outline" 
//                             onClick={() => handleEditClick(user)}
//                             className="text-blue-600 hover:bg-blue-50"
//                           >
//                             <Edit3 className="w-4 h-4 mr-1" /> รายละเอียด
//                           </Button>
                          
//                           <AlertDialog>
//                             <AlertDialogTrigger asChild>
//                               <Button size="sm" variant="destructive">
//                                 <Trash2 className="w-4 h-4 mr-1" /> ลบ
//                               </Button>
//                             </AlertDialogTrigger>
//                             <AlertDialogContent>
//                               <AlertDialogHeader>
//                                 <AlertDialogTitle>ยืนยันการลบผู้ใช้</AlertDialogTitle>
//                                 <AlertDialogDescription>
//                                   คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ "{user.display_name}" ?
//                                 </AlertDialogDescription>
//                               </AlertDialogHeader>
//                               <AlertDialogFooter>
//                                 <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
//                                 <AlertDialogAction onClick={() => handleDeleteUser(user.user_id)}>
//                                   ยืนยันลบ
//                                 </AlertDialogAction>
//                               </AlertDialogFooter>
//                             </AlertDialogContent>
//                           </AlertDialog>
//                         </div>
//                       </TableCell>
//                     </TableRow>
//                   );
//                 })}
//               </TableBody>
//             </Table>
//         </CardContent>
//       </Card>

//       {/* --- Dialog (Modal) --- */}
//       <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
//         <DialogContent className="sm:max-w-[500px]">
//           <DialogHeader>
//             <DialogTitle>ข้อมูลผู้ใช้</DialogTitle>
//             <DialogDescription>ดูรายละเอียดหรือแก้ไขข้อมูลผู้ใช้</DialogDescription>
//           </DialogHeader>
          
//           {selectedUser && (
//             <div className="grid gap-4 py-4">
              
//               {/* ส่วนแสดงอีเมล (Read Only - แก้ไขไม่ได้) */}
//               <div className="space-y-2">
//                 <Label htmlFor="email" className="flex items-center gap-2 text-gray-500">
//                     <Mail className="w-4 h-4" /> อีเมล (ดูเท่านั้น)
//                 </Label>
//                 <Input 
//                   id="email" 
//                   value={editFormData.email || 'ไม่พบข้อมูลอีเมล'} 
//                   disabled 
//                   className="bg-gray-100 text-gray-600 cursor-not-allowed" 
//                 />
//               </div>

//               {/* ชื่อที่แสดง */}
//               <div className="space-y-2">
//                 <Label htmlFor="name">ชื่อที่แสดง</Label>
//                 <Input
//                   id="name"
//                   value={editFormData.display_name}
//                   onChange={(e) => setEditFormData({ ...editFormData, display_name: e.target.value })}
//                 />
//               </div>

//               {/* บทบาท */}
//               <div className="space-y-2">
//                 <Label htmlFor="role">บทบาท</Label>
//                 <Select 
//                     value={editFormData.role} 
//                     onValueChange={(value) => setEditFormData({ ...editFormData, role: value })}
//                 >
//                   <SelectTrigger><SelectValue /></SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="user">User (ผู้ใช้ทั่วไป)</SelectItem>
//                     <SelectItem value="admin">Admin (ผู้ดูแลระบบ)</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="border-t my-2"></div>

//               {/* ส่วนเปลี่ยนรหัสผ่าน */}
//               <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200 space-y-3">
//                  <Label htmlFor="new-password" className="flex items-center gap-2 text-yellow-800 font-semibold">
//                     <Lock className="w-4 h-4" /> ตั้งรหัสผ่านใหม่ (Reset Password)
//                  </Label>
//                  <Input
//                   id="new-password"
//                   type="password"
//                   placeholder="กรอกรหัสผ่านใหม่ (ว่างไว้ถ้าไม่เปลี่ยน)"
//                   value={editFormData.new_password}
//                   onChange={(e) => setEditFormData({ ...editFormData, new_password: e.target.value })}
//                   className="bg-white"
//                 />
//               </div>

//             </div>
//           )}

//           <DialogFooter>
//             <Button variant="outline" onClick={() => setIsEditOpen(false)}>ปิด</Button>
//             <Button onClick={handleSaveChanges} disabled={isSaving}>
//               {isSaving ? "กำลังบันทึก..." : <><Save className="w-4 h-4 mr-2" /> บันทึกการเปลี่ยนแปลง</>}
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>
//     </>
//   );
// };

// export default UserManagement;





import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Users, Shield, Trash2, Edit3, UserCheck, Save, Lock, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AdminService } from '@/services/AdminService';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext'; // ✅ Import useAuth เพื่อเช็คตัวเอง
import { 
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger 
} from '@/components/ui/alert-dialog';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, 
  DialogHeader, DialogTitle
} from '@/components/ui/dialog';

// Interface
interface User {
  id: string;
  user_id: string;
  display_name: string;
  created_at: string;
  email?: string; 
  avatar_url?: string;
  // เพิ่ม field metadata เผื่อไว้ดึงข้อมูลดิบ
  raw_user_meta_data?: {
    full_name?: string;
    display_name?: string;
  };
  user_roles: Array<{ 
    role: string; 
  }>;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  // ✅ ดึง user ปัจจุบัน (Admin ที่กำลังใช้งาน) มาเพื่อเช็คตอนแก้ไข
  const { user: currentUser } = useAuth(); 

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  const [editFormData, setEditFormData] = useState({
    display_name: '',
    email: '', 
    role: 'user',
    new_password: ''
  });
  
  const [isSaving, setIsSaving] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    const result = await AdminService.getAllUsers();
    
    if (result.success) {
      setUsers((result.data as unknown) as User[]);
    } else {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลผู้ใช้ได้",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getUserRole = (user: User) => {
    const roles = user.user_roles || [];
    return roles.length > 0 ? roles[0].role : 'user';
  };

  // ✅ ฟังก์ชันช่วยแสดงชื่อ (Prioritize ชื่อจาก Profile -> Metadata -> Email)
  const getDisplayName = (u: User) => {
    if (u.display_name) return u.display_name;
    if (u.raw_user_meta_data?.full_name) return u.raw_user_meta_data.full_name;
    if (u.email) return u.email.split('@')[0];
    return 'User';
  };

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setEditFormData({
      display_name: getDisplayName(user), // ใช้ Helper function ดึงชื่อ
      email: user.email || '', 
      role: getUserRole(user),
      new_password: ''
    });
    setIsEditOpen(true);
  };

  // --- 2. บันทึกข้อมูล (แก้ไข Logic ตรงนี้) ---
  const handleSaveChanges = async () => {
    if (!selectedUser) return;
    setIsSaving(true);

    try {
        // 1. ✅ อัปเดตข้อมูลลงฐานข้อมูล (ตาราง profiles)
        // ต้องมั่นใจว่าฐานข้อมูลชื่อ profiles และมี column display_name
        const { error: profileError } = await supabase
            .from('profiles') 
            .update({ display_name: editFormData.display_name })
            .eq('user_id', selectedUser.user_id);

        if (profileError) throw profileError;

        // 2. ✅ (สำคัญ) ถ้า Admin แก้ไขชื่อตัวเอง -> ให้อัปเดต Auth Metadata ด้วย
        // เพื่อให้ Header ด้านบนที่ดึงข้อมูลจาก Session เปลี่ยนชื่อตามทันที
        if (currentUser?.id === selectedUser.user_id) {
            const { error: authError } = await supabase.auth.updateUser({
                data: { 
                    full_name: editFormData.display_name,
                    display_name: editFormData.display_name 
                }
            });
            if (authError) console.error("Failed to update auth metadata", authError);
        }

        // 3. อัปเดต Role
        const currentRole = getUserRole(selectedUser);
        if (editFormData.role !== currentRole) {
            await AdminService.updateUserRole(selectedUser.user_id, editFormData.role as 'admin' | 'user');
        }

        // 4. เปลี่ยนรหัสผ่าน
        if (editFormData.new_password.trim() !== '') {
            const passResult = await AdminService.updateUserPassword(selectedUser.user_id, editFormData.new_password);
            // @ts-ignore
            if (!passResult.success) throw new Error(passResult.error || passResult.message);
        }

        toast({
            title: "บันทึกสำเร็จ",
            description: "ข้อมูลอัปเดตเรียบร้อยแล้ว (หากชื่อมุมขวาบนยังไม่เปลี่ยน ให้รีเฟรชหน้าจอ 1 ครั้ง)"
        });

        setIsEditOpen(false);
        loadUsers(); // โหลดข้อมูลใหม่

    } catch (error: any) {
        toast({
            title: "บันทึกไม่สำเร็จ",
            description: error.message || "เกิดข้อผิดพลาดในการบันทึก",
            variant: "destructive"
        });
    } finally {
        setIsSaving(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const result = await AdminService.deleteUser(userId);
    if (result.success) {
      toast({ title: "สำเร็จ", description: "ลบผู้ใช้เรียบร้อยแล้ว" });
      loadUsers();
    } else {
      // @ts-ignore
      toast({ title: "เกิดข้อผิดพลาด", description: result.error || "ไม่สามารถลบผู้ใช้ได้", variant: "destructive" });
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <>
      <Card className="border-none shadow-none md:border md:shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" /> การจัดการผู้ใช้
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 md:p-6">
            <div className="overflow-x-auto">
                <Table>
                <TableHeader>
                    <TableRow>
                    <TableHead>ชื่อผู้ใช้</TableHead>
                    <TableHead>อีเมล</TableHead>
                    <TableHead>บทบาท</TableHead>
                    <TableHead className="text-right">การจัดการ</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user) => {
                    const role = getUserRole(user);
                    const isMe = currentUser?.id === user.user_id; // เช็คว่าเป็นตัวเองไหม

                    return (
                        <TableRow key={user.id}>
                        <TableCell className="font-medium">
                            <div className="flex items-center gap-2">
                                {getDisplayName(user)}
                                {isMe && <span className="text-xs text-muted-foreground bg-gray-100 px-2 py-0.5 rounded-full">(คุณ)</span>}
                            </div>
                        </TableCell>
                        
                        <TableCell>
                            <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="w-3 h-3" />
                                {user.email || <span className="text-gray-400 italic text-xs">ไม่พบข้อมูล</span>}
                            </div>
                        </TableCell>

                        <TableCell>
                            <Badge className={role === 'admin' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-500 hover:bg-gray-600'}>
                            {role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : <UserCheck className="w-3 h-3 mr-1" />}
                            {role === 'admin' ? 'ผู้ดูแล' : 'ผู้ใช้'}
                            </Badge>
                        </TableCell>
                        
                        <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                            <Button 
                                size="sm" variant="outline" 
                                onClick={() => handleEditClick(user)}
                                className="h-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
                            >
                                <Edit3 className="w-3.5 h-3.5 mr-1" /> แก้ไข
                            </Button>
                            
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive" className="h-8" disabled={isMe}>
                                    <Trash2 className="w-3.5 h-3.5" />
                                </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>ยืนยันการลบผู้ใช้</AlertDialogTitle>
                                    <AlertDialogDescription>
                                    คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ "{getDisplayName(user)}" ? <br/>
                                    การกระทำนี้ไม่สามารถย้อนกลับได้
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                                    <AlertDialogAction 
                                        onClick={() => handleDeleteUser(user.user_id)}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                    ยืนยันลบ
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                            </div>
                        </TableCell>
                        </TableRow>
                    );
                    })}
                </TableBody>
                </Table>
            </div>
        </CardContent>
      </Card>

      {/* --- Dialog (Modal) --- */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>แก้ไขข้อมูลผู้ใช้</DialogTitle>
            <DialogDescription>เปลี่ยนแปลงรายละเอียดของผู้ใช้งานในระบบ</DialogDescription>
          </DialogHeader>
          
          {selectedUser && (
            <div className="grid gap-4 py-4">
              
              {/* อีเมล (Read Only) */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs font-semibold text-gray-500 uppercase">
                    อีเมลบัญชี
                </Label>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-md border border-gray-200 text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">{editFormData.email || 'ไม่พบข้อมูล'}</span>
                </div>
              </div>

              {/* ชื่อที่แสดง */}
              <div className="space-y-2">
                <Label htmlFor="name">ชื่อที่แสดง (Display Name)</Label>
                <Input
                  id="name"
                  value={editFormData.display_name}
                  onChange={(e) => setEditFormData({ ...editFormData, display_name: e.target.value })}
                  placeholder="กรอกชื่อที่ต้องการแสดง"
                />
              </div>

              {/* บทบาท */}
              <div className="space-y-2">
                <Label htmlFor="role">สิทธิ์การใช้งาน (Role)</Label>
                <Select 
                    value={editFormData.role} 
                    onValueChange={(value) => setEditFormData({ ...editFormData, role: value })}
                    disabled={currentUser?.id === selectedUser.user_id} // ป้องกันการลดสิทธิ์ตัวเองจนเข้าหน้า Admin ไม่ได้
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">User (ผู้ใช้ทั่วไป)</SelectItem>
                    <SelectItem value="admin">Admin (ผู้ดูแลระบบ)</SelectItem>
                  </SelectContent>
                </Select>
                {currentUser?.id === selectedUser.user_id && (
                    <p className="text-[10px] text-amber-600">
                        * ไม่สามารถเปลี่ยนสิทธิ์ของตัวเองได้เพื่อป้องกันการถูกล็อกออกจากระบบ
                    </p>
                )}
              </div>

              <div className="border-t my-2"></div>

              {/* เปลี่ยนรหัสผ่าน */}
              <div className="bg-orange-50/50 p-4 rounded-lg border border-orange-100 space-y-3">
                 <Label htmlFor="new-password" className="flex items-center gap-2 text-orange-800 font-semibold text-sm">
                    <Lock className="w-3.5 h-3.5" /> รีเซ็ตรหัสผ่าน (Reset Password)
                 </Label>
                 <Input
                  id="new-password"
                  type="password"
                  placeholder="กรอกรหัสผ่านใหม่ (เว้นว่างไว้ถ้าไม่เปลี่ยน)"
                  value={editFormData.new_password}
                  onChange={(e) => setEditFormData({ ...editFormData, new_password: e.target.value })}
                  className="bg-white"
                />
              </div>

            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>ยกเลิก</Button>
            <Button onClick={handleSaveChanges} disabled={isSaving}>
              {isSaving ? "กำลังบันทึก..." : <><Save className="w-4 h-4 mr-2" /> บันทึก</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserManagement;