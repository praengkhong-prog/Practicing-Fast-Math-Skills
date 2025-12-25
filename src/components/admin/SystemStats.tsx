// import { useState, useEffect } from 'react';
// import { BarChart3, Activity, ChevronRight, Calendar } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { AdminService } from '@/services/AdminService';
// import { supabase } from '@/supabaseClient';
// import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

// interface SystemStatsData {
//   totalUsers: number;
//   totalAdmins: number;
//   practiceSessionsCount: number;
//   surveySubmissions: number;
//   recentActivity: any[];
//   monthlyUsers: { month: string; users: number }[];
// }

// interface SystemStatsProps {
//   onNavigate?: (tabName: string) => void;
// }

// interface ChartData {
//   name: string;
//   completed: number;
//   incomplete: number;
//   total: number;
//   fullDate?: string;
// }

// export default function SystemStats({ onNavigate }: SystemStatsProps) {
//   const [stats, setStats] = useState<SystemStatsData | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [totalUsage, setTotalUsage] = useState<number>(0);

//   // เพิ่ม filter 'daily_30' สำหรับดูย้อนหลัง 30 วันแบบเลื่อนได้
//   const [filter, setFilter] = useState<'weekly' | 'daily_30' | 'monthly' | 'yearly'>('weekly');
//   const [chartData, setChartData] = useState<ChartData[]>([]);

//   const loadStats = async () => {
//     setLoading(true);
    
//     const result = await AdminService.getSystemStats();
//     if (result.success) setStats(result.data);

//     const { count } = await supabase.from('practice_results').select('*', { count: 'exact', head: true });
//     if (count !== null) setTotalUsage(count);

//     await fetchAndProcessChartData(filter);

//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchAndProcessChartData(filter);
//   }, [filter]);

//   useEffect(() => {
//     loadStats();
//   }, []);

//   const fetchAndProcessChartData = async (selectedFilter: 'weekly' | 'daily_30' | 'monthly' | 'yearly') => {
    
//     // 1. กำหนดวันเริ่มต้น
//     const startDate = new Date();
//     if (selectedFilter === 'weekly') {
//         startDate.setDate(startDate.getDate() - 6); // 7 วัน
//         startDate.setHours(0, 0, 0, 0);
//     } else if (selectedFilter === 'daily_30') {
//         startDate.setDate(startDate.getDate() - 29); // 30 วัน
//         startDate.setHours(0, 0, 0, 0);
//     } else if (selectedFilter === 'monthly') {
//         startDate.setMonth(startDate.getMonth() - 11); // 12 เดือน
//         startDate.setDate(1); 
//         startDate.setHours(0, 0, 0, 0);
//     } else if (selectedFilter === 'yearly') {
//         startDate.setFullYear(2017);
//         startDate.setMonth(0, 1);
//         startDate.setHours(0, 0, 0, 0);
//     }

//     // 2. ดึงข้อมูล
//     const { data, error } = await supabase
//       .from('practice_results')
//       .select('created_at, status')
//       .gte('created_at', startDate.toISOString())
//       .order('created_at', { ascending: true });

//     if (error || !data) return;

//     // 3. เตรียมโครงข้อมูล (Skeleton)
//     const chartSkeleton: ChartData[] = [];
//     const now = new Date();

//     const createItem = (name: string, fullDate: string): ChartData => ({
//         name, fullDate, completed: 0, incomplete: 0, total: 0 
//     });

