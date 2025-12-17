// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import SEO from "@/components/SEO";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// import { Mode, Level } from "@/lib/math";

// const ModeSelection = () => {
//   const [selectedMode, setSelectedMode] = useState<Mode>("mix");
//   const [selectedLevel, setSelectedLevel] = useState<Level>("easy");
//   const [showTips, setShowTips] = useState(true);
//   const navigate = useNavigate();

//   const modes = [
//     { id: "add" as Mode, title: "บวก", description: "ฝึกบวกเลขเร็วด้วยเทคนิคจับคู่ครบสิบ" },
//     { id: "sub" as Mode, title: "ลบ", description: "ฝึกลบเลขอย่างเป็นระบบ ลดการยืมซ้ำซ้อน" },
//     { id: "mul" as Mode, title: "คูณ", description: "ฝึกคูณไวด้วยการแยกตัวประกอบและสูตรลัด" },
//     { id: "div" as Mode, title: "หาร", description: "ฝึกหารให้คล่องด้วยวิธีหารลงตัวใกล้เคียง" },
//     { id: "mix" as Mode, title: "ผสม", description: "ฝึกแบบรวมทุกทักษะ เพิ่มความท้าทาย" },
//   ];

//   const levels = [
//     { id: "easy" as Level, title: "ง่าย", description: "เลข 1-20" },
//     { id: "medium" as Level, title: "ปานกลาง", description: "เลข 10-99" },
//     { id: "hard" as Level, title: "ยาก", description: "เลข 100-999" },
//   ];

//   const startPractice = () => {
//     const params = new URLSearchParams({
//       mode: selectedMode,
//       level: selectedLevel,
//       showTips: showTips.toString(),
//     });
//     navigate(`/practice?${params.toString()}`);
//   };

//   return (
//     <main className="container mx-auto px-4 py-10 min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
//       <SEO
//         title="เลือกโหมดฝึก — Practicing Fast Math Skills"
//         description="เลือกโหมดและระดับการฝึกคิดเลขเร็วที่เหมาะกับคุณ"
//         canonical="/mode-selection"
//       />
      
//       {/* Animated background elements */}
//       <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
//         <div className="absolute top-20 left-10 text-6xl font-mono text-brand rotate-12 animate-bounce-gentle">⚙️</div>
//         <div className="absolute top-32 right-20 text-4xl font-mono text-brand-2 -rotate-12 animate-pulse-math">🎯</div>
//         <div className="absolute bottom-40 left-20 text-5xl font-mono text-brand-accent rotate-45 animate-bounce-gentle">⭐</div>
//       </div>
      
//       <div className="mx-auto max-w-4xl space-y-8 relative z-10">
//         <div className="text-center animate-fade-in">
//           <div className="inline-block p-4 rounded-full bg-gradient-primary/20 backdrop-blur-sm border border-brand/20 mb-6 animate-bounce-gentle">
//             <div className="text-4xl">⚙️✨</div>
//           </div>
//           <h1 className="text-4xl font-bold math-gradient bg-clip-text text-transparent">เลือกโหมดการฝึก</h1>
//           <p className="mt-4 text-lg text-muted-foreground">กำหนดการตั้งค่าการฝึกที่เหมาะกับคุณ</p>
//         </div>

//         {/* Mode Selection */}
//         <Card className="math-card shadow-math-elevated hover:shadow-math-glow transition-all duration-500 animate-slide-up">
//           <CardHeader className="bg-gradient-subtle rounded-t-lg">
//             <CardTitle className="text-xl font-bold math-gradient bg-clip-text text-transparent flex items-center gap-2">
//               <span className="text-2xl animate-pulse-math">🎯</span>
//               โหมดการฝึก
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
//             {modes.map((mode) => (
//               <Button
//                 key={mode.id}
//                 variant={selectedMode === mode.id ? "hero" : "outline"}
//                 className={`h-auto flex-col p-6 transition-all duration-300 hover:scale-105 group ${
//                   selectedMode === mode.id ? 'shadow-math-glow animate-pulse-math' : 'hover:shadow-lg'
//                 }`}
//                 onClick={() => setSelectedMode(mode.id)}
//               >
//                 <div className="font-bold text-lg mb-2 group-hover:animate-bounce-gentle">{mode.title}</div>
//                 <div className="text-xs opacity-70 text-center leading-relaxed">{mode.description}</div>
//                 {selectedMode === mode.id && (
//                   <div className="mt-2 text-xl animate-bounce-gentle">✨</div>
//                 )}
//               </Button>
//             ))}
//           </CardContent>
//         </Card>

