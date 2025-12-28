// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "@/integrations/supabase/client";
// import SEO from "@/components/SEO";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { useAuth } from "@/contexts/AuthContext";
// import { ArrowLeft, Trophy, Calendar, Search, History, Filter, Zap, ArrowUp, ArrowDown, AlertTriangle, CheckCircle2, Timer, BarChart3, List, XCircle } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";

// import UserProgressionChart from '@/pages/UserProgressionChart'; // ตรวจสอบ path ให้ตรงกับเครื่องคุณ

// interface PracticeResult {
//   id: string;
//   created_at: string;
//   mode_id: string | null;
//   level: string; 
//   score: number;
//   total_questions: number;
//   avg_time_ms: number;
//   status: string; 
// }

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
//   const currentYear = new Date().getFullYear(); 
  
//   const [results, setResults] = useState<PracticeResult[]>([]);
//   // eslint-disable-next-line @typescript-eslint/no-unused-vars
//   const [loading, setLoading] = useState(true);

//   const [filterLevel, setFilterLevel] = useState<string>("all");
//   const [filterType, setFilterType] = useState<string>("latest");
  
//   const [activeTab, setActiveTab] = useState<'table' | 'chart'>('table');
//   const [filterDate, setFilterDate] = useState<string>("");

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
//         setResults((data as unknown as PracticeResult[]) || []);

//       } catch (err) {
//         console.error("Error fetching stats:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchStats();
//   }, [user]);

//   const getStatsByMode = (modeKey: string) => {
//     const config = MODE_CONFIG[modeKey];
    
//     // 1. Filter ข้อมูลตามโหมด (ส่งอันนี้ให้กราฟ เพื่อให้กราฟมีข้อมูลครบทุก Level)
//     const modeBaseData = results.filter(r => {
//         const matchUUID = config.uuid && r.mode_id === config.uuid;
//         const matchMixed = modeKey === 'mixed' && r.mode_id === null;
//         return matchUUID || matchMixed;
//     });

//     // 2. Filter ตาม Level (สำหรับแสดงผล Table และ Card)
//     let levelFilteredData = modeBaseData;
//     if (filterLevel !== "all") {
//         levelFilteredData = levelFilteredData.filter(r => r.level === filterLevel);
//     }

//     if (levelFilteredData.length === 0 && modeBaseData.length === 0) return null;

//     // 3. เตรียมข้อมูล (สำหรับ Card)
//     const latestRun = levelFilteredData[0];
//     const previousRun = levelFilteredData[1]; 

//     // คำนวณ Trend
//     let trend = null;
//     if (latestRun && previousRun) {
//         trend = {
//             scoreDiff: latestRun.score - previousRun.score,
//             timeDiff: (latestRun.avg_time_ms - previousRun.avg_time_ms) / 1000 
//         };
//     }

//     let displayResult: PracticeResult;
    
//     if (filterType === "best") {
//         const completedGames = levelFilteredData.filter(r => r.status !== 'incomplete');
//         const pool = completedGames.length > 0 ? completedGames : levelFilteredData; 

//         if (pool.length > 0) {
//             displayResult = [...pool].sort((a, b) => {
//                 if (b.score !== a.score) return b.score - a.score; 
//                 return a.avg_time_ms - b.avg_time_ms; 
//             })[0];
//         } else {
//             displayResult = latestRun;
//         }
//     } else {
//         displayResult = latestRun; 
//     }

//     // ✅ สร้างข้อมูลจำลอง (Fallback) กรณีไม่มีข้อมูลใน Level นั้นๆ
//     const fallbackResult: PracticeResult = {
//         id: "empty", // ใช้เช็คว่าไม่มีข้อมูลจริง
//         created_at: "",
//         mode_id: null,
//         level: filterLevel === "all" ? "easy" : filterLevel,
//         score: 0,
//         total_questions: 10,
//         avg_time_ms: 0,
//         status: "incomplete"
//     };

//     // 4. กรองวันที่สำหรับ Table (แบบ Manual เพื่อความชัวร์)
//     const historyData = levelFilteredData.filter(item => {
//         if (!filterDate) return true; 
        
//         const date = new Date(item.created_at);
//         const year = date.getFullYear();
//         const month = String(date.getMonth() + 1).padStart(2, '0');
//         const day = String(date.getDate()).padStart(2, '0');
//         const itemDate = `${year}-${month}-${day}`; // จะได้ YYYY-MM-DD
        
