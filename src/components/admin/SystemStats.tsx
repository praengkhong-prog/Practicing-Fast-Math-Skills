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


import { useState, useEffect } from 'react';
import { BarChart3, Activity, ChevronRight, Calendar, Loader2, ChevronLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminService } from '@/services/AdminService';
import { supabase } from '@/integrations/supabase/client'; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

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

  // 1. Filter: รายสัปดาห์ (week), รายเดือน (month), รายปี (year)
  const [filter, setFilter] = useState<'week' | 'month' | 'year'>('month');
  
  // 2. Reference Date: วันที่ปัจจุบันที่กำลังดูอยู่
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

  // ฟังก์ชันเปลี่ยนช่วงเวลา (Previous / Next)
  const handleNavigateDate = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    const value = direction === 'next' ? 1 : -1;

    if (filter === 'week') {
        newDate.setDate(newDate.getDate() + (value * 7));
    } else if (filter === 'month') {
        newDate.setMonth(newDate.getMonth() + value);
    } else if (filter === 'year') {
        newDate.setFullYear(newDate.getFullYear() + value);
    }
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
        const diff = startDate.getDate() - day + (day === 0 ? -6 : 1); // เริ่มวันจันทร์
        startDate.setDate(diff);
        endDate.setDate(startDate.getDate() + 6);
    } else if (selectedFilter === 'month') {
        startDate.setDate(1);
        endDate.setMonth(endDate.getMonth() + 1);
        endDate.setDate(0); 
    } else if (selectedFilter === 'year') {
        startDate.setMonth(0, 1);
        endDate.setMonth(11, 31);
    }

    // 3. ดึงข้อมูลจาก Supabase
    // ✅ แก้ไข: เปลี่ยน .select('created_at, status') เป็น .select('*') เพื่อแก้ Error Type
    const { data, error } = await supabase
      .from('practice_results')
      .select('*') 
      .gte('created_at', startDate.toISOString())
      .lte('created_at', endDate.toISOString())
      .order('created_at', { ascending: true });

    if (error || !data) return;

    // 4. สร้าง Skeleton
    const chartSkeleton: ChartData[] = [];
    const loopDate = new Date(startDate);

    const getDateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const getMonthKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;

    if (selectedFilter === 'week' || selectedFilter === 'month') {
        while (loopDate <= endDate) {
            chartSkeleton.push({
                key: getDateKey(loopDate),
                name: loopDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
                fullDate: loopDate.toDateString(),
                completed: 0, incomplete: 0, total: 0 
            });
            loopDate.setDate(loopDate.getDate() + 1);
        }
    } else if (selectedFilter === 'year') {
        for (let i = 0; i < 12; i++) {
            const d = new Date(startDate.getFullYear(), i, 1);
            chartSkeleton.push({
                key: getMonthKey(d),
                name: d.toLocaleDateString('th-TH', { month: 'short', year: '2-digit' }),
                fullDate: `${d.getMonth()}-${d.getFullYear()}`,
                completed: 0, incomplete: 0, total: 0 
            });
        }
    }

    // 5. Map ข้อมูลจริงใส่กราฟ
    // ✅ แก้ไข: ใช้ (data as any[]) เพื่อ bypass การเช็ค Type ของ column status
    (data as any[]).forEach((item) => {
        const itemDate = new Date(item.created_at);
        let itemKey = '';

        if (selectedFilter === 'week' || selectedFilter === 'month') {
            itemKey = getDateKey(itemDate);
        } else if (selectedFilter === 'year') {
            itemKey = getMonthKey(itemDate);
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
        return currentDate.toLocaleDateString('th-TH', { month: 'long', year: 'numeric' });
    } else if (filter === 'year') {
        return `ปี พ.ศ. ${currentDate.getFullYear() + 543}`;
    }
    return '';
  };

  const getChartWidth = () => {
      if (filter === 'month') {
          // ขยายความกว้างขั้นต่ำเป็น 1200px หรือคำนวณจากจำนวนวัน x 70px (เดิม 40)
          return Math.max(1500, chartData.length * 90); 
      }
      if (filter === 'year') {
          // ขยายหน่อยเผื่อหน้าจอเล็ก
          return Math.max(800, chartData.length * 50);
      }
      return '100%';
  };

  if (loading && !stats) return <div className="flex justify-center p-10"><Loader2 className="animate-spin text-primary" /></div>;

  return (
    <div className="space-y-6">
      {/* Cards Section */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Card: Total Usage */}
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

        {/* Card: Surveys */}
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
            
            {/* Controls Container */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                
                {/* 1. ปุ่มเลื่อนวันที่ (Prev/Next) */}
                <div className="flex items-center bg-white border rounded-md shadow-sm">
                    <button 
                        onClick={() => handleNavigateDate('prev')}
                        className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-l-md"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <span className="px-3 text-sm font-semibold text-gray-700 min-w-[160px] text-center select-none">
                        {getDateRangeLabel()}
                    </span>
                    <button 
                        onClick={() => handleNavigateDate('next')}
                        className="p-1.5 hover:bg-gray-100 text-gray-600 rounded-r-md"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>

                {/* 2. Filter Buttons */}
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
            {/* Wrapper สำหรับ Scrollbar */}
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
                                    barSize={filter === 'month' ? 20 : 40} 
                                />
                                <Bar 
                                    dataKey="incomplete" 
                                    stackId="a" 
                                    fill="#eab308" 
                                    name="ทำไม่เสร็จ (Incomplete)" 
                                    radius={[0, 0, 0, 0]} 
                                    barSize={filter === 'month' ? 20 : 40} 
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