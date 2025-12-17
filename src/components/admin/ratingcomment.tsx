import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient'; // ⚠️ ตรวจสอบ path ให้ตรงกับโปรเจกต์คุณ
import { ArrowLeft, Calendar, Star, MessageSquare, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

// กำหนด Type ให้ตรงกับตารางใน Database
interface SurveyResponse {
  id: string; // ควรมี id ไว้ใช้เป็น key (ถ้าใน DB ไม่มีให้ลบออก)
  user_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

interface SurveyResultsProps {
  onBack: () => void;
}

export default function SurveyResults({ onBack }: SurveyResultsProps) {
  const [data, setData] = useState<SurveyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        setLoading(true);
        // ดึงข้อมูลจากตาราง survey_responses
        const { data: results, error } = await supabase
          .from('survey_responses')
          .select('id, user_id, rating, comment, created_at') // เลือก field ที่ต้องการ
          .order('created_at', { ascending: false }); // เรียงจากใหม่ไปเก่า

        if (error) throw error;
        
        setData((results as SurveyResponse[]) || []);
      } catch (err) {
        console.error('Error fetching surveys:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, []);

  // ฟังก์ชันแปลงวันที่
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('th-TH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ฟังก์ชันแสดงดาวตามคะแนน Rating
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
      {/* Header + Back Button */}
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
                  <th className="px-6 py-4 w-[150px]">User ID</th>
                  <th className="px-6 py-4 w-[180px]">ความพึงพอใจ</th>
                  <th className="px-6 py-4">ความคิดเห็น</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">กำลังโหลดข้อมูล...</td></tr>
                ) : data.length === 0 ? (
                  <tr><td colSpan={4} className="px-6 py-8 text-center text-gray-500">ไม่พบข้อมูลผลสำรวจ</td></tr>
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

                      {/* User ID */}
                      <td className="px-6 py-4 align-top">
                         <div className="flex items-center gap-2 text-gray-700 font-mono text-xs">
                            <User className="w-4 h-4 text-gray-400" />
                            <span className="truncate max-w-[120px]" title={item.user_id}>
                                {item.user_id}
                            </span>
                         </div>
                      </td>

                      {/* Rating (Stars) */}
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