//         return itemDate === filterDate;
//     });

//     return {
//       display: displayResult || fallbackResult, // ใช้ fallback ถ้าไม่มีข้อมูล
//       trend: trend,
//       history: historyData, 
//       rawHistory: modeBaseData, // ส่งข้อมูลดิบ (มีทุก Level) ให้กราฟ
//       count: levelFilteredData.length
//     };
//   };

//   const formatDateTimeCard = (isoString: string) => {
//     if (!isoString) return '-';
//     const date = new Date(isoString);
//     if (isNaN(date.getTime())) return '-';
//     return date.toLocaleDateString('th-TH', {
//       day: 'numeric', month: 'short',
//       hour: '2-digit', minute: '2-digit'
//     }) + ' น.';
//   };

//   const formatDateFull = (isoString: string) => {
//     if (!isoString) return '-';
//     return new Date(isoString).toLocaleDateString('th-TH', {
//       year: '2-digit', month: 'short', day: 'numeric',
//       hour: '2-digit', minute: '2-digit'
//     });
//   };

//   const TrendIndicator = ({ value, type, compact = false }: { value: number, type: 'score' | 'time', compact?: boolean }) => {
//     if (value === 0) return <span className="text-gray-300 ml-1">-</span>;
//     const isGood = type === 'score' ? value > 0 : value < 0; 
//     const colorClass = isGood ? "text-green-600" : "text-red-500";
//     const bgClass = isGood ? "bg-green-100" : "bg-red-100";
//     const Icon = (type === 'score' && value > 0) || (type === 'time' && value > 0) ? ArrowUp : ArrowDown;
//     const displayValue = type === 'time' ? `${Math.abs(value).toFixed(2)}s` : Math.abs(value);

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
//     <main className="container mx-auto px-4 py-10 min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex flex-col justify-between">
//       <SEO title="สถิติส่วนตัว" description="ดูพัฒนาการและสถิติการฝึกฝนของคุณ" />

//       <div className="mx-auto max-w-5xl space-y-8 flex-1 w-full">
//         {/* Header Section */}
//         <div className="flex flex-col gap-4">
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
//                 <p className="text-lg text-muted-foreground">ติดตามผลคะแนนและเวลาเฉลี่ยของคุณ</p>
//             </div>
//         </div>

//         {/* Filter Section */}
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

//              // ถ้าไม่มีข้อมูลเลยแม้แต่ใน Raw Data (ยังไม่เคยเล่นโหมดนี้เลย)
//              if (!stats) return (
//                 <Card key={modeKey} className="math-card shadow-sm opacity-60">
//                     <CardHeader className={`${config.bg} rounded-t-lg border-b border-gray-100`}>
//                         <CardTitle className={`flex items-center justify-between ${config.color}`}>
//                             <div className="flex items-center gap-2">
//                                 <span className="text-3xl font-bold">{config.icon}</span>
//                                 <span>{config.label}</span>
//                             </div>
//                         </CardTitle>
//                     </CardHeader>
//                     <CardContent className="py-8 text-center text-gray-400 text-sm">
//                         ยังไม่มีประวัติการฝึก
//                     </CardContent>
//                 </Card>
//              );

//              return (
//                <Card key={modeKey} className="math-card shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
//                  <CardHeader className={`${config.bg} rounded-t-lg border-b border-gray-100`}>
//                    <CardTitle className={`flex items-center justify-between ${config.color}`}>
//                      <div className="flex items-center gap-2">
//                         <span className="text-3xl font-bold">{config.icon}</span>
//                         <span>{config.label}</span>
//                      </div>
//                      {filterType === 'best' && <Trophy className="w-5 h-5 text-yellow-500" />}
//                      {filterType === 'latest' && <History className="w-5 h-5 text-blue-500" />}
//                    </CardTitle>
//                  </CardHeader>