//         {/* Level Selection */}
//         <Card className="math-card shadow-math-elevated hover:shadow-math-glow transition-all duration-500 animate-slide-up">
//           <CardHeader className="bg-gradient-subtle rounded-t-lg">
//             <CardTitle className="text-xl font-bold math-gradient bg-clip-text text-transparent flex items-center gap-2">
//               <span className="text-2xl animate-pulse-math">📊</span>
//               ระดับความยาก
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
//             {levels.map((level) => (
//               <Button
//                 key={level.id}
//                 variant={selectedLevel === level.id ? "premium" : "outline"}
//                 className={`h-auto flex-col p-6 transition-all duration-300 hover:scale-105 group ${
//                   selectedLevel === level.id ? 'shadow-math-glow animate-pulse-math' : 'hover:shadow-lg'
//                 }`}
//                 onClick={() => setSelectedLevel(level.id)}
//               >
//                 <div className="font-bold text-lg mb-2 group-hover:animate-bounce-gentle">
//                   {level.id === 'easy' && '🟢'} 
//                   {level.id === 'medium' && '🟡'} 
//                   {level.id === 'hard' && '🔴'} 
//                   {level.title}
//                 </div>
//                 <div className="text-xs opacity-70 text-center">{level.description}</div>
//                 {selectedLevel === level.id && (
//                   <div className="mt-2 text-xl animate-bounce-gentle">✨</div>
//                 )}
//               </Button>
//             ))}
//           </CardContent>
//         </Card>

//         {/* Tips Option */}
//         <Card className="math-card shadow-math-elevated hover:shadow-math-glow transition-all duration-500 animate-slide-up">
//           <CardHeader className="bg-gradient-subtle rounded-t-lg">
//             <CardTitle className="text-xl font-bold math-gradient bg-clip-text text-transparent flex items-center gap-2">
//               <span className="text-2xl animate-pulse-math">💡</span>
//               การแสดงเทคนิค
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="p-6">
//             <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-card via-card to-accent/10 border border-brand/10 hover:border-brand/20 transition-colors">
//               <div className="space-y-2">
//                 <Label htmlFor="tips-toggle" className="text-base font-bold cursor-pointer hover:text-brand transition-colors">
//                   💡 แสดงเทคนิคก่อนทำโจทย์
//                 </Label>
//                 <p className="text-sm text-muted-foreground leading-relaxed">
//                   เลือกว่าต้องการดูเทคนิคการคิดเลขเร็วก่อนตอบแต่ละข้อหรือไม่
//                 </p>
//               </div>
//               <Switch
//                 id="tips-toggle"
//                 checked={showTips}
//                 onCheckedChange={setShowTips}
//                 className="scale-125"
//               />
//             </div>
//           </CardContent>
//         </Card>

//         {/* Start Button */}
//         <div className="text-center animate-bounce-gentle">
//           <div className="relative group">
//             <div className="absolute -inset-4 math-gradient rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-lg animate-pulse-math"></div>
//             <Button
//               variant="hero"
//               size="xl"
//               onClick={startPractice}
//               className="relative px-16 py-4 text-xl font-bold shadow-math-elevated hover:shadow-math-glow transition-all duration-500 hover:scale-110 group"
//             >
//               <span className="mr-3 text-2xl group-hover:animate-bounce-gentle">🚀</span>
//               เริ่มฝึกเลย!
//               <span className="ml-3 text-2xl group-hover:animate-bounce-gentle">✨</span>
//             </Button>
//           </div>
          
