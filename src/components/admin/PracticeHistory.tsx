


// import { useState, useEffect, useMemo } from 'react';
// import { supabase } from '@/supabaseClient'; // ⚠️ เช็ค path ให้ตรงกับโปรเจกต์คุณ
// import { ArrowLeft, Filter, XCircle } from 'lucide-react';

// // 1. ปรับ Interface ให้ mode รองรับ null ได้ (กันไว้ก่อน)
// interface PracticeResult {
//   id: string;
//   user_id: string;
//   mode: string | null; // แก้เป็น string | null
//   level: string;
//   score: number;
//   total_questions: number;
//   avg_time_ms: number;
//   created_at: string;
// }

// interface PracticeHistoryProps {
//   onBack: () => void;
// }

// export default function PracticeHistory({ onBack }: PracticeHistoryProps) {
//   const [data, setData] = useState<PracticeResult[]>([]);
//   const [loading, setLoading] = useState(true);

//   const [selectedMode, setSelectedMode] = useState<string>('all');
//   const [selectedLevel, setSelectedLevel] = useState<string>('all');

//   // ฟังก์ชันแสดงชื่อโหมด (จุดที่เคย Error)
//   // แก้ไข: รับค่า null/undefined ได้ และเช็คก่อนใช้งาน .length
//   const formatModeName = (modeName: string | null | undefined) => {
//     if (!modeName) return '-'; // ถ้าไม่มีข้อมูล ให้ขีดแดช หรือคืนค่าว่าง
    
//     if (modeName === 'mixed') return 'Mixed (รวมมิตร)';
//     if (modeName.length > 10) return modeName.substring(0, 8) + '...';
//     return modeName;
//   };

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const { data: results, error } = await supabase
//           .from('practice_results')
//           .select('*')
//           .order('created_at', { ascending: false })
//           .limit(100);

//           console.log("ข้อมูลที่ได้จาก Supabase:", results);

//         if (error) throw error;
//         setData((results as PracticeResult[]) || []);
//       } catch (err) {
//         console.error('Error fetching history:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // ดึงรายการ Mode (เพิ่มการกรองค่า null ออก)
//   const modeOptions = useMemo(() => {
//     const modes = Array.from(new Set(
//       data
//         .map(item => item.mode)
//         .filter((m): m is string => m !== null && m !== undefined && m !== '') // กรองค่าว่างทิ้ง
//     ));
//     return modes.sort();
//   }, [data]);

//   const levelOptions = useMemo(() => {
//     const levels = Array.from(new Set(data.map(item => item.level)));
//     return levels.sort();
//   }, [data]);

//   // Logic การกรองข้อมูล
//   const filteredData = data.filter((item) => {
//     const matchMode = selectedMode === 'all' || item.mode === selectedMode;
//     const matchLevel = selectedLevel === 'all' || item.level === selectedLevel;
//     return matchMode && matchLevel;
//   });

//   const formatTime = (ms: number) => {
//     if (!ms) return '0.00 วินาที';
//     return (ms / 1000).toFixed(2) + ' วินาที';
//   };

//   const formatDate = (dateString: string) => {
//     if (!dateString) return '-';
//     return new Date(dateString).toLocaleString('th-TH');
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header พร้อมปุ่มย้อนกลับ */}
//       <div className="flex items-center justify-between mb-6">
//         <div className="flex items-center space-x-4">
//           <button 
//             onClick={onBack}
//             className="p-2 hover:bg-gray-100 rounded-full transition-colors"
//           >
//             <ArrowLeft className="w-6 h-6 text-gray-600" />
//           </button>
//           <h2 className="text-2xl font-bold text-gray-800">ประวัติการเข้าใช้งาน (Practice Logs)</h2>
//         </div>
//       </div>

//       {/* --- ส่วนตัวกรองข้อมูล (Filter Bar) --- */}
//       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 items-center flex-wrap">
//         <div className="flex items-center gap-2 text-gray-600 font-medium">
//             <Filter className="w-4 h-4" />
//             <span>ตัวกรอง:</span>
//         </div>

//         {/* Dropdown เลือกโหมด */}
//         <select
//             value={selectedMode}
//             onChange={(e) => setSelectedMode(e.target.value)}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 min-w-[150px]"
//         >
//             <option value="all">ทุกโหมด (All Modes)</option>
//             {modeOptions.map(mode => (
//                 <option key={mode} value={mode}>{formatModeName(mode)}</option>
//             ))}
//         </select>

