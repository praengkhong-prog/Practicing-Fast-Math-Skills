
// import { useState, useEffect } from 'react';
// import { supabase } from '@/supabaseClient';
// import { ArrowLeft, Filter, XCircle, User, CheckCircle2, AlertTriangle, Trash2 } from 'lucide-react';

// interface PracticeResult {
//   id: string;
//   user_id: string;
//   mode_id: string | null;
//   level: string;
//   score: number;
//   total_questions: number;
//   avg_time_ms: number;
//   created_at: string;
//   status: string | null;
// }

// const MODE_NAMES: Record<string, string> = {
//   '76ae8bea-cd76-458e-8f16-04e193ce9d7c': 'โหมดบวกเลข (Addition)',
//   '01b1721d-027c-4415-9338-c1f0d87c5374': 'โหมดลบเลข (Subtraction)',
//   'f8c3a72d-77f9-4839-986b-322878d2b8ba': 'โหมดคูณเลข (Multiplication)',
//   '59fb7c37-6857-40fb-bfdb-04f4af194c05': 'โหมดหารเลข (Division)',
// };

// interface PracticeHistoryProps {
//   onBack: () => void;
// }

// export default function PracticeHistory({ onBack }: PracticeHistoryProps) {
//   const [data, setData] = useState<PracticeResult[]>([]);
//   const [userNames, setUserNames] = useState<Record<string, string>>({});
//   const [loading, setLoading] = useState(true);
  
//   const [selectedMode, setSelectedMode] = useState<string>('all');
//   const [selectedLevel, setSelectedLevel] = useState<string>('all');
//   const [selectedStatus, setSelectedStatus] = useState<string>('all');

//   const formatModeName = (modeId: string | null | undefined) => {
//     if (!modeId) return '-';
//     if (modeId === 'mixed') return 'โหมดผสม (Mixed)';
//     return MODE_NAMES[modeId] || `โหมดผสม/อื่นๆ`;
//   };

//   // ✅ ฟังก์ชันสำหรับลบข้อมูล
//   const handleDelete = async (id: string) => {
//     // 1. ถามยืนยันก่อนลบ
//     const confirmDelete = window.confirm("คุณแน่ใจหรือไม่ที่จะลบข้อมูลรายการนี้?");
//     if (!confirmDelete) return;

//     try {
//         // 2. สั่งลบข้อมูลใน Supabase
//         const { error } = await supabase
//             .from('practice_results')
//             .delete()
//             .eq('id', id);

//         if (error) throw error;

//         // 3. อัปเดตหน้าจอทันที (เอาตัวที่ลบออกไปจาก State)
//         setData(prevData => prevData.filter(item => item.id !== id));
//         alert("ลบข้อมูลเรียบร้อยแล้ว");

//     } catch (err) {
//         console.error("Error deleting:", err);
//         alert("เกิดข้อผิดพลาดในการลบข้อมูล");
//     }
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

//         if (error) throw error;
        
//         const resultData = (results as PracticeResult[]) || [];
//         setData(resultData);

//         if (resultData.length > 0) {
//             const userIds = Array.from(new Set(resultData.map(r => r.user_id)));
            
//             const { data: profiles } = await supabase
//                 .from('profiles')
//                 .select('user_id, display_name, email')
//                 .in('user_id', userIds);

//             const nameMap: Record<string, string> = {};
//             if (profiles) {
//                 profiles.forEach((p: any) => {
//                     nameMap[p.user_id] = p.display_name || p.email || 'ไม่ระบุชื่อ';
//                 });
//             }
//             setUserNames(nameMap);
//         }

//       } catch (err) {
//         console.error('Error fetching history:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const filteredData = data.filter((item) => {
//     const matchMode = selectedMode === 'all' || 
//                       item.mode_id === selectedMode || 
//                       (selectedMode === 'mixed' && item.mode_id === null);
                      
//     const matchLevel = selectedLevel === 'all' || item.level === selectedLevel;

//     const isIncomplete = item.status === 'incomplete';
//     const matchStatus = selectedStatus === 'all' || 
//                         (selectedStatus === 'completed' && !isIncomplete) ||
//                         (selectedStatus === 'incomplete' && isIncomplete);

//     return matchMode && matchLevel && matchStatus;
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

//       <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 items-center flex-wrap">
//         <div className="flex items-center gap-2 text-gray-600 font-medium">
//             <Filter className="w-4 h-4" />
//             <span>ตัวกรอง:</span>
//         </div>

