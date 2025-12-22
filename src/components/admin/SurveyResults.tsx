// import { useState, useEffect } from 'react';
// import { AdminService } from '@/services/AdminService';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
// import { Button } from '@/components/ui/button';
// import { ArrowLeft, Star, MessageSquare, Calendar, User } from 'lucide-react';

// // 1. แก้ไข Interface ให้ตรงกับข้อมูลจริง (เปลี่ยน suggestion เป็น comment)
// interface SurveyResponse {
//   id: string;
//   created_at: string;
//   rating: number;
//   comment?: string; // เปลี่ยนจาก suggestion เป็น comment (และใส่ ? เผื่อเป็น null)
  
//   // ปรับ profiles ให้รองรับข้อมูลที่ Join มา (อาจเป็น Array หรือ Object เดียวก็ได้ แล้วแต่ Query)
//   profiles?: {
//     display_name: string;
//     email: string;
//   } | null; // เพิ่ม | null เผื่อหาไม่เจอ
// }

// interface SurveyResultsProps {
//   onBack: () => void;
// }

// const SurveyResults = ({ onBack }: SurveyResultsProps) => {
//   const [surveys, setSurveys] = useState<SurveyResponse[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSurveys = async () => {
//       setLoading(true);
//       const result = await AdminService.getSurveyResponses();
//       if (result.success) {
//         // 2. ใช้ as unknown as ... เพื่อแก้ error Type Mismatch
//         // (บังคับบอก TypeScript ว่าข้อมูลนี้คือ SurveyResponse[] นะ เชื่อฉันเถอะ)
//         setSurveys((result.data as unknown) as SurveyResponse[]);
//       }
//       setLoading(false);
//     };

//     fetchSurveys();
//   }, []);

//   const renderStars = (rating: number) => {
//     return (
//       <div className="flex gap-1">
//         {[...Array(5)].map((_, i) => (
//           <Star 
//             key={i} 
//             className={`w-4 h-4 ${i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
//           />
//         ))}
//       </div>
//     );
//   };

//   if (loading) {
//     return <div className="p-8 text-center">กำลังโหลดข้อมูลแบบสอบถาม...</div>;
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center gap-4">
//         <Button variant="outline" size="sm" onClick={onBack}>
//           <ArrowLeft className="w-4 h-4 mr-2" /> กลับ
//         </Button>
//         <h2 className="text-2xl font-bold tracking-tight">ผลสำรวจความพึงพอใจ</h2>
//       </div>

//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <MessageSquare className="h-5 w-5" />
//             รายการตอบกลับ ({surveys.length})
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>วันที่</TableHead>
//                 <TableHead>ผู้ใช้งาน</TableHead>
//                 <TableHead>คะแนน</TableHead>
//                 <TableHead>ความคิดเห็น / ข้อเสนอแนะ</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {surveys.length === 0 ? (
//                 <TableRow>
//                   <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
//                     ยังไม่มีข้อมูลการตอบแบบสอบถาม
//                   </TableCell>
//                 </TableRow>
//               ) : (
//                 surveys.map((item) => {
//                     // ตรวจสอบข้อมูล profile (บางทีอาจมาเป็น Array หรือ Object)
//                     // ถ้า data มาแบบ profiles: [...] (Array) ให้ดึงตัวแรก
//                     // ถ้า data มาแบบ profiles: {...} (Object) ให้ใช้เลย
//                     const profileData = Array.isArray(item.profiles) 
//                         ? item.profiles[0] 
//                         : item.profiles;

//                     return (
//                       <TableRow key={item.id}>
//                         <TableCell className="font-medium whitespace-nowrap">
//                           <div className="flex items-center gap-2">
//                             <Calendar className="w-4 h-4 text-gray-400" />
//                             {new Date(item.created_at).toLocaleDateString('th-TH', {
//                                 year: 'numeric',
//                                 month: 'short',
//                                 day: 'numeric',
//                                 hour: '2-digit',
//                                 minute: '2-digit'
//                             })}
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                           <div className="flex flex-col">
//                             <span className="flex items-center gap-2 font-medium">
//                                 <User className="w-3 h-3" />
//                                 {profileData?.display_name || 'ไม่ระบุชื่อ'}
//                             </span>
//                             <span className="text-xs text-muted-foreground ml-5">
//                                 {profileData?.email}
//                             </span>
//                           </div>
//                         </TableCell>
//                         <TableCell>
//                             {renderStars(item.rating || 0)}
//                         </TableCell>
//                         <TableCell className="max-w-[400px]">
//                             {/* 3. แก้ไขการเรียกใช้ตัวแปรจาก suggestion เป็น comment */}
//                             {item.comment ? (
//                                 <span className="text-sm">{item.comment}</span>
//                             ) : (
//                                 <span className="text-xs text-gray-400 italic">- ไม่มีข้อความ -</span>
//                             )}
//                         </TableCell>
//                       </TableRow>
//                     );
//                 })
//               )}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>
//     </div>
//   );
// };