//     if (selectedFilter === 'weekly') {
//         for (let i = 0; i < 7; i++) {
//             const d = new Date();
//             d.setDate(now.getDate() - (6 - i));
//             // เปลี่ยนจาก ชื่อวัน เป็น วันที่ (เช่น 16 ธ.ค.)
//             chartSkeleton.push(createItem(
//                 d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
//                 d.toDateString()
//             ));
//         }
//     } else if (selectedFilter === 'daily_30') {
//         // Loop 30 วัน
//         for (let i = 0; i < 30; i++) {
//             const d = new Date();
//             d.setDate(now.getDate() - (29 - i));
//             chartSkeleton.push(createItem(
//                 d.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
//                 d.toDateString()
//             ));
//         }
//     } else if (selectedFilter === 'monthly') {
//         for (let i = 0; i < 12; i++) {
//             const d = new Date();
//             d.setMonth(now.getMonth() - (11 - i));
//             chartSkeleton.push(createItem(
//                 d.toLocaleDateString('th-TH', { month: 'short', year: '2-digit' }), // เช่น ธ.ค. 68
//                 `${d.getMonth()}-${d.getFullYear()}`
//             ));
//         }
//     } else if (selectedFilter === 'yearly') {
//         const startYear = 2017;
//         const currentYear = now.getFullYear();
//         for (let y = startYear; y <= currentYear; y++) {
//             chartSkeleton.push(createItem(
//                 `พ.ศ. ${y + 543}`,
//                 y.toString()
//             ));
//         }
//     }

//     // 4. Map ข้อมูลลงกราฟ
//     data.forEach((item) => {
//         const date = new Date(item.created_at);
//         let found: ChartData | undefined;
        
//         if (selectedFilter === 'weekly' || selectedFilter === 'daily_30') {
//             // เช็คด้วยวันที่แบบสั้น (16 ธ.ค.)
//             const dayName = date.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' });
//             found = chartSkeleton.find(x => x.name === dayName);
//         } else if (selectedFilter === 'monthly') {
//             const monthName = date.toLocaleDateString('th-TH', { month: 'short', year: '2-digit' });
//             found = chartSkeleton.find(x => x.name === monthName);
//         } else if (selectedFilter === 'yearly') {
//             const yearName = `พ.ศ. ${date.getFullYear() + 543}`;
//             found = chartSkeleton.find(x => x.name === yearName);
//         }

//         if (found) {
//             if (item.status === 'incomplete') {
//                 found.incomplete++;
//             } else {
//                 found.completed++;
//             }
//             found.total++;
//         }
//     });

//     setChartData(chartSkeleton);
//   };

//   // คำนวณความกว้างของกราฟ เพื่อให้ Scroll ได้
//   const getChartWidth = () => {
//       // ถ้าข้อมูลน้อยกว่า 12 แท่ง ให้เต็มจอ (100%)
//       // ถ้ามากกว่านั้น ให้ขยายความกว้างแท่งละ 60px เพื่อให้ Scroll ได้
//       return chartData.length > 12 ? chartData.length * 60 : '100%';
//   };

//   if (loading && !stats) return <div className="p-10 text-center">Loading stats...</div>;

//   return (
//     <div className="space-y-6">
//       {/* Cards Section */}
//       <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
//         {/* Card: Total Usage */}
//         <Card 
//             className="hover:shadow-lg transition-all border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50 cursor-pointer"
//             onClick={() => onNavigate && onNavigate('practice_history')}
//         >
//           <CardContent className="p-6 relative">
//             <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                 <div className="p-2 bg-blue-100 rounded-full">
//                     <Activity className="h-6 w-6 text-blue-600" />
//                 </div>
//                 <div className="ml-4">
//                     <p className="text-sm font-medium text-muted-foreground">การเข้าใช้งานทั้งหมด</p>
//                     <p className="text-2xl font-bold text-blue-900">{totalUsage}</p>
//                 </div>
//                 </div>
//                 <ChevronRight className="h-5 w-5 text-gray-300" />
//             </div>
//             <p className="text-xs text-blue-600 mt-2 flex items-center">คลิกเพื่อดูประวัติ</p>
//           </CardContent>
//         </Card>