//         <select
//             value={selectedMode}
//             onChange={(e) => setSelectedMode(e.target.value)}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 min-w-[180px]"
//         >
//             <option value="all">ทุกโหมด (All Modes)</option>
//             {Object.entries(MODE_NAMES).map(([id, name]) => (
//                 <option key={id} value={id}>{name}</option>
//             ))}
//             <option value="mixed">โหมดผสม (Mixed)</option>
//         </select>

//         <select
//             value={selectedLevel}
//             onChange={(e) => setSelectedLevel(e.target.value)}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 min-w-[150px]"
//         >
//             <option value="all">ทุกระดับ (All Levels)</option>
//             {['easy', 'medium', 'hard'].map(level => (
//                 <option key={level} value={level}>{level.toUpperCase()}</option>
//             ))}
//         </select>

//         <select
//             value={selectedStatus}
//             onChange={(e) => setSelectedStatus(e.target.value)}
//             className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 min-w-[150px]"
//         >
//             <option value="all">ทุกสถานะ (All Status)</option>
//             <option value="completed">สำเร็จ (Completed)</option>
//             <option value="incomplete">ไม่สำเร็จ (Incomplete)</option>
//         </select>

//         {(selectedMode !== 'all' || selectedLevel !== 'all' || selectedStatus !== 'all') && (
//             <button 
//                 onClick={() => { setSelectedMode('all'); setSelectedLevel('all'); setSelectedStatus('all'); }}
//                 className="flex items-center gap-1 text-red-500 hover:text-red-700 text-sm font-medium px-3 py-2 hover:bg-red-50 rounded-md transition-colors"
//             >
//                 <XCircle className="w-4 h-4" />
//                 ล้างค่า
//             </button>
//         )}
        
//         <div className="ml-auto text-sm text-gray-500">
//             พบข้อมูล {filteredData.length} รายการ
//         </div>
//       </div>

//       <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="w-full text-sm text-left">
//             <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
//               <tr>
//                 <th className="px-6 py-3">วันที่/เวลา</th>
//                 <th className="px-6 py-3">ผู้ใช้งาน (User)</th>
//                 <th className="px-6 py-3">โหมด</th>
//                 <th className="px-6 py-3">สถานะ</th>
//                 <th className="px-6 py-3">ระดับ</th>
//                 <th className="px-6 py-3 text-center">คะแนน</th>
//                 <th className="px-6 py-3 text-center">เวลาเฉลี่ย/ข้อ</th>
//                 <th className="px-6 py-3 text-center">จัดการ</th> {/* ✅ เพิ่มหัวตาราง */}
//               </tr>
//             </thead>
//             <tbody>
//               {loading ? (
//                 <tr>
//                   <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
//                     กำลังโหลดข้อมูล...
//                   </td>
//                 </tr>
//               ) : filteredData.length === 0 ? (
//                 <tr>
//                   <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
//                     {data.length > 0 ? 'ไม่พบข้อมูลที่ตรงกับเงื่อนไข' : 'ไม่พบข้อมูลการใช้งาน'}
//                   </td>
//                 </tr>
//               ) : (
//                 filteredData.map((item, index) => (
//                   <tr key={index} className="bg-white border-b hover:bg-gray-50">
//                     <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
//                       {formatDate(item.created_at)}
//                     </td>
                    
//                     <td className="px-6 py-4 font-medium text-gray-900">
//                         <div className="flex items-center gap-2">
//                             <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
//                                 <User className="w-4 h-4" />
//                             </div>
//                             <div className="flex flex-col">
//                                 <span className="font-medium">
//                                     {userNames[item.user_id] || 'ไม่ระบุชื่อ'}
//                                 </span>
//                                 <span className="text-[10px] text-gray-400">
//                                     {item.user_id.substring(0, 8)}...
//                                 </span>
//                             </div>
//                         </div>
//                     </td>

//                     <td className="px-6 py-4">
//                       <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded whitespace-nowrap" title={item.mode_id || ''}>
//                         {formatModeName(item.mode_id)}
//                       </span>
//                     </td>

//                     <td className="px-6 py-4">
//                         {item.status === 'incomplete' ? (
//                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
//                                 <AlertTriangle className="w-3 h-3 mr-1" />
//                                 ไม่สำเร็จ
//                             </span>
//                         ) : (
//                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
//                                 <CheckCircle2 className="w-3 h-3 mr-1" />
//                                 สำเร็จ
//                             </span>
//                         )}
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