//           {/* Summary of selection */}
//           <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-card via-card to-accent/10 border border-brand/10 max-w-md mx-auto">
//             <p className="text-sm text-muted-foreground mb-2">การตั้งค่าของคุณ:</p>
//             <div className="flex flex-wrap gap-2 justify-center">
//               <span className="px-3 py-1 rounded-full bg-brand/20 text-brand text-xs font-medium">
//                 {modes.find(m => m.id === selectedMode)?.title}
//               </span>
//               <span className="px-3 py-1 rounded-full bg-brand-2/20 text-brand-2 text-xs font-medium">
//                 {levels.find(l => l.id === selectedLevel)?.title}
//               </span>
//               {showTips && (
//                 <span className="px-3 py-1 rounded-full bg-brand-accent/20 text-brand-accent text-xs font-medium">
//                   💡 เทคนิค
//                 </span>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   );
// };

// export default ModeSelection;





// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "@/supabaseClient"; 
// import SEO from "@/components/SEO";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Switch } from "@/components/ui/switch";
// import { Label } from "@/components/ui/label";
// // เพิ่ม ArrowLeft เข้ามาใน import
// import { Loader2, Lightbulb, ArrowLeft } from "lucide-react"; 
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription
// } from "@/components/ui/dialog"; 

// // Interface สำหรับข้อมูลจาก Supabase
// interface PracticeLevel {
//   id: string; 
//   difficulty: string; // 'easy', 'medium', 'hard'
//   description: string;
// }

// interface PracticeMode {
//   id: string; 
//   name: string; 
//   description: string;
//   practice_levels: PracticeLevel[]; 
// }

// interface Technique {
//   id: string;
//   title: string;
//   description: string;
//   image_url?: string;
//   video_url?: string;
// }

// const ModeSelection = () => {
//   const navigate = useNavigate();
  
//   // --- States ---
//   const [modes, setModes] = useState<PracticeMode[]>([]);
//   const [loading, setLoading] = useState(true);
  
//   const [selectedModeId, setSelectedModeId] = useState<string>("");
//   const [selectedLevelDifficulty, setSelectedLevelDifficulty] = useState<string>("easy");
  
//   const [showTips, setShowTips] = useState(true);

//   // States สำหรับ Popup เทคนิค
//   const [isTipOpen, setIsTipOpen] = useState(false);
//   const [currentTechnique, setCurrentTechnique] = useState<Technique | null>(null);
//   const [loadingTip, setLoadingTip] = useState(false);

//   // --- 1. Fetch Data จาก Supabase ---
//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const { data, error } = await supabase
//           .from("practice_modes")
//           .select(`
//             id,
//             name,
//             description,
//             practice_levels (
//               id,
//               difficulty,
//               description
//             )
//           `)
//           .eq("enabled", true)
//           .order("created_at");

//         if (error) throw error;

//         if (data && data.length > 0) {
//           // --- จุดที่แก้ไข: กรองข้อมูลซ้ำ (Data Cleaning) ---
          
//           // 1. กรอง Mode ซ้ำ (เผื่อมี ID ซ้ำกันมา)
//           const uniqueModes = data.filter((mode, index, self) =>
//             index === self.findIndex((m) => m.id === mode.id)
//           );

//           // 2. กรอง Level ซ้ำภายในแต่ละ Mode
//           const cleanedModes = uniqueModes.map(mode => {
//             const uniqueLevels: PracticeLevel[] = [];
//             const foundDifficulties = new Set<string>();

//             if (mode.practice_levels) {
//                 mode.practice_levels.forEach(level => {
//                     if (!foundDifficulties.has(level.difficulty)) {
//                         foundDifficulties.add(level.difficulty);
//                         uniqueLevels.push(level);
//                     }
//                 });
//             }

//             // เรียงลำดับความยาก easy -> medium -> hard
//             const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
//             uniqueLevels.sort((a, b) => {
//                 return (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 99) - 
//                        (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 99);
//             });

//             return {
//                 ...mode,
//                 practice_levels: uniqueLevels
//             };
//           });

