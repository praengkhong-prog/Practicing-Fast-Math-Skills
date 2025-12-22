// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "@/supabaseClient";
// import SEO from "@/components/SEO";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useAuth } from "@/contexts/AuthContext";
// import { ArrowLeft, Trophy, Clock, Calendar, Search, History, Filter, Zap, ArrowUp, ArrowDown, AlertTriangle, CheckCircle2 } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge"; 

// // Interface (เพิ่ม field status)
// interface PracticeResult {
//   id: string;
//   created_at: string;
//   mode: string; 
//   level: string; 
//   score: number;
//   total_questions: number;
//   avg_time_ms: number;
//   status?: string; // เพิ่ม status: 'completed' | 'incomplete'
// }

// // Config โหมดต่างๆ
// const MODE_CONFIG: Record<string, { label: string; uuid?: string; icon: string; color: string; bg: string }> = {
//   add: { label: "การบวก", uuid: "76ae8bea-cd76-458e-8f16-04e193ce9d7c", icon: "+", color: "text-blue-600", bg: "bg-blue-50" },
//   minus: { label: "การลบ", uuid: "01b1721d-027c-4415-9338-c1f0d87c5374", icon: "-", color: "text-red-600", bg: "bg-red-50" },
//   multiply: { label: "การคูณ", uuid: "f8c3a72d-77f9-4839-986b-322878d2b8ba", icon: "×", color: "text-purple-600", bg: "bg-purple-50" },
//   divide: { label: "การหาร", uuid: "59fb7c37-6857-40fb-bfdb-04f4af194c05", icon: "÷", color: "text-orange-600", bg: "bg-orange-50" },
//   mixed: { label: "โหมดผสม", uuid: "mixed", icon: "∞", color: "text-green-600", bg: "bg-green-50" },
// };

// const Stats = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const currentYear = new Date().getFullYear(); // ดึงปีปัจจุบัน
  
//   const [results, setResults] = useState<PracticeResult[]>([]);
//   const [loading, setLoading] = useState(true);

//   // --- STATE ตัวกรอง ---
//   const [filterLevel, setFilterLevel] = useState<string>("all");
//   const [filterType, setFilterType] = useState<string>("latest"); 

//   useEffect(() => {
//     const fetchStats = async () => {
//       if (!user) return;
//       try {
//         const { data, error } = await supabase
//           .from("practice_results") 
//           .select("*")
//           .eq("user_id", user.id)
//           .order("created_at", { ascending: false });

//         if (error) throw error;
//         setResults(data || []);
//       } catch (err) {
//         console.error("Error fetching stats:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStats();
//   }, [user]);

//   // ฟังก์ชันคำนวณสถิติ
//   const getStatsByMode = (modeKey: string) => {
//     const config = MODE_CONFIG[modeKey];
    
//     // 1. กรองตามโหมด
//     let filtered = results.filter(r => 
//         r.mode === modeKey || (config.uuid && r.mode === config.uuid) || (modeKey === 'mixed' && r.mode === 'mix')
//     );

//     // 2. กรองตาม Level
//     if (filterLevel !== "all") {
//         filtered = filtered.filter(r => r.level === filterLevel);
//     }

//     if (filtered.length === 0) return null;

//     // --- LOGIC คำนวณ Trend ---
//     const latestRun = filtered[0];
//     // หา run ก่อนหน้า (ที่ไม่ใช่ตัวเดียวกับ latest)
//     const previousRun = filtered[1]; 

//     let trend = null;
//     if (latestRun && previousRun) {
//         trend = {
//             scoreDiff: latestRun.score - previousRun.score,
//             timeDiff: latestRun.avg_time_ms - previousRun.avg_time_ms
//         };
//     }

//     // 3. หาสถิติที่จะโชว์ในการ์ดหลัก
//     let displayResult: PracticeResult;
    
//     if (filterType === "best") {
//         // *** แก้ไข: Best Score ต้องเป็นเกมที่ status = 'completed' เท่านั้น (ถ้ามี) ***
//         const completedGames = filtered.filter(r => r.status !== 'incomplete');
//         const pool = completedGames.length > 0 ? completedGames : filtered; // ถ้าไม่มี completed เลย ก็เอาอันที่มี

//         displayResult = [...pool].sort((a, b) => {
//             if (b.score !== a.score) return b.score - a.score; 
//             return a.avg_time_ms - b.avg_time_ms; 
//         })[0];
//     } else {
//         displayResult = latestRun; // Latest โชว์หมด ไม่สนว่าจบไหม
//     }

//     return {
//       display: displayResult,
//       trend: trend,
//       history: filtered,
//       count: filtered.length
//     };
//   };

//   const formatDate = (isoString: string) => {
//     return new Date(isoString).toLocaleDateString('th-TH', {
//       year: '2-digit', month: 'short', day: 'numeric',
//       hour: '2-digit', minute: '2-digit'
//     });
//   };

//   // Component: Trend Indicator
//   const TrendIndicator = ({ value, type, compact = false }: { value: number, type: 'score' | 'time', compact?: boolean }) => {
//     if (value === 0) return <span className="text-gray-300 ml-1">-</span>;
//     const isGood = type === 'score' ? value > 0 : value < 0; 
//     const colorClass = isGood ? "text-green-600" : "text-red-500";
//     const bgClass = isGood ? "bg-green-100" : "bg-red-100";
//     const Icon = value > 0 ? ArrowUp : ArrowDown;
//     const displayValue = type === 'time' ? `${(Math.abs(value)/1000).toFixed(1)}s` : Math.abs(value);

//     if (compact) {
//         return (
//             <div className={`flex items-center text-[10px] font-bold ml-1.5 ${colorClass}`}>
//                 <Icon className="w-3 h-3" />
//                 {displayValue}
//             </div>
//         );
//     }
//     return (
//         <span className={`flex items-center text-xs px-1.5 py-0.5 rounded-md font-bold ${colorClass} ${bgClass}`}>
//             <Icon className="w-3 h-3 mr-1" />
//             {displayValue}
//         </span>
//     );
//   };