//         {/* Dropdown เลือกระดับ */}
//         <select
//             value={selectedLevel}
//             onChange={(e) => setSelectedLevel(e.target.value)}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 min-w-[150px]"
//         >
//             <option value="all">ทุกระดับ (All Levels)</option>
//             {levelOptions.map(level => (
//                 <option key={level} value={level}>{level ? level.toUpperCase() : '-'}</option>
//             ))}
//         </select>

//         {/* ปุ่ม Reset Filter */}
//         {(selectedMode !== 'all' || selectedLevel !== 'all') && (
//             <button 
//                 onClick={() => { setSelectedMode('all'); setSelectedLevel('all'); }}
//                 className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium px-3 py-2 hover:bg-red-50 rounded-md transition-colors"
//             >
//                 <XCircle className="w-4 h-4" />
//                 ล้างค่า
//             </button>
//         )}
        
//         {/* แสดงจำนวนผลลัพธ์ */}
//         <div className="ml-auto text-sm text-gray-500">
//             พบข้อมูล {filteredData.length} รายการ
//         </div>
//       </div>

//       {/* --- ตารางแสดงผล --- */}
//       <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm text-left">
//             <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
//               <tr>
//                 <th className="px-6 py-3">วันที่/เวลา</th>
//                 <th className="px-6 py-3">User ID</th>
//                 <th className="px-6 py-3">โหมด</th>
//                 <th className="px-6 py-3">ระดับ</th>
//                 <th className="px-6 py-3 text-center">คะแนน</th>
//                 <th className="px-6 py-3 text-center">เวลาเฉลี่ย/ข้อ</th>
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
//                     กำลังโหลดข้อมูล...
//                   </td>
//                 </tr>
//               ) : filteredData.length === 0 ? (
//                 <tr>
//                   <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
//                     {data.length > 0 ? 'ไม่พบข้อมูลที่ตรงกับเงื่อนไข' : 'ไม่พบข้อมูลการใช้งาน'}
//                   </td>
//                 </tr>
//               ) : (
//                 filteredData.map((item, index) => (
//                   <tr key={index} className="bg-white border-b hover:bg-gray-50">
//                     <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
//                       {formatDate(item.created_at)}
//                     </td>
//                     <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-[150px]" title={item.user_id}>
//                       {item.user_id}
//                     </td>
//                     <td className="px-6 py-4">
//                       <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded" title={item.mode || ''}>
//                         {formatModeName(item.mode)}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4">
//                         <span className={`text-xs font-medium px-2.5 py-0.5 rounded border ${
//                             item.level === 'hard' ? 'bg-red-50 text-red-700 border-red-200' :
//                             item.level === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
//                             'bg-green-50 text-green-700 border-green-200'
//                         }`}>
//                             {item.level ? item.level.toUpperCase() : '-'}
//                         </span>
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       <span className="font-bold text-green-600">
//                         {item.score}
//                       </span> 
//                       <span className="text-gray-400 text-xs"> / {item.total_questions}</span>
//                     </td>
//                     <td className="px-6 py-4 text-center">
//                       {formatTime(item.avg_time_ms)}
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }



import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/supabaseClient';
import { ArrowLeft, Filter, XCircle } from 'lucide-react';

// 1. แก้ Interface ให้ตรงกับฐานข้อมูลจริง (ใช้ mode_id)
interface PracticeResult {
  id: string;
  user_id: string;
  mode_id: string | null; // ⚠️ เปลี่ยนจาก mode เป็น mode_id
  level: string;
  score: number;
  total_questions: number;
  avg_time_ms: number;
  created_at: string;
}

// 2. สร้างตัวแปร Mapping ชื่อโหมด (เพราะ Database ส่งมาเป็นรหัส เราต้องแปลเป็นชื่อคนอ่านรู้เรื่อง)
// คุณสามารถมาแก้ชื่อภาษาไทยตรงนี้ได้เลยครับ ตามรหัสที่เห็น
const MODE_NAMES: Record<string, string> = {
  'f8c3a72d-77f9-4839-986b-322878d2b8ba': 'โหมดบวกเลข (Addition)', 
  '76ae8bea-cd76-458e-8f16-04e193ce9d7c': 'โหมดลบเลข (Subtraction)',
  '01b1721d-027c-4415-9338-c1f0d87c5374': 'โหมดคูณเลข (Multiplication)',
  'a30a6d31-8497-4cd6-9870-5f594ae6d2fa': 'โหมดหารเลข (Division)',
  // ถ้ามีรหัสอื่นโผล่มาอีก ให้เพิ่มบรรทัดต่อท้ายตรงนี้ครับ
};

