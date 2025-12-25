import { useState, useMemo, useRef } from 'react';
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  TooltipProps
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, Calendar, ChevronLeft, ChevronRight, BarChart3, Clock, CalendarClock } from "lucide-react";

interface PracticeResult {
  id: string;
  created_at: string;
  score: number;
  total_questions: number;
  avg_time_ms: number;
  status?: string; 
  level: string; 
}

interface ChartProps {
  rawData: PracticeResult[];
}

interface CustomTooltipProps extends TooltipProps<number, string> {
    viewMode: 'trend' | 'daily';
}

const CustomTooltip = ({ active, payload, viewMode }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload as any;
        return (
            <div className="bg-white p-3 border border-gray-200 shadow-xl rounded-lg text-sm z-50 min-w-[180px]">
                <div className="border-b pb-2 mb-2">
                    <p className="font-bold text-gray-800">{data.fullDate}</p>
                    {viewMode === 'trend' ? (
                        <p className="text-xs text-gray-500 mt-1">
                            ฝึกฝนทั้งหมด <span className="text-blue-600 font-bold">{data.count}</span> ครั้ง
                        </p>
                    ) : (
                        <p className="text-xs text-gray-500 mt-1">
                            เวลา: {data.label} น.
                        </p>
                    )}
                    {data.status === 'incomplete' && (
                        <span className="inline-block mt-1 text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded font-bold">
                            ⚠️ ทำไม่จบ
                        </span>
                    )}
                </div>
                <div className="space-y-1">
                    <p className="text-blue-600 font-semibold flex justify-between gap-4">
                        <span>{viewMode === 'trend' ? 'คะแนนเฉลี่ย:' : 'คะแนน:'}</span>
                        <span>{data.score}</span>
                    </p>
                    <p className="text-orange-500 font-semibold flex justify-between gap-4">
                        <span>{viewMode === 'trend' ? 'เวลาเฉลี่ย:' : 'เวลา:'}</span>
                        <span>{data.time} วินาที</span>
                    </p>
                </div>
            </div>
        );
    }
    return null;
};

