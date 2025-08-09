import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Admin = () => {
  const survey = JSON.parse(localStorage.getItem("bmb:survey") || "[]");
  const results = JSON.parse(localStorage.getItem("bmb:results") || "[]");

  return (
    <main className="container mx-auto px-4 py-10">
      <SEO title="แดชบอร์ดผู้ดูแล — Brainy Math Boost" description="ภาพรวมระบบและการจัดการเนื้อหา" canonical="/admin" />
      <h1 className="mb-6 text-2xl font-bold">แดชบอร์ดผู้ดูแล</h1>
      <Tabs defaultValue="dashboard" className="space-y-4">
        <TabsList>
          <TabsTrigger value="dashboard">สรุป</TabsTrigger>
          <TabsTrigger value="users">ผู้ใช้</TabsTrigger>
          <TabsTrigger value="content">เนื้อหา</TabsTrigger>
          <TabsTrigger value="stats">สถิติรวม</TabsTrigger>
        </TabsList>
        <TabsContent value="dashboard" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader><CardTitle>จำนวนการส่งแบบสำรวจ</CardTitle></CardHeader>
            <CardContent className="text-3xl font-semibold">{survey.length}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>จำนวนเซสชันฝึก</CardTitle></CardHeader>
            <CardContent className="text-3xl font-semibold">{results.length}</CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>สถานะการเชื่อมต่อ</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">ยังไม่เชื่อมต่อฐานข้อมูล • โปรดเชื่อม Supabase เพื่อใช้งานจริง</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="users">
          <Card>
            <CardHeader><CardTitle>การจัดการผู้ใช้</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">ต้องเชื่อมต่อ Supabase เพื่อดู/จัดการผู้ใช้จริง</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="content">
          <Card>
            <CardHeader><CardTitle>การจัดการเนื้อหา</CardTitle></CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <div>• โหมด: บวก, ลบ, คูณ, หาร, ผสม</div>
              <div>• ระดับ: ง่าย, ปานกลาง, ยาก</div>
              <div>• เทคนิค: สามารถเพิ่มชุดเทคนิคได้หลังเชื่อมฐานข้อมูล</div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="stats">
          <Card>
            <CardHeader><CardTitle>สถิติรวม</CardTitle></CardHeader>
            <CardContent className="text-sm text-muted-foreground">เมื่อเชื่อม Supabase จะสามารถดูสถิติระบบแบบเรียลไทม์</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Admin;
