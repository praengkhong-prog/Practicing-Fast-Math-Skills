import { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client'; 
import { 
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription 
} from "@/components/ui/dialog";
import { Star, Eye, User, Calendar, MessageSquare, ArrowLeft, Loader2 } from "lucide-react";

interface SurveyResultsProps {
  onBack?: () => void;
}

interface SurveySubmission {
  id: string;
  created_at: string;
  user_email: string;
  user_name: string;
  rating: number; 
  comment: string | null;
}

interface UserSummary {
  email: string;
  name: string;
  totalSubmissions: number;
  averageRating: number;
  lastSubmission: string;
  history: SurveySubmission[];
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-4 h-4 ${
            star <= Math.round(rating) 
              ? "fill-yellow-400 text-yellow-400" 
              : "text-gray-300"
          }`}
        />
      ))}
      <span className="text-sm text-gray-600 ml-1">({rating.toFixed(1)})</span>
    </div>
  );
};

export default function SurveyResults({ onBack }: SurveyResultsProps) {
  
  const [rawData, setRawData] = useState<SurveySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserSummary | null>(null);

  // const fetchSurveys = async () => {
  //   try {
  //     setLoading(true);
      
  //     // ✅ แก้ไข: ลบ :user_id ออก ให้เหลือแค่ profiles เฉยๆ 
  //     // Supabase จะหาความสัมพันธ์ให้อัตโนมัติ ซึ่งแก้ปัญหา Cache Error ได้
  //     const { data, error } = await supabase
  //       .from('survey_responses')
  //       .select(`
  //         id,
  //         created_at,
  //         rating,
  //         comment,
  //         user_id,
  //         profiles (
  //           email,
  //           display_name
  //         )
  //       `)
  //       .order('created_at', { ascending: false });
  //       console.log("data : " , data);
  //       console.log("error : " , error);
  //     if (error) {

  //       console.error("Error fetching surveys:", error.message);
  //       return;
  //     }

  //     if (data) {
  //       const formattedData: SurveySubmission[] = data.map((item: any) => {
  //         // ดึงข้อมูล Profile อย่างปลอดภัย
  //         // หมายเหตุ: ถ้าไม่ใส่ alias profiles:user_id ข้อมูลจะกลับมาในชื่อ profiles ตรงๆ
  //         const profile = item.profiles; 
          
  //         return {
  //           id: item.id,
  //           created_at: item.created_at,
  //           rating: item.rating,
  //           comment: item.comment,
  //           user_email: profile?.email || 'Unknown Email', 
  //           user_name: profile?.display_name || profile?.email || 'Unknown User'
  //         };
  //       });
        
  //       setRawData(formattedData);
  //     }
  //   } catch (error) {
  //     console.error("Unexpected error:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  type SurveySubmission = {
  id: string;
  created_at: string;
  rating: number;
  comment: string | null;
  user_email: string;
  user_name: string;
};

const fetchSurveys = async () => {
  try {
    setLoading(true);

    // -----------------------------
    // 1) ดึง survey ก่อน
    // -----------------------------
    const { data: surveys, error: sErr } = await supabase
      .from("survey_responses")
      .select("id, created_at, rating, comment, user_id")
      .order("created_at", { ascending: false });

    console.log("surveys:", surveys);
    console.log("survey error:", sErr);

    if (sErr) {
      console.error("Error fetching surveys:", sErr.message);
      return;
    }

    const safeSurveys = surveys ?? [];

    // -----------------------------
    // 2) รวม userIds ไม่ให้ซ้ำ + ตัด null/undefined ออก
    // -----------------------------
    const userIds = Array.from(
      new Set(
        safeSurveys
          .map((s: any) => s.user_id)
          .filter((id: any) => !!id)
      )
    );

    console.log("userIds:", userIds);

    // -----------------------------
    // 3) ดึง profiles ตาม userIds (ถ้ามี)
    // -----------------------------
    let profileById: Record<string, { email: string | null; display_name: string | null }> = {};

    if (userIds.length > 0) {
      const { data: profiles, error: pErr } = await supabase
        .from("profiles")
        .select("user_id, email, display_name")
        .in("user_id", userIds);

      console.log("profiles:", profiles);
      console.log("profiles error:", pErr);

      if (pErr) {
        console.error("Error fetching profiles:", pErr.message);
        // ไม่ return ก็ได้ ถ้าอยากให้ยังโชว์ survey ต่อไปโดย profile เป็น null
        // return;
      } else {
        profileById = Object.fromEntries(
          (profiles ?? []).map((p: any) => [
            p.user_id,
            { email: p.email ?? null, display_name: p.display_name ?? null },
          ])
        );
      }
    }

    // -----------------------------
    // 4) merge ให้ได้รูปแบบเหมือน select profiles(...)
    // -----------------------------
    const merged = safeSurveys.map((s: any) => ({
      ...s,
      profiles: s.user_id ? profileById[s.user_id] ?? null : null,
    }));

    console.log("merged:", merged);

    // -----------------------------
    // 5) format เป็น SurveySubmission (แบบที่คุณใช้ setRawData)
    // -----------------------------
    const formattedData: SurveySubmission[] = merged.map((item: any) => {
      const profile = item.profiles;

      return {
        id: item.id,
        created_at: item.created_at,
        rating: item.rating,
        comment: item.comment,
        user_email: profile?.email || "Unknown Email",
        user_name: profile?.display_name || profile?.email || "Unknown User",
      };
    });

    setRawData(formattedData);
  } catch (error) {
    console.error("Unexpected error:", error);
  } finally {
    setLoading(false);
  }
};
  useEffect(() => {
    fetchSurveys();
  }, []);

  const groupedData = useMemo(() => {
    const map = new Map<string, UserSummary>();

    rawData.forEach((item) => {
      if (!map.has(item.user_email)) {
        map.set(item.user_email, {
          email: item.user_email,
          name: item.user_name,
          totalSubmissions: 0,
          averageRating: 0, 
          lastSubmission: item.created_at,
          history: []
        });
      }

      const user = map.get(item.user_email)!;
      user.history.push(item);
      user.totalSubmissions += 1;
      
      if (new Date(item.created_at) > new Date(user.lastSubmission)) {
        user.lastSubmission = item.created_at;
      }
    });

    return Array.from(map.values()).map(user => {
      const totalScore = user.history.reduce((sum, curr) => sum + curr.rating, 0);
      user.averageRating = totalScore / user.totalSubmissions;
      user.history.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return user;
    });
  }, [rawData]);

  const systemAverage = groupedData.length > 0 
    ? groupedData.reduce((sum, user) => sum + user.averageRating, 0) / groupedData.length 
    : 0;

  if (loading) {
      return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;
  }

  return (
    <div className="space-y-6">
      
      <div className="flex items-center gap-4">
        {onBack && (
            <Button variant="outline" size="icon" onClick={onBack}>
                <ArrowLeft className="w-4 h-4" />
            </Button>
        )}
        <h1 className="text-2xl font-bold text-gray-800">สรุปผลความพึงพอใจ (Survey Summary)</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">ความพึงพอใจเฉลี่ย (ทั้งระบบ)</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold flex items-center gap-2">
                {systemAverage.toFixed(2)} / 5.0
                <Star className="text-yellow-400 fill-yellow-400 w-6 h-6" />
             </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">จำนวนผู้ทำแบบสำรวจ</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">{groupedData.length} คน</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">จำนวนครั้งที่ส่งทั้งหมด</CardTitle>
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">{rawData.length} ครั้ง</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>รายชื่อผู้ใช้งานและการประเมิน</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ผู้ใช้งาน</TableHead>
                <TableHead className="text-center">จำนวนครั้งที่ทำ</TableHead>
                <TableHead>ความพึงพอใจเฉลี่ย</TableHead>
                <TableHead>ส่งล่าสุดเมื่อ</TableHead>
                <TableHead className="text-right">จัดการ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {groupedData.length > 0 ? (
                groupedData.map((user) => (
                  <TableRow key={user.email}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium flex items-center gap-2">
                          <User className="w-4 h-4" /> {user.name}
                        </span>
                        <span className="text-xs text-gray-500 ml-6">{user.email}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.totalSubmissions} ครั้ง
                      </span>
                    </TableCell>
                    <TableCell>
                      <StarRating rating={user.averageRating} />
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {new Date(user.lastSubmission).toLocaleDateString('th-TH', {
                          day: 'numeric', month: 'short', year: '2-digit', hour: '2-digit', minute:'2-digit'
                      })}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedUser(user)}
                          className="gap-2 text-blue-600 hover:text-blue-700"
                      >
                          <Eye className="w-4 h-4" /> ดูประวัติ
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-gray-500">
                    <div className="flex flex-col items-center gap-2">
                        <span>ไม่พบข้อมูลแบบสำรวจในระบบ</span>
                        <span className="text-xs text-red-400 font-light">(หากมีข้อมูลใน Database แต่ไม่ขึ้นตรงนี้ ให้ตรวจสอบ RLS Policy ใน Supabase)</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!selectedUser} onOpenChange={(open) => !open && setSelectedUser(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
                <MessageSquare className="w-5 h-5 text-blue-600" />
                ประวัติการประเมิน: {selectedUser?.name}
            </DialogTitle>
            <DialogDescription>
                อีเมล: {selectedUser?.email} | เฉลี่ย: {selectedUser?.averageRating.toFixed(2)}/5
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 space-y-4">
            {selectedUser?.history.map((record, index) => (
                <div key={record.id} className="p-4 border rounded-lg bg-gray-50 hover:bg-white transition-colors">
                    <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="font-bold text-gray-700">ครั้งที่ {selectedUser.history.length - index}</span>
                            <span>•</span>
                            <Calendar className="w-3 h-3" />
                            {new Date(record.created_at).toLocaleDateString('th-TH', {
                                day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                            })}
                        </div>
                        <StarRating rating={record.rating} />
                    </div>
                    
                    <div className="text-sm text-gray-700 bg-white p-3 rounded border border-gray-100 shadow-sm min-h-[50px]">
                        <span className="font-semibold text-gray-900">ความเห็น: </span>
                        {record.comment ? record.comment : <span className="text-gray-400">- ไม่มีข้อเสนอแนะ -</span>}
                    </div>
                </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}