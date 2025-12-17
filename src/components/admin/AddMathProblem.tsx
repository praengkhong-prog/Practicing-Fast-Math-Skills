// import React, { useState, useEffect } from 'react';
// import { supabase } from '@/supabaseClient';
// import { Lightbulb, Loader2 } from 'lucide-react'; // เพิ่ม icon ถ้าต้องการ

// // 1. กำหนด Props
// interface AddMathProblemProps {
//   defaultCategory?: string; 
//   onSuccess?: () => void;   
//   initialData?: ProblemData | null; 
// }

// // 2. กำหนด Type ของข้อมูลในฟอร์ม (เพิ่ม technique_id)
// export interface ProblemData {
//   id?: string;
//   question: string;
//   choice_a: string;
//   choice_b: string;
//   choice_c: string;
//   choice_d: string;
//   correct_answer: string;
//   category: string;
//   difficulty: string;
//   technique_id?: string | null; // <--- เพิ่มตรงนี้
// }

// // Type สำหรับรายการเทคนิคที่จะดึงมาแสดงใน Dropdown
// interface TechniqueItem {
//   id: string;
//   title: string;
//   practice_modes?: { name: string }; // เพื่อแสดงว่าเทคนิคนี้อยู่หมวดไหน
// }

// const AddMathProblem: React.FC<AddMathProblemProps> = ({ defaultCategory, onSuccess, initialData }) => {
  
//   // State สำหรับเก็บข้อมูลฟอร์ม
//   const [formData, setFormData] = useState<ProblemData>({
//     question: '',
//     choice_a: '',
//     choice_b: '',
//     choice_c: '',
//     choice_d: '',
//     correct_answer: 'A',
//     category: defaultCategory || 'add', 
//     difficulty: 'easy',
//     technique_id: '', // <--- ค่าเริ่มต้น
//   });

//   const [loading, setLoading] = useState(false);
//   const [techniques, setTechniques] = useState<TechniqueItem[]>([]); // State เก็บรายการเทคนิค

//   // --- Effect 1: ดึงรายการ Techniques ทั้งหมด ---
//   useEffect(() => {
//     const fetchTechniques = async () => {
//       try {
//         // เลือก id, title และชื่อหมวดฝึก (practice_modes) มาแสดงให้เลือกง่ายๆ
//         const { data, error } = await supabase
//           .from('techniques')
//           .select('id, title, practice_modes (name)')
//           .order('title', { ascending: true });
        
//         if (!error && data) {
//           setTechniques(data as any);
//         }
//       } catch (err) {
//         console.error('Error fetching techniques:', err);
//       }
//     };
//     fetchTechniques();
//   }, []);

//   // --- Effect 2: นำข้อมูลเดิมมาใส่ฟอร์ม (กรณีแก้ไข) ---
//   useEffect(() => {
//     if (initialData) {
//       setFormData({
//         question: initialData.question,
//         choice_a: initialData.choice_a,
//         choice_b: initialData.choice_b,
//         choice_c: initialData.choice_c,
//         choice_d: initialData.choice_d,
//         correct_answer: initialData.correct_answer,
//         category: initialData.category,
//         difficulty: initialData.difficulty,
//         technique_id: initialData.technique_id || '', // <--- map ค่า technique
//       });
//     } else if (defaultCategory) {
//       setFormData(prev => ({ ...prev, category: defaultCategory }));
//     }
//   }, [initialData, defaultCategory]);

//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       // แปลง technique_id ที่เป็น string ว่าง ให้เป็น null ก่อนส่งเข้า DB
//       const payload = {
//         ...formData,
//         technique_id: formData.technique_id === '' ? null : formData.technique_id
//       };

//       if (initialData?.id) {
//         // === UPDATE ===
//         const { error } = await supabase
//           .from('math_problems')
//           .update(payload)
//           .eq('id', initialData.id);

//         if (error) throw error;
//         alert('แก้ไขข้อมูลเรียบร้อยแล้ว!');

//       } else {
//         // === INSERT ===
//         const { error } = await supabase
//           .from('math_problems')
//           .insert([payload]);

//         if (error) throw error;
//         alert('บันทึกโจทย์ใหม่เรียบร้อยแล้ว!');

//         // Reset Form
//         setFormData({
//             question: '',
//             choice_a: '', choice_b: '', choice_c: '', choice_d: '',
//             correct_answer: 'A',
//             category: defaultCategory || 'add', 
//             difficulty: 'easy',
//             technique_id: '', // Reset technique
//         });
//       }