//           setModes(cleanedModes);
          
//           // เลือกตัวแรกเป็นค่าเริ่มต้น
//           if (cleanedModes.length > 0) {
//             setSelectedModeId(cleanedModes[0].id);
//           }
//         }
//       } catch (err) {
//         console.error("Error fetching modes:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // หา Mode ที่กำลังเลือกอยู่
//   const currentModeData = modes.find(m => m.id === selectedModeId);
//   // ดึง Levels ของ Mode นั้นๆ
//   const availableLevels = currentModeData?.practice_levels || [];

//   // --- 2. Logic การเริ่มเกม & หาเทคนิค ---
//   const handleStartClick = async () => {
//     if (showTips) {
//       setLoadingTip(true);
//       try {
//         const { data } = await supabase
//           .from("techniques")
//           .select("*")
//           .eq("practice_mode_id", selectedModeId)
//           .eq("difficulty", selectedLevelDifficulty)
//           .maybeSingle(); 

//         if (data) {
//           setCurrentTechnique(data);
//           setIsTipOpen(true); 
//         } else {
//           proceedToGame();
//         }
//       } catch (error) {
//         console.error("Error fetching technique:", error);
//         proceedToGame();
//       } finally {
//         setLoadingTip(false);
//       }
//     } else {
//       proceedToGame();
//     }
//   };

//   const proceedToGame = () => {
//     setIsTipOpen(false);
    
//     const params = new URLSearchParams({
//       modeId: selectedModeId,
//       modeName: currentModeData?.name || "",
//       difficulty: selectedLevelDifficulty,
//     });
//     navigate(`/practice?${params.toString()}`);
//   };

//   const getLevelColor = (diff: string) => {
//     switch (diff) {
//       case 'easy': return 'text-green-600 bg-green-50 border-green-200';
//       case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
//       case 'hard': return 'text-red-600 bg-red-50 border-red-200';
//       default: return 'text-gray-600';
//     }
//   };

//   if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-blue-500" /></div>;

//   return (
//     <main className="container mx-auto px-4 py-10 min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
//       <SEO
//         title="เลือกโหมดฝึก — Practicing Fast Math Skills"
//         description="เลือกโหมดและระดับการฝึกคิดเลขเร็วที่เหมาะกับคุณ"
//         canonical="/mode-selection"
//       />
      
//       <div className="mx-auto max-w-4xl space-y-8 relative z-10">
        
//         {/* --- ส่วนปุ่มย้อนกลับ (Back Button) --- */}
//         <div className="flex justify-start">
//             <Button 
//                 variant="ghost" 
//                 onClick={() => navigate(-1)} // สั่งให้กลับไปหน้าก่อนหน้า
//                 className="gap-2 text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
//             >
//                 <ArrowLeft className="w-6 h-6" /> 
//                 <span className="text-lg">ย้อนกลับ</span>
//             </Button>
//         </div>

//         <div className="text-center animate-fade-in -mt-4">
//           <h1 className="text-4xl font-bold math-gradient bg-clip-text text-transparent">เลือกโหมดการฝึก</h1>
//           <p className="mt-4 text-lg text-muted-foreground">ข้อมูลสดจากระบบฐานข้อมูล</p>
//         </div>

//         {/* --- ส่วนเลือก Mode --- */}
//         <Card className="math-card shadow-math-elevated">
//           <CardHeader className="bg-gradient-subtle rounded-t-lg">
//             <CardTitle className="text-xl font-bold flex items-center gap-2">
//               <span className="text-2xl">🎯</span> โหมดการฝึก
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
//             {modes.map((mode) => (
//               <Button
//                 key={mode.id}
//                 variant={selectedModeId === mode.id ? "default" : "outline"} 
//                 className={`h-auto flex-col p-6 transition-all duration-300 hover:scale-105 ${
//                   selectedModeId === mode.id ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50 text-blue-700' : ''
//                 }`}
//                 onClick={() => setSelectedModeId(mode.id)}
//               >
//                 <div className="font-bold text-lg mb-2">{mode.name}</div>
//                 <div className="text-xs opacity-70 text-center leading-relaxed line-clamp-2">{mode.description}</div>
//               </Button>
//             ))}
             