// export default SurveyResults;



// import { useState, useEffect } from 'react';
// import { supabase } from '@/supabaseClient'; // ⚠️ ตรวจสอบ path ให้ตรงกับโปรเจกต์คุณ
// import { ArrowLeft, Calendar, Star, MessageSquare, User } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/card';

// // กำหนด Type ให้ตรงกับตารางใน Database
// interface SurveyResponse {
//   id: string; // ควรมี id ไว้ใช้เป็น key (ถ้าใน DB ไม่มีให้ลบออก)
//   user_id: string;
//   rating: number;
//   comment: string;
//   created_at: string;
// }

// interface SurveyResultsProps {
//   onBack: () => void;
// }

// export default function SurveyResults({ onBack }: SurveyResultsProps) {
//   const [data, setData] = useState<SurveyResponse[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSurveys = async () => {
//       try {
//         setLoading(true);
//         // ดึงข้อมูลจากตาราง survey_responses
//         const { data: results, error } = await supabase
//           .from('survey_responses')
//           .select('id, user_id, rating, comment, created_at') // เลือก field ที่ต้องการ
//           .order('created_at', { ascending: false }); // เรียงจากใหม่ไปเก่า

//         if (error) throw error;
        
//         setData((results as SurveyResponse[]) || []);
//       } catch (err) {
//         console.error('Error fetching surveys:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSurveys();
//   }, []);

//   // ฟังก์ชันแปลงวันที่
//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleString('th-TH', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   // ฟังก์ชันแสดงดาวตามคะแนน Rating
//   const renderStars = (rating: number) => {
//     return (
//       <div className="flex text-yellow-400">
//         {[...Array(5)].map((_, i) => (
//           <Star 
//             key={i} 
//             className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-gray-300'}`} 
//           />
//         ))}
//         <span className="ml-2 text-gray-600 text-xs pt-0.5">({rating}/5)</span>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header + Back Button */}
//       <div className="flex items-center space-x-4">
//         <button 
//           onClick={onBack}
//           className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 text-gray-600"
//         >
//           <ArrowLeft className="w-5 h-5" />
//           <span>ย้อนกลับ</span>
//         </button>
//         <h2 className="text-2xl font-bold text-gray-800">ผลสำรวจความพึงพอใจ (Survey Results)</h2>
//       </div>

//       <Card>
//         <CardContent className="p-0 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm text-left">
//               <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
//                 <tr>
//                   <th className="px-6 py-4 w-[200px]">วันที่/เวลา</th>
//                   <th className="px-6 py-4 w-[150px]">User ID</th>
//                   <th className="px-6 py-4 w-[180px]">ความพึงพอใจ</th>
//                   <th className="px-6 py-4">ความคิดเห็น</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {loading ? (
//                   <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">กำลังโหลดข้อมูล...</td></tr>
//                 ) : data.length === 0 ? (
//                   <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">ไม่พบข้อมูลผลสำรวจ</td></tr>
//                 ) : (
//                   data.map((item, index) => (
//                     <tr key={item.id || index} className="bg-white hover:bg-gray-50 transition-colors">
//                       {/* วันที่ */}
//                       <td className="px-6 py-4 text-gray-500 whitespace-nowrap align-top">
//                         <div className="flex items-center gap-2">
//                           <Calendar className="w-4 h-4 text-gray-400" />
//                           {formatDate(item.created_at)}
//                         </div>
//                       </td>

//                       {/* User ID */}
//                       <td className="px-6 py-4 align-top">
//                          <div className="flex items-center gap-2 text-gray-700 font-mono text-xs">
//                             <User className="w-4 h-4 text-gray-400" />
//                             <span className="truncate max-w-[120px]" title={item.user_id}>
//                                 {item.user_id}
//                             </span>
//                          </div>
//                       </td>

//                       {/* Rating (Stars) */}
//                       <td className="px-6 py-4 align-top">
//                         {renderStars(item.rating)}
//                       </td>

//                       {/* Comment */}
//                       <td className="px-6 py-4 text-gray-600 align-top">
//                         <div className="flex gap-2">
//                             <MessageSquare className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
//                             <p className="text-sm leading-relaxed">
//                                 {item.comment ? item.comment : <span className="text-gray-400 italic">- ไม่มีความคิดเห็น -</span>}
//                             </p>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


// import { useState, useEffect } from 'react';
// // import { supabase } from '@/supabaseClient'; // ❌ ไม่ใช้แล้ว ให้ใช้ Service แทน
// import { AdminService } from '@/services/AdminService'; // ✅ เรียกใช้ Service
// import { ArrowLeft, Calendar, Star, MessageSquare, User, Mail } from 'lucide-react';
// import { Card, CardContent } from '@/components/ui/card';