//         {/* Card: Surveys */}
//         <Card 
//             className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-orange-500 bg-gradient-to-br from-white to-orange-50"
//             onClick={() => onNavigate && onNavigate('surveys')}
//         >
//           <CardContent className="p-6 relative">
//             <div className="flex items-center justify-between">
//                 <div className="flex items-center">
//                 <div className="p-2 bg-orange-100 rounded-full">
//                     <BarChart3 className="h-6 w-6 text-orange-600" />
//                 </div>
//                 <div className="ml-4">
//                     <p className="text-sm font-medium text-muted-foreground">ผลสำรวจ</p>
//                     <p className="text-2xl font-bold text-orange-900">{stats?.surveySubmissions || 0}</p>
//                 </div>
//                 </div>
//                 <ChevronRight className="h-5 w-5 text-gray-300" />
//             </div>
//              <p className="text-xs text-orange-600 mt-2 flex items-center">ดูรายละเอียด</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* --- Chart Section (Stacked Bar Chart with Scroll) --- */}
//       <Card>
//         <CardHeader className="flex flex-col sm:flex-row items-center justify-between pb-2 gap-4">
//             <CardTitle className="text-lg font-bold text-gray-700 flex items-center gap-2">
//                 <Calendar className="w-5 h-5" />
//                 สถิติการเข้าใช้งาน (แยกตามสถานะ)
//             </CardTitle>
            
//             {/* Filter Buttons */}
//             <div className="flex bg-gray-100 p-1 rounded-md overflow-x-auto max-w-full">
//                 <button 
//                     onClick={() => setFilter('weekly')}
//                     className={`px-3 py-1 text-sm rounded-md transition-all whitespace-nowrap ${filter === 'weekly' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
//                 >
//                     7 วัน
//                 </button>
//                 <button 
//                     onClick={() => setFilter('daily_30')}
//                     className={`px-3 py-1 text-sm rounded-md transition-all whitespace-nowrap ${filter === 'daily_30' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
//                 >
//                     30 วัน (เลื่อนดู)
//                 </button>
//                 <button 
//                     onClick={() => setFilter('monthly')}
//                     className={`px-3 py-1 text-sm rounded-md transition-all whitespace-nowrap ${filter === 'monthly' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
//                 >
//                     รายเดือน
//                 </button>
//                 <button 
//                     onClick={() => setFilter('yearly')}
//                     className={`px-3 py-1 text-sm rounded-md transition-all whitespace-nowrap ${filter === 'yearly' ? 'bg-white shadow text-blue-600 font-medium' : 'text-gray-500 hover:text-gray-900'}`}
//                 >
//                     รายปี
//                 </button>
//             </div>
//         </CardHeader>
        
//         <CardContent>
//             {/* Wrapper สำหรับ Scrollbar */}
//             <div className="w-full overflow-x-auto pb-4">
//                 {/* กำหนดความกว้างแบบ Dynamic: ถ้าข้อมูลเยอะ ให้กว้างขึ้นเพื่อให้ Scroll ได้ */}
//                 <div style={{ height: 350, width: getChartWidth(), minWidth: '100%' }}>
//                     {chartData.length > 0 ? (
//                         <ResponsiveContainer width="100%" height="100%">
//                             <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
//                                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
//                                 <XAxis 
//                                     dataKey="name" 
//                                     stroke="#888888" 
//                                     fontSize={12} 
//                                     tickLine={false} 
//                                     axisLine={false}
//                                     tickMargin={10}
//                                 />
//                                 <YAxis 
//                                     stroke="#888888" 
//                                     fontSize={12} 
//                                     tickLine={false} 
//                                     axisLine={false} 
//                                     allowDecimals={false}
//                                 />
//                                 <Tooltip 
//                                     cursor={{ fill: '#f3f4f6' }}
//                                     contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
//                                 />
//                                 <Legend verticalAlign="top" height={36}/>
//                                 <Bar 
//                                     dataKey="completed" 
//                                     stackId="a" 
//                                     fill="#22c55e" 
//                                     name="ทำเสร็จ (Completed)" 
//                                     radius={[0, 0, 4, 4]} 
//                                     barSize={30} // ขนาดแท่ง
//                                 />
//                                 <Bar 
//                                     dataKey="incomplete" 
//                                     stackId="a" 
//                                     fill="#eab308" 
//                                     name="ทำไม่เสร็จ (Incomplete)" 
//                                     radius={[4, 4, 0, 0]} 
//                                     barSize={30} // ขนาดแท่ง
//                                 />
//                             </BarChart>
//                         </ResponsiveContainer>
//                     ) : (
//                         <div className="flex items-center justify-center h-full text-gray-400">
//                             ไม่มีข้อมูลในช่วงเวลานี้
//                         </div>
//                     )}
//                 </div>
//             </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