//              {/* ปุ่ม Hardcode Mixed Mode */}
//              <Button
//                 variant={selectedModeId === 'mixed' ? "default" : "outline"}
//                 className={`h-auto flex-col p-6 ${selectedModeId === 'mixed' ? 'border-purple-500 bg-purple-50 text-purple-700' : ''}`}
//                 onClick={() => setSelectedModeId('mixed')}
//               >
//                 <div className="font-bold text-lg mb-2">โหมดผสม (Mixed)</div>
//                 <div className="text-xs opacity-70 text-center">รวมมิตรทุกโหมด</div>
//               </Button>
//           </CardContent>
//         </Card>

//         {/* --- ส่วนเลือก Level --- */}
//         <Card className="math-card shadow-math-elevated">
//           <CardHeader className="bg-gradient-subtle rounded-t-lg">
//             <CardTitle className="text-xl font-bold flex items-center gap-2">
//               <span className="text-2xl">📊</span> ระดับความยาก
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
//             {selectedModeId === 'mixed' ? (
//                 ['easy', 'medium', 'hard'].map((lvl) => (
//                     <Button
//                         key={lvl}
//                         variant="outline"
//                         className={`h-auto flex-col p-6 ${selectedLevelDifficulty === lvl ? 'border-purple-500 bg-purple-50' : ''}`}
//                         onClick={() => setSelectedLevelDifficulty(lvl)}
//                     >
//                          <div className="font-bold uppercase">{lvl}</div>
//                     </Button>
//                 ))
//             ) : availableLevels.length > 0 ? (
//                 availableLevels.map((level) => (
//                 <Button
//                     key={level.id}
//                     variant="outline"
//                     className={`h-auto flex-col p-6 transition-all ${
//                     selectedLevelDifficulty === level.difficulty 
//                         ? `ring-2 ${getLevelColor(level.difficulty)}` 
//                         : 'hover:bg-gray-50'
//                     }`}
//                     onClick={() => setSelectedLevelDifficulty(level.difficulty)}
//                 >
//                     <div className="font-bold text-lg mb-2 capitalize">
//                      {level.difficulty}
//                     </div>
//                     <div className="text-xs opacity-70 text-center">{level.description}</div>
//                 </Button>
//                 ))
//             ) : (
//                 <div className="col-span-3 text-center text-gray-400 py-4">ไม่พบระดับความยากในโหมดนี้</div>
//             )}
//           </CardContent>
//         </Card>


//         {/* --- Start Button --- */}
//         <div className="text-center pb-10">
//             <Button
//               size="lg"
//               onClick={handleStartClick}
//               disabled={loadingTip}
//               className="px-16 py-8 text-xl font-bold shadow-lg hover:scale-105 transition-transform bg-blue-600 hover:bg-blue-700 text-white rounded-full"
//             >
//               {loadingTip ? <Loader2 className="animate-spin mr-2" /> : <span className="mr-2">🚀</span>}
//               เริ่มฝึกเลย!
//             </Button>
//         </div>
//       </div>

//       {/* --- POPUP Dialog --- */}
//       <Dialog open={isTipOpen} onOpenChange={setIsTipOpen}>
//         <DialogContent className="sm:max-w-lg">
//             <DialogHeader>
//                 <DialogTitle className="flex items-center gap-2 text-2xl text-yellow-600">
//                     <Lightbulb className="w-6 h-6 fill-yellow-400 text-yellow-600" />
//                     เทคนิคแนะนำ!
//                 </DialogTitle>
//                 <DialogDescription className="text-lg font-medium text-gray-800 pt-2">
//                     {currentTechnique?.title}
//                 </DialogDescription>
//             </DialogHeader>
            