//                  <CardContent className="pt-6 flex-grow flex flex-col justify-center text-center space-y-4">
//                      {/* ✅ ตรวจสอบว่า id ไม่ใช่ 'empty' ถึงจะแสดงผลข้อมูล ถ้าเป็น empty ให้โชว์หน้าค้นหา */}
//                      {stats && stats.display.id !== 'empty' ? (
//                          <>
//                             <div className="space-y-2">
//                                 <div className="text-xs font-medium text-gray-400 uppercase tracking-wider flex items-center justify-center gap-2">
//                                     {filterType === 'best' ? 'คะแนนสูงสุด' : 'คะแนนล่าสุด'}
//                                 </div>
//                                 <div className="flex items-center justify-center gap-3">
//                                     <div className="text-5xl font-bold text-gray-800">
//                                         {stats.display.score}
//                                         <span className="text-lg text-gray-300 ml-1">/ {stats.display.total_questions}</span>
//                                     </div>
//                                     {filterType === 'latest' && stats.trend && (
//                                         <div className="flex flex-col items-start animate-fade-in">
//                                             <TrendIndicator value={stats.trend.scoreDiff} type="score" />
//                                         </div>
//                                     )}
//                                 </div>
//                                 {stats.display.status === 'incomplete' && (
//                                     <div className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 border border-yellow-200">
//                                         <AlertTriangle className="w-3 h-3 mr-1" /> ทำไม่จบ
//                                     </div>
//                                 )}
//                             </div>

//                             <div className="grid grid-cols-2 gap-3 text-sm mt-2">
//                                 <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center justify-center">
//                                     <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
//                                         <Timer className="w-3 h-3" /> เวลาเฉลี่ย/ข้อ
//                                     </div>
//                                     <div className="font-bold text-gray-700 flex items-center gap-2">
//                                         {stats.display.avg_time_ms ? (stats.display.avg_time_ms / 1000).toFixed(2) : '0.00'}s
//                                         {filterType === 'latest' && stats.trend && (
//                                             <TrendIndicator value={stats.trend.timeDiff} type="time" compact={true} />
//                                         )}
//                                     </div>
//                                 </div>
//                                 <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center justify-center">
//                                     <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
//                                         <Calendar className="w-3 h-3" /> วันที่
//                                     </div>
//                                     <div className="font-bold text-gray-700 text-sm">
//                                         {formatDateTimeCard(stats.display.created_at)}
//                                     </div>
//                                 </div>
//                             </div>
//                          </>
//                      ) : (
//                          <div className="py-8 text-gray-400 flex flex-col items-center gap-2">
//                             <Search className="w-10 h-10 opacity-20" />
//                             <p className="text-sm">ไม่พบข้อมูลในระดับนี้</p>
//                             <Button variant="link" onClick={() => navigate('/')} className="text-blue-500 text-xs">กลับหน้าหลักเพื่อเริ่มฝึก</Button>
//                          </div>
//                      )}
//                  </CardContent>
                 
//                  {/* ✅ ซ่อนปุ่มดูประวัติ ถ้าไม่มีข้อมูลจริง */}
//                  {stats && stats.display.id !== 'empty' && (
//                      <div className="p-4 border-t bg-gray-50/50">
//                         <Dialog>
//                             <DialogTrigger asChild>
//                                 <Button variant="outline" className="w-full gap-2 text-sm h-9" onClick={() => setActiveTab('table')}>
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
                                
//                                 <div className="flex flex-col gap-2 my-2">
//                                     <div className="flex justify-center">
//                                         <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
//                                             <button 
//                                                 onClick={() => setActiveTab('table')}
//                                                 className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
//                                             >
//                                                 <List className="w-4 h-4" /> รายการประวัติ
//                                             </button>
//                                             <button 
//                                                 onClick={() => setActiveTab('chart')}
//                                                 className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'chart' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
//                                             >
//                                                 <BarChart3 className="w-4 h-4" /> กราฟพัฒนาการ
//                                             </button>
//                                         </div>
//                                     </div>

//                                     {activeTab === 'table' && (
//                                         <div className="flex items-center justify-end gap-2 bg-white px-2 py-1">
//                                             <span className="text-xs text-gray-500 font-medium">ดูเฉพาะวันที่:</span>
//                                             <div className="relative">
//                                                 <input 
//                                                     type="date" 
//                                                     value={filterDate}
//                                                     onChange={(e) => setFilterDate(e.target.value)}
//                                                     className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 w-[140px]"
//                                                 />
//                                             </div>
//                                             {filterDate && (
//                                                 <button 
//                                                     onClick={() => setFilterDate("")}
//                                                     className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full transition-colors"
//                                                     title="ล้างตัวกรอง"
//                                                 >
//                                                     <XCircle className="w-4 h-4" />
//                                                 </button>
//                                             )}
//                                         </div>
//                                     )}
//                                 </div>