interface PracticeHistoryProps {
  onBack: () => void;
}

export default function PracticeHistory({ onBack }: PracticeHistoryProps) {
  const [data, setData] = useState<PracticeResult[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');

  // ฟังก์ชันแปลงรหัส Mode ID ให้เป็นชื่อที่อ่านออก
  const formatModeName = (modeId: string | null | undefined) => {
    if (!modeId) return '-';
    // ลองหาชื่อจากตัวแปร MODE_NAMES ข้างบน ถ้าไม่เจอให้แสดงรหัสเดิมไปก่อน
    return MODE_NAMES[modeId] || `โหมดไม่ทราบชื่อ (${modeId.substring(0, 4)}...)`;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: results, error } = await supabase
          .from('practice_results')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;
        
        // Debug ดูค่าอีกครั้งถ้ายังไม่ขึ้น
        // console.log("Fetched Data:", results); 

        setData((results as PracticeResult[]) || []);
      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ดึงรายการ Mode จาก mode_id
  const modeOptions = useMemo(() => {
    const modes = Array.from(new Set(
      data
        .map(item => item.mode_id)
        .filter((m): m is string => !!m)
    ));
    return modes.sort();
  }, [data]);

  const levelOptions = useMemo(() => {
    const levels = Array.from(new Set(data.map(item => item.level)));
    return levels.sort();
  }, [data]);

  // Logic การกรองข้อมูล (ใช้ mode_id)
  const filteredData = data.filter((item) => {
    const matchMode = selectedMode === 'all' || item.mode_id === selectedMode;
    const matchLevel = selectedLevel === 'all' || item.level === selectedLevel;
    return matchMode && matchLevel;
  });

  const formatTime = (ms: number) => {
    if (!ms) return '0.00 วินาที';
    return (ms / 1000).toFixed(2) + ' วินาที';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('th-TH');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ArrowLeft className="w-6 h-6 text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-800">ประวัติการเข้าใช้งาน (Practice Logs)</h2>
        </div>
      </div>

      {/* --- Filter Bar --- */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2 text-gray-600 font-medium">
            <Filter className="w-4 h-4" />
            <span>ตัวกรอง:</span>
        </div>

        {/* Dropdown เลือกโหมด */}
        <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 min-w-[200px]"
        >
            <option value="all">ทุกโหมด (All Modes)</option>
            {modeOptions.map(modeId => (
                <option key={modeId} value={modeId}>{formatModeName(modeId)}</option>
            ))}
        </select>

        {/* Dropdown เลือกระดับ */}
        <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 min-w-[150px]"
        >
            <option value="all">ทุกระดับ (All Levels)</option>
            {levelOptions.map(level => (
                <option key={level} value={level}>{level ? level.toUpperCase() : '-'}</option>
            ))}
        </select>

        {/* Reset Filter */}
        {(selectedMode !== 'all' || selectedLevel !== 'all') && (
            <button 
                onClick={() => { setSelectedMode('all'); setSelectedLevel('all'); }}
                className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium px-3 py-2 hover:bg-red-50 rounded-md transition-colors"
            >
                <XCircle className="w-4 h-4" />
                ล้างค่า
            </button>
        )}
        
        <div className="ml-auto text-sm text-gray-500">
            พบข้อมูล {filteredData.length} รายการ
        </div>
      </div>

      {/* --- Table --- */}
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
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    {data.length > 0 ? 'ไม่พบข้อมูลที่ตรงกับเงื่อนไข' : 'ไม่พบข้อมูลการใช้งาน'}
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={index} className="bg-white border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {formatDate(item.created_at)}
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-[150px]" title={item.user_id}>
                      {item.user_id}
                    </td>
                    <td className="px-6 py-4">
                      {/* เรียกใช้ formatModeName เพื่อแปลงรหัสเป็นชื่อ */}
                      <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded whitespace-nowrap" title={item.mode_id || ''}>
                        {formatModeName(item.mode_id)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                        <span className={`text-xs font-medium px-2.5 py-0.5 rounded border ${
                            item.level === 'hard' ? 'bg-red-50 text-red-700 border-red-200' :
                            item.level === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                            'bg-green-50 text-green-700 border-green-200'
                        }`}>
                            {item.level ? item.level.toUpperCase() : '-'}
                        </span>
                    </td>
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