// 




import { useState, useEffect } from 'react';
import { BarChart3, Activity, ChevronRight, Calendar, Loader2, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminService } from '@/services/AdminService';
import { supabase } from '@/integrations/supabase/client'; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const THAI_MONTHS = [
  "ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.",
  "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."
];

// ✅ กำหนดปีเริ่มต้นสำหรับกราฟรายปี (2565 / 2022)
const START_YEAR_FIXED = 2022;

interface SystemStatsData {
  totalUsers: number;
  totalAdmins: number;
  practiceSessionsCount: number;
  surveySubmissions: number;
  recentActivity: any[];
  monthlyUsers: { month: string; users: number }[];
}

interface SystemStatsProps {
  onNavigate?: (tabName: string) => void;
}

interface ChartData {
  key: string;
  name: string;
  completed: number;
  incomplete: number;
  total: number;
  fullDate?: string;
}

export default function SystemStats({ onNavigate }: SystemStatsProps) {
  const [stats, setStats] = useState<SystemStatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [totalUsage, setTotalUsage] = useState<number>(0);

  const [filter, setFilter] = useState<'week' | 'month' | 'year'>('month');
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [chartData, setChartData] = useState<ChartData[]>([]);

  const loadStats = async () => {
    setLoading(true);
    const result = await AdminService.getSystemStats();
    if (result.success) setStats(result.data);

    const { count } = await supabase.from('practice_results').select('*', { count: 'exact', head: true });
    if (count !== null) setTotalUsage(count);

    await fetchAndProcessChartData(filter, currentDate);
    setLoading(false);
  };

  useEffect(() => {
    fetchAndProcessChartData(filter, currentDate);
  }, [filter, currentDate]);

  useEffect(() => {
    loadStats();
  }, []);

  const handleNavigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const value = direction === 'next' ? 1 : -1;

    if (filter === 'week') {
        newDate.setDate(newDate.getDate() + (value * 7));
    } else if (filter === 'month') {
        // ✅ รายเดือน: เลื่อนทีละ 1 ปี (เพราะ 1 หน้าจอโชว์ ม.ค.-ธ.ค. ของปีนั้น)
        newDate.setFullYear(newDate.getFullYear() + value);
    } 
    // ✅ รายปี: ไม่ต้องเลื่อน (เพราะโชว์ 2022-ปัจจุบัน ในหน้าเดียว)
    
    setCurrentDate(newDate);
  };

  const fetchAndProcessChartData = async (selectedFilter: 'week' | 'month' | 'year', refDate: Date) => {
    
    // คำนวณ Start/End Date
    const startDate = new Date(refDate);
    const endDate = new Date(refDate);

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(23, 59, 59, 999);

    if (selectedFilter === 'week') {
        const day = startDate.getDay(); 
        const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); 
        startDate.setDate(diff);
        endDate.setDate(startDate.getDate() + 6);
    } else if (selectedFilter === 'month') {
        // ✅ รายเดือน: เอาข้อมูลตั้งแต่ 1 ม.ค. - 31 ธ.ค. ของปีที่เลือก
        startDate.setMonth(0, 1);     // 1 ม.ค.
        endDate.setMonth(11, 31);     // 31 ธ.ค.
    } else if (selectedFilter === 'year') {
        // ✅ รายปี: เอาข้อมูลตั้งแต่ 1 ม.ค. 2022 ถึง ปัจจุบัน
        startDate.setFullYear(START_YEAR_FIXED, 0, 1); // 1 ม.ค. 2022
        endDate.setFullYear(new Date().getFullYear(), 11, 31); // 31 ธ.ค. ปีปัจจุบัน
    }

    const { data, error } = await supabase
      .from('practice_results')
      .select('*') 
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });

    if (error || !data) return;

    const chartSkeleton: ChartData[] = [];
    
    const getDateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    
    if (selectedFilter === 'week') {
        const loopDate = new Date(startDate);
        while (loopDate <= endDate) {
            chartSkeleton.push({
                key: getDateKey(loopDate),
                name: loopDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
                fullDate: loopDate.toDateString(),
                completed: 0, incomplete: 0, total: 0 
            });
            loopDate.setDate(loopDate.getDate() + 1);
        }
    } else if (selectedFilter === 'month') {
        // ✅ รายเดือน: สร้าง Skeleton 12 เดือน (ม.ค. - ธ.ค.)
        for (let i = 0; i < 12; i++) {
            chartSkeleton.push({
                key: `${i}`, // key คือ index เดือน 0-11
                name: THAI_MONTHS[i], 
                fullDate: `${THAI_MONTHS[i]} ${refDate.getFullYear() + 543}`,
                completed: 0, incomplete: 0, total: 0 
            });
        }
    } else if (selectedFilter === 'year') {
        // ✅ รายปี: สร้าง Skeleton ตามปี พ.ศ. (2565 - ปัจจุบัน)
        const currentYear = new Date().getFullYear();
        for (let y = START_YEAR_FIXED; y <= currentYear; y++) {
             chartSkeleton.push({
                key: `${y}`, // key คือปี ค.ศ.
                name: `ปี ${y + 543}`, // แสดงปี พ.ศ.
                fullDate: `ปี พ.ศ. ${y + 543}`,
                completed: 0, incomplete: 0, total: 0 
            });
        }
    }

    // Map ข้อมูลจริงใส่กราฟ
    (data as any[]).forEach((item) => {
        const itemDate = new Date(item.created_at);
        let itemKey = '';

        if (selectedFilter === 'week') {
            itemKey = getDateKey(itemDate);
        } else if (selectedFilter === 'month') {
            // key คือ index เดือน (0-11)
            itemKey = `${itemDate.getMonth()}`;
        } else if (selectedFilter === 'year') {
            // key คือ ปี ค.ศ.
            itemKey = `${itemDate.getFullYear()}`;
        }

        const found = chartSkeleton.find(x => x.key === itemKey);
        if (found) {
            if (item.status === 'incomplete') {
                found.incomplete++;
            } else {
                found.completed++;
            }
            found.total++;
        }
    });

    setChartData(chartSkeleton);
  };

  const getDateRangeLabel = () => {
    const start = new Date(currentDate);
    const end = new Date(currentDate);

    if (filter === 'week') {
        const day = start.getDay(); 
        const diff = start.getDate() - day + (day === 0 ? -6 : 1);
        start.setDate(diff);
        end.setDate(start.getDate() + 6);
        return `${start.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })} - ${end.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}`;
    } else if (filter === 'month') {
        // ✅ รายเดือน: แสดงปี พ.ศ. ของข้อมูลชุดนั้น
        return `ประจำปี พ.ศ. ${currentDate.getFullYear() + 543}`;
    } else if (filter === 'year') {
        // ✅ รายปี: แสดงช่วงปี 2565 - ปัจจุบัน
        return `ปี พ.ศ. ${START_YEAR_FIXED + 543} - ปัจจุบัน`;
    }
    return '';
  };

  const getChartWidth = () => {
      // ปรับความกว้างกราฟ
      if (filter === 'week') return '100%';
      if (filter === 'month') return Math.max(800, chartData.length * 50); // กว้างพอสมควรสำหรับ 12 เดือน
      if (filter === 'year') return '100%'; // ปีมีไม่กี่แท่ง ให้เต็มจอ
      return '100%';
  };

  if (loading && !stats) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      {/* Cards Section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card 
            className="hover:shadow-lg transition-all border-l-4 border-l-blue-500 bg-gradient-to-br from-white to-blue-50 cursor-pointer"
            onClick={() => onNavigate && onNavigate('practice_history')}
        >
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full">
                    <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">การเข้าใช้งานทั้งหมด</p>
                    <p className="text-2xl font-bold text-blue-900">{totalUsage}</p>
                </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300" />
            </div>
            <p className="text-xs text-blue-600 mt-2 flex items-center">คลิกเพื่อดูประวัติ</p>
          </CardContent>
        </Card>

        <Card 
            className="hover:shadow-lg transition-all cursor-pointer border-l-4 border-l-orange-500 bg-gradient-to-br from-white to-orange-50"
            onClick={() => onNavigate && onNavigate('surveys')}
        >
          <CardContent className="p-6 relative">
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-full">
                    <BarChart3 className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                    <p className="text-sm font-medium text-muted-foreground">ผลสำรวจ</p>
                    <p className="text-2xl font-bold text-orange-900">{stats?.surveySubmissions || 0}</p>
                </div>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-300" />
            </div>
             <p className="text-xs text-orange-600 mt-2 flex items-center">ดูรายละเอียด</p>
          </CardContent>
        </Card>
      </div>

      {/* --- Chart Section --- */}
      <Card>
        <CardHeader className="flex flex-col md:flex-row items-center justify-between pb-2 gap-4">
            <div className="flex flex-col gap-1 w-full md:w-auto">
                <CardTitle className="text-lg font-bold text-gray-700 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    สถิติการเข้าใช้งาน
                </CardTitle>
                <p className="text-sm text-gray-500 hidden md:block">แสดงจำนวนการเล่นเกม สำเร็จ vs ไม่สำเร็จ</p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                
                {/* Date Navigator */}
                <div className="flex items-center bg-white border rounded-md shadow-sm">
                    {/* ซ่อนปุ่มลูกศร ถ้าเป็นโหมดรายปี (เพราะโชว์หมดแล้ว) */}
                    {filter !== 'year' && (
                        <button 
                            onClick={() => handleNavigateDate('prev')}
                            className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-l-md"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                    )}
                    
                    <span className="px-3 text-sm font-semibold text-gray-700 min-w-[180px] text-center select-none">
                        {getDateRangeLabel()}
                    </span>

                    {filter !== 'year' && (
                        <button 
                            onClick={() => handleNavigateDate('next')}
                            className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-r-md"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    )}
                </div>

                {/* Filter Buttons */}
                <div className="flex bg-gray-100 p-1 rounded-md">
                    <button 
                        onClick={() => setFilter('week')}
                        className={`px-3 py-1.5 text-sm rounded-md transition-all font-medium ${filter === 'week' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        รายสัปดาห์
                    </button>
                    <button 
                        onClick={() => setFilter('month')}
                        className={`px-3 py-1.5 text-sm rounded-md transition-all font-medium ${filter === 'month' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        รายเดือน
                    </button>
                    <button 
                        onClick={() => setFilter('year')}
                        className={`px-3 py-1.5 text-sm rounded-md transition-all font-medium ${filter === 'year' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-900'}`}
                    >
                        รายปี
                    </button>
                </div>
            </div>
        </CardHeader>
        
        <CardContent>
            <div className="w-full overflow-x-auto pb-4">
                <div style={{ height: 350, width: getChartWidth(), minWidth: '100%' }}>
                    {chartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                <XAxis 
                                    dataKey="name" 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false}
                                    tickMargin={10}
                                    interval={0}
                                />
                                <YAxis 
                                    stroke="#888888" 
                                    fontSize={12} 
                                    tickLine={false} 
                                    axisLine={false} 
                                    allowDecimals={false}
                                />
                                <Tooltip 
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    labelStyle={{ fontWeight: 'bold', color: '#374151' }}
                                />
                                <Legend verticalAlign="top" height={36}/>
                                <Bar 
                                    dataKey="completed" 
                                    stackId="a" 
                                    fill="#22c55e" 
                                    name="ทำเสร็จ (Completed)" 
                                    radius={[0, 0, 4, 4]} 
                                    barSize={filter === 'week' ? 40 : 20} 
                                />
                                <Bar 
                                    dataKey="incomplete" 
                                    stackId="a" 
                                    fill="#eab308" 
                                    name="ทำไม่เสร็จ (Incomplete)" 
                                    radius={[0, 0, 0, 0]} 
                                    barSize={filter === 'week' ? 40 : 20} 
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex items-center justify-center h-full text-gray-400 bg-gray-50 rounded-lg border border-dashed">
                            ไม่มีข้อมูลในช่วงเวลานี้
                        </div>
                    )}
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}