const UserProgressionChart = ({ rawData }: ChartProps) => {
  // ✅ Logic: ถ้ามีข้อมูล ให้เลือก Level ของเกมล่าสุดเป็นค่าเริ่มต้น
  const [filterLevel, setFilterLevel] = useState<string>(() => {
      if (rawData && rawData.length > 0) {
          return rawData[0].level;
      }
      return 'easy';
  });

  const [viewMode, setViewMode] = useState<'trend' | 'daily'>('trend'); 
  const [dateRange, setDateRange] = useState<number>(7); 
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handlePrevDay = () => {
    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };

  const handleNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const isToday = useMemo(() => {
    return selectedDate.toDateString() === new Date().toDateString();
  }, [selectedDate]);

  const chartData = useMemo(() => {
    if (!rawData || rawData.length === 0) return [];

    const levelData = rawData.filter(item => item.level === filterLevel);

    if (viewMode === 'trend') {
        const now = new Date();
        const cutoffDate = new Date();
        cutoffDate.setDate(now.getDate() - dateRange);

        const filtered = levelData.filter(item => {
            const itemDate = new Date(item.created_at);
            const matchDate = dateRange === 0 ? true : itemDate >= cutoffDate;
            return matchDate && item.status !== 'incomplete';
        });

        const groupedMap = new Map<string, { totalScore: number; totalTime: number; count: number; dateObj: Date }>();

        filtered.forEach(item => {
            const dateObj = new Date(item.created_at);
            const dateKey = dateObj.toLocaleDateString('en-CA');
            if (!groupedMap.has(dateKey)) {
                groupedMap.set(dateKey, { totalScore: 0, totalTime: 0, count: 0, dateObj });
            }
            const group = groupedMap.get(dateKey)!;
            group.totalScore += item.score;
            group.totalTime += (item.avg_time_ms / 1000);
            group.count += 1;
        });

        return Array.from(groupedMap.values())
            .map(group => ({
                timestamp: group.dateObj.getTime(),
                label: group.dateObj.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' }),
                fullDate: group.dateObj.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' }),
                score: parseFloat((group.totalScore / group.count).toFixed(2)),
                time: parseFloat((group.totalTime / group.count).toFixed(2)),
                count: group.count,
                type: 'trend' as const
            }))
            .sort((a, b) => a.timestamp - b.timestamp);
    } else {
        const targetDateStr = selectedDate.toDateString();
        const dailyItems = levelData.filter(item => new Date(item.created_at).toDateString() === targetDateStr);

        return dailyItems
            .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
            .map(item => ({
                timestamp: new Date(item.created_at).getTime(),
                label: new Date(item.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }),
                fullDate: new Date(item.created_at).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
                score: item.score,
                time: parseFloat((item.avg_time_ms / 1000).toFixed(2)),
                status: item.status,
                type: 'daily' as const
            }));
    }
  }, [rawData, filterLevel, viewMode, dateRange, selectedDate]);

  return (
    <Card className="border-none shadow-none bg-transparent w-full">
      <CardHeader className="px-0 pt-0 pb-4">
        <div className="flex flex-col gap-4">
            
            <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    {viewMode === 'trend' ? <TrendingUp className="w-5 h-5 text-blue-600" /> : <BarChart3 className="w-5 h-5 text-green-600" />}
                    {viewMode === 'trend' ? 'กราฟแนวโน้ม (Trend)' : 'กราฟรายวัน (Daily)'}
                </CardTitle>

                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setViewMode('trend')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1
                            ${viewMode === 'trend' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <TrendingUp className="w-3 h-3" /> แนวโน้ม
                    </button>
                    <button
                        onClick={() => setViewMode('daily')}
                        className={`px-3 py-1 rounded-md text-xs font-bold transition-all flex items-center gap-1
                            ${viewMode === 'daily' ? 'bg-white text-green-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Clock className="w-3 h-3" /> รายวัน
                    </button>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-center gap-3 bg-white p-2 rounded-lg border border-gray-100 shadow-sm">
                
                <div className="flex items-center gap-1">
                    {['easy', 'medium', 'hard'].map((lvl) => (
                        <button
                            key={lvl}
                            onClick={() => setFilterLevel(lvl)}
                            className={`px-3 py-1 rounded-md text-xs font-bold capitalize transition-all border
                                ${filterLevel === lvl 
                                    ? 'bg-blue-50 text-blue-600 border-blue-200' 
                                    : 'bg-white text-gray-500 border-transparent hover:bg-gray-50'}`}
                        >
                            {lvl}
                        </button>
                    ))}
                </div>

                {viewMode === 'trend' ? (
                    <div className="flex items-center gap-1">
                        {[7, 30, 0].map((days) => (
                            <button
                                key={days}
                                onClick={() => setDateRange(days)}
                                className={`px-3 py-1 rounded-md text-xs font-bold transition-all
                                    ${dateRange === days ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'text-gray-500 hover:bg-gray-50'}`}
                            >
                                {days === 0 ? 'ทั้งหมด' : `${days} วัน`}
                            </button>
                        ))}
                    </div>
                ) : (
                    <div className="flex items-center gap-2">
                        <button onClick={handlePrevDay} className="p-1 hover:bg-gray-100 rounded"><ChevronLeft className="w-4 h-4 text-gray-500" /></button>
                        <div className="relative">
                            <button 
                                onClick={() => dateInputRef.current?.showPicker()} 
                                className="flex items-center gap-2 text-xs font-bold text-gray-700 bg-gray-50 px-3 py-1.5 rounded border border-gray-200"
                            >
                                <Calendar className="w-3 h-3 text-gray-500" />
                                {selectedDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: '2-digit' })}
                            </button>
                            <input 
                                ref={dateInputRef}
                                type="date" 
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={(e) => e.target.value && setSelectedDate(new Date(e.target.value))}
                            />
                        </div>
                        <button onClick={handleNextDay} disabled={isToday} className={`p-1 rounded ${isToday ? 'opacity-30' : 'hover:bg-gray-100'}`}><ChevronRight className="w-4 h-4 text-gray-500" /></button>
                    </div>
                )}
            </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-0">
        <div className="w-full h-[300px] mt-2">
            {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }} barGap={2}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="label" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} dy={10} />
                        <YAxis yAxisId="left" domain={[0, 10]} tick={{ fontSize: 10, fill: '#3b82f6' }} axisLine={false} tickLine={false} label={{ value: viewMode === 'trend' ? 'คะแนนเฉลี่ย' : 'คะแนน', angle: -90, position: 'insideLeft', style: { fill: '#3b82f6', fontSize: 10 } }} />
                        <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 10, fill: '#f97316' }} axisLine={false} tickLine={false} label={{ value: viewMode === 'trend' ? 'เวลาเฉลี่ย (s)' : 'เวลา (s)', angle: 90, position: 'insideRight', style: { fill: '#f97316', fontSize: 10 } }} />
                        <Tooltip content={<CustomTooltip viewMode={viewMode} />} />
                        <Legend wrapperStyle={{ paddingTop: '10px' }} />
                        <Bar yAxisId="left" dataKey="score" name={viewMode === 'trend' ? "คะแนนเฉลี่ย" : "คะแนน"} fill="#3b82f6" barSize={viewMode === 'trend' ? 30 : 20} radius={[4, 4, 0, 0]} fillOpacity={0.8}>
                             {viewMode === 'daily' && chartData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.status === 'incomplete' ? '#ef4444' : '#3b82f6'} fillOpacity={entry.status === 'incomplete' ? 0.3 : 0.8} />
                             ))}
                        </Bar>
                        <Line yAxisId="right" type="monotone" dataKey="time" name={viewMode === 'trend' ? "เวลาเฉลี่ย (วินาที)" : "เวลา (วินาที)"} stroke="#f97316" strokeWidth={2} dot={{ r: 3, fill: '#f97316', strokeWidth: 2, stroke: '#fff' }} />
                    </ComposedChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-400 bg-gray-50 rounded-lg border border-dashed">
                    <CalendarClock className="w-10 h-10 opacity-20 mb-2" />
                    <p className="text-sm">ไม่มีข้อมูลการเล่น</p>
                    <p className="text-xs">{viewMode === 'daily' ? 'ในวันที่เลือก' : 'ในช่วงเวลานี้'}</p>
                </div>
            )}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProgressionChart;