import { useState, useEffect } from 'react';
import { Users, Shield, Trash2, Edit3, UserCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AdminService } from '@/services/AdminService';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

interface User {
  id: string;
  user_id: string;
  display_name: string;
  created_at: string;
  user_roles: Array<{ role: string; created_at: string }>;
}

const UserManagement = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const loadUsers = async () => {
    setLoading(true);
    const result = await AdminService.getAllUsers();
    if (result.success) {
      setUsers(result.data || []);
    } else {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลผู้ใช้ได้",
        variant: "destructive"
      });
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId: string, newRole: 'admin' | 'user') => {
    const result = await AdminService.updateUserRole(userId, newRole);
    if (result.success) {
      toast({
        title: "สำเร็จ",
        description: `เปลี่ยนบทบาทผู้ใช้เป็น ${newRole} แล้ว`
      });
      loadUsers();
    } else {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเปลี่ยนบทบาทได้",
        variant: "destructive"
      });
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const result = await AdminService.deleteUser(userId);
    if (result.success) {
      toast({
        title: "สำเร็จ",
        description: "ลบผู้ใช้แล้ว"
      });
      loadUsers();
    } else {
      toast({
        title: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถลบผู้ใช้ได้",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const getUserRole = (user: User) => {
    return user.user_roles?.[0]?.role || 'user';
  };

  const formatUserId = (userId: string) => {
    // แสดง 8 ตัวอักษรแรกและ 4 ตัวสุดท้าย
    return `${userId.slice(0, 8)}...${userId.slice(-4)}`;
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            การจัดการผู้ใช้
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          การจัดการผู้ใช้
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            ไม่มีข้อมูลผู้ใช้
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ชื่อผู้ใช้</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>บทบาท</TableHead>
                <TableHead>วันที่สมัคร</TableHead>
                <TableHead>การจัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => {
                const role = getUserRole(user);
                return (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.display_name || 'ไม่ระบุชื่อ'}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      <span title={user.user_id} className="cursor-help">
                        {formatUserId(user.user_id)}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={role === 'admin' ? 'default' : 'secondary'}>
                        {role === 'admin' ? (
                          <>
                            <Shield className="w-3 h-3 mr-1" />
                            ผู้ดูแล
                          </>
                        ) : (
                          <>
                            <UserCheck className="w-3 h-3 mr-1" />
                            ผู้ใช้
                          </>
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {new Date(user.created_at).toLocaleDateString('th-TH')}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleRoleChange(user.user_id, role === 'admin' ? 'user' : 'admin')}
                        >
                          <Edit3 className="w-4 h-4 mr-1" />
                          {role === 'admin' ? 'ลดบทบาท' : 'เพิ่มผู้ดูแล'}
                        </Button>
                        
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4 mr-1" />
                              ลบ
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>ยืนยันการลบผู้ใช้</AlertDialogTitle>
                              <AlertDialogDescription>
                                คุณแน่ใจหรือไม่ว่าต้องการลบผู้ใช้ "{user.display_name}" 
                                การดำเนินการนี้ไม่สามารถยกเลิกได้
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>ยกเลิก</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteUser(user.user_id)}>
                                ลบผู้ใช้
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
        )}
      </CardContent>
    </Card>
  );
};

export default UserManagement;