//       if (onSuccess) onSuccess();

//     } catch (error: any) {
//       alert('เกิดข้อผิดพลาด: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   return (
//     <div className="w-full p-1 bg-white">
//       <form onSubmit={handleSubmit} className="space-y-4">
        
//         {/* ส่วนโจทย์ */}
//         <div>
//           <label className="block text-sm font-medium text-gray-700">โจทย์คำถาม</label>
//           <textarea
//             name="question"
//             value={formData.question}
//             onChange={handleChange}
//             required
//             className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//             rows={3}
//             placeholder="เช่น 5 + 3 เท่ากับเท่าไหร่?"
//           />
//         </div>

//         {/* ส่วนตัวเลือก A-D */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//           {['a', 'b', 'c', 'd'].map((choice) => (
//             <div key={choice}>
//               <label className="block text-sm font-medium text-gray-700 uppercase">ตัวเลือก {choice}</label>
//               <input
//                 type="text"
//                 name={`choice_${choice}`}
//                 // @ts-ignore
//                 value={(formData as any)[`choice_${choice}`]}
//                 onChange={handleChange}
//                 required
//                 className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//               />
//             </div>
//           ))}
//         </div>

//         <hr className="my-4" />

//         {/* แถวการตั้งค่าโจทย์ (3 คอลัมน์) */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
//           {/* 1. เฉลย */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">เฉลยที่ถูกต้อง</label>
//             <select
//               name="correct_answer"
//               value={formData.correct_answer}
//               onChange={handleChange}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//             >
//               <option value="A">ข้อ A</option>
//               <option value="B">ข้อ B</option>
//               <option value="C">ข้อ C</option>
//               <option value="D">ข้อ D</option>
//             </select>
//           </div>

//           {/* 2. ระดับความยาก */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700">ระดับความยาก</label>
//             <select
//               name="difficulty"
//               value={formData.difficulty}
//               onChange={handleChange}
//               className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
//             >
//               <option value="easy">ง่าย</option>
//               <option value="medium">ปานกลาง</option>
//               <option value="hard">ยาก</option>
//             </select>
//           </div>

//            {/* 3. หมวดการฝึก (Category) */}
//            <div>
//             <label className="block text-sm font-medium text-gray-700">หมวดการฝึก</label>
//             {defaultCategory ? (
//                 <div className="mt-1">
//                     <input
//                         type="text"
//                         name="category"
//                         value={formData.category}
//                         readOnly
//                         className="block w-full p-2 border border-gray-300 bg-gray-100 text-gray-500 rounded-md cursor-not-allowed"
//                     />
//                 </div>
//             ) : (
//                 <select
//                     name="category"
//                     value={formData.category}
//                     onChange={handleChange}
//                     className="mt-1 block w-full p-2 border border-gray-300 rounded-md bg-white"
//                 >
//                     <option value="add">การบวก (+)</option>
//                     <option value="sub">การลบ (-)</option>
//                     <option value="mul">การคูณ (×)</option>
//                     <option value="div">การหาร (÷)</option>
//                 </select>
//             )}
//           </div>
//         </div>

//         {/* แถวใหม่: เลือกเทคนิค (Technique) */}
//         <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
//             <label className="block text-sm font-medium text-blue-800 mb-2 flex items-center gap-2">
//                 <Lightbulb className="w-4 h-4" />
//                 เทคนิคการทำโจทย์ (Optional)
//             </label>
//             <select
//                 name="technique_id"
//                 value={formData.technique_id || ''}
//                 onChange={handleChange}
//                 className="block w-full p-2 border border-blue-200 rounded-md focus:ring-blue-500 focus:border-blue-500"
//             >
//                 <option value="">-- ไม่ระบุเทคนิค --</option>
//                 {techniques.map((tech) => (
//                     <option key={tech.id} value={tech.id}>
//                         {tech.title} {tech.practice_modes?.name ? `(${tech.practice_modes.name})` : ''}
//                     </option>
//                 ))}
//             </select>
//             <p className="text-xs text-blue-600 mt-1">
//                 การเลือกเทคนิคจะช่วยให้ผู้เรียนกดดูคำอธิบายเพิ่มเติมได้เมื่อทำโจทย์ข้อนี้
//             </p>
//         </div>