//             <div className="space-y-4 py-4">
//                 <p className="text-gray-600 leading-relaxed whitespace-pre-line">
//                     {currentTechnique?.description || "ไม่มีรายละเอียด"}
//                 </p>
//                 {currentTechnique?.image_url && (
//                     <div className="rounded-lg overflow-hidden border">
//                         <img src={currentTechnique.image_url} alt="Technique" className="w-full h-auto object-cover" />
//                     </div>
//                 )}
//                 {currentTechnique?.video_url && (
//                     <a href={currentTechnique.video_url} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm block">
//                         ดูวิดีโอประกอบคลิกที่นี่
//                     </a>
//                 )}
//             </div>

//             <DialogFooter>
//                 <Button onClick={proceedToGame} className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
//                     เข้าใจแล้ว เริ่มเกมเลย! 👉
//                 </Button>
//             </DialogFooter>
//         </DialogContent>
//       </Dialog>

      

//     </main>
//   );
// };

// export default ModeSelection;




import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/supabaseClient"; 
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lightbulb, ArrowLeft } from "lucide-react"; 
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog"; 

// Interface สำหรับข้อมูลจาก Supabase
interface PracticeLevel {
  id: string; 
  difficulty: string; // 'easy', 'medium', 'hard'
  description: string;
}

interface PracticeMode {
  id: string; 
  name: string; 
  description: string;
  practice_levels: PracticeLevel[]; 
}

interface Technique {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  video_url?: string;
}

