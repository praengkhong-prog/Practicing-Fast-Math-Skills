import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient'; // ⚠️ เช็ค path ให้ตรง
import { ArrowLeft, Clock, Calendar } from 'lucide-react';

interface PracticeResult {
  id: string; // หรือ number ตามโครงสร้าง DB
  user_id: string;
  mode: string;
  level: string;
  score: number;
  total_questions: number;
  avg_time_ms: number;
  created_at: string; // ถ้าใน DB ชื่อ create_at ให้แก้ตรงนี้
}

interface PracticeHistoryProps {
  onBack: () => void; // ฟังก์ชันสำหรับปุ่ม "ย้อนกลับ"
}

export default function PracticeHistory({ onBack }: PracticeHistoryProps) {
  const [data, setData] = useState<PracticeResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // ดึงข้อมูล เรียงจากล่าสุดไปเก่าสุด
        const { data: results, error } = await supabase
          .from('practice_results')
          .select('*') // ✅ แก้เป็น * เพื่อดึง id และข้อมูลทั้งหมดให้ตรงกับ Interface
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;
        
        // ✅ เพิ่ม (results as PracticeResult[]) เพื่อแก้ error ตัวแดง
        setData((results as PracticeResult[]) || []);
        
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ฟังก์ชันแปลงเวลา ms เป็น วินาที
  const formatTime = (ms: number) => {
    return (ms / 1000).toFixed(2) + ' วินาที';
  };

  // ฟังก์ชันแปลงวันที่
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('th-TH');
  };

  return (
    <div className="space-y-6">
      {/* Header พร้อมปุ่มย้อนกลับ */}
      <div className="flex items-center space-x-4 mb-6">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800">ประวัติการเข้าใช้งาน (Practice Logs)</h2>
      </div>

      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3">วันที่/เวลา</th>
                <th className="px-6 py-3">User ID</th>
                <th className="px-6 py-3">โหมด</th>
                <th className="px-6 py-3">ระดับ</th>
                <th className="px-6 py-3 text-center">คะแนน</th>
                <th className="px-6 py-3 text-center">เวลาเฉลี่ย/ข้อ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    กำลังโหลดข้อมูล...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    ไม่พบข้อมูลการใช้งาน
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr key={index} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-[150px]" title={item.user_id}>
                      {item.user_id}
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                        {item.mode}
                      </span>
                    </td>
                    <td className="px-6 py-4">{item.level}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-bold text-green-600">
                        {item.score}
                      </span> 
                      <span className="text-gray-400 text-xs"> / {item.total_questions}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {formatTime(item.avg_time_ms)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}