//   return (
//     // ปรับ Layout เป็น Flex Column เพื่อจัด Footer ให้ลงล่างสุด
//     <main className="container mx-auto px-4 py-10 min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex flex-col justify-between">
//       <SEO title="สถิติส่วนตัว" description="ดูพัฒนาการและสถิติการฝึกฝนของคุณ" />

//       {/* Content Wrapper: ให้ขยายเต็มพื้นที่ที่เหลือ (flex-1) */}
//       <div className="mx-auto max-w-5xl space-y-8 flex-1 w-full">
//         {/* Header */}
//         <div className="flex flex-col gap-4">
//             {/* <div className="flex justify-start">
//                 <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2 text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent">
//                     <ArrowLeft className="w-6 h-6" /> <span className="text-lg">ย้อนกลับ</span>
//                 </Button>
//             </div> */}
            
            
//             <div className="space-y-2 animate-fade-in">
//                 <h1 className="text-4xl font-bold math-gradient bg-clip-text text-transparent">สถิติและพัฒนาการ</h1>
//                 <p className="text-lg text-muted-foreground">ติดตามผลการฝึกฝนของคุณ</p>
//             </div>
//         </div>

//         {/* Filter Bar */}
//         <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row gap-6 items-center justify-between">
//             <div className="flex items-center gap-3 w-full md:w-auto">
//                 <div className="flex items-center gap-2 text-muted-foreground min-w-fit">
//                     <Filter className="w-4 h-4" />
//                     <span className="text-sm font-medium">ระดับ:</span>
//                 </div>
//                 <div className="flex gap-2 overflow-x-auto">
//                     {['all', 'easy', 'medium', 'hard'].map((lvl) => (
//                         <button
//                             key={lvl}
//                             onClick={() => setFilterLevel(lvl)}
//                             className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
//                                 filterLevel === lvl ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'
//                             }`}
//                         >
//                             {lvl === 'all' ? 'ทั้งหมด' : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             <div className="flex items-center gap-3 w-full md:w-auto">
//                 <div className="flex items-center gap-2 text-muted-foreground min-w-fit">
//                     <Zap className="w-4 h-4" />
//                     <span className="text-sm font-medium">มุมมอง:</span>
//                 </div>
//                 <div className="flex gap-2">
//                     <button onClick={() => setFilterType('latest')} className={`px-4 py-1 rounded-full text-xs font-bold border ${filterType === 'latest' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600'}`}>
//                         ⏱️ ล่าสุด
//                     </button>
//                     <button onClick={() => setFilterType('best')} className={`px-4 py-1 rounded-full text-xs font-bold border ${filterType === 'best' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-gray-600'}`}>
//                         🏆 ดีที่สุด
//                     </button>
//                 </div>
//             </div>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {Object.keys(MODE_CONFIG).map((modeKey) => {
//              const config = MODE_CONFIG[modeKey];
//              const stats = getStatsByMode(modeKey);

//              return (
//                <Card key={modeKey} className="math-card shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
//                  <CardHeader className={`${config.bg} rounded-t-lg border-b border-gray-100`}>
//                    <CardTitle className={`flex items-center justify-between ${config.color}`}>
//                      <div className="flex items-center gap-2">
//                         <span className="text-3xl font-bold">{config.icon}</span>
//                         <span>{config.label}</span>
//                      </div>
//                      {stats && filterType === 'best' && <Trophy className="w-5 h-5 text-yellow-500" />}
//                      {stats && filterType === 'latest' && <History className="w-5 h-5 text-blue-500" />}
//                    </CardTitle>
//                  </CardHeader>

//                  <CardContent className="pt-6 flex-grow flex flex-col justify-center text-center space-y-4">
//                    {stats ? (
//                      <>
//                         <div className="space-y-2">
//                             <div className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center justify-center gap-2">
//                                 {filterType === 'best' ? 'คะแนนสูงสุด' : 'คะแนนล่าสุด'}
//                             </div>
//                             <div className="flex items-center justify-center gap-3">
//                                 <div className="text-5xl font-bold text-gray-800">
//                                     {stats.display.score}
//                                     <span className="text-lg text-gray-300 ml-1">/ {stats.display.total_questions}</span>
//                                 </div>
//                                 {filterType === 'latest' && stats.trend && (
//                                     <div className="flex flex-col items-start animate-fade-in">
//                                         <TrendIndicator value={stats.trend.scoreDiff} type="score" />
//                                     </div>
//                                 )}
//                             </div>
//                             {/* แสดงสถานะ ถ้าทำไม่จบ */}
//                             {stats.display.status === 'incomplete' && (
//                                 <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
//                                     <AlertTriangle className="w-3 h-3 mr-1" /> ทำไม่จบ
//                                 </div>
//                             )}
//                         </div>

//                         <div className="grid grid-cols-2 gap-3 text-sm mt-2">
//                             <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center justify-center">
//                                 <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
//                                     <Clock className="w-3 h-3" /> เวลาเฉลี่ย
//                                 </div>
//                                 <div className="font-bold text-gray-700 flex items-center gap-2">
//                                     {(stats.display.avg_time_ms / 1000).toFixed(1)}s
//                                     {filterType === 'latest' && stats.trend && (
//                                         <TrendIndicator value={stats.trend.timeDiff} type="time" compact={false} />
//                                     )}
//                                 </div>
//                             </div>
//                             <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center justify-center">
//                                 <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
//                                     <Calendar className="w-3 h-3" /> วันที่
//                                 </div>
//                                 <div className="font-bold text-gray-700">
//                                     {formatDate(stats.display.created_at).split(' ')[0]}
//                                 </div>
//                             </div>
//                         </div>
//                      </>
//                    ) : (
//                      <div className="py-8 text-gray-400 flex flex-col items-center gap-2">
//                         <Search className="w-10 h-10 opacity-20" />
//                         <p className="text-sm">ไม่พบข้อมูล</p>
//                         <Button variant="link" onClick={() => navigate('/mode-selection')} className="text-blue-500 text-xs">เริ่มฝึกโหมดนี้</Button>
//                      </div>
//                    )}
//                  </CardContent>
                 