//                                 <div className="flex-1 min-h-0 flex flex-col">
//                                     {activeTab === 'table' && (
//                                         <div className="flex-1 border rounded-md overflow-hidden relative animate-fade-in flex flex-col">
//                                             <div className="overflow-hidden flex flex-col h-full">
//                                                 <div className="bg-gray-50 border-b">
//                                                     <Table>
//                                                         <TableHeader>
//                                                             <TableRow>
//                                                                 <TableHead>วันที่</TableHead>
//                                                                 <TableHead>สถานะ</TableHead> 
//                                                                 <TableHead>ระดับ</TableHead>
//                                                                 <TableHead className="text-right">คะแนน</TableHead>
//                                                                 <TableHead className="text-right">เวลา/ข้อ</TableHead>
//                                                             </TableRow>
//                                                         </TableHeader>
//                                                     </Table>
//                                                 </div>
                                                
//                                                 <div className="overflow-y-auto custom-scrollbar flex-1">
//                                                     {stats.history.length > 0 ? (
//                                                         <Table>
//                                                             <TableBody>
//                                                                 {stats.history.map((row, index) => {
//                                                                     const prevRow = stats.history[index + 1];
//                                                                     let scoreDiff = 0;
//                                                                     let timeDiff = 0;
//                                                                     const currentAvgTimeSec = row.avg_time_ms / 1000;

//                                                                     if (prevRow) {
//                                                                         const prevAvgTimeSec = prevRow.avg_time_ms / 1000;
//                                                                         scoreDiff = row.score - prevRow.score;
//                                                                         timeDiff = currentAvgTimeSec - prevAvgTimeSec; 
//                                                                     }
//                                                                     return (
//                                                                         <TableRow key={row.id} className={row.status === 'incomplete' ? 'bg-yellow-50/50' : ''}>
//                                                                             <TableCell className="text-gray-600 text-xs sm:text-sm">
//                                                                                 {formatDateFull(row.created_at)}
//                                                                             </TableCell>
//                                                                             <TableCell>
//                                                                                 {row.status === 'incomplete' ? (
//                                                                                     <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-yellow-100 text-yellow-700 border border-yellow-200">
//                                                                                         <AlertTriangle className="w-3 h-3 mr-1" /> ไม่จบ
//                                                                                     </span>
//                                                                                 ) : (
//                                                                                     <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
//                                                                                         <CheckCircle2 className="w-3 h-3 mr-1" /> จบ
//                                                                                     </span>
//                                                                                 )}
//                                                                             </TableCell>
//                                                                             <TableCell>
//                                                                                 <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase
//                                                                                     ${row.level === 'hard' ? 'bg-red-50 text-red-600 border-red-200' : 
//                                                                                     row.level === 'medium' ? 'bg-yellow-50 text-yellow-600 border-yellow-200' : 
//                                                                                     'bg-green-50 text-green-600 border-green-200'}`}>
//                                                                                     {row.level}
//                                                                                 </span>
//                                                                             </TableCell>
//                                                                             <TableCell className="text-right">
//                                                                                 <div className="flex items-center justify-end">
//                                                                                     <span className="font-bold text-lg">{row.score}</span>
//                                                                                     <span className="text-xs text-gray-400 mx-1">/ {row.total_questions}</span>
//                                                                                     {prevRow && <TrendIndicator value={scoreDiff} type="score" compact={true} />}
//                                                                                 </div>
//                                                                             </TableCell>
//                                                                             <TableCell className="text-right">
//                                                                                 <div className="flex items-center justify-end">
//                                                                                     <span className="text-gray-500">{currentAvgTimeSec.toFixed(2)}s</span>
//                                                                                     {prevRow && <TrendIndicator value={timeDiff} type="time" compact={true} />}
//                                                                                 </div>
//                                                                             </TableCell>
//                                                                         </TableRow>
//                                                                     );
//                                                                 })}
//                                                             </TableBody>
//                                                         </Table>
//                                                     ) : (
//                                                         <div className="flex flex-col items-center justify-center h-40 text-gray-400">
//                                                             <Filter className="w-8 h-8 opacity-20 mb-2" />
//                                                             <p className="text-sm">ไม่พบข้อมูลในวันที่เลือก</p>
//                                                         </div>
//                                                     )}
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     )}

