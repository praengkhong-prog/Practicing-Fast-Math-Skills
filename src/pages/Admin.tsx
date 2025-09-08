import SEO from "@/components/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import UserManagement from "@/components/admin/UserManagement";
import SystemStats from "@/components/admin/SystemStats";
import ContentManager from "@/components/admin/ContentManager";
import { Settings, BarChart3, Users, BookOpen } from "lucide-react";

const Admin = () => {
  const { user } = useAuth();

  return (
    <main className="container mx-auto px-4 py-10">
      <SEO 
        title="แดชบอร์ดผู้ดูแล — Brainy Math Boost" 
        description="ภาพรวมระบบและการจัดการเนื้อหา" 
        canonical="/admin" 
      />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          แดชบอร์ดผู้ดูแล
        </h1>
        <p className="text-muted-foreground mt-2">
          จัดการระบบและตรวจสอบข้อมูลการใช้งาน
        </p>
      </div>

      <Tabs defaultValue="dashboard" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            สถิติ
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            ผู้ใช้
          </TabsTrigger>
          <TabsTrigger value="content" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            เนื้อหา
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            ตั้งค่า
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <SystemStats />
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <UserManagement />
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <ContentManager />
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <div className="grid gap-6">
            {/* System Settings */}
            <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  การตั้งค่าระบบ
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">การแจ้งเตือน</h4>
                      <p className="text-sm text-muted-foreground">เปิด/ปิดการแจ้งเตือนผู้ใช้ใหม่</p>
                    </div>
                    <div className="text-sm text-muted-foreground">เปิดใช้งาน</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">ข้อมูลการใช้งาน</h4>
                      <p className="text-sm text-muted-foreground">เก็บสถิติการใช้งานผู้ใช้</p>
                    </div>
                    <div className="text-sm text-muted-foreground">เปิดใช้งาน</div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">โหมดบำรุงรักษา</h4>
                      <p className="text-sm text-muted-foreground">ปิดระบบชั่วคราวเพื่อบำรุงรักษา</p>
                    </div>
                    <div className="text-sm text-muted-foreground">ปิดใช้งาน</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Admin;
