// import { useState, useEffect } from 'react';
// import { supabase } from '@/supabaseClient';
// import { BookOpen, Plus, Edit2, Loader2, Trash2, X, Save, Lightbulb, Image as ImageIcon, Video, Youtube } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';

// // Import Dialogs (คงเดิม)
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogHeader, 
//   DialogTitle, 
//   DialogTrigger 
// } from '@/components/ui/dialog';
// import AddMathProblem from './AddMathProblem'; 
// import ProblemListDialog from './ProblemListDialog';

// // --- Interfaces ---
// interface PracticeMode {
//   id: string;
//   name: string;
//   description: string;
//   difficulty: 'easy' | 'medium' | 'hard';
//   enabled: boolean;
// }

// interface Technique {
//   id: string;
//   title: string;
//   description: string;
//   image_url: string;
//   video_url: string;
//   difficulty: string;
//   practice_mode_id: string;
//   // Optional: เพื่อ join ชื่อโหมดมาแสดง
//   practice_modes?: {
//     name: string;
//   };
// }

// const ContentManager = () => {
//   // --- States สำหรับ Practice Modes (เดิม) ---
//   const [modes, setModes] = useState<PracticeMode[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     difficulty: 'easy'
//   });
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [isSaving, setIsSaving] = useState(false);

//   // --- States สำหรับ Techniques (ใหม่) ---
//   const [techniques, setTechniques] = useState<Technique[]>([]);
//   const [techLoading, setTechLoading] = useState(true);
//   const [techFormData, setTechFormData] = useState({
//     title: '',
//     description: '',
//     image_url: '',
//     video_url: '',
//     difficulty: 'easy',
//     practice_mode_id: ''
//   });
//   const [editingTechId, setEditingTechId] = useState<string | null>(null);
//   const [isSavingTech, setIsSavingTech] = useState(false);

//   // --- 1. Fetch Data ---
//   const fetchModes = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('practice_modes')
//         .select('*')
//         .order('created_at', { ascending: true });
//       if (error) throw error;
//       setModes(data || []);
//     } catch (error: any) {
//       console.error('Error fetching modes:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTechniques = async () => {
//     setTechLoading(true);
//     try {
//       // select *, practice_modes(name) คือการ join เอาชื่อโหมดมาด้วย
//       const { data, error } = await supabase
//         .from('techniques')
//         .select('*, practice_modes (name)') 
//         .order('created_at', { ascending: false });

//       if (error) throw error;
//       setTechniques(data || []);
//     } catch (error: any) {
//       console.error('Error fetching techniques:', error.message);
//     } finally {
//       setTechLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchModes();
//     fetchTechniques();
//   }, []);

//   // --- Logic สำหรับ Practice Mode (เดิม) ---
//   const handleEditClick = (mode: PracticeMode) => {
//     setEditingId(mode.id);
//     setFormData({
//       name: mode.name,
//       description: mode.description || '',
//       difficulty: mode.difficulty
//     });
//     // เลื่อนไปที่ฟอร์มโหมด (ถ้าต้องการ)
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setFormData({ name: '', description: '', difficulty: 'easy' });
//   };

//   const handleSaveMode = async () => {
//     if (!formData.name) { alert('กรุณากรอกชื่อโหมด'); return; }
//     setIsSaving(true);
//     try {
//       if (editingId) {
//         const { error } = await supabase.from('practice_modes').update(formData).eq('id', editingId);
//         if (error) throw error;
//       } else {
//         const { error } = await supabase.from('practice_modes').insert([{ ...formData, enabled: true }]);
//         if (error) throw error;
//       }
//       handleCancelEdit();
//       fetchModes();
//     } catch (error: any) {
//       alert('Error: ' + error.message);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleDeleteMode = async (id: string) => {
//     if (!confirm('ยืนยันการลบโหมด?')) return;
//     try {
//       const { error } = await supabase.from('practice_modes').delete().eq('id', id);
//       if (error) throw error;
//       setModes(modes.filter(m => m.id !== id));
//       if (editingId === id) handleCancelEdit();
//     } catch (error: any) {
//       alert('Error: ' + error.message);
//     }
//   };

//   // --- Logic สำหรับ Techniques (ใหม่) ---
//   
//   const handleEditTechClick = (tech: Technique) => {
//     setEditingTechId(tech.id);
//     setTechFormData({
//       title: tech.title,
//       description: tech.description || '',
//       image_url: tech.image_url || '',
//       video_url: tech.video_url || '',
//       difficulty: tech.difficulty,
//       practice_mode_id: tech.practice_mode_id
//     });
//     // Scroll ไปหาฟอร์มเทคนิค
//     const element = document.getElementById('tech-form-section');
//     if (element) element.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleCancelTechEdit = () => {
//     setEditingTechId(null);
//     setTechFormData({
//       title: '',
//       description: '',
//       image_url: '',
//       video_url: '',
//       difficulty: 'easy',
//       practice_mode_id: ''
//     });
//   };

//   const handleSaveTechnique = async () => {
//     if (!techFormData.title || !techFormData.practice_mode_id) {
//       alert('กรุณากรอกชื่อเทคนิค และเลือกหมวดการฝึก');
//       return;
//     }

//     setIsSavingTech(true);
//     try {
//       const payload = {
//         title: techFormData.title,
//         description: techFormData.description,
//         image_url: techFormData.image_url,
//         video_url: techFormData.video_url,
//         difficulty: techFormData.difficulty,
//         practice_mode_id: techFormData.practice_mode_id
//       };

//       if (editingTechId) {
//         const { error } = await supabase
//           .from('techniques')
//           .update(payload)
//           .eq('id', editingTechId);
//         if (error) throw error;
//         alert('แก้ไขเทคนิคเรียบร้อย');
//       } else {
//         const { error } = await supabase
//           .from('techniques')
//           .insert([payload]);
//         if (error) throw error;
//         alert('เพิ่มเทคนิคเรียบร้อย');
//       }

//       handleCancelTechEdit();
//       fetchTechniques();
//     } catch (error: any) {
//       alert('เกิดข้อผิดพลาด: ' + error.message);
//     } finally {
//       setIsSavingTech(false);
//     }
//   };

//   const handleDeleteTechnique = async (id: string) => {
//     if (!confirm('คุณแน่ใจหรือไม่ที่จะลบเทคนิคนี้?')) return;
//     try {
//       const { error } = await supabase.from('techniques').delete().eq('id', id);
//       if (error) throw error;
//       setTechniques(techniques.filter(t => t.id !== id));
//       if (editingTechId === id) handleCancelTechEdit();
//     } catch (error: any) {
//       alert('ลบไม่สำเร็จ: ' + error.message);
//     }
//   };

//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty) {
//       case 'easy': return 'bg-green-100 text-green-800 border-green-200';
//       case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'hard': return 'bg-red-100 text-red-800 border-red-200';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading && modes.length === 0) {
//     return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
//   }