// // ปรับ Interface ให้รองรับข้อมูล profiles ที่ Service ส่งมา
// interface SurveyResponse {
//   id: string;
//   user_id: string;
//   rating: number;
//   comment: string;
//   created_at: string;
//   // ✅ เพิ่มส่วนนี้
//   profiles?: {
//     display_name?: string;
//     email?: string;
//   };
// }

// interface SurveyResultsProps {
//   onBack: () => void;
// }

// export default function SurveyResults({ onBack }: SurveyResultsProps) {
//   const [data, setData] = useState<SurveyResponse[]>([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchSurveys = async () => {
//       try {
//         setLoading(true);
        
//         // ✅ เปลี่ยนมาใช้ AdminService ที่เราแก้ไปเมื่อกี้
//         const result = await AdminService.getSurveyResponses();
        
//         if (result.success) {
//            setData((result.data as unknown) as SurveyResponse[]);
//         } else {
//            console.error('Error fetching surveys:', result.error);
//         }

//       } catch (err) {
//         console.error('Error fetching surveys:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchSurveys();
//   }, []);

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleString('th-TH', {
//       year: 'numeric',
//       month: 'long',
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit',
//     });
//   };

//   const renderStars = (rating: number) => {
//     return (
//       <div className="flex text-yellow-400">
//         {[...Array(5)].map((_, i) => (
//           <Star 
//             key={i} 
//             className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-gray-300'}`} 
//           />
//         ))}
//         <span className="ml-2 text-gray-600 text-xs pt-0.5">({rating}/5)</span>
//       </div>
//     );
//   };

//   return (
//     <div className="space-y-6">
//       <div className="flex items-center space-x-4">
//         <button 
//           onClick={onBack}
//           className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 text-gray-600"
//         >
//           <ArrowLeft className="w-5 h-5" />
//           <span>ย้อนกลับ</span>
//         </button>
//         <h2 className="text-2xl font-bold text-gray-800">ผลสำรวจความพึงพอใจ (Survey Results)</h2>
//       </div>

//       <Card>
//         <CardContent className="p-0 overflow-hidden">
//           <div className="overflow-x-auto">
//             <table className="w-full text-sm text-left">
//               <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
//                 <tr>
//                   <th className="px-6 py-4 w-[200px]">วันที่/เวลา</th>
//                   {/* เปลี่ยนหัวตารางจาก User ID เป็น ผู้ใช้งาน */}
//                   <th className="px-6 py-4 w-[250px]">ผู้ใช้งาน</th>
//                   <th className="px-6 py-4 w-[180px]">ความพึงพอใจ</th>
//                   <th className="px-6 py-4">ความคิดเห็น</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-gray-100">
//                 {loading ? (
//                   <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">กำลังโหลดข้อมูล...</td></tr>
//                 ) : data.length === 0 ? (
//                   <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">ไม่พบข้อมูลผลสำรวจ</td></tr>
//                 ) : (
//                   data.map((item, index) => (
//                     <tr key={item.id || index} className="bg-white hover:bg-gray-50 transition-colors">
//                       {/* วันที่ */}
//                       <td className="px-6 py-4 text-gray-500 whitespace-nowrap align-top">
//                         <div className="flex items-center gap-2">
//                           <Calendar className="w-4 h-4 text-gray-400" />
//                           {formatDate(item.created_at)}
//                         </div>
//                       </td>

//                       {/* ✅ แสดงชื่อผู้ใช้ และ อีเมล */}
//                       <td className="px-6 py-4 align-top">
//                           <div className="flex flex-col">
//                              <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
//                                 <User className="w-4 h-4 text-blue-500" />
//                                 {/* แสดงชื่อ Display Name ถ้าไม่มีให้แสดง ID บางส่วน */}
//                                 <span>
//                                     {item.profiles?.display_name || item.user_id.substring(0,8) + '...'}
//                                 </span>
//                              </div>
                             
//                              {/* แสดงอีเมลตัวเล็กๆ ด้านล่าง */}
//                              {item.profiles?.email && (
//                                 <div className="flex items-center gap-1.5 mt-1 ml-0.5 text-gray-400 text-xs">
//                                    <Mail className="w-3 h-3" />
//                                    <span>{item.profiles.email}</span>
//                                 </div>
//                              )}
//                           </div>
//                       </td>

//                       {/* Rating */}
//                       <td className="px-6 py-4 align-top">
//                         {renderStars(item.rating)}
//                       </td>

//                       {/* Comment */}
//                       <td className="px-6 py-4 text-gray-600 align-top">
//                         <div className="flex gap-2">
//                             <MessageSquare className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
//                             <p className="text-sm leading-relaxed">
//                                 {item.comment ? item.comment : <span className="text-gray-400 italic">- ไม่มีความคิดเห็น -</span>}
//                             </p>
//                         </div>
//                       </td>
//                     </tr>
//                   ))
//                 )}
//               </tbody>
//             </table>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }





import { useState, useEffect } from 'react';
// ✅ เรียกใช้ AdminService
import { AdminService } from '@/services/AdminService'; 
// ✅ เพิ่ม Trash2 (รูปถังขยะ) เข้ามา
import { ArrowLeft, Calendar, Star, MessageSquare, User, Mail, Trash2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface SurveyResponse {
  id: string;
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
  profiles?: {
    display_name?: string;
    email?: string;
  };
}

interface SurveyResultsProps {
  onBack: () => void;
}

export default function SurveyResults({ onBack }: SurveyResultsProps) {
  const [data, setData] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      setLoading(true);
      const result = await AdminService.getSurveyResponses();
      if (result.success) {
           setData((result.data as unknown) as SurveyResponse[]);
      } else {
           console.error('Error fetching surveys:', result.error);
      }
    } catch (err) {
      console.error('Error fetching surveys:', err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ ฟังก์ชันสำหรับลบข้อมูล
  const handleDelete = async (id: string) => {
    // 1. ถามยืนยัน
    if (!window.confirm("คุณแน่ใจหรือไม่ที่จะลบความคิดเห็นนี้?")) return;

    try {
      // 2. เรียกใช้ Service เพื่อสั่งลบ
      const result = await AdminService.deleteSurveyResponse(id);
      
      if (result.success) {
        // 3. ลบสำเร็จ -> อัปเดตหน้าจอโดยเอาตัวนั้นออกทันที
        setData(prev => prev.filter(item => item.id !== id));
        alert("ลบข้อมูลเรียบร้อยแล้ว");
      } else {
        alert("เกิดข้อผิดพลาดในการลบข้อมูล: " + result.error);
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('th-TH', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex text-yellow-400">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? 'fill-current' : 'text-gray-300'}`} 
          />
        ))}
        <span className="ml-2 text-gray-600 text-xs pt-0.5">({rating}/5)</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 text-gray-600"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>ย้อนกลับ</span>
        </button>
        <h2 className="text-2xl font-bold text-gray-800">ผลสำรวจความพึงพอใจ (Survey Results)</h2>
      </div>

      <Card>
        <CardContent className="p-0 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 w-[200px]">วันที่/เวลา</th>
                  <th className="px-6 py-4 w-[250px]">ผู้ใช้งาน</th>
                  <th className="px-6 py-4 w-[180px]">ความพึงพอใจ</th>
                  <th className="px-6 py-4">ความคิดเห็น</th>
                  {/* ✅ เพิ่มหัวตาราง "จัดการ" ตรงนี้ */}
                  <th className="px-6 py-4 w-[100px] text-center">จัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">กำลังโหลดข้อมูล...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan={5} className="px-6 py-8 text-center text-gray-500">ไม่พบข้อมูลผลสำรวจ</td></tr>
                ) : (
                  data.map((item, index) => (
                    <tr key={item.id || index} className="bg-white hover:bg-gray-50 transition-colors">
                      {/* วันที่ */}
                      <td className="px-6 py-4 text-gray-500 whitespace-nowrap align-top">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          {formatDate(item.created_at)}
                        </div>
                      </td>

                      {/* ผู้ใช้งาน */}
                      <td className="px-6 py-4 align-top">
                          <div className="flex flex-col">
                             <div className="flex items-center gap-2 text-gray-800 font-semibold text-sm">
                                <User className="w-4 h-4 text-blue-500" />
                                <span>
                                    {item.profiles?.display_name || item.user_id.substring(0,8) + '...'}
                                </span>
                             </div>
                             
                             {item.profiles?.email && (
                                <div className="flex items-center gap-1.5 mt-1 ml-0.5 text-gray-400 text-xs">
                                   <Mail className="w-3 h-3" />
                                   <span>{item.profiles.email}</span>
                                </div>
                             )}
                          </div>
                      </td>

                      {/* Rating */}
                      <td className="px-6 py-4 align-top">
                        {renderStars(item.rating)}
                      </td>

                      {/* Comment */}
                      <td className="px-6 py-4 text-gray-600 align-top">
                        <div className="flex gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0" />
                            <p className="text-sm leading-relaxed">
                                {item.comment ? item.comment : <span className="text-gray-400 italic">- ไม่มีความคิดเห็น -</span>}
                            </p>
                        </div>
                      </td>

                      {/* ✅ ปุ่มลบ (Trash Icon) */}
                      <td className="px-6 py-4 align-top text-center">
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
                          title="ลบข้อมูล"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}