//         {/* ปุ่ม Submit */}
//         <button
//           type="submit"
//           disabled={loading}
//           className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
//             ${loading ? 'bg-gray-400' : initialData ? 'bg-orange-600 hover:bg-orange-700' : 'bg-blue-600 hover:bg-blue-700'} 
//             focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-4 flex justify-center items-center`}
//         >
//           {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
//           {loading ? 'กำลังบันทึก...' : initialData ? 'บันทึกการแก้ไข' : 'เพิ่มโจทย์ใหม่'}
//         </button>

//       </form>
//     </div>
//   );
// };

// export default AddMathProblem;


// import { useState, useEffect } from 'react';
// import { supabase } from '@/supabaseClient';
// import { Loader2, Save, Plus, Check, Lightbulb, X } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Card, CardContent } from '@/components/ui/card';

// // เพิ่ม interface สำหรับรับข้อมูลเก่า
// interface MathProblemData {
//   id?: string;
//   question: string;
//   choice_a: string;
//   choice_b: string;
//   choice_c: string;
//   choice_d: string;
//   correct_answer: string;
//   difficulty: string;
//   category: string;
//   technique_id?: string | null;
// }

// interface AddMathProblemProps {
//   defaultCategory: string;
//   onSuccess?: () => void;
//   initialData?: MathProblemData | null; // รับข้อมูลเริ่มต้น (กรณีแก้ไข)
//   onCancel?: () => void; // ปุ่มยกเลิก
// }

// interface Technique {
//     id: string;
//     title: string;
// }

// const AddMathProblem = ({ defaultCategory, onSuccess, initialData, onCancel }: AddMathProblemProps) => {
//   const [loading, setLoading] = useState(false);
//   const [techniques, setTechniques] = useState<Technique[]>([]);
  
//   const [formData, setFormData] = useState({
//     question: '',
//     choice_a: '',
//     choice_b: '',
//     choice_c: '',
//     choice_d: '',
//     correct_answer: 'A',
//     difficulty: 'easy',
//     category: defaultCategory,
//     technique_id: 'none'
//   });

//   // โหลดข้อมูลเทคนิค และ ข้อมูลเก่า(ถ้ามี)
//   useEffect(() => {
//     const fetchTechniques = async () => {
//         const { data } = await supabase.from('techniques').select('id, title').order('created_at');
//         setTechniques(data || []);
//     };
//     fetchTechniques();

//     // ถ้ามีข้อมูลเก่าส่งมา (โหมดแก้ไข) ให้เอามาใส่ฟอร์ม
//     if (initialData) {
//         setFormData({
//             question: initialData.question,
//             choice_a: initialData.choice_a,
//             choice_b: initialData.choice_b,
//             choice_c: initialData.choice_c,
//             choice_d: initialData.choice_d,
//             correct_answer: initialData.correct_answer,
//             difficulty: initialData.difficulty,
//             category: initialData.category,
//             technique_id: initialData.technique_id || 'none'
//         });
//     }
//   }, [initialData]);

//   const handleChange = (field: string, value: string) => {
//     setFormData(prev => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = async () => {
//     if (!formData.question || !formData.choice_a || !formData.choice_b || !formData.choice_c || !formData.choice_d) {
//       alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
//       return;
//     }

//     setLoading(true);
//     try {
//       const payload = {
//           ...formData,
//           technique_id: formData.technique_id === 'none' ? null : formData.technique_id
//       };

//       if (initialData && initialData.id) {
//         // --- โหมดแก้ไข (Update) ---
//         const { error } = await supabase
//             .from('math_problems')
//             .update(payload)
//             .eq('id', initialData.id);
//         if (error) throw error;
//         alert('แก้ไขโจทย์เรียบร้อย!');
//       } else {
//         // --- โหมดเพิ่มใหม่ (Insert) ---
//         const { error } = await supabase
//             .from('math_problems')
//             .insert([payload]);
//         if (error) throw error;
//         alert('เพิ่มโจทย์เรียบร้อย!');
        
//         // Reset Form เฉพาะตอนเพิ่มใหม่
//         setFormData({
//             question: '',
//             choice_a: '',
//             choice_b: '',
//             choice_c: '',
//             choice_d: '',
//             correct_answer: 'A',
//             difficulty: 'easy',
//             category: defaultCategory,
//             technique_id: 'none'
//         });
//       }

//       if (onSuccess) onSuccess();

