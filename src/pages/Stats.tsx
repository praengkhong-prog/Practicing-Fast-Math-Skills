import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { readResults } from "@/lib/math";
import { TrendingUp, Target, Clock, Award } from "lucide-react";

const modes: { key: string; label: string; icon: string }[] = [
  { key: "add", label: "บวก", icon: "➕" },
  { key: "sub", label: "ลบ", icon: "➖" },
  { key: "mul", label: "คูณ", icon: "✖️" },
  { key: "div", label: "หาร", icon: "➗" },
  { key: "mix", label: "ผสม", icon: "🔀" },
];

const difficulties: { key: string; label: string; icon: string }[] = [
  { key: "easy", label: "ง่าย", icon: "🟢" },
  { key: "medium", label: "ปานกลาง", icon: "🟡" },
  { key: "hard", label: "ยาก", icon: "🔴" },
];

const Stats = () => {
  const results = readResults();

  const byMode: Record<string, { best: number; avg: string; count: number } | undefined> = {};
  modes.forEach((m) => {
    const r = results.filter((x) => x.mode === (m.key as any));
    if (r.length) {
      const best = Math.max(...r.map((x) => x.score));
      const avg = (r.reduce((a, b) => a + b.avgTimeMs, 0) / r.length / 1000).toFixed(1);
      byMode[m.key] = { best, avg, count: r.length };
    }
  });

  const byDifficulty: Record<string, { best: number; avg: string; count: number } | undefined> = {};
  difficulties.forEach((d) => {
    const r = results.filter((x) => x.level === d.key);
    if (r.length) {
      const best = Math.max(...r.map((x) => x.score));
      const avg = (r.reduce((a, b) => a + b.avgTimeMs, 0) / r.length / 1000).toFixed(1);
      byDifficulty[d.key] = { best, avg, count: r.length };
    }
  });

  const renderStatsCard = (item: any, stats: any, type: 'mode' | 'difficulty') => (
    <Card key={item.key} className="math-card hover:shadow-math-elevated transition-all duration-300 group">
      <CardHeader className="bg-gradient-subtle rounded-t-lg text-center">
        <CardTitle className="text-xl font-bold math-gradient bg-clip-text text-transparent group-hover:animate-pulse-math flex items-center justify-center gap-2">
          <span>{item.icon}</span>
          {item.label}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 text-center">
        {stats ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Award className="h-5 w-5 text-yellow-500" />
              <div className="text-2xl font-bold text-brand">
                {stats.best} / 10
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Clock className="h-4 w-4 text-blue-500" />
              <div className="text-lg text-brand-2 font-medium">
                {stats.avg} วินาที
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Target className="h-4 w-4 text-green-500" />
              <div className="text-sm text-muted-foreground">
                เปอร์เซ็นต์: {Math.round((stats.best / 10) * 100)}%
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <TrendingUp className="h-4 w-4 text-purple-500" />
              <div className="text-sm text-muted-foreground">
                จำนวนครั้ง: {stats.count}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-muted-foreground py-4">
            <div className="text-4xl mb-2">🎯</div>
            <div>ยังไม่มีข้อมูล</div>
            <div className="text-sm">ลองเริ่มฝึก{type === 'mode' ? 'โหมด' : 'ระดับ'}นี้ดูเลย!</div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <main className="container mx-auto px-4 py-10">
      <SEO title="สถิติการฝึก — Brainy Math Boost" description="ดูคะแนนสูงสุดและเวลาเฉลี่ยในแต่ละโหมดและระดับความยาก" canonical="/stats" />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          สถิติส่วนตัว
        </h1>
        <p className="text-muted-foreground mt-2">
          ดูผลการฝึกของคุณแยกตามโหมดและระดับความยาก
        </p>
      </div>

      <Tabs defaultValue="modes" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="modes" className="flex items-center gap-2">
            <span>🎯</span>
            โหมดการฝึก
          </TabsTrigger>
          <TabsTrigger value="difficulties" className="flex items-center gap-2">
            <span>📊</span>
            ระดับความยาก
          </TabsTrigger>
        </TabsList>

        <TabsContent value="modes" className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {modes.map((m) => renderStatsCard(m, byMode[m.key], 'mode'))}
          </div>
        </TabsContent>

        <TabsContent value="difficulties" className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
            {difficulties.map((d) => renderStatsCard(d, byDifficulty[d.key], 'difficulty'))}
          </div>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default Stats;