//                  {stats && (
//                     <div className="p-4 border-t bg-gray-50/50">
//                         <Dialog>
//                             <DialogTrigger asChild>
//                                 <Button variant="outline" className="w-full gap-2 text-sm h-9">
//                                     <History className="w-4 h-4" /> ดูประวัติทั้งหมด
//                                 </Button>
//                             </DialogTrigger>
//                             <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
//                                 <DialogHeader>
//                                     <DialogTitle className={`flex items-center gap-2 text-2xl ${config.color}`}>
//                                         {config.icon} ประวัติ: {config.label}
//                                     </DialogTitle>
//                                     <DialogDescription>
//                                         ประวัติการฝึก {filterLevel !== 'all' ? `(ระดับ ${filterLevel})` : ''} ทั้งหมด
//                                     </DialogDescription>
//                                 </DialogHeader>
//                                 <ScrollArea className="flex-1 mt-4 border rounded-md p-4">
//                                     <Table>
//                                         <TableHeader>
//                                             <TableRow>
//                                                 <TableHead>วันที่</TableHead>
//                                                 <TableHead>สถานะ</TableHead> 
//                                                 <TableHead>ระดับ</TableHead>
//                                                 <TableHead className="text-right">คะแนน</TableHead>
//                                                 <TableHead className="text-right">เวลา/ข้อ</TableHead>
//                                             </TableRow>
//                                         </TableHeader>
//                                         <TableBody>
//                                             {stats.history.map((row, index) => {
//                                                 const prevRow = stats.history[index + 1];
//                                                 let scoreDiff = 0;
//                                                 let timeDiff = 0;
//                                                 if (prevRow) {
//                                                     scoreDiff = row.score - prevRow.score;
//                                                     timeDiff = row.avg_time_ms - prevRow.avg_time_ms;
//                                                 }
//                                                 return (
//                                                     <TableRow key={row.id} className={row.status === 'incomplete' ? 'bg-yellow-50/50' : ''}>
//                                                         <TableCell className="text-gray-600 text-xs sm:text-sm">
//                                                             {formatDate(row.created_at)}
//                                                         </TableCell>
//                                                         {/* Status Column */}
//                                                         <TableCell>
//                                                             {row.status === 'incomplete' ? (
//                                                                 <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
//                                                                         <AlertTriangle className="w-3 h-3 mr-1" /> ไม่จบ
//                                                                 </span>
//                                                             ) : (
//                                                                 <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
//                                                                         <CheckCircle2 className="w-3 h-3 mr-1" /> จบ
//                                                                 </span>
//                                                             )}
//                                                         </TableCell>
//                                                         <TableCell>
//                                                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase
//                                                                 ${row.level === 'hard' ? 'bg-red-50 text-red-600 border-red-200' : 
//                                                                   row.level === 'medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 
//                                                                   'bg-green-50 text-green-600 border-green-200'}`}>
//                                                                 {row.level}
//                                                             </span>
//                                                         </TableCell>
//                                                         <TableCell className="text-right">
//                                                             <div className="flex items-center justify-end">
//                                                                 <span className="font-bold text-lg">{row.score}</span>
//                                                                 <span className="text-xs text-gray-400 mx-1">/ {row.total_questions}</span>
//                                                                 {prevRow && <TrendIndicator value={scoreDiff} type="score" compact={true} />}
//                                                             </div>
//                                                         </TableCell>
//                                                         <TableCell className="text-right">
//                                                             <div className="flex items-center justify-end">
//                                                                 <span className="text-gray-500">{(row.avg_time_ms / 1000).toFixed(1)}s</span>
//                                                                 {prevRow && <TrendIndicator value={timeDiff} type="time" compact={true} />}
//                                                             </div>
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 );
//                                             })}
//                                         </TableBody>
//                                     </Table>
//                                 </ScrollArea>
//                             </DialogContent>
//                         </Dialog>
//                     </div>
//                  )}
//                </Card>
//              );
//           })}
//         </div>
//       </div>

//       {/* --- Footer Start --- */}
//       <footer className="w-full py-6 text-center mt-8 border-t border-slate-200/50">
//           <div className="container mx-auto px-4">
//             <p className="text-xs md:text-sm text-muted-foreground/70 font-light">
//               &copy; {currentYear} ภาควิชาคอมพิวเตอร์ คณะวิทยาศาสตร์และเทคโนโลยี 
//               <span className="hidden sm:inline"> • </span> 
//               <br className="sm:hidden" /> 
//               มหาวิทยาลัยราชภัฏเชียงใหม่
//             </p>
//           </div>
//       </footer>
//       {/* --- Footer End --- */}
      
//     </main>
//   );
// };

// export default Stats;




// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client"; // ⚠️ ตรวจสอบ path นี้ว่าถูกต้องตามโปรเจกต์ของคุณ
// import SEO from "@/components/SEO";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useAuth } from "@/contexts/AuthContext";
// import { ArrowLeft, Trophy, Clock, Calendar, Search, History, Filter, Zap, ArrowUp, ArrowDown, AlertTriangle, CheckCircle2 } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { ScrollArea } from "@/components/ui/scroll-area";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// // Interface (เพิ่ม field status)
// interface PracticeResult {
//   id: string;
//   created_at: string;
//   mode: string; 
//   level: string; 
//   score: number;
//   total_questions: number;
//   avg_time_ms: number;
//   status?: string; // เพิ่ม status: 'completed' | 'incomplete'
// }

// // Config โหมดต่างๆ
// const MODE_CONFIG: Record<string, { label: string; uuid?: string; icon: string; color: string; bg: string }> = {
//   add: { label: "การบวก", uuid: "76ae8bea-cd76-458e-8f16-04e193ce9d7c", icon: "+", color: "text-blue-600", bg: "bg-blue-50" },
//   minus: { label: "การลบ", uuid: "01b1721d-027c-4415-9338-c1f0d87c5374", icon: "-", color: "text-red-600", bg: "bg-red-50" },
//   multiply: { label: "การคูณ", uuid: "f8c3a72d-77f9-4839-986b-322878d2b8ba", icon: "×", color: "text-purple-600", bg: "bg-purple-50" },
//   divide: { label: "การหาร", uuid: "59fb7c37-6857-40fb-bfdb-04f4af194c05", icon: "÷", color: "text-orange-600", bg: "bg-orange-50" },
//   mixed: { label: "โหมดผสม", uuid: "mixed", icon: "∞", color: "text-green-600", bg: "bg-green-50" },
// };

// const Stats = () => {
//   const navigate = useNavigate();
//   const { user } = useAuth();
//   const currentYear = new Date().getFullYear(); // ดึงปีปัจจุบัน
  
//   const [results, setResults] = useState<PracticeResult[]>([]);
//   const [loading, setLoading] = useState(true);

//   // --- STATE ตัวกรอง ---
//   const [filterLevel, setFilterLevel] = useState<string>("all");
//   const [filterType, setFilterType] = useState<string>("latest"); 

//   useEffect(() => {
//     const fetchStats = async () => {
//       if (!user) return;
//       try {
//         const { data, error } = await supabase
//           .from("practice_results") 
//           .select("*")
//           .eq("user_id", user.id)
//           .order("created_at", { ascending: false });

//         if (error) throw error;
//         setResults(data || []);
//       } catch (err) {
//         console.error("Error fetching stats:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStats();
//   }, [user]);

//   // ฟังก์ชันคำนวณสถิติ
//   const getStatsByMode = (modeKey: string) => {
//     const config = MODE_CONFIG[modeKey];
    
//     // 1. กรองตามโหมด
//     let filtered = results.filter(r => 
//         r.mode === modeKey || (config.uuid && r.mode === config.uuid) || (modeKey === 'mixed' && r.mode === 'mix')
//     );

//     // 2. กรองตาม Level
//     if (filterLevel !== "all") {
//         filtered = filtered.filter(r => r.level === filterLevel);
//     }

//     if (filtered.length === 0) return null;

//     // --- LOGIC คำนวณ Trend ---
//     const latestRun = filtered[0];
//     // หา run ก่อนหน้า (ที่ไม่ใช่ตัวเดียวกับ latest)
//     const previousRun = filtered[1]; 

//     let trend = null;
//     if (latestRun && previousRun) {
//         trend = {
//             scoreDiff: latestRun.score - previousRun.score,
//             timeDiff: latestRun.avg_time_ms - previousRun.avg_time_ms
//         };
//     }

//     // 3. หาสถิติที่จะโชว์ในการ์ดหลัก
//     let displayResult: PracticeResult;
    
//     if (filterType === "best") {
//         // *** แก้ไข: Best Score ต้องเป็นเกมที่ status = 'completed' เท่านั้น (ถ้ามี) ***
//         const completedGames = filtered.filter(r => r.status !== 'incomplete');
//         const pool = completedGames.length > 0 ? completedGames : filtered; // ถ้าไม่มี completed เลย ก็เอาอันที่มี

//         displayResult = [...pool].sort((a, b) => {
//             if (b.score !== a.score) return b.score - a.score; 
//             return a.avg_time_ms - b.avg_time_ms; 
//         })[0];
//     } else {
//         displayResult = latestRun; // Latest โชว์หมด ไม่สนว่าจบไหม
//     }

//     return {
//       display: displayResult,
//       trend: trend,
//       history: filtered,
//       count: filtered.length
//     };
//   };

//   const formatDate = (isoString: string) => {
//     return new Date(isoString).toLocaleDateString('th-TH', {
//       year: '2-digit', month: 'short', day: 'numeric',
//       hour: '2-digit', minute: '2-digit'
//     });
//   };

//   // Component: Trend Indicator
//   const TrendIndicator = ({ value, type, compact = false }: { value: number, type: 'score' | 'time', compact?: boolean }) => {
//     if (value === 0) return <span className="text-gray-300 ml-1">-</span>;
//     const isGood = type === 'score' ? value > 0 : value < 0; 
//     const colorClass = isGood ? "text-green-600" : "text-red-500";
//     const bgClass = isGood ? "bg-green-100" : "bg-red-100";
//     const Icon = value > 0 ? ArrowUp : ArrowDown;
//     const displayValue = type === 'time' ? `${(Math.abs(value)/1000).toFixed(1)}s` : Math.abs(value);

//     if (compact) {
//         return (
//             <div className={`flex items-center text-[10px] font-bold ml-1.5 ${colorClass}`}>
//                 <Icon className="w-3 h-3" />
//                 {displayValue}
//             </div>
//         );
//     }
//     return (
//         <span className={`flex items-center text-xs px-1.5 py-0.5 rounded-md font-bold ${colorClass} ${bgClass}`}>
//             <Icon className="w-3 h-3 mr-1" />
//             {displayValue}
//         </span>
//     );
//   };

//   return (
//     // ปรับ Layout เป็น Flex Column เพื่อจัด Footer ให้ลงล่างสุด
//     <main className="container mx-auto px-4 py-10 min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex flex-col justify-between">
//       <SEO title="สถิติส่วนตัว" description="ดูพัฒนาการและสถิติการฝึกฝนของคุณ" />