//                     {/* ✅ เพิ่มปุ่มลบ */}
//                     <td className="px-6 py-4 text-center">
//                       <button
//                         onClick={() => handleDelete(item.id)}
//                         className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
//                         title="ลบข้อมูล"
//                       >
//                         <Trash2 className="w-4 h-4" />
//                       </button>
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




import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft, Filter, XCircle, User, CheckCircle2, AlertTriangle, Trash2, Calendar } from 'lucide-react';

interface PracticeResult {
  id: string;
  user_id: string;
  mode_id: string | null;
  level: string;
  score: number;
  total_questions: number;
  avg_time_ms: number;
  created_at: string;
  status: string;
}

const MODE_NAMES: Record<string, string> = {
  '76ae8bea-cd76-458e-8f16-04e193ce9d7c': 'โหมดบวกเลข (Addition)',
  '01b1721d-027c-4415-9338-c1f0d87c5374': 'โหมดลบเลข (Subtraction)',
  'f8c3a72d-77f9-4839-986b-322878d2b8ba': 'โหมดคูณเลข (Multiplication)',
  '59fb7c37-6857-40fb-bfdb-04f4af194c05': 'โหมดหารเลข (Division)',
};

interface PracticeHistoryProps {
  onBack: () => void;
}

export default function PracticeHistory({ onBack }: PracticeHistoryProps) {
  const [data, setData] = useState<PracticeResult[]>([]);
  const [userNames, setUserNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  
  // State สำหรับตัวกรองต่างๆ
  const [selectedMode, setSelectedMode] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  // ✅ 1. เพิ่ม State สำหรับวันที่ (ค่าเริ่มต้นเป็นว่าง)
  const [selectedDate, setSelectedDate] = useState<string>('');

  const formatModeName = (modeId: string | null | undefined) => {
    if (!modeId) return 'หมดผสม (Mixed)';
    if (modeId === 'mixed') return 'โหมดผสม (Mixed)';
    return MODE_NAMES[modeId] || `โหมดอื่นๆ`;
  };

  const handleDelete = async (id: string) => {
    const confirmDelete = window.confirm("คุณแน่ใจหรือไม่ที่จะลบข้อมูลรายการนี้?");
    if (!confirmDelete) return;

    try {
        const { error } = await supabase
            .from('practice_results')
            .delete()
            .eq('id', id);

        if (error) throw error;

        setData(prevData => prevData.filter(item => item.id !== id));
        alert("ลบข้อมูลเรียบร้อยแล้ว");

    } catch (err) {
        console.error("Error deleting:", err);
        alert("เกิดข้อผิดพลาดในการลบข้อมูล");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // หมายเหตุ: ปัจจุบันดึงมาแค่ 100 รายการล่าสุด
        // ถ้าต้องการค้นหาข้อมูลเก่ามากๆ อาจต้องเพิ่ม limit หรือค้นหาจาก Server โดยตรง
        const { data: results, error } = await supabase
          .from('practice_results')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(100);

        if (error) throw error;
        
        const resultData = (results as unknown as PracticeResult[]) || [];
        setData(resultData);

        if (resultData.length > 0) {
            const userIds = Array.from(new Set(resultData.map((r: any) => r.user_id)));
            
            const { data: profiles } = await supabase
                .from('profiles')
                .select('user_id, display_name, email')
                .in('user_id', userIds);

            const nameMap: Record<string, string> = {};
            if (profiles) {
                profiles.forEach((p: any) => {
                    nameMap[p.user_id] = p.display_name || p.email || 'ไม่ระบุชื่อ';
                });
            }
            setUserNames(nameMap);
        }

      } catch (err) {
        console.error('Error fetching history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = data.filter((item) => {
    const matchMode = selectedMode === 'all' || 
                      item.mode_id === selectedMode || 
                      (selectedMode === 'mixed' && item.mode_id === null);
                      
    const matchLevel = selectedLevel === 'all' || item.level === selectedLevel;

    const currentStatus = item.status?.toLowerCase() || 'completed';
    const isIncomplete = currentStatus === 'incomplete';
    const matchStatus = selectedStatus === 'all' || 
                        (selectedStatus === 'completed' && !isIncomplete) ||
                        (selectedStatus === 'incomplete' && isIncomplete);

    // ✅ 2. เพิ่ม Logic การกรองวันที่
    let matchDate = true;
    if (selectedDate) {
        // แปลงวันที่จาก Database (ISO) ให้เป็น YYYY-MM-DD เพื่อเทียบกับ Input
        const itemDate = new Date(item.created_at).toLocaleDateString('en-CA'); // en-CA จะได้ format YYYY-MM-DD
        matchDate = itemDate === selectedDate;
    }

    return matchMode && matchLevel && matchStatus && matchDate;
  });

  const formatTime = (ms: number) => {
    if (!ms) return '0.00 วินาที';
    return (ms / 1000).toFixed(2) + ' วินาที';
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString('th-TH');
  };

  const renderTableBody = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
            กำลังโหลดข้อมูล...
          </td>
        </tr>
      );
    }

    if (filteredData.length === 0) {
      return (
        <tr>
          <td colSpan={8} className="px-6 py-8 text-center text-gray-500">
            {data.length > 0 ? 'ไม่พบข้อมูลที่ตรงกับเงื่อนไข' : 'ไม่พบข้อมูลการใช้งาน'}
          </td>
        </tr>
      );
    }

    return filteredData.map((item, index) => (
      <tr key={index} className="bg-white border-b hover:bg-gray-50">
        <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
          {formatDate(item.created_at)}
        </td>
        
        <td className="px-6 py-4 font-medium text-gray-900">
            <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                    <span className="font-medium">
                        {userNames[item.user_id] || 'ไม่ระบุชื่อ'}
                    </span>
                    <span className="text-[10px] text-gray-400">
                        {item.user_id.substring(0, 8)}...
                    </span>
                </div>
            </div>
        </td>

        <td className="px-6 py-4">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded whitespace-nowrap" title={item.mode_id || ''}>
            {formatModeName(item.mode_id)}
          </span>
        </td>

        <td className="px-6 py-4">
            {item.status === 'incomplete' ? (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    ไม่สำเร็จ
                </span>
            ) : (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    สำเร็จ
                </span>
            )}
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

        <td className="px-6 py-4 text-center">
          <button
            onClick={() => handleDelete(item.id)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-full transition-colors"
            title="ลบข้อมูล"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </td>
      </tr>
    ));
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

      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 flex flex-col sm:flex-row gap-4 items-center flex-wrap">
        <div className="flex items-center gap-2 text-gray-600 font-medium">
            <Filter className="w-4 h-4" />
            <span>ตัวกรอง:</span>
        </div>

        {/* ✅ 3. เพิ่ม Input เลือกวันที่ (Date Picker) */}
        <div className="relative">
             <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Calendar className="w-4 h-4 text-gray-500" />
             </div>
             <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
                placeholder="เลือกวันที่"
             />
        </div>

        <select
            value={selectedMode}
            onChange={(e) => setSelectedMode(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 min-w-[180px]"
        >
            <option value="all">ทุกโหมด (All Modes)</option>
            {Object.entries(MODE_NAMES).map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
            ))}
            <option value="mixed">โหมดผสม (Mixed)</option>
        </select>

        <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 min-w-[150px]"
        >
            <option value="all">ทุกระดับ (All Levels)</option>
            {['easy', 'medium', 'hard'].map(level => (
                <option key={level} value={level}>{level.toUpperCase()}</option>
            ))}
        </select>

        <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 min-w-[150px]"
        >
            <option value="all">ทุกสถานะ (All Status)</option>
            <option value="completed">สำเร็จ (Completed)</option>
            <option value="incomplete">ไม่สำเร็จ (Incomplete)</option>
        </select>

        {(selectedMode !== 'all' || selectedLevel !== 'all' || selectedStatus !== 'all' || selectedDate !== '') && (
            <button 
                onClick={() => { 
                    setSelectedMode('all'); 
                    setSelectedLevel('all'); 
                    setSelectedStatus('all'); 
                    setSelectedDate(''); // ล้างวันที่ด้วย
                }}
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

      <div className="bg-white rounded-lg shadow border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3">วันที่/เวลา</th>
                <th className="px-6 py-3">ผู้ใช้งาน (User)</th>
                <th className="px-6 py-3">โหมด</th>
                <th className="px-6 py-3">สถานะ</th>
                <th className="px-6 py-3">ระดับ</th>
                <th className="px-6 py-3 text-center">คะแนน</th>
                <th className="px-6 py-3 text-center">เวลาเฉลี่ย/ข้อ</th>
                <th className="px-6 py-3 text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {renderTableBody()}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}