//     } catch (error: any) {
//       alert('เกิดข้อผิดพลาด: ' + error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Card className="border-0 shadow-none">
//       <CardContent className="p-0 space-y-4">
        
//         {/* หัวข้อ (เปลี่ยนตามโหมด) */}
//         <div className="flex justify-between items-center mb-2">
//             <h3 className="text-lg font-bold text-gray-700">
//                 {initialData ? 'แก้ไขโจทย์' : 'เพิ่มโจทย์ใหม่'}
//             </h3>
//             {onCancel && (
//                 <Button variant="ghost" size="sm" onClick={onCancel}>
//                     <X className="w-4 h-4 mr-1" /> ยกเลิก
//                 </Button>
//             )}
//         </div>

//         {/* ส่วนโจทย์ */}
//         <div className="space-y-2">
//             <Label className="text-base">โจทย์คำถาม</Label>
//             <Input 
//                 placeholder="เช่น 5 + 5 = ?" 
//                 value={formData.question}
//                 onChange={(e) => handleChange('question', e.target.value)}
//                 className="text-lg font-medium"
//             />
//         </div>

//         {/* ส่วนตัวเลือก 4 ข้อ */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//             {['a', 'b', 'c', 'd'].map((choice) => (
//                 <div key={choice} className="space-y-2">
//                     <Label>ตัวเลือก {choice.toUpperCase()}</Label>
//                     <div className="flex items-center gap-2">
//                         <div className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded font-bold text-gray-500">
//                             {choice.toUpperCase()}
//                         </div>
//                         <Input 
//                             placeholder={`คำตอบ ${choice.toUpperCase()}`} 
//                             value={(formData as any)[`choice_${choice}`]}
//                             onChange={(e) => handleChange(`choice_${choice}`, e.target.value)}
//                         />
//                     </div>
//                 </div>
//             ))}
//         </div>

//         <div className="grid grid-cols-2 gap-4 pt-2">
//             <div className="space-y-2">
//                 <Label className="text-green-700 font-bold">เฉลยข้อที่ถูกต้อง</Label>
//                 <Select value={formData.correct_answer} onValueChange={(val) => handleChange('correct_answer', val)}>
//                     <SelectTrigger className="border-green-200 bg-green-50 text-green-700 font-bold"><SelectValue /></SelectTrigger>
//                     <SelectContent>
//                         {['A', 'B', 'C', 'D'].map(c => <SelectItem key={c} value={c}>ข้อ {c}</SelectItem>)}
//                     </SelectContent>
//                 </Select>
//             </div>
//             <div className="space-y-2">
//                 <Label>ระดับความยาก</Label>
//                 <Select value={formData.difficulty} onValueChange={(val) => handleChange('difficulty', val)}>
//                     <SelectTrigger><SelectValue /></SelectTrigger>
//                     <SelectContent>
//                         <SelectItem value="easy">ง่าย (Easy)</SelectItem>
//                         <SelectItem value="medium">ปานกลาง (Medium)</SelectItem>
//                         <SelectItem value="hard">ยาก (Hard)</SelectItem>
//                     </SelectContent>
//                 </Select>
//             </div>
//         </div>

//         <div className="space-y-2 pt-2 border-t mt-2">
//              <Label className="flex items-center gap-2 text-yellow-600"><Lightbulb className="w-4 h-4" /> ใช้เทคนิคอะไร? (Optional)</Label>
//              <Select value={formData.technique_id} onValueChange={(val) => handleChange('technique_id', val)}>
//                 <SelectTrigger className="bg-yellow-50/50 border-yellow-200">
//                     <SelectValue placeholder="เลือกเทคนิค..." />
//                 </SelectTrigger>
//                 <SelectContent>
//                     <SelectItem value="none" className="text-gray-400">-- ไม่ระบุ --</SelectItem>
//                     {techniques.map((tech) => (
//                         <SelectItem key={tech.id} value={tech.id}>{tech.title}</SelectItem>
//                     ))}
//                 </SelectContent>
//             </Select>
//         </div>

//         <div className="flex gap-3 mt-4">
//             {onCancel && (
//                 <Button variant="outline" className="flex-1 py-6" onClick={onCancel}>ยกเลิก</Button>
//             )}
//             <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-6" onClick={handleSubmit} disabled={loading}>
//                 {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
//                 {initialData ? 'บันทึกการแก้ไข' : 'เพิ่มโจทย์'}
//             </Button>
//         </div>

//       </CardContent>
//     </Card>
//   );
// };

