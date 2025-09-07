import SEO from "@/components/SEO";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { readResults } from "@/lib/math";

const modes: { key: string; label: string }[] = [
  { key: "add", label: "บวก" },
  { key: "sub", label: "ลบ" },
  { key: "mul", label: "คูณ" },
  { key: "div", label: "หาร" },
  { key: "mix", label: "ผสม" },
];

const Stats = () => {
  const results = readResults();

  const byMode: Record<string, { best: number; avg: string } | undefined> = {};
  modes.forEach((m) => {
    const r = results.filter((x) => x.mode === (m.key as any));
    if (r.length) {
      const best = Math.max(...r.map((x) => x.score));
      const avg = (r.reduce((a, b) => a + b.avgTimeMs, 0) / r.length / 1000).toFixed(1);
      byMode[m.key] = { best, avg };
    }
  });

  return (
    <main className="container mx-auto px-4 py-10">
      <SEO title="สถิติการฝึก — Brainy Math Boost" description="ดูคะแนนสูงสุดและเวลาเฉลี่ยในแต่ละโหมด" canonical="/stats" />
      <h1 className="mb-6 text-2xl font-bold">สถิติส่วนตัว</h1>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {modes.map((m) => (
          <Card key={m.key} className="math-card hover:shadow-math-elevated transition-all duration-300 group">
            <CardHeader className="bg-gradient-subtle rounded-t-lg text-center">
              <CardTitle className="text-xl font-bold math-gradient bg-clip-text text-transparent group-hover:animate-pulse-math">
                {m.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 text-center">
              {byMode[m.key] ? (
                <div className="space-y-3">
                  <div className="text-2xl font-bold text-brand">
                    🏆 {byMode[m.key]!.best} / 10
                  </div>
                  <div className="text-lg text-brand-2 font-medium">
                    ⏱️ {byMode[m.key]!.avg} วินาที
                  </div>
                  <div className="text-sm text-muted-foreground">
                    เปอร์เซ็นต์: {Math.round((byMode[m.key]!.best / 10) * 100)}%
                  </div>
                </div>
              ) : (
                <div className="text-muted-foreground py-4">
                  <div className="text-4xl mb-2">🎯</div>
                  <div>ยังไม่มีข้อมูล</div>
                  <div className="text-sm">ลองเริ่มฝึกโหมดนี้ดูเลย!</div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default Stats;