//                                     {activeTab === 'chart' && (
//                                         <div className="flex items-center justify-center h-full animate-fade-in">
//                                             <div className="w-full h-full max-h-[400px]">
//                                                 {/* ส่งข้อมูลดิบ (rawHistory) ให้กราฟไปจัดการต่อ */}
//                                                 <UserProgressionChart rawData={stats.rawHistory} />
//                                             </div>
//                                         </div>
//                                     )}
//                                 </div>
//                             </DialogContent>
//                         </Dialog>
//                      </div>
//                  )}
//                </Card>
//              );
//           })}
//         </div>
//       </div>

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
import { ArrowLeft, Trophy, Calendar, Search, History, Filter, Zap, ArrowUp, ArrowDown, AlertTriangle, CheckCircle2, Timer, BarChart3, List, XCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import UserProgressionChart from '@/pages/UserProgressionChart';

interface PracticeResult {
  id: string;
  created_at: string;
  mode_id: string | null;
  level: string; 
  score: number;
  total_questions: number;
  avg_time_ms: number;
  status: string; 
}

// ✅ แก้ไขส่วนนี้: เพิ่มโหมด "missing" (หาเลขที่หายไป) เข้าไปแล้ว
const MODE_CONFIG: Record<string, { label: string; uuid?: string; icon: string; color: string; bg: string }> = {
  add: { label: "การบวก", uuid: "76ae8bea-cd76-458e-8f16-04e193ce9d7c", icon: "+", color: "text-blue-600", bg: "bg-blue-50" },
  minus: { label: "การลบ", uuid: "01b1721d-027c-4415-9338-c1f0d87c5374", icon: "-", color: "text-red-600", bg: "bg-red-50" },
  multiply: { label: "การคูณ", uuid: "f8c3a72d-77f9-4839-986b-322878d2b8ba", icon: "×", color: "text-purple-600", bg: "bg-purple-50" },
  divide: { label: "การหาร", uuid: "59fb7c37-6857-40fb-bfdb-04f4af194c05", icon: "÷", color: "text-orange-600", bg: "bg-orange-50" },
  // 👇 เพิ่มใหม่ 👇
  missing: { label: "หาเลขที่หายไป", uuid: "a195ecc8-f2eb-4985-ba6d-619d1167d0d6", icon: "?", color: "text-pink-600", bg: "bg-pink-50" },
  // 👆 เพิ่มใหม่ 👆
  mixed: { label: "โหมดผสม", uuid: "mixed", icon: "∞", color: "text-green-600", bg: "bg-green-50" },

  newModeName: { 
     label: "ชื่อโหมดใหม่", 
     uuid: "เลข-uuid-ของโหมดใหม่-ที่เอามาจากฐานข้อมูล", 
     icon: "★", // เลือกไอคอนที่ต้องการ
     color: "text-indigo-600", // เลือกสีตัวหนังสือ
     bg: "bg-indigo-50" // เลือกสีพื้นหลัง
  },

};



const Stats = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const currentYear = new Date().getFullYear(); 
  
  const [results, setResults] = useState<PracticeResult[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(true);

  const [filterLevel, setFilterLevel] = useState<string>("all");
  const [filterType, setFilterType] = useState<string>("latest");
  
  const [activeTab, setActiveTab] = useState<'table' | 'chart'>('table');
  const [filterDate, setFilterDate] = useState<string>("");

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
        setResults((data as unknown as PracticeResult[]) || []);

      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const getStatsByMode = (modeKey: string) => {
    const config = MODE_CONFIG[modeKey];
    
    // 1. Filter ข้อมูลตามโหมด
    const modeBaseData = results.filter(r => {
        const matchUUID = config.uuid && r.mode_id === config.uuid;
        const matchMixed = modeKey === 'mixed' && r.mode_id === null;
        return matchUUID || matchMixed;
    });

    // 2. Filter ตาม Level
    let levelFilteredData = modeBaseData;
    if (filterLevel !== "all") {
        levelFilteredData = levelFilteredData.filter(r => r.level === filterLevel);
    }

    if (levelFilteredData.length === 0 && modeBaseData.length === 0) return null;

    // 3. เตรียมข้อมูล
    const latestRun = levelFilteredData[0];
    const previousRun = levelFilteredData[1]; 

    // คำนวณ Trend
    let trend = null;
    if (latestRun && previousRun) {
        trend = {
            scoreDiff: latestRun.score - previousRun.score,
            timeDiff: (latestRun.avg_time_ms - previousRun.avg_time_ms) / 1000 
        };
    }

    let displayResult: PracticeResult;
    
    if (filterType === "best") {
        const completedGames = levelFilteredData.filter(r => r.status !== 'incomplete');
        const pool = completedGames.length > 0 ? completedGames : levelFilteredData; 

        if (pool.length > 0) {
            displayResult = [...pool].sort((a, b) => {
                if (b.score !== a.score) return b.score - a.score; 
                return a.avg_time_ms - b.avg_time_ms; 
            })[0];
        } else {
            displayResult = latestRun;
        }
    } else {
        displayResult = latestRun; 
    }

    // Fallback
    const fallbackResult: PracticeResult = {
        id: "empty", 
        created_at: "",
        mode_id: null,
        level: filterLevel === "all" ? "easy" : filterLevel,
        score: 0,
        total_questions: 10,
        avg_time_ms: 0,
        status: "incomplete"
    };

    // 4. กรองวันที่สำหรับ Table
    const historyData = levelFilteredData.filter(item => {
        if (!filterDate) return true; 
        
        const date = new Date(item.created_at);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const itemDate = `${year}-${month}-${day}`; 
        
        return itemDate === filterDate;
    });

    return {
      display: displayResult || fallbackResult,
      trend: trend,
      history: historyData, 
      rawHistory: modeBaseData, 
      count: levelFilteredData.length
    };
  };

  const formatDateTimeCard = (isoString: string) => {
    if (!isoString) return '-';
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '-';
    return date.toLocaleDateString('th-TH', {
      day: 'numeric', month: 'short',
      hour: '2-digit', minute: '2-digit'
    }) + ' น.';
  };

  const formatDateFull = (isoString: string) => {
    if (!isoString) return '-';
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
    const Icon = (type === 'score' && value > 0) || (type === 'time' && value > 0) ? ArrowUp : ArrowDown;
    const displayValue = type === 'time' ? `${Math.abs(value).toFixed(2)}s` : Math.abs(value);

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
        {/* Header Section */}
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
                <p className="text-lg text-muted-foreground">ติดตามผลคะแนนและเวลาเฉลี่ยของคุณ</p>
            </div>
        </div>

        {/* Filter Section */}
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

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Object.keys(MODE_CONFIG).map((modeKey) => {
             const config = MODE_CONFIG[modeKey];
             const stats = getStatsByMode(modeKey);

             // ถ้าไม่มีข้อมูลเลยแม้แต่ใน Raw Data
             if (!stats) return (
                <Card key={modeKey} className="math-card shadow-sm opacity-60">
                    <CardHeader className={`${config.bg} rounded-t-lg border-b border-gray-100`}>
                        <CardTitle className={`flex items-center justify-between ${config.color}`}>
                            <div className="flex items-center gap-2">
                                <span className="text-3xl font-bold">{config.icon}</span>
                                <span>{config.label}</span>
                            </div>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="py-8 text-center text-gray-400 text-sm">
                        ยังไม่มีประวัติการฝึก
                    </CardContent>
                </Card>
             );

             return (
               <Card key={modeKey} className="math-card shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                 <CardHeader className={`${config.bg} rounded-t-lg border-b border-gray-100`}>
                   <CardTitle className={`flex items-center justify-between ${config.color}`}>
                     <div className="flex items-center gap-2">
                        <span className="text-3xl font-bold">{config.icon}</span>
                        <span>{config.label}</span>
                     </div>
                     {filterType === 'best' && <Trophy className="w-5 h-5 text-yellow-500" />}
                     {filterType === 'latest' && <History className="w-5 h-5 text-blue-500" />}
                   </CardTitle>
                 </CardHeader>

                 <CardContent className="pt-6 flex-grow flex flex-col justify-center text-center space-y-4">
                     {stats && stats.display.id !== 'empty' ? (
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
                                        <Timer className="w-3 h-3" /> เวลาเฉลี่ย/ข้อ
                                    </div>
                                    <div className="font-bold text-gray-700 flex items-center gap-2">
                                        {stats.display.avg_time_ms ? (stats.display.avg_time_ms / 1000).toFixed(2) : '0.00'}s
                                        {filterType === 'latest' && stats.trend && (
                                            <TrendIndicator value={stats.trend.timeDiff} type="time" compact={true} />
                                        )}
                                    </div>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-lg flex flex-col items-center justify-center">
                                    <div className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> วันที่
                                    </div>
                                    <div className="font-bold text-gray-700 text-sm">
                                        {formatDateTimeCard(stats.display.created_at)}
                                    </div>
                                </div>
                            </div>
                         </>
                     ) : (
                         <div className="py-8 text-gray-400 flex flex-col items-center gap-2">
                            <Search className="w-10 h-10 opacity-20" />
                            <p className="text-sm">ไม่พบข้อมูลในระดับนี้</p>
                            <Button variant="link" onClick={() => navigate('/')} className="text-blue-500 text-xs">กลับหน้าหลักเพื่อเริ่มฝึก</Button>
                         </div>
                     )}
                 </CardContent>
                 
                 {stats && stats.display.id !== 'empty' && (
                     <div className="p-4 border-t bg-gray-50/50">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button variant="outline" className="w-full gap-2 text-sm h-9" onClick={() => setActiveTab('table')}>
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
                                
                                <div className="flex flex-col gap-2 my-2">
                                    <div className="flex justify-center">
                                        <div className="bg-gray-100 p-1 rounded-lg flex gap-1">
                                            <button 
                                                onClick={() => setActiveTab('table')}
                                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'table' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                            >
                                                <List className="w-4 h-4" /> รายการประวัติ
                                            </button>
                                            <button 
                                                onClick={() => setActiveTab('chart')}
                                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'chart' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                                            >
                                                <BarChart3 className="w-4 h-4" /> กราฟพัฒนาการ
                                            </button>
                                        </div>
                                    </div>

                                    {activeTab === 'table' && (
                                        <div className="flex items-center justify-end gap-2 bg-white px-2 py-1">
                                            <span className="text-xs text-gray-500 font-medium">ดูเฉพาะวันที่:</span>
                                            <div className="relative">
                                                <input 
                                                    type="date" 
                                                    value={filterDate}
                                                    onChange={(e) => setFilterDate(e.target.value)}
                                                    className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 w-[140px]"
                                                />
                                            </div>
                                            {filterDate && (
                                                <button 
                                                    onClick={() => setFilterDate("")}
                                                    className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1 rounded-full transition-colors"
                                                    title="ล้างตัวกรอง"
                                                >
                                                    <XCircle className="w-4 h-4" />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1 min-h-0 flex flex-col">
                                    {activeTab === 'table' && (
                                        <div className="flex-1 border rounded-md overflow-hidden relative animate-fade-in flex flex-col">
                                            <div className="overflow-hidden flex flex-col h-full">
                                                <div className="bg-gray-50 border-b">
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
                                                    </Table>
                                                </div>
                                                
                                                <div className="overflow-y-auto custom-scrollbar flex-1">
                                                    {stats.history.length > 0 ? (
                                                        <Table>
                                                            <TableBody>
                                                                {stats.history.map((row, index) => {
                                                                    const prevRow = stats.history[index + 1];
                                                                    let scoreDiff = 0;
                                                                    let timeDiff = 0;
                                                                    const currentAvgTimeSec = row.avg_time_ms / 1000;

                                                                    if (prevRow) {
                                                                        const prevAvgTimeSec = prevRow.avg_time_ms / 1000;
                                                                        scoreDiff = row.score - prevRow.score;
                                                                        timeDiff = currentAvgTimeSec - prevAvgTimeSec; 
                                                                    }
                                                                    return (
                                                                        <TableRow key={row.id} className={row.status === 'incomplete' ? 'bg-yellow-50/50' : ''}>
                                                                            <TableCell className="text-gray-600 text-xs sm:text-sm">
                                                                                {formatDateFull(row.created_at)}
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
                                                                                    <span className="text-gray-500">{currentAvgTimeSec.toFixed(2)}s</span>
                                                                                    {prevRow && <TrendIndicator value={timeDiff} type="time" compact={true} />}
                                                                                </div>
                                                                            </TableCell>
                                                                        </TableRow>
                                                                    );
                                                                })}
                                                            </TableBody>
                                                        </Table>
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center h-40 text-gray-400">
                                                            <Filter className="w-8 h-8 opacity-20 mb-2" />
                                                            <p className="text-sm">ไม่พบข้อมูลในวันที่เลือก</p>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {activeTab === 'chart' && (
                                        <div className="flex items-center justify-center h-full animate-fade-in">
                                            <div className="w-full h-full max-h-[400px]">
                                                {/* ส่งข้อมูลดิบ (rawHistory) ให้กราฟไปจัดการต่อ */}
                                                <UserProgressionChart rawData={stats.rawHistory} />
                                            </div>
                                        </div>
                                    )}
                                </div>
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