//       {/* Content Wrapper: ให้ขยายเต็มพื้นที่ที่เหลือ (flex-1) */}
//       <div className="mx-auto max-w-5xl space-y-8 flex-1 w-full">
//         {/* Header */}
//         <div className="flex flex-col gap-4">
//             {/* ✅ ปุ่มย้อนกลับ (แก้ไขให้ไปหน้าหลัก /) */}
//             <div className="flex justify-start">
//                 <Button 
//                     variant="ghost" 
//                     onClick={() => navigate('/')} 
//                     className="gap-2 text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
//                 >
//                     <ArrowLeft className="w-6 h-6" /> <span className="text-lg">กลับหน้าหลัก</span>
//                 </Button>
//             </div>
            
//             <div className="space-y-2 animate-fade-in">
//                 <h1 className="text-4xl font-bold math-gradient bg-clip-text text-transparent">สถิติและพัฒนาการ</h1>
//                 <p className="text-lg text-muted-foreground">ติดตามผลการฝึกฝนของคุณ</p>
//             </div>
//         </div>

//         {/* Filter Bar */}
//         <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row gap-6 items-center justify-between">
//             <div className="flex items-center gap-3 w-full md:w-auto">
//                 <div className="flex items-center gap-2 text-muted-foreground min-w-fit">
//                     <Filter className="w-4 h-4" />
//                     <span className="text-sm font-medium">ระดับ:</span>
//                 </div>
//                 <div className="flex gap-2 overflow-x-auto">
//                     {['all', 'easy', 'medium', 'hard'].map((lvl) => (
//                         <button
//                             key={lvl}
//                             onClick={() => setFilterLevel(lvl)}
//                             className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
//                                 filterLevel === lvl ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'
//                             }`}
//                         >
//                             {lvl === 'all' ? 'ทั้งหมด' : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
//                         </button>
//                     ))}
//                 </div>
//             </div>

//             <div className="flex items-center gap-3 w-full md:w-auto">
//                 <div className="flex items-center gap-2 text-muted-foreground min-w-fit">
//                     <Zap className="w-4 h-4" />
//                     <span className="text-sm font-medium">มุมมอง:</span>
//                 </div>
//                 <div className="flex gap-2">
//                     <button onClick={() => setFilterType('latest')} className={`px-4 py-1 rounded-full text-xs font-bold border ${filterType === 'latest' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600'}`}>
//                         ⏱️ ล่าสุด
//                     </button>
//                     <button onClick={() => setFilterType('best')} className={`px-4 py-1 rounded-full text-xs font-bold border ${filterType === 'best' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-gray-600'}`}>
//                         🏆 ดีที่สุด
//                     </button>
//                 </div>
//             </div>
//         </div>

//         {/* Stats Grid */}
//         <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
//           {Object.keys(MODE_CONFIG).map((modeKey) => {
//              const config = MODE_CONFIG[modeKey];
//              const stats = getStatsByMode(modeKey);

//              return (
//                <Card key={modeKey} className="math-card shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
//                  <CardHeader className={`${config.bg} rounded-t-lg border-b border-gray-100`}>
//                    <CardTitle className={`flex items-center justify-between ${config.color}`}>
//                      <div className="flex items-center gap-2">
//                         <span className="text-3xl font-bold">{config.icon}</span>
//                         <span>{config.label}</span>
//                      </div>
//                      {stats && filterType === 'best' && <Trophy className="w-5 h-5 text-yellow-500" />}
//                      {stats && filterType === 'latest' && <History className="w-5 h-5 text-blue-500" />}
//                    </CardTitle>
//                  </CardHeader>

//                  <CardContent className="pt-6 flex-grow flex flex-col justify-center text-center space-y-4">
//                    {stats ? (
//                      <>
//                         <div className="space-y-2">
//                             <div className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center justify-center gap-2">
//                                 {filterType === 'best' ? 'คะแนนสูงสุด' : 'คะแนนล่าสุด'}
//                             </div>
//                             <div className="flex items-center justify-center gap-3">
//                                 <div className="text-5xl font-bold text-gray-800">
//                                     {stats.display.score}
//                                     <span className="text-lg text-gray-300 ml-1">/ {stats.display.total_questions}</span>
//                                 </div>
//                                 {filterType === 'latest' && stats.trend && (
//                                     <div className="flex flex-col items-start animate-fade-in">
//                                         <TrendIndicator value={stats.trend.scoreDiff} type="score" />
//                                     </div>
//                                 )}
//                             </div>
//                             {/* แสดงสถานะ ถ้าทำไม่จบ */}
//                             {stats.display.status === 'incomplete' && (
//                                 <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
//                                     <AlertTriangle className="w-3 h-3 mr-1" /> ทำไม่จบ
//                                 </div>
//                             )}
//                         </div>

//                         <div className="grid grid-cols-2 gap-3 text-sm mt-2">
//                             <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center justify-center">
//                                 <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
//                                     <Clock className="w-3 h-3" /> เวลาเฉลี่ย
//                                 </div>
//                                 <div className="font-bold text-gray-700 flex items-center gap-2">
//                                     {(stats.display.avg_time_ms / 1000).toFixed(1)}s
//                                     {filterType === 'latest' && stats.trend && (
//                                         <TrendIndicator value={stats.trend.timeDiff} type="time" compact={false} />
//                                     )}
//                                 </div>
//                             </div>
//                             <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center justify-center">
//                                 <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
//                                     <Calendar className="w-3 h-3" /> วันที่
//                                 </div>
//                                 <div className="font-bold text-gray-700">
//                                     {formatDate(stats.display.created_at).split(' ')[0]}
//                                 </div>
//                             </div>
//                         </div>
//                      </>
//                    ) : (
//                      <div className="py-8 text-gray-400 flex flex-col items-center gap-2">
//                         <Search className="w-10 h-10 opacity-20" />
//                         <p className="text-sm">ไม่พบข้อมูล</p>
//                         <Button variant="link" onClick={() => navigate('/mode-selection')} className="text-blue-500 text-xs">เริ่มฝึกโหมดนี้</Button>
//                      </div>
//                    )}
//                  </CardContent>
                 
