// import React, { useEffect, useState } from 'react';
// import { supabase } from '@/supabaseClient';
// import { Trash2, Edit, ArrowLeft, Loader2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import AddMathProblem, { ProblemData } from './AddMathProblem'; // Import ฟอร์มแก้ไขเดิม

// interface ProblemListDialogProps {
//   category: string; // รับค่าหมวดหมู่ เช่น 'add', 'sub'
// }

// const ProblemListDialog: React.FC<ProblemListDialogProps> = ({ category }) => {
//   const [problems, setProblems] = useState<ProblemData[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   // State สำหรับจัดการโหมดแก้ไขภายใน Popup
//   const [isEditing, setIsEditing] = useState(false);
//   const [editingData, setEditingData] = useState<ProblemData | null>(null);

//   // ฟังก์ชันดึงข้อมูลโจทย์เฉพาะหมวดที่เลือก
//   const fetchProblems = async () => {
//     setLoading(true);
//     const { data, error } = await supabase
//       .from('math_problems')
//       .select('*')
//       .eq('category', category) // กรองตามหมวด
//       .order('created_at', { ascending: false });

//     if (!error && data) {
//       setProblems(data);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchProblems();
//   }, [category]);

//   // ฟังก์ชันลบ
//   const handleDelete = async (id: string) => {
//     if (!confirm('ยืนยันการลบโจทย์ข้อนี้?')) return;

//     const { error } = await supabase
//       .from('math_problems')
//       .delete()
//       .eq('id', id);

//     if (!error) {
//       // อัปเดตรายการโดยไม่ต้องโหลดใหม่
//       setProblems(prev => prev.filter(p => p.id !== id));
//     } else {
//       alert('ลบไม่สำเร็จ: ' + error.message);
//     }
//   };

//   // ถ้าอยู่ในโหมดแก้ไข ให้แสดงฟอร์ม AddMathProblem แทน
//   if (isEditing && editingData) {
//     return (
//       <div className="space-y-4">
//         <Button 
//             variant="ghost" 
//             onClick={() => setIsEditing(false)} 
//             className="mb-2 pl-0 hover:pl-2 transition-all"
//         >
//             <ArrowLeft className="w-4 h-4 mr-2" /> กลับไปหน้ารายการ
//         </Button>
        
//         <h3 className="text-lg font-semibold">แก้ไขโจทย์</h3>
        
//         {/* เรียกใช้ฟอร์มเดิม แต่ส่งข้อมูลเก่าเข้าไปด้วย */}
//         <AddMathProblem 
//             initialData={editingData}
//             defaultCategory={category}
//             onSuccess={() => {
//                 setIsEditing(false); // ปิดโหมดแก้ไข
//                 fetchProblems();     // โหลดข้อมูลใหม่
//             }}
//         />
//       </div>
//     );
//   }

//   // หน้าแสดงรายการปกติ
//   return (
//     <div className="space-y-4">
//       <div className="flex justify-between items-center">
//         <h3 className="text-lg font-medium">รายการโจทย์ ({problems.length} ข้อ)</h3>
//         <Button variant="outline" size="sm" onClick={fetchProblems}>
//             รีเฟรช
//         </Button>
//       </div>

//       <div className="border rounded-md overflow-hidden max-h-[60vh] overflow-y-auto">
//         {loading ? (
//             <div className="p-8 flex justify-center items-center text-muted-foreground">
//                 <Loader2 className="w-6 h-6 animate-spin mr-2" /> กำลังโหลด...
//             </div>
//         ) : problems.length === 0 ? (
//             <div className="p-8 text-center text-muted-foreground">
//                 ยังไม่มีโจทย์ในหมวดนี้
//             </div>
//         ) : (
//             <table className="w-full text-sm text-left">
//                 <thead className="bg-gray-50 text-gray-700 border-b sticky top-0">
//                     <tr>
//                         <th className="px-4 py-3">คำถาม</th>
//                         <th className="px-4 py-3">ระดับ</th>
//                         <th className="px-4 py-3">เฉลย</th>
//                         <th className="px-4 py-3 text-right">จัดการ</th>
//                     </tr>
//                 </thead>
//                 <tbody className="divide-y">
//                     {problems.map((prob) => (
//                         <tr key={prob.id} className="hover:bg-gray-50">
//                             <td className="px-4 py-3 font-medium max-w-[200px] truncate" title={prob.question}>
//                                 {prob.question}
//                             </td>
//                             <td className="px-4 py-3">
//                                 <Badge variant="outline" className={
//                                     prob.difficulty === 'easy' ? 'bg-green-50 text-green-700 border-green-200' :
//                                     prob.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
//                                     'bg-red-50 text-red-700 border-red-200'
//                                 }>
//                                     {prob.difficulty}
//                                 </Badge>
//                             </td>
//                             <td className="px-4 py-3 font-bold text-blue-600">{prob.correct_answer}</td>
//                             <td className="px-4 py-3 text-right space-x-1">
//                                 <Button 
//                                     size="icon" 
//                                     variant="ghost" 
//                                     className="h-8 w-8 text-orange-500 hover:text-orange-700 hover:bg-orange-50"
//                                     onClick={() => {
//                                         setEditingData(prob);
//                                         setIsEditing(true);
//                                     }}
//                                 >
//                                     <Edit className="w-4 h-4" />
//                                 </Button>
//                                 <Button 
//                                     size="icon" 
//                                     variant="ghost" 
//                                     className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
//                                     onClick={() => prob.id && handleDelete(prob.id)}
//                                 >
//                                     <Trash2 className="w-4 h-4" />
//                                 </Button>
//                             </td>
//                         </tr>
//                     ))}
//                 </tbody>
//             </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default ProblemListDialog;