// export default AddMathProblem;




import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { Loader2, Save, Plus, Check, Lightbulb, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

// Interface สำหรับรับข้อมูลเก่า
interface MathProblemData {
  id?: string;
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

interface AddMathProblemProps {
  defaultCategory: string; // ชื่อโหมด เช่น "การบวก"
  onSuccess?: () => void;
  initialData?: MathProblemData | null;
  onCancel?: () => void;
}

interface Technique {
  id: string;
  title: string;
}

interface LevelOption {
  difficulty: string;
}

const AddMathProblem = ({ defaultCategory, onSuccess, initialData, onCancel }: AddMathProblemProps) => {
  const [loading, setLoading] = useState(false);
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [availableLevels, setAvailableLevels] = useState<LevelOption[]>([]); // state เก็บระดับความยากที่ดึงมา
  
  const [formData, setFormData] = useState({
    question: '',
    choice_a: '',
    choice_b: '',
    choice_c: '',
    choice_d: '',
    correct_answer: 'A',
    difficulty: '', // ปล่อยว่างไว้ก่อน รอโหลดข้อมูล level
    category: defaultCategory,
    technique_id: 'none'
  });

  // โหลดข้อมูล (Techniques และ Levels ของโหมดนี้)
  useEffect(() => {
    const fetchData = async () => {
      // 1. โหลด Techniques
      const { data: techData } = await supabase.from('techniques').select('id, title').order('created_at');
      setTechniques(techData || []);

      // 2. โหลด Levels ตาม Category (Mode Name) ที่ส่งมา
      // ต้องหา mode_id จากชื่อ category ก่อน
      const { data: modeData } = await supabase
        .from('practice_modes')
        .select('id')
        .eq('name', defaultCategory)
        .single();

      if (modeData) {
        // ถ้าเจอโหมด ให้ดึง Level ของโหมดนั้นมา
        const { data: levelsData } = await supabase
            .from('practice_levels')
            .select('difficulty')
            .eq('mode_id', modeData.id);
        
        if (levelsData && levelsData.length > 0) {
            setAvailableLevels(levelsData);
            // ถ้าเป็นการเพิ่มใหม่ และยังไม่ได้เลือก difficulty ให้เลือกอันแรกเป็นค่าเริ่มต้น
            if (!initialData) {
                setFormData(prev => ({ ...prev, difficulty: levelsData[0].difficulty }));
            }
        } else {
            // กรณีไม่มี Level เลย (Fallback)
            setAvailableLevels([{ difficulty: 'easy' }, { difficulty: 'medium' }, { difficulty: 'hard' }]);
            if (!initialData) setFormData(prev => ({ ...prev, difficulty: 'easy' }));
        }
      }
    };

    fetchData();

    // ถ้ามีข้อมูลเก่าส่งมา (โหมดแก้ไข) ให้เอามาใส่ฟอร์ม
    if (initialData) {
        setFormData({
            question: initialData.question,
            choice_a: initialData.choice_a,
            choice_b: initialData.choice_b,
            choice_c: initialData.choice_c,
            choice_d: initialData.choice_d,
            correct_answer: initialData.correct_answer,
            difficulty: initialData.difficulty,
            category: initialData.category,
            technique_id: initialData.technique_id || 'none'
        });
    }
  }, [initialData, defaultCategory]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!formData.question || !formData.choice_a || !formData.choice_b || !formData.choice_c || !formData.choice_d) {
      alert('กรุณากรอกข้อมูลให้ครบทุกช่อง');
      return;
    }

    setLoading(true);
    try {
      const payload = {
          ...formData,
          technique_id: formData.technique_id === 'none' ? null : formData.technique_id
      };

      if (initialData && initialData.id) {
        // --- โหมดแก้ไข (Update) ---
        const { error } = await supabase
            .from('math_problems')
            .update(payload)
            .eq('id', initialData.id);
        if (error) throw error;
        alert('แก้ไขโจทย์เรียบร้อย!');
      } else {
        // --- โหมดเพิ่มใหม่ (Insert) ---
        const { error } = await supabase
            .from('math_problems')
            .insert([payload]);
        if (error) throw error;
        alert('เพิ่มโจทย์เรียบร้อย!');
        
        // Reset Form
        setFormData({
            question: '',
            choice_a: '',
            choice_b: '',
            choice_c: '',
            choice_d: '',
            correct_answer: 'A',
            difficulty: availableLevels.length > 0 ? availableLevels[0].difficulty : 'easy',
            category: defaultCategory,
            technique_id: 'none'
        });
      }

      if (onSuccess) onSuccess();

    } catch (error: any) {
      alert('เกิดข้อผิดพลาด: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0 space-y-4">
        
        {/* หัวข้อ */}
        <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-bold text-gray-700">
                {initialData ? 'แก้ไขโจทย์' : `เพิ่มโจทย์ใหม่ (${defaultCategory})`}
            </h3>
            {onCancel && (
                <Button variant="ghost" size="sm" onClick={onCancel}>
                    <X className="w-4 h-4 mr-1" /> ยกเลิก
                </Button>
            )}
        </div>

        {/* ส่วนโจทย์ */}
        <div className="space-y-2">
            <Label className="text-base">โจทย์คำถาม</Label>
            <Input 
                placeholder="เช่น 5 + 5 = ?" 
                value={formData.question}
                onChange={(e) => handleChange('question', e.target.value)}
                className="text-lg font-medium"
            />
        </div>

        {/* ส่วนตัวเลือก 4 ข้อ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['a', 'b', 'c', 'd'].map((choice) => (
                <div key={choice} className="space-y-2">
                    <Label>ตัวเลือก {choice.toUpperCase()}</Label>
                    <div className="flex items-center gap-2">
                        <div className="bg-gray-100 w-8 h-8 flex items-center justify-center rounded font-bold text-gray-500">
                            {choice.toUpperCase()}
                        </div>
                        <Input 
                            placeholder={`คำตอบ ${choice.toUpperCase()}`} 
                            value={(formData as any)[`choice_${choice}`]}
                            onChange={(e) => handleChange(`choice_${choice}`, e.target.value)}
                        />
                    </div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-2">
                <Label className="text-green-700 font-bold">เฉลยข้อที่ถูกต้อง</Label>
                <Select value={formData.correct_answer} onValueChange={(val) => handleChange('correct_answer', val)}>
                    <SelectTrigger className="border-green-200 bg-green-50 text-green-700 font-bold"><SelectValue /></SelectTrigger>
                    <SelectContent>
                        {['A', 'B', 'C', 'D'].map(c => <SelectItem key={c} value={c}>ข้อ {c}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
            
            {/* แก้ไขส่วนนี้: ระดับความยากแบบ Dynamic */}
            <div className="space-y-2">
                <Label>ระดับความยาก</Label>
                <Select 
                    value={formData.difficulty} 
                    onValueChange={(val) => handleChange('difficulty', val)}
                    disabled={availableLevels.length === 0}
                >
                    <SelectTrigger>
                        <SelectValue placeholder={availableLevels.length === 0 ? "ไม่มีข้อมูลระดับ" : "เลือกระดับ"} />
                    </SelectTrigger>
                    <SelectContent>
                        {availableLevels.map((level, index) => (
                            <SelectItem key={index} value={level.difficulty}>
                                {level.difficulty}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {availableLevels.length === 0 && (
                     <p className="text-xs text-red-500">
                        *โหมดนี้ยังไม่ได้ตั้งค่าระดับความยาก กรุณาไปเพิ่มระดับในหน้าจัดการโหมดก่อน
                     </p>
                )}
            </div>
        </div>

        <div className="space-y-2 pt-2 border-t mt-2">
             <Label className="flex items-center gap-2 text-yellow-600"><Lightbulb className="w-4 h-4" /> ใช้เทคนิคอะไร? (Optional)</Label>
             <Select value={formData.technique_id} onValueChange={(val) => handleChange('technique_id', val)}>
                <SelectTrigger className="bg-yellow-50/50 border-yellow-200">
                    <SelectValue placeholder="เลือกเทคนิค..." />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="none" className="text-gray-400">-- ไม่ระบุ --</SelectItem>
                    {techniques.map((tech) => (
                        <SelectItem key={tech.id} value={tech.id}>{tech.title}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>

        <div className="flex gap-3 mt-4">
            {onCancel && (
                <Button variant="outline" className="flex-1 py-6" onClick={onCancel}>ยกเลิก</Button>
            )}
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-lg py-6" onClick={handleSubmit} disabled={loading}>
                {loading ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2" />}
                {initialData ? 'บันทึกการแก้ไข' : 'เพิ่มโจทย์'}
            </Button>
        </div>

      </CardContent>
    </Card>
  );
};

export default AddMathProblem;