//                  {stats && (
//                     <div className="p-4 border-t bg-gray-50/50">
//                         <Dialog>
//                             <DialogTrigger asChild>
//                                 <Button variant="outline" className="w-full gap-2 text-sm h-9">
//                                     <History className="w-4 h-4" /> ดูประวัติทั้งหมด
//                                 </Button>
//                             </DialogTrigger>
//                             <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
//                                 <DialogHeader>
//                                     <DialogTitle className={`flex items-center gap-2 text-2xl ${config.color}`}>
//                                         {config.icon} ประวัติ: {config.label}
//                                     </DialogTitle>
//                                     <DialogDescription>
//                                         ประวัติการฝึก {filterLevel !== 'all' ? `(ระดับ ${filterLevel})` : ''} ทั้งหมด
//                                     </DialogDescription>
//                                 </DialogHeader>
//                                 <ScrollArea className="flex-1 mt-4 border rounded-md p-4">
//                                     <Table>
//                                         <TableHeader>
//                                             <TableRow>
//                                                 <TableHead>วันที่</TableHead>
//                                                 <TableHead>สถานะ</TableHead> 
//                                                 <TableHead>ระดับ</TableHead>
//                                                 <TableHead className="text-right">คะแนน</TableHead>
//                                                 <TableHead className="text-right">เวลา/ข้อ</TableHead>
//                                             </TableRow>
//                                         </TableHeader>
//                                         <TableBody>
//                                             {stats.history.map((row, index) => {
//                                                 const prevRow = stats.history[index + 1];
//                                                 let scoreDiff = 0;
//                                                 let timeDiff = 0;
//                                                 if (prevRow) {
//                                                     scoreDiff = row.score - prevRow.score;
//                                                     timeDiff = row.avg_time_ms - prevRow.avg_time_ms;
//                                                 }
//                                                 return (
//                                                     <TableRow key={row.id} className={row.status === 'incomplete' ? 'bg-yellow-50/50' : ''}>
//                                                         <TableCell className="text-gray-600 text-xs sm:text-sm">
//                                                             {formatDate(row.created_at)}
//                                                         </TableCell>
//                                                         {/* Status Column */}
//                                                         <TableCell>
//                                                             {row.status === 'incomplete' ? (
//                                                                 <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
//                                                                         <AlertTriangle className="w-3 h-3 mr-1" /> ไม่จบ
//                                                                 </span>
//                                                             ) : (
//                                                                 <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
//                                                                         <CheckCircle2 className="w-3 h-3 mr-1" /> จบ
//                                                                 </span>
//                                                             )}
//                                                         </TableCell>
//                                                         <TableCell>
//                                                             <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase
//                                                                 ${row.level === 'hard' ? 'bg-red-50 text-red-600 border-red-200' : 
//                                                                   row.level === 'medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 
//                                                                   'bg-green-50 text-green-600 border-green-200'}`}>
//                                                                 {row.level}
//                                                             </span>
//                                                         </TableCell>
//                                                         <TableCell className="text-right">
//                                                             <div className="flex items-center justify-end">
//                                                                 <span className="font-bold text-lg">{row.score}</span>
//                                                                 <span className="text-xs text-gray-400 mx-1">/ {row.total_questions}</span>
//                                                                 {prevRow && <TrendIndicator value={scoreDiff} type="score" compact={true} />}
//                                                             </div>
//                                                         </TableCell>
//                                                         <TableCell className="text-right">
//                                                             <div className="flex items-center justify-end">
//                                                                 <span className="text-gray-500">{(row.avg_time_ms / 1000).toFixed(1)}s</span>
//                                                                 {prevRow && <TrendIndicator value={timeDiff} type="time" compact={true} />}
//                                                             </div>
//                                                         </TableCell>
//                                                     </TableRow>
//                                                 );
//                                             })}
//                                         </TableBody>
//                                     </Table>
//                                 </ScrollArea>
//                             </DialogContent>
//                         </Dialog>
//                     </div>
//                  )}
//                </Card>
//              );
//           })}
//         </div>
//       </div>

//       {/* --- Footer Start --- */}
//       <footer className="w-full py-6 text-center mt-8 border-t border-slate-200/50">
//           <div className="container mx-auto px-4">
//             <p className="text-xs md:text-sm text-muted-foreground/70 font-light">
//               &copy; {currentYear} ภาควิชาคอมพิวเตอร์ คณะวิทยาศาสตร์และเทคโนโลยี 
//               <span className="hidden sm:inline"> • </span> 
//               <br className="sm:hidden" /> 
//               มหาวิทยาลัยราชภัฏเชียงใหม่
//             </p>
//           </div>
//       </footer>
//       {/* --- Footer End --- */}
      
//     </main>
//   );
// };

// export default Stats;





import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft, Trophy, Clock, Calendar, Search, History, Filter, Zap, ArrowUp, ArrowDown, AlertTriangle, CheckCircle2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ✅ 1. Interface ที่ตรงกับฐานข้อมูลจริง (mode_id)
interface PracticeResult {
  id: string;
  created_at: string;
  mode_id: string | null; // ใช้ mode_id
  level: string; 
  score: number;
  total_questions: number;
  avg_time_ms: number;
  status?: string; 
}

const MODE_CONFIG: Record<string, { label: string; uuid?: string; icon: string; color: string; bg: string }> = {
  add: { label: "การบวก", uuid: "76ae8bea-cd76-458e-8f16-04e193ce9d7c", icon: "+", color: "text-blue-600", bg: "bg-blue-50" },
  minus: { label: "การลบ", uuid: "01b1721d-027c-4415-9338-c1f0d87c5374", icon: "-", color: "text-red-600", bg: "bg-red-50" },
  multiply: { label: "การคูณ", uuid: "f8c3a72d-77f9-4839-986b-322878d2b8ba", icon: "×", color: "text-purple-600", bg: "bg-purple-50" },
  divide: { label: "การหาร", uuid: "a30a6d31-8497-4cd6-9870-5f594ae6d2fa", icon: "÷", color: "text-orange-600", bg: "bg-orange-50" },
  mixed: { label: "โหมดผสม", uuid: "mixed", icon: "∞", color: "text-green-600", bg: "bg-green-50" },
};