import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { Trash2, Loader2, AlertCircle, CheckCircle2, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import AddMathProblem from './AddMathProblem'; 

interface MathProblem {
  id: string;
  question: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  choice_d: string;
  correct_answer: string;
  difficulty: string;
  category: string;
  technique_id?: string | null;
}

interface ProblemListDialogProps {
  category: string;
}

const ProblemListDialog = ({ category }: ProblemListDialogProps) => {
  const [problems, setProblems] = useState<MathProblem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [editingProblem, setEditingProblem] = useState<MathProblem | null>(null);

  useEffect(() => {
    fetchProblems();
  }, [category]);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      // เริ่มต้น Query ดึงทั้งหมดก่อน
      let query = supabase
        .from('math_problems')
        .select('*')
        .order('created_at', { ascending: false });

      // --- ตรวจสอบว่าเป็นโหมดผสมหรือไม่ (รองรับหลายชื่อ) ---
      const mixedKeywords = ['โหมดผสม', 'Mixed', 'mixed', 'ผสมโจทย์', 'รวมโจทย์'];
      const isMixedMode = mixedKeywords.includes(category);

      // ถ้าไม่ใช่โหมดผสม ให้กรองตามชื่อหมวด
      if (!isMixedMode) {
         query = query.eq('category', category);
      }
      // -----------------------------------------------------

      const { data, error } = await query;

      if (error) throw error;
      setProblems(data || []);
    } catch (error: any) {
      console.error('Error:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('ยืนยันที่จะลบโจทย์ข้อนี้?')) return;
    try {
      const { error } = await supabase.from('math_problems').delete().eq('id', id);
      if (error) throw error;
      setProblems(problems.filter(p => p.id !== id));
    } catch (error: any) {
      alert('ลบไม่สำเร็จ: ' + error.message);
    }
  };

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'การบวก': return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'การลบ': return 'bg-red-50 text-red-700 border-red-100';
      case 'การคูณ': return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'การหาร': return 'bg-orange-50 text-orange-700 border-orange-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-200';
    }
  };

  if (editingProblem) {
      return (
          <div className="h-full overflow-y-auto px-1">
              <AddMathProblem 
                  defaultCategory={editingProblem.category} 
                  initialData={editingProblem} 
                  onSuccess={() => {
                      setEditingProblem(null);
                      fetchProblems();        
                  }}
                  onCancel={() => setEditingProblem(null)}
              />
          </div>
      );
  }

  if (loading) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-blue-500" /></div>;
  }

  return (
    <div className="flex flex-col h-[60vh] md:h-[70vh]">
      <div className="mb-4 flex justify-between items-center px-1">
        <h3 className="text-sm font-medium text-gray-500">
             {/* แสดงข้อความจำนวนโจทย์ */}
             {problems.length > 0 
                ? `พบโจทย์ทั้งหมด ${problems.length} ข้อ` 
                : 'ยังไม่พบโจทย์'
             }
        </h3>
      </div>

      <ScrollArea className="flex-1 pr-4">
        {problems.length === 0 ? (
          <div className="text-center py-10 text-gray-400 border-2 border-dashed rounded-xl">
            <AlertCircle className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>ยังไม่มีโจทย์ในหมวดนี้</p>
          </div>
        ) : (
          <div className="space-y-3 pb-4">
            {problems.map((problem) => (
              <div key={problem.id} className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-start justify-between group">
                <div className="flex-1">
                  
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant="outline" className={getDifficultyColor(problem.difficulty)}>
                        {problem.difficulty}
                    </Badge>
                    <Badge variant="secondary" className={`border ${getCategoryColor(problem.category)}`}>
                        {problem.category}
                    </Badge>
                    <span className="text-xs text-gray-300 font-mono ml-auto sm:ml-0">ID: {problem.id.slice(0,4)}...</span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-gray-800 mb-2">{problem.question}</h4>
                  
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
                    {['a','b','c','d'].map(c => {
                        const isCorrect = problem.correct_answer === c.toUpperCase();
                        return (
                            <div key={c} className={isCorrect ? 'text-green-600 font-bold flex items-center' : ''}>
                                {c.toUpperCase()}: {(problem as any)[`choice_${c}`]} 
                                {isCorrect && <CheckCircle2 className="w-3 h-3 ml-1"/>}
                            </div>
                        )
                    })}
                  </div>
                </div>

                <div className="ml-4 flex flex-col gap-2">
                   <Button variant="ghost" size="icon" className="text-blue-400 hover:text-blue-600 hover:bg-blue-50" onClick={() => setEditingProblem(problem)}>
                      <Edit className="w-4 h-4" />
                   </Button>
                   <Button variant="ghost" size="icon" className="text-red-400 hover:text-red-600 hover:bg-red-50" onClick={() => handleDelete(problem.id)}>
                      <Trash2 className="w-4 h-4" />
                   </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ProblemListDialog;