//   return (
//     <div className="space-y-8 pb-10">
//       
//       {/* ================= SECTION 1: PRACTICE MODES ================= */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <BookOpen className="h-5 w-5" />
//             จัดการโหมดการฝึก ({modes.length})
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {modes.map((mode) => (
//                <div key={mode.id} className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg ${editingId === mode.id ? 'border-blue-500 bg-blue-50' : 'bg-white'}`}>
//                   {/* ... (ส่วนแสดงผล Mode เหมือนเดิม) ... */}
//                   <div className="flex items-center gap-4 mb-4 md:mb-0">
//                         <div>
//                             <div className="flex items-center gap-2">
//                                 <h3 className="font-medium text-lg">{mode.name}</h3>
//                                 <Badge variant="outline" className={getDifficultyColor(mode.difficulty)}>
//                                     {mode.difficulty}
//                                 </Badge>
//                             </div>
//                             <p className="text-sm text-muted-foreground mt-1">{mode.description || '-'}</p>
//                         </div>
//                     </div>
//                     <div className="flex flex-wrap gap-2 w-full md:w-auto">
//                         <Button size="sm" variant="ghost" className="text-orange-600 hover:bg-orange-50" onClick={() => handleEditClick(mode)}>
//                             <Edit2 className="w-4 h-4 mr-1" /> แก้ไข
//                         </Button>
//                         <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteMode(mode.id)}>
//                             <Trash2 className="w-4 h-4 mr-1" /> ลบ
//                         </Button>
//                         <div className="w-px h-8 bg-gray-200 mx-1 hidden md:block"></div>
//                         <Dialog>
//                             <DialogTrigger asChild>
//                             <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
//                                 <Plus className="w-4 h-4 mr-1" /> เพิ่มโจทย์
//                             </Button>
//                             </DialogTrigger>
//                             <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//                             <DialogHeader><DialogTitle>เพิ่มโจทย์: {mode.name}</DialogTitle></DialogHeader>
//                             <AddMathProblem defaultCategory={mode.name} onSuccess={() => console.log('Done')} />
//                             </DialogContent>
//                         </Dialog>
//                         <Dialog>
//                             <DialogTrigger asChild>
//                             <Button size="sm" variant="outline" className="text-gray-600">
//                                 <BookOpen className="w-4 h-4 mr-1" /> โจทย์
//                             </Button>
//                             </DialogTrigger>
//                             <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
//                             <DialogHeader><DialogTitle>จัดการโจทย์: {mode.name}</DialogTitle></DialogHeader>
//                             <ProblemListDialog category={mode.name} />
//                             </DialogContent>
//                         </Dialog>               
//                     </div>
//                </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* ฟอร์ม Practice Mode */}
//       <Card className={`border-t-4 shadow-md ${editingId ? 'border-t-orange-500' : 'border-t-blue-500'}`}>
//         <CardHeader>
//           <CardTitle className={`flex items-center gap-2 ${editingId ? 'text-orange-700' : 'text-blue-700'}`}>
//             {editingId ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
//             {editingId ? 'แก้ไขข้อมูลโหมด' : 'เพิ่มโหมดฝึกใหม่'}
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//              {/* ... (ฟอร์ม input เดิมของ Mode) ... */}
//              <div className="grid gap-4 sm:grid-cols-2">
//                 <div className="space-y-2">
//                     <Label>ชื่อโหมด <span className="text-red-500">*</span></Label>
//                     <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
//                 </div>
//                 <div className="space-y-2">
//                     <Label>ระดับความยาก</Label>
//                     <Select value={formData.difficulty} onValueChange={(val) => setFormData({...formData, difficulty: val as any})}>
//                         <SelectTrigger><SelectValue /></SelectTrigger>
//                         <SelectContent>
//                             <SelectItem value="easy">ง่าย</SelectItem>
//                             <SelectItem value="medium">ปานกลาง</SelectItem>
//                             <SelectItem value="hard">ยาก</SelectItem>
//                         </SelectContent>
//                     </Select>
//                 </div>
//                 <div className="space-y-2 sm:col-span-2">
//                     <Label>คำอธิบาย</Label>
//                     <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
//                 </div>
//                 <div className="sm:col-span-2 pt-2 flex gap-2">
//                     <Button onClick={handleSaveMode} disabled={isSaving} className={editingId ? 'bg-orange-600' : 'bg-blue-600'}>
//                         {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingId ? 'บันทึกการแก้ไข' : 'เพิ่มโหมดใหม่')}
//                     </Button>
//                     {editingId && <Button variant="outline" onClick={handleCancelEdit}>ยกเลิก</Button>}
//                 </div>
//              </div>
//         </CardContent>
//       </Card>

//       <div className="my-8 border-b border-gray-300"></div>

//       {/* ================= SECTION 2: TECHNIQUES (ใหม่) ================= */}
//       <div id="tech-form-section">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
//             <Lightbulb className="w-6 h-6 text-yellow-500" /> 
//             จัดการเทคนิคการทำโจทย์
//         </h2>
//         
//         {/* รายการ Techniques */}
//         <Card className="mb-6">
//             <CardContent className="pt-6">
//                 {techLoading ? (
//                     <div className="text-center py-4">กำลังโหลดข้อมูล...</div>
//                 ) : techniques.length === 0 ? (
//                     <div className="text-center text-gray-500 py-4">ยังไม่มีข้อมูลเทคนิค</div>
//                 ) : (
//                     <div className="grid grid-cols-1 gap-4">
//                         {techniques.map((tech) => (
//                             <div key={tech.id} className={`border rounded-lg p-4 flex flex-col md:flex-row gap-4 justify-between ${editingTechId === tech.id ? 'bg-purple-50 border-purple-500' : 'bg-white'}`}>
//                                 <div className="flex-1">
//                                     <div className="flex items-center gap-2 mb-2">
//                                         <h3 className="font-bold text-lg">{tech.title}</h3>
//                                         <Badge variant="secondary">{tech.practice_modes?.name || 'Unknown Mode'}</Badge>
//                                         <Badge variant="outline" className={getDifficultyColor(tech.difficulty)}>{tech.difficulty}</Badge>
//                                     </div>
//                                     <p className="text-sm text-gray-600 line-clamp-2">{tech.description}</p>
//                                     
//                                     <div className="flex gap-4 mt-2 text-xs text-gray-400">
//                                         {tech.image_url && <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> มีรูปภาพ</span>}
//                                         {tech.video_url && <span className="flex items-center gap-1"><Video className="w-3 h-3" /> มีวิดีโอ</span>}
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-2 shrink-0">
//                                     <Button size="icon" variant="ghost" onClick={() => handleEditTechClick(tech)}>
//                                         <Edit2 className="w-4 h-4 text-gray-600" />
//                                     </Button>
//                                     <Button size="icon" variant="ghost" onClick={() => handleDeleteTechnique(tech.id)}>
//                                         <Trash2 className="w-4 h-4 text-red-500" />
//                                     </Button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </CardContent>
//         </Card>

//         {/* ฟอร์มเพิ่ม/แก้ไข Technique */}
//         <Card className={`border-t-4 shadow-md ${editingTechId ? 'border-t-purple-500' : 'border-t-green-500'}`}>
//             <CardHeader>
//                 <CardTitle className={`flex items-center gap-2 ${editingTechId ? 'text-purple-700' : 'text-green-700'}`}>
//                     {editingTechId ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
//                     {editingTechId ? 'แก้ไขเทคนิค' : 'เพิ่มเทคนิคใหม่'}
//                 </CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <div className="grid gap-4 sm:grid-cols-2">
//                     {/* ชื่อเทคนิค */}
//                     <div className="space-y-2 sm:col-span-2">
//                         <Label>ชื่อหัวข้อเทคนิค <span className="text-red-500">*</span></Label>
//                         <Input 
//                             placeholder="เช่น เทคนิคการคูณไขว้, สูตรลัดหาพื้นที่" 
//                             value={techFormData.title}
//                             onChange={(e) => setTechFormData({...techFormData, title: e.target.value})}
//                         />
//                     </div>

//                     {/* เชื่อมโยงหมวดหมู่ (ดึงจาก Practice Mode) */}
//                     <div className="space-y-2">
//                         <Label>หมวดการฝึก (Category) <span className="text-red-500">*</span></Label>
//                         <Select 
//                             value={techFormData.practice_mode_id} 
//                             onValueChange={(val) => setTechFormData({...techFormData, practice_mode_id: val})}
//                         >
//                             <SelectTrigger>
//                                 <SelectValue placeholder="เลือกหมวดที่เกี่ยวข้อง" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {modes.map(m => (
//                                     <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     {/* ระดับความยาก */}
//                     <div className="space-y-2">
//                         <Label>ระดับความยาก</Label>
//                         <Select 
//                             value={techFormData.difficulty} 
//                             onValueChange={(val) => setTechFormData({...techFormData, difficulty: val})}
//                         >
//                             <SelectTrigger><SelectValue /></SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="easy">ง่าย (Easy)</SelectItem>
//                                 <SelectItem value="medium">ปานกลาง (Medium)</SelectItem>
//                                 <SelectItem value="hard">ยาก (Hard)</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     {/* URL รูปภาพ */}
//                     <div className="space-y-2">
//                         <Label className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> URL รูปภาพประกอบ (ถ้ามี)</Label>
//                         <Input 
//                             placeholder="https://example.com/image.png" 
//                             value={techFormData.image_url}
//                             onChange={(e) => setTechFormData({...techFormData, image_url: e.target.value})}
//                         />
//                     </div>

//                     {/* URL วิดีโอ */}
//                     <div className="space-y-2">
//                         <Label className="flex items-center gap-2"><Youtube className="w-4 h-4" /> URL วิดีโอ/Youtube (ถ้ามี)</Label>
//                         <Input 
//                             placeholder="https://youtube.com/..." 
//                             value={techFormData.video_url}
//                             onChange={(e) => setTechFormData({...techFormData, video_url: e.target.value})}
//                         />
//                     </div>

//                     {/* คำอธิบาย */}
//                     <div className="space-y-2 sm:col-span-2">
//                         <Label>รายละเอียด/วิธีการ</Label>
//                         <Textarea 
//                             className="min-h-[100px]"
//                             placeholder="อธิบายขั้นตอนหรือสูตรอย่างละเอียด..."
//                             value={techFormData.description}
//                             onChange={(e) => setTechFormData({...techFormData, description: e.target.value})}
//                         />
//                     </div>

//                     {/* ปุ่ม Action */}
//                     <div className="sm:col-span-2 pt-4 flex gap-2">
//                         <Button 
//                             onClick={handleSaveTechnique} 
//                             disabled={isSavingTech}
//                             className={editingTechId ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'}
//                         >
//                             {isSavingTech ? (
//                                 <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังบันทึก...</>
//                             ) : (
//                                 <><Save className="w-4 h-4 mr-2" /> {editingTechId ? 'บันทึกการแก้ไข' : 'บันทึกเทคนิค'}</>
//                             )}
//                         </Button>
//                         
//                         {editingTechId && (
//                             <Button variant="outline" onClick={handleCancelTechEdit}>
//                                 <X className="w-4 h-4 mr-2" /> ยกเลิก
//                             </Button>
//                         )}
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//       </div>

//     </div>
//   );
// };

// export default ContentManager;  





// import { useState, useEffect } from 'react';
// import { supabase } from '@/supabaseClient';
// import { 
//   BookOpen, 
//   Plus, 
//   Edit2, 
//   Loader2, 
//   Trash2, 
//   X, 
//   Save, 
//   Lightbulb, 
//   Image as ImageIcon, 
//   Video, 
//   Youtube 
// } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';

// // Import Dialogs
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogHeader, 
//   DialogTitle, 
//   DialogTrigger 
// } from '@/components/ui/dialog';
// import AddMathProblem from './AddMathProblem'; 
// import ProblemListDialog from './ProblemListDialog';

// // --- Interfaces ---
// type DifficultyLevel = 'easy' | 'medium' | 'hard';

// interface PracticeMode {
//   id: string;
//   name: string;
//   description: string;
//   difficulty: DifficultyLevel;
//   enabled: boolean;
// }

// interface Technique {
//   id: string;
//   title: string;
//   description: string;
//   image_url: string;
//   video_url: string;
//   difficulty: DifficultyLevel; // แก้ให้ตรงกับ PracticeMode
//   practice_mode_id: string;
//   // Optional: เพื่อรองรับข้อมูลที่ join มา
//   practice_modes?: {
//     name: string;
//   } | null;
// }

// const ContentManager = () => {
//   // --- States สำหรับ Practice Modes ---
//   const [modes, setModes] = useState<PracticeMode[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     difficulty: 'easy' as DifficultyLevel
//   });
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [isSaving, setIsSaving] = useState(false);

//   // --- States สำหรับ Techniques ---
//   const [techniques, setTechniques] = useState<Technique[]>([]);
//   const [techLoading, setTechLoading] = useState(true);
//   const [techFormData, setTechFormData] = useState({
//     title: '',
//     description: '',
//     image_url: '',
//     video_url: '',
//     difficulty: 'easy' as DifficultyLevel,
//     practice_mode_id: ''
//   });
//   const [editingTechId, setEditingTechId] = useState<string | null>(null);
//   const [isSavingTech, setIsSavingTech] = useState(false);

//   // --- 1. Fetch Data ---
//   const fetchModes = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('practice_modes')
//         .select('*')
//         .order('created_at', { ascending: true });
//       if (error) throw error;
//       setModes(data || []);
//     } catch (error: any) {
//       console.error('Error fetching modes:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTechniques = async () => {
//     setTechLoading(true);
//     try {
//       // select *, practice_modes(name) คือการ join เอาชื่อโหมดมาด้วย
//       const { data, error } = await supabase
//         .from('techniques')
//         .select('*, practice_modes (name)') 
//         .order('created_at', { ascending: false });

//       if (error) throw error;
      
//       // Cast type เพื่อแก้ปัญหา TypeScript warning
//       setTechniques((data as any) || []);
//     } catch (error: any) {
//       console.error('Error fetching techniques:', error.message);
//     } finally {
//       setTechLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchModes();
//     fetchTechniques();
//   }, []);

//   // --- Logic สำหรับ Practice Mode ---
//   const handleEditClick = (mode: PracticeMode) => {
//     setEditingId(mode.id);
//     setFormData({
//       name: mode.name,
//       description: mode.description || '',
//       difficulty: mode.difficulty
//     });
//     // เลื่อนไปที่ฟอร์ม
//     const element = document.getElementById('mode-form-section');
//     if (element) element.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setFormData({ name: '', description: '', difficulty: 'easy' });
//   };

//   const handleSaveMode = async () => {
//     if (!formData.name) { alert('กรุณากรอกชื่อโหมด'); return; }
//     setIsSaving(true);
//     try {
//       if (editingId) {
//         const { error } = await supabase.from('practice_modes').update(formData).eq('id', editingId);
//         if (error) throw error;
//       } else {
//         const { error } = await supabase.from('practice_modes').insert([{ ...formData, enabled: true }]);
//         if (error) throw error;
//       }
//       handleCancelEdit();
//       fetchModes();
//     } catch (error: any) {
//       alert('Error: ' + error.message);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleDeleteMode = async (id: string) => {
//     if (!confirm('ยืนยันการลบโหมด?')) return;
//     try {
//       const { error } = await supabase.from('practice_modes').delete().eq('id', id);
//       if (error) throw error;
//       setModes(modes.filter(m => m.id !== id));
//       if (editingId === id) handleCancelEdit();
//     } catch (error: any) {
//       alert('Error: ' + error.message);
//     }
//   };

//   // --- Logic สำหรับ Techniques ---
//   const handleEditTechClick = (tech: Technique) => {
//     setEditingTechId(tech.id);
//     setTechFormData({
//       title: tech.title,
//       description: tech.description || '',
//       image_url: tech.image_url || '',
//       video_url: tech.video_url || '',
//       difficulty: tech.difficulty,
//       practice_mode_id: tech.practice_mode_id
//     });
//     // Scroll ไปหาฟอร์มเทคนิค
//     const element = document.getElementById('tech-form-section');
//     if (element) element.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleCancelTechEdit = () => {
//     setEditingTechId(null);
//     setTechFormData({
//       title: '',
//       description: '',
//       image_url: '',
//       video_url: '',
//       difficulty: 'easy',
//       practice_mode_id: ''
//     });
//   };

//   const handleSaveTechnique = async () => {
//     if (!techFormData.title || !techFormData.practice_mode_id) {
//       alert('กรุณากรอกชื่อเทคนิค และเลือกหมวดการฝึก');
//       return;
//     }

//     setIsSavingTech(true);
//     try {
//       const payload = {
//         title: techFormData.title,
//         description: techFormData.description,
//         image_url: techFormData.image_url,
//         video_url: techFormData.video_url,
//         difficulty: techFormData.difficulty,
//         practice_mode_id: techFormData.practice_mode_id
//       };

//       if (editingTechId) {
//         const { error } = await supabase
//           .from('techniques')
//           .update(payload)
//           .eq('id', editingTechId);
//         if (error) throw error;
//         alert('แก้ไขเทคนิคเรียบร้อย');
//       } else {
//         const { error } = await supabase
//           .from('techniques')
//           .insert([payload]);
//         if (error) throw error;
//         alert('เพิ่มเทคนิคเรียบร้อย');
//       }

//       handleCancelTechEdit();
//       fetchTechniques();
//     } catch (error: any) {
//       alert('เกิดข้อผิดพลาด: ' + error.message);
//     } finally {
//       setIsSavingTech(false);
//     }
//   };

//   const handleDeleteTechnique = async (id: string) => {
//     if (!confirm('คุณแน่ใจหรือไม่ที่จะลบเทคนิคนี้?')) return;
//     try {
//       const { error } = await supabase.from('techniques').delete().eq('id', id);
//       if (error) throw error;
//       setTechniques(techniques.filter(t => t.id !== id));
//       if (editingTechId === id) handleCancelTechEdit();
//     } catch (error: any) {
//       alert('ลบไม่สำเร็จ: ' + error.message);
//     }
//   };

//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty) {
//       case 'easy': return 'bg-green-100 text-green-800 border-green-200';
//       case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'hard': return 'bg-red-100 text-red-800 border-red-200';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading && modes.length === 0) {
//     return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
//   }

//   return (
//     <div className="space-y-8 pb-10">
      
//       {/* ================= SECTION 1: PRACTICE MODES ================= */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <BookOpen className="h-5 w-5" />
//             จัดการโหมดการฝึก ({modes.length})
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {modes.map((mode) => (
//                <div key={mode.id} className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg ${editingId === mode.id ? 'border-blue-500 bg-blue-50' : 'bg-white'}`}>
//                   <div className="flex items-center gap-4 mb-4 md:mb-0">
//                         <div>
//                             <div className="flex items-center gap-2">
//                                 <h3 className="font-medium text-lg">{mode.name}</h3>
//                                 <Badge variant="outline" className={getDifficultyColor(mode.difficulty)}>
//                                     {mode.difficulty}
//                                 </Badge>
//                             </div>
//                             <p className="text-sm text-muted-foreground mt-1">{mode.description || '-'}</p>
//                         </div>
//                     </div>
//                     <div className="flex flex-wrap gap-2 w-full md:w-auto">
//                         <Button size="sm" variant="ghost" className="text-orange-600 hover:bg-orange-50" onClick={() => handleEditClick(mode)}>
//                             <Edit2 className="w-4 h-4 mr-1" /> แก้ไข
//                         </Button>
//                         <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteMode(mode.id)}>
//                             <Trash2 className="w-4 h-4 mr-1" /> ลบ
//                         </Button>
//                         <div className="w-px h-8 bg-gray-200 mx-1 hidden md:block"></div>
//                         <Dialog>
//                             <DialogTrigger asChild>
//                             <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
//                                 <Plus className="w-4 h-4 mr-1" /> เพิ่มโจทย์
//                             </Button>
//                             </DialogTrigger>
//                             <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//                             <DialogHeader><DialogTitle>เพิ่มโจทย์: {mode.name}</DialogTitle></DialogHeader>
//                             <AddMathProblem defaultCategory={mode.name} onSuccess={() => console.log('Done')} />
//                             </DialogContent>
//                         </Dialog>
//                         <Dialog>
//                             <DialogTrigger asChild>
//                             <Button size="sm" variant="outline" className="text-gray-600">
//                                 <BookOpen className="w-4 h-4 mr-1" /> โจทย์
//                             </Button>
//                             </DialogTrigger>
//                             <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
//                             <DialogHeader><DialogTitle>จัดการโจทย์: {mode.name}</DialogTitle></DialogHeader>
//                             <ProblemListDialog category={mode.name} />
//                             </DialogContent>
//                         </Dialog>               
//                     </div>
//                </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* ฟอร์ม Practice Mode */}
//       <div id="mode-form-section">
//         <Card className={`border-t-4 shadow-md ${editingId ? 'border-t-orange-500' : 'border-t-blue-500'}`}>
//             <CardHeader>
//             <CardTitle className={`flex items-center gap-2 ${editingId ? 'text-orange-700' : 'text-blue-700'}`}>
//                 {editingId ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
//                 {editingId ? 'แก้ไขข้อมูลโหมด' : 'เพิ่มโหมดฝึกใหม่'}
//             </CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <div className="grid gap-4 sm:grid-cols-2">
//                     <div className="space-y-2">
//                         <Label>ชื่อโหมด <span className="text-red-500">*</span></Label>
//                         <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
//                     </div>
//                     <div className="space-y-2">
//                         <Label>ระดับความยาก</Label>
//                         <Select 
//                             value={formData.difficulty || undefined} 
//                             onValueChange={(val) => setFormData({...formData, difficulty: val as DifficultyLevel})}
//                         >
//                             <SelectTrigger><SelectValue /></SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="easy">ง่าย</SelectItem>
//                                 <SelectItem value="medium">ปานกลาง</SelectItem>
//                                 <SelectItem value="hard">ยาก</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>
//                     <div className="space-y-2 sm:col-span-2">
//                         <Label>คำอธิบาย</Label>
//                         <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
//                     </div>
//                     <div className="sm:col-span-2 pt-2 flex gap-2">
//                         <Button onClick={handleSaveMode} disabled={isSaving} className={editingId ? 'bg-orange-600' : 'bg-blue-600'}>
//                             {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingId ? 'บันทึกการแก้ไข' : 'เพิ่มโหมดใหม่')}
//                         </Button>
//                         {editingId && <Button variant="outline" onClick={handleCancelEdit}>ยกเลิก</Button>}
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//       </div>

//       <div className="my-8 border-b border-gray-300"></div>

//       {/* ================= SECTION 2: TECHNIQUES ================= */}
//       <div id="tech-form-section">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
//             <Lightbulb className="w-6 h-6 text-yellow-500" /> 
//             จัดการเทคนิคการทำโจทย์
//         </h2>
        
//         {/* รายการ Techniques */}
//         <Card className="mb-6">
//             <CardContent className="pt-6">
//                 {techLoading ? (
//                     <div className="text-center py-4">กำลังโหลดข้อมูล...</div>
//                 ) : techniques.length === 0 ? (
//                     <div className="text-center text-gray-500 py-4">ยังไม่มีข้อมูลเทคนิค</div>
//                 ) : (
//                     <div className="grid grid-cols-1 gap-4">
//                         {techniques.map((tech) => (
//                             <div key={tech.id} className={`border rounded-lg p-4 flex flex-col md:flex-row gap-4 justify-between ${editingTechId === tech.id ? 'bg-purple-50 border-purple-500' : 'bg-white'}`}>
//                                 <div className="flex-1">
//                                     <div className="flex items-center gap-2 mb-2">
//                                         <h3 className="font-bold text-lg">{tech.title}</h3>
//                                         {/* ใช้ Optional Chaining (?) เผื่อข้อมูล join ไม่มา */}
//                                         <Badge variant="secondary">{tech.practice_modes?.name || 'Unknown Mode'}</Badge>
//                                         <Badge variant="outline" className={getDifficultyColor(tech.difficulty)}>{tech.difficulty}</Badge>
//                                     </div>
//                                     <p className="text-sm text-gray-600 line-clamp-2">{tech.description}</p>
                                    
//                                     <div className="flex gap-4 mt-2 text-xs text-gray-400">
//                                         {tech.image_url && <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> มีรูปภาพ</span>}
//                                         {tech.video_url && <span className="flex items-center gap-1"><Video className="w-3 h-3" /> มีวิดีโอ</span>}
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-2 shrink-0">
//                                     <Button size="icon" variant="ghost" onClick={() => handleEditTechClick(tech)}>
//                                         <Edit2 className="w-4 h-4 text-gray-600" />
//                                     </Button>
//                                     <Button size="icon" variant="ghost" onClick={() => handleDeleteTechnique(tech.id)}>
//                                         <Trash2 className="w-4 h-4 text-red-500" />
//                                     </Button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </CardContent>
//         </Card>

//         {/* ฟอร์มเพิ่ม/แก้ไข Technique */}
//         <Card className={`border-t-4 shadow-md ${editingTechId ? 'border-t-purple-500' : 'border-t-green-500'}`}>
//             <CardHeader>
//                 <CardTitle className={`flex items-center gap-2 ${editingTechId ? 'text-purple-700' : 'text-green-700'}`}>
//                     {editingTechId ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
//                     {editingTechId ? 'แก้ไขเทคนิค' : 'เพิ่มเทคนิคใหม่'}
//                 </CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <div className="grid gap-4 sm:grid-cols-2">
//                     {/* ชื่อเทคนิค */}
//                     <div className="space-y-2 sm:col-span-2">
//                         <Label>ชื่อหัวข้อเทคนิค <span className="text-red-500">*</span></Label>
//                         <Input 
//                             placeholder="เช่น เทคนิคการคูณไขว้, สูตรลัดหาพื้นที่" 
//                             value={techFormData.title}
//                             onChange={(e) => setTechFormData({...techFormData, title: e.target.value})}
//                         />
//                     </div>

//                     {/* เชื่อมโยงหมวดหมู่ (ดึงจาก Practice Mode) */}
//                     <div className="space-y-2">
//                         <Label>หมวดการฝึก (Category) <span className="text-red-500">*</span></Label>
//                         <Select 
//                             value={techFormData.practice_mode_id || undefined} 
//                             onValueChange={(val) => setTechFormData({...techFormData, practice_mode_id: val})}
//                         >
//                             <SelectTrigger>
//                                 <SelectValue placeholder="เลือกหมวดที่เกี่ยวข้อง" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {modes.map(m => (
//                                     <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     {/* ระดับความยาก */}
//                     <div className="space-y-2">
//                         <Label>ระดับความยาก</Label>
//                         <Select 
//                             value={techFormData.difficulty || undefined} 
//                             onValueChange={(val) => setTechFormData({...techFormData, difficulty: val as DifficultyLevel})}
//                         >
//                             <SelectTrigger><SelectValue /></SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="easy">ง่าย (Easy)</SelectItem>
//                                 <SelectItem value="medium">ปานกลาง (Medium)</SelectItem>
//                                 <SelectItem value="hard">ยาก (Hard)</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     {/* URL รูปภาพ */}
//                     <div className="space-y-2">
//                         <Label className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> URL รูปภาพประกอบ (ถ้ามี)</Label>
//                         <Input 
//                             placeholder="https://example.com/image.png" 
//                             value={techFormData.image_url}
//                             onChange={(e) => setTechFormData({...techFormData, image_url: e.target.value})}
//                         />
//                     </div>

//                     {/* URL วิดีโอ */}
//                     <div className="space-y-2">
//                         <Label className="flex items-center gap-2"><Youtube className="w-4 h-4" /> URL วิดีโอ/Youtube (ถ้ามี)</Label>
//                         <Input 
//                             placeholder="https://youtube.com/..." 
//                             value={techFormData.video_url}
//                             onChange={(e) => setTechFormData({...techFormData, video_url: e.target.value})}
//                         />
//                     </div>

//                     {/* คำอธิบาย */}
//                     <div className="space-y-2 sm:col-span-2">
//                         <Label>รายละเอียด/วิธีการ</Label>
//                         <Textarea 
//                             className="min-h-[100px]"
//                             placeholder="อธิบายขั้นตอนหรือสูตรอย่างละเอียด..."
//                             value={techFormData.description}
//                             onChange={(e) => setTechFormData({...techFormData, description: e.target.value})}
//                         />
//                     </div>

//                     {/* ปุ่ม Action */}
//                     <div className="sm:col-span-2 pt-4 flex gap-2">
//                         <Button 
//                             onClick={handleSaveTechnique} 
//                             disabled={isSavingTech}
//                             className={editingTechId ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'}
//                         >
//                             {isSavingTech ? (
//                                 <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังบันทึก...</>
//                             ) : (
//                                 <><Save className="w-4 h-4 mr-2" /> {editingTechId ? 'บันทึกการแก้ไข' : 'บันทึกเทคนิค'}</>
//                             )}
//                         </Button>
                        
//                         {editingTechId && (
//                             <Button variant="outline" onClick={handleCancelTechEdit}>
//                                 <X className="w-4 h-4 mr-2" /> ยกเลิก
//                             </Button>
//                         )}
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//       </div>

//     </div>
//   );
// };

// export default ContentManager;



// import { useState, useEffect } from 'react';
// import { supabase } from '@/supabaseClient';
// import { 
//   BookOpen, 
//   Plus, 
//   Edit2, 
//   Loader2, 
//   Trash2, 
//   X, 
//   Save, 
//   Lightbulb, 
//   Image as ImageIcon, 
//   Video, 
//   Youtube 
// } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
// import { Textarea } from '@/components/ui/textarea';

// // Import Dialogs
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogHeader, 
//   DialogTitle, 
//   DialogTrigger 
// } from '@/components/ui/dialog';
// import AddMathProblem from './AddMathProblem'; 
// import ProblemListDialog from './ProblemListDialog';

// // --- Interfaces ---
// type DifficultyLevel = 'easy' | 'medium' | 'hard';

// interface PracticeMode {
//   id: string;
//   name: string;
//   description: string;
//   difficulty: DifficultyLevel;
//   enabled: boolean;
// }

// interface Technique {
//   id: string;
//   title: string;
//   description: string;
//   image_url: string;
//   video_url: string;
//   difficulty: DifficultyLevel;
//   practice_mode_id: string;
//   // Optional: เพื่อรองรับข้อมูลที่ join มา
//   practice_modes?: {
//     name: string;
//   } | null;
// }

// const ContentManager = () => {
//   // --- States สำหรับ Practice Modes ---
//   const [modes, setModes] = useState<PracticeMode[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   // formData ยังคงต้องมี difficulty เพื่อไม่ให้ TS ฟ้อง แต่ User จะมองไม่เห็น
//   const [formData, setFormData] = useState({
//     name: '',
//     description: '',
//     difficulty: 'easy' as DifficultyLevel 
//   });
//   const [editingId, setEditingId] = useState<string | null>(null);
//   const [isSaving, setIsSaving] = useState(false);

//   // --- States สำหรับ Techniques ---
//   const [techniques, setTechniques] = useState<Technique[]>([]);
//   const [techLoading, setTechLoading] = useState(true);
//   const [techFormData, setTechFormData] = useState({
//     title: '',
//     description: '',
//     image_url: '',
//     video_url: '',
//     difficulty: 'easy' as DifficultyLevel,
//     practice_mode_id: ''
//   });
//   const [editingTechId, setEditingTechId] = useState<string | null>(null);
//   const [isSavingTech, setIsSavingTech] = useState(false);

//   // --- 1. Fetch Data ---
//   const fetchModes = async () => {
//     setLoading(true);
//     try {
//       const { data, error } = await supabase
//         .from('practice_modes')
//         .select('*')
//         .order('created_at', { ascending: true });
//       if (error) throw error;
//       setModes(data || []);
//     } catch (error: any) {
//       console.error('Error fetching modes:', error.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchTechniques = async () => {
//     setTechLoading(true);
//     try {
//       // select *, practice_modes(name) คือการ join เอาชื่อโหมดมาด้วย
//       const { data, error } = await supabase
//         .from('techniques')
//         .select('*, practice_modes (name)') 
//         .order('created_at', { ascending: false });

//       if (error) throw error;
      
//       // Cast type เพื่อแก้ปัญหา TypeScript warning
//       setTechniques((data as any) || []);
//     } catch (error: any) {
//       console.error('Error fetching techniques:', error.message);
//     } finally {
//       setTechLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchModes();
//     fetchTechniques();
//   }, []);

//   // --- Logic สำหรับ Practice Mode ---
//   const handleEditClick = (mode: PracticeMode) => {
//     setEditingId(mode.id);
//     setFormData({
//       name: mode.name,
//       description: mode.description || '',
//       difficulty: mode.difficulty // ยังคงเก็บค่าเดิมไว้ แต่ไม่แสดงให้แก้
//     });
//     // เลื่อนไปที่ฟอร์ม
//     const element = document.getElementById('mode-form-section');
//     if (element) element.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleCancelEdit = () => {
//     setEditingId(null);
//     setFormData({ name: '', description: '', difficulty: 'easy' });
//   };

//   const handleSaveMode = async () => {
//     if (!formData.name) { alert('กรุณากรอกชื่อโหมด'); return; }
//     setIsSaving(true);
//     try {
//       if (editingId) {
//         const { error } = await supabase.from('practice_modes').update(formData).eq('id', editingId);
//         if (error) throw error;
//       } else {
//         const { error } = await supabase.from('practice_modes').insert([{ ...formData, enabled: true }]);
//         if (error) throw error;
//       }
//       handleCancelEdit();
//       fetchModes();
//     } catch (error: any) {
//       alert('Error: ' + error.message);
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleDeleteMode = async (id: string) => {
//     if (!confirm('ยืนยันการลบโหมด?')) return;
//     try {
//       const { error } = await supabase.from('practice_modes').delete().eq('id', id);
//       if (error) throw error;
//       setModes(modes.filter(m => m.id !== id));
//       if (editingId === id) handleCancelEdit();
//     } catch (error: any) {
//       alert('Error: ' + error.message);
//     }
//   };

//   // --- Logic สำหรับ Techniques ---
//   const handleEditTechClick = (tech: Technique) => {
//     setEditingTechId(tech.id);
//     setTechFormData({
//       title: tech.title,
//       description: tech.description || '',
//       image_url: tech.image_url || '',
//       video_url: tech.video_url || '',
//       difficulty: tech.difficulty,
//       practice_mode_id: tech.practice_mode_id
//     });
//     // Scroll ไปหาฟอร์มเทคนิค
//     const element = document.getElementById('tech-form-section');
//     if (element) element.scrollIntoView({ behavior: 'smooth' });
//   };

//   const handleCancelTechEdit = () => {
//     setEditingTechId(null);
//     setTechFormData({
//       title: '',
//       description: '',
//       image_url: '',
//       video_url: '',
//       difficulty: 'easy',
//       practice_mode_id: ''
//     });
//   };

//   const handleSaveTechnique = async () => {
//     if (!techFormData.title || !techFormData.practice_mode_id) {
//       alert('กรุณากรอกชื่อเทคนิค และเลือกหมวดการฝึก');
//       return;
//     }

//     setIsSavingTech(true);
//     try {
//       const payload = {
//         title: techFormData.title,
//         description: techFormData.description,
//         image_url: techFormData.image_url,
//         video_url: techFormData.video_url,
//         difficulty: techFormData.difficulty,
//         practice_mode_id: techFormData.practice_mode_id
//       };

//       if (editingTechId) {
//         const { error } = await supabase
//           .from('techniques')
//           .update(payload)
//           .eq('id', editingTechId);
//         if (error) throw error;
//         alert('แก้ไขเทคนิคเรียบร้อย');
//       } else {
//         const { error } = await supabase
//           .from('techniques')
//           .insert([payload]);
//         if (error) throw error;
//         alert('เพิ่มเทคนิคเรียบร้อย');
//       }

//       handleCancelTechEdit();
//       fetchTechniques();
//     } catch (error: any) {
//       alert('เกิดข้อผิดพลาด: ' + error.message);
//     } finally {
//       setIsSavingTech(false);
//     }
//   };

//   const handleDeleteTechnique = async (id: string) => {
//     if (!confirm('คุณแน่ใจหรือไม่ที่จะลบเทคนิคนี้?')) return;
//     try {
//       const { error } = await supabase.from('techniques').delete().eq('id', id);
//       if (error) throw error;
//       setTechniques(techniques.filter(t => t.id !== id));
//       if (editingTechId === id) handleCancelTechEdit();
//     } catch (error: any) {
//       alert('ลบไม่สำเร็จ: ' + error.message);
//     }
//   };

//   const getDifficultyColor = (difficulty: string) => {
//     switch (difficulty) {
//       case 'easy': return 'bg-green-100 text-green-800 border-green-200';
//       case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//       case 'hard': return 'bg-red-100 text-red-800 border-red-200';
//       default: return 'bg-gray-100 text-gray-800';
//     }
//   };

//   if (loading && modes.length === 0) {
//     return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
//   }

//   return (
//     <div className="space-y-8 pb-10">
      
//       {/* ================= SECTION 1: PRACTICE MODES ================= */}
//       <Card>
//         <CardHeader>
//           <CardTitle className="flex items-center gap-2">
//             <BookOpen className="h-5 w-5" />
//             จัดการโหมดการฝึก ({modes.length})
//           </CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="space-y-4">
//             {modes.map((mode) => (
//                <div key={mode.id} className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg ${editingId === mode.id ? 'border-blue-500 bg-blue-50' : 'bg-white'}`}>
//                   <div className="flex items-center gap-4 mb-4 md:mb-0">
//                         <div>
//                             <div className="flex items-center gap-2">
//                                 <h3 className="font-medium text-lg">{mode.name}</h3>
//                                 {/* เอา Badge Difficulty ออกแล้วตามคำขอ */}
//                             </div>
//                             <p className="text-sm text-muted-foreground mt-1">{mode.description || '-'}</p>
//                         </div>
//                     </div>
//                     <div className="flex flex-wrap gap-2 w-full md:w-auto">
//                         <Button size="sm" variant="ghost" className="text-orange-600 hover:bg-orange-50" onClick={() => handleEditClick(mode)}>
//                             <Edit2 className="w-4 h-4 mr-1" /> แก้ไข
//                         </Button>
//                         <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteMode(mode.id)}>
//                             <Trash2 className="w-4 h-4 mr-1" /> ลบ
//                         </Button>
//                         <div className="w-px h-8 bg-gray-200 mx-1 hidden md:block"></div>
//                         <Dialog>
//                             <DialogTrigger asChild>
//                             <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
//                                 <Plus className="w-4 h-4 mr-1" /> เพิ่มโจทย์
//                             </Button>
//                             </DialogTrigger>
//                             <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
//                             <DialogHeader><DialogTitle>เพิ่มโจทย์: {mode.name}</DialogTitle></DialogHeader>
//                             <AddMathProblem defaultCategory={mode.name} onSuccess={() => console.log('Done')} />
//                             </DialogContent>
//                         </Dialog>
//                         <Dialog>
//                             <DialogTrigger asChild>
//                             <Button size="sm" variant="outline" className="text-gray-600">
//                                 <BookOpen className="w-4 h-4 mr-1" /> โจทย์
//                             </Button>
//                             </DialogTrigger>
//                             {/* <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
//                             <DialogHeader><DialogTitle>จัดการโจทย์: {mode.name}</DialogTitle></DialogHeader>
//                             <ProblemListDialog category={mode.name} />
//                             </DialogContent> */}
//                             <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
//                             <DialogHeader><DialogTitle>จัดการโจทย์: {mode.name}</DialogTitle></DialogHeader>
//                             <ProblemListDialog category={mode.name} />
//                             </DialogContent>
//                         </Dialog>               
//                     </div>
//                </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>

//       {/* ฟอร์ม Practice Mode */}
//       <div id="mode-form-section">
//         <Card className={`border-t-4 shadow-md ${editingId ? 'border-t-orange-500' : 'border-t-blue-500'}`}>
//             <CardHeader>
//             <CardTitle className={`flex items-center gap-2 ${editingId ? 'text-orange-700' : 'text-blue-700'}`}>
//                 {editingId ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
//                 {editingId ? 'แก้ไขข้อมูลโหมด' : 'เพิ่มโหมดฝึกใหม่'}
//             </CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <div className="grid gap-4 sm:grid-cols-2">
//                     <div className="space-y-2 sm:col-span-2">
//                         <Label>ชื่อโหมด <span className="text-red-500">*</span></Label>
//                         <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
//                     </div>
//                     {/* เอา Dropdown Difficulty ออกแล้ว */}
                    
//                     <div className="space-y-2 sm:col-span-2">
//                         <Label>คำอธิบาย</Label>
//                         <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
//                     </div>
//                     <div className="sm:col-span-2 pt-2 flex gap-2">
//                         <Button onClick={handleSaveMode} disabled={isSaving} className={editingId ? 'bg-orange-600' : 'bg-blue-600'}>
//                             {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingId ? 'บันทึกการแก้ไข' : 'เพิ่มโหมดใหม่')}
//                         </Button>
//                         {editingId && <Button variant="outline" onClick={handleCancelEdit}>ยกเลิก</Button>}
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//       </div>

//       <div className="my-8 border-b border-gray-300"></div>

//       {/* ================= SECTION 2: TECHNIQUES ================= */}
//       <div id="tech-form-section">
//         <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
//             <Lightbulb className="w-6 h-6 text-yellow-500" /> 
//             จัดการเทคนิคการทำโจทย์
//         </h2>
        
//         {/* รายการ Techniques */}
//         <Card className="mb-6">
//             <CardContent className="pt-6">
//                 {techLoading ? (
//                     <div className="text-center py-4">กำลังโหลดข้อมูล...</div>
//                 ) : techniques.length === 0 ? (
//                     <div className="text-center text-gray-500 py-4">ยังไม่มีข้อมูลเทคนิค</div>
//                 ) : (
//                     <div className="grid grid-cols-1 gap-4">
//                         {techniques.map((tech) => (
//                             <div key={tech.id} className={`border rounded-lg p-4 flex flex-col md:flex-row gap-4 justify-between ${editingTechId === tech.id ? 'bg-purple-50 border-purple-500' : 'bg-white'}`}>
//                                 <div className="flex-1">
//                                     <div className="flex items-center gap-2 mb-2">
//                                         <h3 className="font-bold text-lg">{tech.title}</h3>
//                                         {/* ใช้ Optional Chaining (?) เผื่อข้อมูล join ไม่มา */}
//                                         <Badge variant="secondary">{tech.practice_modes?.name || 'Unknown Mode'}</Badge>
//                                         <Badge variant="outline" className={getDifficultyColor(tech.difficulty)}>{tech.difficulty}</Badge>
//                                     </div>
//                                     <p className="text-sm text-gray-600 line-clamp-2">{tech.description}</p>
                                    
//                                     <div className="flex gap-4 mt-2 text-xs text-gray-400">
//                                         {tech.image_url && <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> มีรูปภาพ</span>}
//                                         {tech.video_url && <span className="flex items-center gap-1"><Video className="w-3 h-3" /> มีวิดีโอ</span>}
//                                     </div>
//                                 </div>
//                                 <div className="flex items-center gap-2 shrink-0">
//                                     <Button size="icon" variant="ghost" onClick={() => handleEditTechClick(tech)}>
//                                         <Edit2 className="w-4 h-4 text-gray-600" />
//                                     </Button>
//                                     <Button size="icon" variant="ghost" onClick={() => handleDeleteTechnique(tech.id)}>
//                                         <Trash2 className="w-4 h-4 text-red-500" />
//                                     </Button>
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </CardContent>
//         </Card>

//         {/* ฟอร์มเพิ่ม/แก้ไข Technique */}
//         <Card className={`border-t-4 shadow-md ${editingTechId ? 'border-t-purple-500' : 'border-t-green-500'}`}>
//             <CardHeader>
//                 <CardTitle className={`flex items-center gap-2 ${editingTechId ? 'text-purple-700' : 'text-green-700'}`}>
//                     {editingTechId ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
//                     {editingTechId ? 'แก้ไขเทคนิค' : 'เพิ่มเทคนิคใหม่'}
//                 </CardTitle>
//             </CardHeader>
//             <CardContent>
//                 <div className="grid gap-4 sm:grid-cols-2">
//                     {/* ชื่อเทคนิค */}
//                     <div className="space-y-2 sm:col-span-2">
//                         <Label>ชื่อหัวข้อเทคนิค <span className="text-red-500">*</span></Label>
//                         <Input 
//                             placeholder="เช่น เทคนิคการคูณไขว้, สูตรลัดหาพื้นที่" 
//                             value={techFormData.title}
//                             onChange={(e) => setTechFormData({...techFormData, title: e.target.value})}
//                         />
//                     </div>

//                     {/* เชื่อมโยงหมวดหมู่ (ดึงจาก Practice Mode) */}
//                     <div className="space-y-2">
//                         <Label>หมวดการฝึก (Category) <span className="text-red-500">*</span></Label>
//                         <Select 
//                             value={techFormData.practice_mode_id || undefined} 
//                             onValueChange={(val) => setTechFormData({...techFormData, practice_mode_id: val})}
//                         >
//                             <SelectTrigger>
//                                 <SelectValue placeholder="เลือกหมวดที่เกี่ยวข้อง" />
//                             </SelectTrigger>
//                             <SelectContent>
//                                 {modes.map(m => (
//                                     <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
//                                 ))}
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     {/* ระดับความยาก */}
//                     <div className="space-y-2">
//                         <Label>ระดับความยาก</Label>
//                         <Select 
//                             value={techFormData.difficulty || undefined} 
//                             onValueChange={(val) => setTechFormData({...techFormData, difficulty: val as DifficultyLevel})}
//                         >
//                             <SelectTrigger><SelectValue /></SelectTrigger>
//                             <SelectContent>
//                                 <SelectItem value="easy">ง่าย (Easy)</SelectItem>
//                                 <SelectItem value="medium">ปานกลาง (Medium)</SelectItem>
//                                 <SelectItem value="hard">ยาก (Hard)</SelectItem>
//                             </SelectContent>
//                         </Select>
//                     </div>

//                     {/* URL รูปภาพ */}
//                     <div className="space-y-2">
//                         <Label className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> URL รูปภาพประกอบ (ถ้ามี)</Label>
//                         <Input 
//                             placeholder="https://example.com/image.png" 
//                             value={techFormData.image_url}
//                             onChange={(e) => setTechFormData({...techFormData, image_url: e.target.value})}
//                         />
//                     </div>

//                     {/* URL วิดีโอ */}
//                     <div className="space-y-2">
//                         <Label className="flex items-center gap-2"><Youtube className="w-4 h-4" /> URL วิดีโอ/Youtube (ถ้ามี)</Label>
//                         <Input 
//                             placeholder="https://youtube.com/..." 
//                             value={techFormData.video_url}
//                             onChange={(e) => setTechFormData({...techFormData, video_url: e.target.value})}
//                         />
//                     </div>

//                     {/* คำอธิบาย */}
//                     <div className="space-y-2 sm:col-span-2">
//                         <Label>รายละเอียด/วิธีการ</Label>
//                         <Textarea 
//                             className="min-h-[100px]"
//                             placeholder="อธิบายขั้นตอนหรือสูตรอย่างละเอียด..."
//                             value={techFormData.description}
//                             onChange={(e) => setTechFormData({...techFormData, description: e.target.value})}
//                         />
//                     </div>

//                     {/* ปุ่ม Action */}
//                     <div className="sm:col-span-2 pt-4 flex gap-2">
//                         <Button 
//                             onClick={handleSaveTechnique} 
//                             disabled={isSavingTech}
//                             className={editingTechId ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'}
//                         >
//                             {isSavingTech ? (
//                                 <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังบันทึก...</>
//                             ) : (
//                                 <><Save className="w-4 h-4 mr-2" /> {editingTechId ? 'บันทึกการแก้ไข' : 'บันทึกเทคนิค'}</>
//                             )}
//                         </Button>
                        
//                         {editingTechId && (
//                             <Button variant="outline" onClick={handleCancelTechEdit}>
//                                 <X className="w-4 h-4 mr-2" /> ยกเลิก
//                             </Button>
//                         )}
//                     </div>
//                 </div>
//             </CardContent>
//         </Card>
//       </div>

//     </div>
//   );
// };

// export default ContentManager;







import { useState, useEffect } from 'react';
import { supabase } from '@/supabaseClient';
import { 
  BookOpen, 
  Plus, 
  Edit2, 
  Loader2, 
  Trash2, 
  X, 
  Save, 
  Lightbulb, 
  Image as ImageIcon, 
  Video, 
  Youtube,
  MinusCircle // เพิ่ม icon สำหรับลบ level
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

// Import Dialogs
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import AddMathProblem from './AddMathProblem'; 
import ProblemListDialog from './ProblemListDialog';

// --- Interfaces ---
type DifficultyLevel = 'easy' | 'medium' | 'hard';

// Interface สำหรับระดับความยาก (ลูก)
interface PracticeLevel {
  id?: string;
  difficulty: string;
  description: string;
}

// Interface สำหรับโหมด (แม่)
interface PracticeMode {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  practice_levels?: PracticeLevel[]; // เพิ่ม field นี้เพื่อรับข้อมูล levels
}

interface Technique {
  id: string;
  title: string;
  description: string;
  image_url: string;
  video_url: string;
  difficulty: DifficultyLevel;
  practice_mode_id: string;
  practice_modes?: {
    name: string;
  } | null;
}

const ContentManager = () => {
  // --- States สำหรับ Practice Modes ---
  const [modes, setModes] = useState<PracticeMode[]>([]);
  const [loading, setLoading] = useState(true);
  
  // formData ของโหมด (เอา difficulty ออกแล้ว เพราะไปอยู่ใน table ลูก)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  // State สำหรับจัดการ Level ภายในฟอร์ม
  const [modeLevels, setModeLevels] = useState<PracticeLevel[]>([]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // --- States สำหรับ Techniques ---
  const [techniques, setTechniques] = useState<Technique[]>([]);
  const [techLoading, setTechLoading] = useState(true);
  const [techFormData, setTechFormData] = useState({
    title: '',
    description: '',
    image_url: '',
    video_url: '',
    difficulty: 'easy' as DifficultyLevel,
    practice_mode_id: ''
  });
  const [editingTechId, setEditingTechId] = useState<string | null>(null);
  const [isSavingTech, setIsSavingTech] = useState(false);

  // --- 1. Fetch Data ---
  const fetchModes = async () => {
    setLoading(true);
    try {
      // ดึงข้อมูลโหมด พร้อมกับ join ตาราง levels มาด้วย
      const { data, error } = await supabase
        .from('practice_modes')
        .select(`
            *,
            practice_levels (
                id,
                difficulty,
                description
            )
        `)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setModes(data || []);
    } catch (error: any) {
      console.error('Error fetching modes:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTechniques = async () => {
    setTechLoading(true);
    try {
      const { data, error } = await supabase
        .from('techniques')
        .select('*, practice_modes (name)') 
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTechniques((data as any) || []);
    } catch (error: any) {
      console.error('Error fetching techniques:', error.message);
    } finally {
      setTechLoading(false);
    }
  };

  useEffect(() => {
    fetchModes();
    fetchTechniques();
  }, []);

  // --- Logic สำหรับ Practice Mode ---
  
  const handleEditClick = (mode: PracticeMode) => {
    setEditingId(mode.id);
    setFormData({
      name: mode.name,
      description: mode.description || '',
    });
    // ดึง Level เดิมมาใส่ใน State (ถ้าไม่มีให้เป็น array ว่าง)
    setModeLevels(mode.practice_levels || []);
    
    // เลื่อนไปที่ฟอร์ม
    const element = document.getElementById('mode-form-section');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', description: '' });
    setModeLevels([]); // เคลียร์ levels
  };

  // -- Logic จัดการ Level ใน Form --
  const handleAddLevelToForm = () => {
    setModeLevels([...modeLevels, { difficulty: 'easy', description: '' }]);
  };

  const handleRemoveLevelFromForm = (index: number) => {
    const newLevels = [...modeLevels];
    newLevels.splice(index, 1);
    setModeLevels(newLevels);
  };

  const handleChangeLevel = (index: number, field: keyof PracticeLevel, value: string) => {
    const newLevels = [...modeLevels];
    // @ts-ignore
    newLevels[index][field] = value;
    setModeLevels(newLevels);
  };

  // -- SAVE Logic (สำคัญ: บันทึก 2 ตาราง) --
  const handleSaveMode = async () => {
    if (!formData.name) { alert('กรุณากรอกชื่อโหมด'); return; }
    
    // บังคับให้มีอย่างน้อย 1 Level (ถ้าไม่ต้องการบังคับ ลบ 2 บรรทัดนี้ได้)
    if (modeLevels.length === 0) { alert('กรุณาเพิ่มระดับความยากอย่างน้อย 1 ระดับ'); return; }

    setIsSaving(true);
    try {
      let modeId = editingId;

      // 1. บันทึก/แก้ไข ตารางแม่ (practice_modes)
      if (editingId) {
        const { error } = await supabase.from('practice_modes').update(formData).eq('id', editingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
            .from('practice_modes')
            .insert([{ ...formData, enabled: true }])
            .select()
            .single();
        if (error) throw error;
        modeId = data.id;
      }

      if (!modeId) throw new Error("ไม่พบ Mode ID");

      // 2. จัดการตารางลูก (practice_levels)
      // ใช้วิธีลบของเก่าทิ้งทั้งหมด แล้ว insert ใหม่ (Sync) เพื่อความง่ายและชัวร์
      
      // 2.1 ลบ Level เก่าของโหมดนี้
      const { error: deleteError } = await supabase
        .from('practice_levels')
        .delete()
        .eq('mode_id', modeId);
      
      if (deleteError) throw deleteError;

      // 2.2 เตรียมข้อมูล Level ใหม่เพื่อ Insert
      const levelsPayload = modeLevels.map(lvl => ({
        mode_id: modeId, 
        difficulty: lvl.difficulty,
        description: lvl.description
      }));

      // 2.3 Insert ลงตาราง
      if (levelsPayload.length > 0) {
        const { error: insertError } = await supabase.from('practice_levels').insert(levelsPayload);
        if (insertError) throw insertError;
      }

      handleCancelEdit();
      fetchModes(); // ดึงข้อมูลใหม่
      alert('บันทึกข้อมูลเรียบร้อย');
    } catch (error: any) {
      alert('Error: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMode = async (id: string) => {
    if (!confirm('ยืนยันการลบโหมด? ข้อมูลระดับความยากและเทคนิคที่เกี่ยวข้องอาจหายไปด้วย')) return;
    try {
      const { error } = await supabase.from('practice_modes').delete().eq('id', id);
      if (error) throw error;
      setModes(modes.filter(m => m.id !== id));
      if (editingId === id) handleCancelEdit();
    } catch (error: any) {
      alert('Error: ' + error.message);
    }
  };

  // --- Logic สำหรับ Techniques ---
  const handleEditTechClick = (tech: Technique) => {
    setEditingTechId(tech.id);
    setTechFormData({
      title: tech.title,
      description: tech.description || '',
      image_url: tech.image_url || '',
      video_url: tech.video_url || '',
      difficulty: tech.difficulty,
      practice_mode_id: tech.practice_mode_id
    });
    const element = document.getElementById('tech-form-section');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const handleCancelTechEdit = () => {
    setEditingTechId(null);
    setTechFormData({
      title: '',
      description: '',
      image_url: '',
      video_url: '',
      difficulty: 'easy',
      practice_mode_id: ''
    });
  };

  const handleSaveTechnique = async () => {
    if (!techFormData.title || !techFormData.practice_mode_id) {
      alert('กรุณากรอกชื่อเทคนิค และเลือกหมวดการฝึก');
      return;
    }

    setIsSavingTech(true);
    try {
      const payload = {
        title: techFormData.title,
        description: techFormData.description,
        image_url: techFormData.image_url,
        video_url: techFormData.video_url,
        difficulty: techFormData.difficulty,
        practice_mode_id: techFormData.practice_mode_id
      };

      if (editingTechId) {
        const { error } = await supabase
          .from('techniques')
          .update(payload)
          .eq('id', editingTechId);
        if (error) throw error;
        alert('แก้ไขเทคนิคเรียบร้อย');
      } else {
        const { error } = await supabase
          .from('techniques')
          .insert([payload]);
        if (error) throw error;
        alert('เพิ่มเทคนิคเรียบร้อย');
      }

      handleCancelTechEdit();
      fetchTechniques();
    } catch (error: any) {
      alert('เกิดข้อผิดพลาด: ' + error.message);
    } finally {
      setIsSavingTech(false);
    }
  };

  const handleDeleteTechnique = async (id: string) => {
    if (!confirm('คุณแน่ใจหรือไม่ที่จะลบเทคนิคนี้?')) return;
    try {
      const { error } = await supabase.from('techniques').delete().eq('id', id);
      if (error) throw error;
      setTechniques(techniques.filter(t => t.id !== id));
      if (editingTechId === id) handleCancelTechEdit();
    } catch (error: any) {
      alert('ลบไม่สำเร็จ: ' + error.message);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading && modes.length === 0) {
    return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 pb-10">
      
      {/* ================= SECTION 1: PRACTICE MODES ================= */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            จัดการโหมดการฝึก ({modes.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modes.map((mode) => (
               <div key={mode.id} className={`flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg ${editingId === mode.id ? 'border-blue-500 bg-blue-50' : 'bg-white'}`}>
                  <div className="flex items-center gap-4 mb-4 md:mb-0">
                        <div>
                            <div className="flex items-center gap-2">
                                <h3 className="font-medium text-lg">{mode.name}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1">{mode.description || '-'}</p>
                            {/* แสดง Levels เล็กๆ */}
                            <div className="flex flex-wrap gap-1 mt-2">
                                {mode.practice_levels && mode.practice_levels.length > 0 ? (
                                    mode.practice_levels.map((lvl, idx) => (
                                        <span key={idx} className="text-xs bg-gray-100 px-2 py-0.5 rounded border">
                                            {lvl.difficulty}
                                        </span>
                                    ))
                                ) : (
                                    <span className="text-xs text-red-400">ยังไม่มีระดับความยาก</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        <Button size="sm" variant="ghost" className="text-orange-600 hover:bg-orange-50" onClick={() => handleEditClick(mode)}>
                            <Edit2 className="w-4 h-4 mr-1" /> แก้ไข
                        </Button>
                        <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={() => handleDeleteMode(mode.id)}>
                            <Trash2 className="w-4 h-4 mr-1" /> ลบ
                        </Button>
                        <div className="w-px h-8 bg-gray-200 mx-1 hidden md:block"></div>
                        <Dialog>
                            <DialogTrigger asChild>
                            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                                <Plus className="w-4 h-4 mr-1" /> เพิ่มโจทย์
                            </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader><DialogTitle>เพิ่มโจทย์: {mode.name}</DialogTitle></DialogHeader>
                            <AddMathProblem defaultCategory={mode.name} onSuccess={() => console.log('Done')} />
                            </DialogContent>
                        </Dialog>
                        <Dialog>
                            <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="text-gray-600">
                                <BookOpen className="w-4 h-4 mr-1" /> โจทย์
                            </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col">
                            <DialogHeader><DialogTitle>จัดการโจทย์: {mode.name}</DialogTitle></DialogHeader>
                            <ProblemListDialog category={mode.name} />
                            </DialogContent>
                        </Dialog>               
                    </div>
               </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ฟอร์ม Practice Mode */}
      <div id="mode-form-section">
        <Card className={`border-t-4 shadow-md ${editingId ? 'border-t-orange-500' : 'border-t-blue-500'}`}>
            <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${editingId ? 'text-orange-700' : 'text-blue-700'}`}>
                {editingId ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                {editingId ? 'แก้ไขข้อมูลโหมด' : 'เพิ่มโหมดฝึกใหม่'}
            </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-6">
                    {/* ส่วนข้อมูลโหมด */}
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2 sm:col-span-2">
                            <Label>ชื่อโหมด <span className="text-red-500">*</span></Label>
                            <Input value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} placeholder="เช่น การบวก, การหาร" />
                        </div>
                        <div className="space-y-2 sm:col-span-2">
                            <Label>คำอธิบาย</Label>
                            <Textarea value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} placeholder="รายละเอียดเบื้องต้น" />
                        </div>
                    </div>

                    <div className="border-t pt-2"></div>

                    {/* ส่วนจัดการระดับความยาก */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-semibold">ระดับความยากในโหมดนี้</Label>
                            <Button type="button" size="sm" variant="outline" onClick={handleAddLevelToForm}>
                                <Plus className="w-4 h-4 mr-1" /> เพิ่มระดับ
                            </Button>
                        </div>

                        {modeLevels.length === 0 && (
                            <div className="text-center p-4 bg-gray-50 border border-dashed rounded text-sm text-gray-500">
                                ยังไม่มีระดับความยาก กดปุ่ม "เพิ่มระดับ" ด้านบนเพื่อตั้งค่า
                            </div>
                        )}

                        <div className="space-y-3">
                            {modeLevels.map((lvl, index) => (
                                <div key={index} className="flex flex-col sm:flex-row gap-3 items-start sm:items-center bg-gray-50 p-3 rounded border">
                                    <div className="w-full sm:w-[150px]">
                                        <Select 
                                            value={lvl.difficulty} 
                                            onValueChange={(val) => handleChangeLevel(index, 'difficulty', val)}
                                        >
                                            <SelectTrigger className="bg-white">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="easy">Easy (ง่าย)</SelectItem>
                                                <SelectItem value="medium">Medium (กลาง)</SelectItem>
                                                <SelectItem value="hard">Hard (ยาก)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="flex-1 w-full">
                                        <Input 
                                            className="bg-white"
                                            placeholder="คำอธิบายเพิ่มเติม (เช่น เลข 1-10)" 
                                            value={lvl.description || ''}
                                            onChange={(e) => handleChangeLevel(index, 'description', e.target.value)}
                                        />
                                    </div>
                                    <Button 
                                        type="button" 
                                        size="icon" 
                                        variant="ghost" 
                                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                        onClick={() => handleRemoveLevelFromForm(index)}
                                    >
                                        <MinusCircle className="w-5 h-5" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                        <Button onClick={handleSaveMode} disabled={isSaving} className={editingId ? 'bg-orange-600' : 'bg-blue-600'}>
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : (editingId ? 'บันทึกการแก้ไขทั้งหมด' : 'บันทึกโหมดใหม่')}
                        </Button>
                        {editingId && <Button variant="outline" onClick={handleCancelEdit}>ยกเลิก</Button>}
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

      <div className="my-8 border-b border-gray-300"></div>

      {/* ================= SECTION 2: TECHNIQUES ================= */}
      <div id="tech-form-section">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-500" /> 
            จัดการเทคนิคการทำโจทย์
        </h2>
        
        {/* รายการ Techniques */}
        <Card className="mb-6">
            <CardContent className="pt-6">
                {techLoading ? (
                    <div className="text-center py-4">กำลังโหลดข้อมูล...</div>
                ) : techniques.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">ยังไม่มีข้อมูลเทคนิค</div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {techniques.map((tech) => (
                            <div key={tech.id} className={`border rounded-lg p-4 flex flex-col md:flex-row gap-4 justify-between ${editingTechId === tech.id ? 'bg-purple-50 border-purple-500' : 'bg-white'}`}>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h3 className="font-bold text-lg">{tech.title}</h3>
                                        <Badge variant="secondary">{tech.practice_modes?.name || 'Unknown Mode'}</Badge>
                                        <Badge variant="outline" className={getDifficultyColor(tech.difficulty)}>{tech.difficulty}</Badge>
                                    </div>
                                    <p className="text-sm text-gray-600 line-clamp-2">{tech.description}</p>
                                    
                                    <div className="flex gap-4 mt-2 text-xs text-gray-400">
                                        {tech.image_url && <span className="flex items-center gap-1"><ImageIcon className="w-3 h-3" /> มีรูปภาพ</span>}
                                        {tech.video_url && <span className="flex items-center gap-1"><Video className="w-3 h-3" /> มีวิดีโอ</span>}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    <Button size="icon" variant="ghost" onClick={() => handleEditTechClick(tech)}>
                                        <Edit2 className="w-4 h-4 text-gray-600" />
                                    </Button>
                                    <Button size="icon" variant="ghost" onClick={() => handleDeleteTechnique(tech.id)}>
                                        <Trash2 className="w-4 h-4 text-red-500" />
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>

        {/* ฟอร์มเพิ่ม/แก้ไข Technique */}
        <Card className={`border-t-4 shadow-md ${editingTechId ? 'border-t-purple-500' : 'border-t-green-500'}`}>
            <CardHeader>
                <CardTitle className={`flex items-center gap-2 ${editingTechId ? 'text-purple-700' : 'text-green-700'}`}>
                    {editingTechId ? <Edit2 className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                    {editingTechId ? 'แก้ไขเทคนิค' : 'เพิ่มเทคนิคใหม่'}
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                    {/* ชื่อเทคนิค */}
                    <div className="space-y-2 sm:col-span-2">
                        <Label>ชื่อหัวข้อเทคนิค <span className="text-red-500">*</span></Label>
                        <Input 
                            placeholder="เช่น เทคนิคการคูณไขว้, สูตรลัดหาพื้นที่" 
                            value={techFormData.title}
                            onChange={(e) => setTechFormData({...techFormData, title: e.target.value})}
                        />
                    </div>

                    {/* เชื่อมโยงหมวดหมู่ */}
                    <div className="space-y-2">
                        <Label>หมวดการฝึก (Category) <span className="text-red-500">*</span></Label>
                        <Select 
                            value={techFormData.practice_mode_id || undefined} 
                            onValueChange={(val) => setTechFormData({...techFormData, practice_mode_id: val})}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="เลือกหมวดที่เกี่ยวข้อง" />
                            </SelectTrigger>
                            <SelectContent>
                                {modes.map(m => (
                                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* ระดับความยาก */}
                    <div className="space-y-2">
                        <Label>ระดับความยาก</Label>
                        <Select 
                            value={techFormData.difficulty || undefined} 
                            onValueChange={(val) => setTechFormData({...techFormData, difficulty: val as DifficultyLevel})}
                        >
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                                <SelectItem value="easy">ง่าย (Easy)</SelectItem>
                                <SelectItem value="medium">ปานกลาง (Medium)</SelectItem>
                                <SelectItem value="hard">ยาก (Hard)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {/* URL รูปภาพ */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2"><ImageIcon className="w-4 h-4" /> URL รูปภาพประกอบ (ถ้ามี)</Label>
                        <Input 
                            placeholder="https://example.com/image.png" 
                            value={techFormData.image_url}
                            onChange={(e) => setTechFormData({...techFormData, image_url: e.target.value})}
                        />
                    </div>

                    {/* URL วิดีโอ */}
                    <div className="space-y-2">
                        <Label className="flex items-center gap-2"><Youtube className="w-4 h-4" /> URL วิดีโอ/Youtube (ถ้ามี)</Label>
                        <Input 
                            placeholder="https://youtube.com/..." 
                            value={techFormData.video_url}
                            onChange={(e) => setTechFormData({...techFormData, video_url: e.target.value})}
                        />
                    </div>

                    {/* คำอธิบาย */}
                    <div className="space-y-2 sm:col-span-2">
                        <Label>รายละเอียด/วิธีการ</Label>
                        <Textarea 
                            className="min-h-[100px]"
                            placeholder="อธิบายขั้นตอนหรือสูตรอย่างละเอียด..."
                            value={techFormData.description}
                            onChange={(e) => setTechFormData({...techFormData, description: e.target.value})}
                        />
                    </div>

                    {/* ปุ่ม Action */}
                    <div className="sm:col-span-2 pt-4 flex gap-2">
                        <Button 
                            onClick={handleSaveTechnique} 
                            disabled={isSavingTech}
                            className={editingTechId ? 'bg-purple-600 hover:bg-purple-700' : 'bg-green-600 hover:bg-green-700'}
                        >
                            {isSavingTech ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> กำลังบันทึก...</>
                            ) : (
                                <><Save className="w-4 h-4 mr-2" /> {editingTechId ? 'บันทึกการแก้ไข' : 'บันทึกเทคนิค'}</>
                            )}
                        </Button>
                        
                        {editingTechId && (
                            <Button variant="outline" onClick={handleCancelTechEdit}>
                                <X className="w-4 h-4 mr-2" /> ยกเลิก
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>

    </div>
  );
};

export default ContentManager;