const Stats = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentYear = new Date().getFullYear(); 
  
  const [results, setResults] = useState<PracticeResult[]>([]);
  const [loading, setLoading] = useState(true);

  // --- STATE ตัวกรอง ---
  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("latest"); 

  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from("practice_results") 
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (error) throw error;
        
        // ✅ แก้ไขตรงนี้: Force Cast ข้อมูลให้เป็น PracticeResult[] 
        // เพื่อแก้ Error Type Mismatch
        setResults((data as unknown as PracticeResult[]) || []);

      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  // ฟังก์ชันคำนวณสถิติ
  const getStatsByMode = (modeKey: string) => {
    const config = MODE_CONFIG[modeKey];
    
    // ✅ Logic การกรองใช้ mode_id
    let filtered = results.filter(r => {
        const matchUUID = config.uuid && r.mode_id === config.uuid;
        const matchMixed = modeKey === 'mixed' && r.mode_id === null;
        return matchUUID || matchMixed;
    });

    if (filterLevel !== "all") {
        filtered = filtered.filter(r => r.level === filterLevel);
    }

    if (filtered.length === 0) return null;

    const latestRun = filtered[0];
    const previousRun = filtered[1]; 

    let trend = null;
    if (latestRun && previousRun) {
        trend = {
            scoreDiff: latestRun.score - previousRun.score,
            timeDiff: latestRun.avg_time_ms - previousRun.avg_time_ms
        };
    }

    let displayResult: PracticeResult;
    
    if (filterType === "best") {
        const completedGames = filtered.filter(r => r.status !== 'incomplete');
        const pool = completedGames.length > 0 ? completedGames : filtered; 

        displayResult = [...pool].sort((a, b) => {
            if (b.score !== a.score) return b.score - a.score; 
            return a.avg_time_ms - b.avg_time_ms; 
        })[0];
    } else {
        displayResult = latestRun; 
    }

    return {
      display: displayResult,
      trend: trend,
      history: filtered,
      count: filtered.length
    };
  };

  const formatDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString('th-TH', {
      year: '2-digit', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  const TrendIndicator = ({ value, type, compact = false }: { value: number, type: 'score' | 'time', compact?: boolean }) => {
    if (value === 0) return <span className="text-gray-300 ml-1">-</span>;
    const isGood = type === 'score' ? value > 0 : value < 0; 
    const colorClass = isGood ? "text-green-600" : "text-red-500";
    const bgClass = isGood ? "bg-green-100" : "bg-red-100";
    const Icon = value > 0 ? ArrowUp : ArrowDown;
    const displayValue = type === 'time' ? `${(Math.abs(value)/1000).toFixed(1)}s` : Math.abs(value);

    if (compact) {
        return (
            <div className={`flex items-center text-[10px] font-bold ml-1.5 ${colorClass}`}>
                <Icon className="w-3 h-3" />
                {displayValue}
            </div>
        );
    }
    return (
        <span className={`flex items-center text-xs px-1.5 py-0.5 rounded-md font-bold ${colorClass} ${bgClass}`}>
            <Icon className="w-3 h-3 mr-1" />
            {displayValue}
        </span>
    );
  };

  return (
    <main className="container mx-auto px-4 py-10 min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex flex-col justify-between">
      <SEO title="สถิติส่วนตัว" description="ดูพัฒนาการและสถิติการฝึกฝนของคุณ" />

      <div className="mx-auto max-w-5xl space-y-8 flex-1 w-full">
        <div className="flex flex-col gap-4">
            <div className="flex justify-start">
                <Button 
                    variant="ghost" 
                    onClick={() => navigate('/')} 
                    className="gap-2 text-muted-foreground hover:text-foreground pl-0 hover:bg-transparent"
                >
                    <ArrowLeft className="w-6 h-6" /> <span className="text-lg">กลับหน้าหลัก</span>
                </Button>
            </div>
            
            <div className="space-y-2 animate-fade-in">
                <h1 className="text-4xl font-bold math-gradient bg-clip-text text-transparent">สถิติและพัฒนาการ</h1>
                <p className="text-lg text-muted-foreground">ติดตามผลการฝึกฝนของคุณ</p>
            </div>
        </div>

        <div className="bg-white p-4 rounded-xl shadow-sm border flex flex-col md:flex-row gap-6 items-center justify-between">
            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 text-muted-foreground min-w-fit">
                    <Filter className="w-4 h-4" />
                    <span className="text-sm font-medium">ระดับ:</span>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                    {['all', 'easy', 'medium', 'hard'].map((lvl) => (
                        <button
                            key={lvl}
                            onClick={() => setFilterLevel(lvl)}
                            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                                filterLevel === lvl ? 'bg-blue-100 text-blue-700' : 'text-gray-500 hover:bg-gray-50'
                            }`}
                        >
                            {lvl === 'all' ? 'ทั้งหมด' : lvl.charAt(0).toUpperCase() + lvl.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
                <div className="flex items-center gap-2 text-muted-foreground min-w-fit">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-medium">มุมมอง:</span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setFilterType('latest')} className={`px-4 py-1 rounded-full text-xs font-bold border ${filterType === 'latest' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600'}`}>
                        ⏱️ ล่าสุด
                    </button>
                    <button onClick={() => setFilterType('best')} className={`px-4 py-1 rounded-full text-xs font-bold border ${filterType === 'best' ? 'bg-yellow-500 text-white border-yellow-500' : 'bg-white text-gray-600'}`}>
                        🏆 ดีที่สุด
                    </button>
                </div>
            </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.keys(MODE_CONFIG).map((modeKey) => {
             const config = MODE_CONFIG[modeKey];
             const stats = getStatsByMode(modeKey);

             return (
               <Card key={modeKey} className="math-card shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                 <CardHeader className={`${config.bg} rounded-t-lg border-b border-gray-100`}>
                   <CardTitle className={`flex items-center justify-between ${config.color}`}>
                     <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold">{config.icon}</span>
                        <span>{config.label}</span>
                     </div>
                     {stats && filterType === 'best' && <Trophy className="w-5 h-5 text-yellow-500" />}
                     {stats && filterType === 'latest' && <History className="w-5 h-5 text-blue-500" />}
                   </CardTitle>
                 </CardHeader>

                 <CardContent className="pt-6 flex-grow flex flex-col justify-center text-center space-y-4">
                   {stats ? (
                     <>
                        <div className="space-y-2">
                            <div className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center justify-center gap-2">
                                {filterType === 'best' ? 'คะแนนสูงสุด' : 'คะแนนล่าสุด'}
                            </div>
                            <div className="flex items-center justify-center gap-3">
                                <div className="text-5xl font-bold text-gray-800">
                                    {stats.display.score}
                                    <span className="text-lg text-gray-300 ml-1">/ {stats.display.total_questions}</span>
                                </div>
                                {filterType === 'latest' && stats.trend && (
                                    <div className="flex flex-col items-start animate-fade-in">
                                        <TrendIndicator value={stats.trend.scoreDiff} type="score" />
                                    </div>
                                )}
                            </div>
                            {stats.display.status === 'incomplete' && (
                                <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
                                    <AlertTriangle className="w-3 h-3 mr-1" /> ทำไม่จบ
                                </div>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm mt-2">
                            <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center justify-center">
                                <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> เวลาเฉลี่ย
                                </div>
                                <div className="font-bold text-gray-700 flex items-center gap-2">
                                    {(stats.display.avg_time_ms / 1000).toFixed(1)}s
                                    {filterType === 'latest' && stats.trend && (
                                        <TrendIndicator value={stats.trend.timeDiff} type="time" compact={false} />
                                    )}
                                </div>
                            </div>
                            <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center justify-center">
                                <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                                    <Calendar className="w-3 h-3" /> วันที่
                                </div>
                                <div className="font-bold text-gray-700">
                                    {formatDate(stats.display.created_at).split(' ')[0]}
                                </div>
                            </div>
                        </div>
                     </>
                   ) : (
                     <div className="py-8 text-gray-400 flex flex-col items-center gap-2">
                        <Search className="w-10 h-10 opacity-20" />
                        <p className="text-sm">ไม่พบข้อมูล</p>
                        <Button variant="link" onClick={() => navigate('/')} className="text-blue-500 text-xs">กลับหน้าหลักเพื่อเริ่มฝึก</Button>
                     </div>
                   )}
                 </CardContent>
                 
                 {stats && (
                    <div className="p-4 border-t bg-gray-50/50">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full gap-2 text-sm h-9">
                                    <History className="w-4 h-4" /> ดูประวัติทั้งหมด
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl h-[80vh] flex flex-col">
                                <DialogHeader>
                                    <DialogTitle className={`flex items-center gap-2 text-2xl ${config.color}`}>
                                        {config.icon} ประวัติ: {config.label}
                                    </DialogTitle>
                                    <DialogDescription>
                                        ประวัติการฝึก {filterLevel !== 'all' ? `(ระดับ ${filterLevel})` : ''} ทั้งหมด
                                    </DialogDescription>
                                </DialogHeader>
                                <ScrollArea className="flex-1 mt-4 border rounded-md p-4">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>วันที่</TableHead>
                                                <TableHead>สถานะ</TableHead> 
                                                <TableHead>ระดับ</TableHead>
                                                <TableHead className="text-right">คะแนน</TableHead>
                                                <TableHead className="text-right">เวลา/ข้อ</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {stats.history.map((row, index) => {
                                                const prevRow = stats.history[index + 1];
                                                let scoreDiff = 0;
                                                let timeDiff = 0;
                                                if (prevRow) {
                                                    scoreDiff = row.score - prevRow.score;
                                                    timeDiff = row.avg_time_ms - prevRow.avg_time_ms;
                                                }
                                                return (
                                                    <TableRow key={row.id} className={row.status === 'incomplete' ? 'bg-yellow-50/50' : ''}>
                                                        <TableCell className="text-gray-600 text-xs sm:text-sm">
                                                            {formatDate(row.created_at)}
                                                        </TableCell>
                                                        <TableCell>
                                                            {row.status === 'incomplete' ? (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
                                                                            <AlertTriangle className="w-3 h-3 mr-1" /> ไม่จบ
                                                                </span>
                                                            ) : (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                                                                            <CheckCircle2 className="w-3 h-3 mr-1" /> จบ
                                                                </span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>
                                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase
                                                                ${row.level === 'hard' ? 'bg-red-50 text-red-600 border-red-200' : 
                                                                  row.level === 'medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 
                                                                  'bg-green-50 text-green-600 border-green-200'}`}>
                                                                {row.level}
                                                            </span>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end">
                                                                <span className="font-bold text-lg">{row.score}</span>
                                                                <span className="text-xs text-gray-400 mx-1">/ {row.total_questions}</span>
                                                                {prevRow && <TrendIndicator value={scoreDiff} type="score" compact={true} />}
                                                            </div>
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            <div className="flex items-center justify-end">
                                                                <span className="text-gray-500">{(row.avg_time_ms / 1000).toFixed(1)}s</span>
                                                                {prevRow && <TrendIndicator value={timeDiff} type="time" compact={true} />}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                );
                                            })}
                                        </TableBody>
                                    </Table>
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>
                    </div>
                 )}
               </Card>
             );
          })}
        </div>
      </div>

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
      
    </main>
  );
};

export default Stats;