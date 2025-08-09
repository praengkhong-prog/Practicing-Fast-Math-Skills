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

  const byMode: Record<string, { best: number; avg: number } | undefined> = {};
  modes.forEach((m) => {
    const r = results.filter((x) => x.mode === (m.key as any));
    if (r.length) {
      const best = Math.max(...r.map((x) => x.score));
      const avg = Math.round(r.reduce((a, b) => a + b.avgTimeMs, 0) / r.length);
      byMode[m.key] = { best, avg };
    }
  });

  return (
    <main className="container mx-auto px-4 py-10">
      <SEO title="สถิติการฝึก — Brainy Math Boost" description="ดูคะแนนสูงสุดและเวลาเฉลี่ยในแต่ละโหมด" canonical="/stats" />
      <h1 className="mb-6 text-2xl font-bold">สถิติส่วนตัว</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {modes.map((m) => (
          <Card key={m.key}>
            <CardHeader>
              <CardTitle>{m.label}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              {byMode[m.key] ? (
                <div className="space-y-1">
                  <div>คะแนนสูงสุด: {byMode[m.key]!.best} / 10</div>
                  <div>เวลาเฉลี่ย: {byMode[m.key]!.avg} ms</div>
                </div>
              ) : (
                <div>ยังไม่มีข้อมูล ลองเริ่มฝึกโหมดนี้ดูเลย!</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
};

export default Stats;