const ModeSelection = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear(); // ดึงปีปัจจุบัน
  
  // --- States ---
  const [modes, setModes] = useState<PracticeMode[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [selectedModeId, setSelectedModeId] = useState<string>("");
  const [selectedLevelDifficulty, setSelectedLevelDifficulty] = useState<string>("easy");
  
  const [showTips, setShowTips] = useState(true);

  // States สำหรับ Popup เทคนิค
  const [isTipOpen, setIsTipOpen] = useState(false);
  const [currentTechnique, setCurrentTechnique] = useState<Technique | null>(null);
  const [loadingTip, setLoadingTip] = useState(false);

  // --- 1. Fetch Data จาก Supabase ---
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("practice_modes")
          .select(`
            id,
            name,
            description,
            practice_levels (
              id,
              difficulty,
              description
            )
          `)
          .eq("enabled", true)
          .order("created_at");

        if (error) throw error;

        if (data && data.length > 0) {
          // --- จุดที่แก้ไข: กรองข้อมูลซ้ำ (Data Cleaning) ---
          
          // 1. กรอง Mode ซ้ำ (เผื่อมี ID ซ้ำกันมา)
          const uniqueModes = data.filter((mode, index, self) =>
            index === self.findIndex((m) => m.id === mode.id)
          );

          // 2. กรอง Level ซ้ำภายในแต่ละ Mode
          const cleanedModes = uniqueModes.map(mode => {
            const uniqueLevels: PracticeLevel[] = [];
            const foundDifficulties = new Set<string>();

            if (mode.practice_levels) {
                mode.practice_levels.forEach(level => {
                    if (!foundDifficulties.has(level.difficulty)) {
                        foundDifficulties.add(level.difficulty);
                        uniqueLevels.push(level);
                    }
                });
            }

            // เรียงลำดับความยาก easy -> medium -> hard
            const difficultyOrder = { 'easy': 1, 'medium': 2, 'hard': 3 };
            uniqueLevels.sort((a, b) => {
                return (difficultyOrder[a.difficulty as keyof typeof difficultyOrder] || 99) - 
                       (difficultyOrder[b.difficulty as keyof typeof difficultyOrder] || 99);
            });

            return {
                ...mode,
                practice_levels: uniqueLevels
            };
          });

          setModes(cleanedModes);
          
          // เลือกตัวแรกเป็นค่าเริ่มต้น
          if (cleanedModes.length > 0) {
            setSelectedModeId(cleanedModes[0].id);
          }
        }
      } catch (err) {
        console.error("Error fetching modes:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // หา Mode ที่กำลังเลือกอยู่
  const currentModeData = modes.find(m => m.id === selectedModeId);
  // ดึง Levels ของ Mode นั้นๆ
  const availableLevels = currentModeData?.practice_levels || [];

  // --- 2. Logic การเริ่มเกม & หาเทคนิค ---
  const handleStartClick = async () => {
    if (showTips) {
      setLoadingTip(true);
      try {
        const { data } = await supabase
          .from("techniques")
          .select("*")
          .eq("practice_mode_id", selectedModeId)
          .eq("difficulty", selectedLevelDifficulty)
          .maybeSingle(); 

        if (data) {
          setCurrentTechnique(data);
          setIsTipOpen(true); 
        } else {
          proceedToGame();
        }
      } catch (error) {
        console.error("Error fetching technique:", error);
        proceedToGame();
      } finally {
        setLoadingTip(false);
      }
    } else {
      proceedToGame();
    }
  };

  const proceedToGame = () => {
    setIsTipOpen(false);
    
    const params = new URLSearchParams({
      modeId: selectedModeId,
      modeName: currentModeData?.name || "",
      difficulty: selectedLevelDifficulty,
    });
    navigate(`/practice?${params.toString()}`);
  };

  const getLevelColor = (diff: string) => {
    switch (diff) {
      case 'easy': return 'text-green-600 bg-green-50 border-green-200';
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'hard': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600';
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin w-10 h-10 text-blue-500" /></div>;

  return (
    // เพิ่ม flex flex-col justify-between เพื่อดัน footer ลงล่าง
    <main className="container mx-auto px-4 py-10 min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex flex-col justify-between">
      <SEO
        title="เลือกโหมดฝึก — Practicing Fast Math Skills"
        description="เลือกโหมดและระดับการฝึกคิดเลขเร็วที่เหมาะกับคุณ"
        canonical="/mode-selection"
      />
      
      {/* Content Wrapper: ให้ขยายเต็มพื้นที่ที่เหลือ (flex-1) */}
      <div className="mx-auto max-w-4xl space-y-8 relative z-10 flex-1 w-full">
        
        {/* --- ส่วนปุ่มย้อนกลับ (Back Button) --- */}
        <div className="flex justify-start">
            <Button 
                variant="ghost" 
                onClick={() => navigate(-1)} // สั่งให้กลับไปหน้าก่อนหน้า
                className="gap-2 text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
            >
                <ArrowLeft className="w-6 h-6" /> 
                <span className="text-lg">ย้อนกลับ</span>
            </Button>
        </div>

        <div className="text-center animate-fade-in -mt-4">
          <h1 className="text-4xl font-bold math-gradient bg-clip-text text-transparent">เลือกโหมดการฝึก</h1>
          <p className="mt-4 text-lg text-muted-foreground">ข้อมูลสดจากระบบฐานข้อมูล</p>
        </div>

        {/* --- ส่วนเลือก Mode --- */}
        <Card className="math-card shadow-math-elevated">
          <CardHeader className="bg-gradient-subtle rounded-t-lg">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">🎯</span> โหมดการฝึก
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {modes.map((mode) => (
              <Button
                key={mode.id}
                variant={selectedModeId === mode.id ? "default" : "outline"} 
                className={`h-auto flex-col p-6 transition-all duration-300 hover:scale-105 ${
                  selectedModeId === mode.id ? 'border-blue-500 ring-2 ring-blue-200 bg-blue-50 text-blue-700' : ''
                }`}
                onClick={() => setSelectedModeId(mode.id)}
              >
                <div className="font-bold text-lg mb-2">{mode.name}</div>
                <div className="text-xs opacity-70 text-center leading-relaxed line-clamp-2">{mode.description}</div>
              </Button>
            ))}
             
             {/* ปุ่ม Hardcode Mixed Mode */}
             <Button
                variant={selectedModeId === 'mixed' ? "default" : "outline"}
                className={`h-auto flex-col p-6 ${selectedModeId === 'mixed' ? 'border-purple-500 bg-purple-50 text-purple-700' : ''}`}
                onClick={() => setSelectedModeId('mixed')}
              >
                <div className="font-bold text-lg mb-2">โหมดผสม (Mixed)</div>
                <div className="text-xs opacity-70 text-center">รวมมิตรทุกโหมด</div>
              </Button>
          </CardContent>
        </Card>

        {/* --- ส่วนเลือก Level --- */}
        <Card className="math-card shadow-math-elevated">
          <CardHeader className="bg-gradient-subtle rounded-t-lg">
            <CardTitle className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">📊</span> ระดับความยาก
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
            {selectedModeId === 'mixed' ? (
                ['easy', 'medium', 'hard'].map((lvl) => (
                    <Button
                        key={lvl}
                        variant="outline"
                        className={`h-auto flex-col p-6 ${selectedLevelDifficulty === lvl ? 'border-purple-500 bg-purple-50' : ''}`}
                        onClick={() => setSelectedLevelDifficulty(lvl)}
                    >
                         <div className="font-bold uppercase">{lvl}</div>
                    </Button>
                ))
            ) : availableLevels.length > 0 ? (
                availableLevels.map((level) => (
                <Button
                    key={level.id}
                    variant="outline"
                    className={`h-auto flex-col p-6 transition-all ${
                    selectedLevelDifficulty === level.difficulty 
                        ? `ring-2 ${getLevelColor(level.difficulty)}` 
                        : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedLevelDifficulty(level.difficulty)}
                >
                    <div className="font-bold text-lg mb-2 capitalize">
                      {level.difficulty}
                    </div>
                    <div className="text-xs opacity-70 text-center">{level.description}</div>
                </Button>
                ))
            ) : (
                <div className="col-span-3 text-center text-gray-400 py-4">ไม่พบระดับความยากในโหมดนี้</div>
            )}
          </CardContent>
        </Card>


        {/* --- Start Button --- */}
        <div className="text-center pb-10">
            <Button
              size="lg"
              onClick={handleStartClick}
              disabled={loadingTip}
              className="px-16 py-8 text-xl font-bold shadow-lg hover:scale-105 transition-transform bg-blue-600 hover:bg-blue-700 text-white rounded-full"
            >
              {loadingTip ? <Loader2 className="animate-spin mr-2" /> : <span className="mr-2">🚀</span>}
              เริ่มฝึกเลย!
            </Button>
        </div>
      </div>

      {/* --- Footer Start --- */}
      <footer className="w-full py-6 text-center mt-8 border-t border-slate-200/50">
          <div className="container mx-auto px-4">
            <p className="text-xs md:text-sm text-muted-foreground/70 font-light">
              &copy; {currentYear} ภาควิชาคอมพิวเตอร์ คณะวิทยาศาสตร์และเทคโนโลยี 
              <span className="hidden sm:inline"> • </span> 
              <br className="sm:hidden" /> 
              มหาวิทยาลัยราชภัฏเชียงใหม่
            </p>
          </div>
      </footer>
      {/* --- Footer End --- */}

      {/* --- POPUP Dialog --- */}
      <Dialog open={isTipOpen} onOpenChange={setIsTipOpen}>
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-2xl text-yellow-600">
                    <Lightbulb className="w-6 h-6 fill-yellow-400 text-yellow-600" />
                    เทคนิคแนะนำ!
                </DialogTitle>
                <DialogDescription className="text-lg font-medium text-gray-800 pt-2">
                    {currentTechnique?.title}
                </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                    {currentTechnique?.description || "ไม่มีรายละเอียด"}
                </p>
                {currentTechnique?.image_url && (
                    <div className="rounded-lg overflow-hidden border">
                        <img src={currentTechnique.image_url} alt="Technique" className="w-full h-auto object-cover" />
                    </div>
                )}
                {currentTechnique?.video_url && (
                    <a href={currentTechnique.video_url} target="_blank" rel="noreferrer" className="text-blue-600 underline text-sm block">
                        ดูวิดีโอประกอบคลิกที่นี่
                    </a>
                )}
            </div>

            <DialogFooter>
                <Button onClick={proceedToGame} className="w-full bg-green-600 hover:bg-green-700 text-lg py-6">
                    เข้าใจแล้ว เริ่มเกมเลย! 👉
                </Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>

    </main>
  );
};

export default ModeSelection;