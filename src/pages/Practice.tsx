import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { generateProblem, Mode, Level, saveResult } from "@/lib/math";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { PracticeService } from "@/services/PracticeService";
import { routes } from "@/routes/web";
import { config } from "@/config/app";

const Practice = () => {
  const [params] = useSearchParams();
  const mode = (params.get("mode") as Mode) || "mix";
  const level = (params.get("level") as Level) || "easy";
  const showTipsParam = params.get("showTips") === "true";

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
const [times, setTimes] = useState<number[]>([]);
const [answered, setAnswered] = useState<number | null>(null);
const [showTipBefore, setShowTipBefore] = useState(showTipsParam);
const startRef = useRef<number>(performance.now());

  const problem = useMemo(() => generateProblem(mode, level), [index, mode, level]);

  useEffect(() => {
    startRef.current = performance.now();
  }, [index]);

  const total = 10;
  const progress = Math.round(((index) / total) * 100);

  const onAnswer = (value: number) => {
    if (answered !== null) return;
    const elapsed = performance.now() - startRef.current;
    setTimes((t) => [...t, elapsed]);
    setAnswered(value);
    const correct = value === problem.correct;
    if (correct) setScore((s) => s + 1);
    toast({
      title: correct ? "ถูกต้อง!" : "ยังไม่ถูก",
      description: correct ? "เยี่ยมมาก!" : `คำตอบที่ถูกคือ ${problem.correct}`,
    });
  };

  const next = () => {
    if (index + 1 >= total) {
      const avg = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
      saveResult({ mode, level, score, avgTimeMs: avg, date: new Date().toISOString() });
      toast({ title: "บันทึกผลแล้ว", description: "ดูสถิติของคุณได้ในหน้า สถิติ" });
    }
    setAnswered(null);
    setIndex((i) => i + 1);
  };

  const avgSeconds = times.length ? (times.reduce((a, b) => a + b, 0) / times.length / 1000).toFixed(1) : "0.0";

  return (
    <main className="container mx-auto px-4 py-10">
      <SEO
        title={`ฝึกคิดเลขเร็ว (${mode.toUpperCase()}) — Brainy Math Boost`}
        description="โหมดฝึกคิดเลขเร็ว จับเวลาให้คะแนน พร้อมเทคนิคเฉลย"
        canonical="/practice"
      />
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">ฝึกโหมด: {mode.toUpperCase()} • ระดับ: {level}</h1>
          <p className="text-sm text-muted-foreground">ข้อที่ {Math.min(index + 1, total)}/{total} • คะแนน {score}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm text-brand-2 font-medium">⏱️ เวลาเฉลี่ย {avgSeconds} วินาที</div>
          <div className="flex items-center gap-2">
            <Switch id="show-tip" checked={showTipBefore} onCheckedChange={setShowTipBefore} />
            <Label htmlFor="show-tip" className="text-sm text-muted-foreground">แสดงเทคนิคก่อนทำ</Label>
          </div>
        </div>
      </div>

      {index < total ? (
        <Card className="math-card shadow-math-elevated hover:shadow-math-glow transition-all duration-300">
          <CardHeader className="bg-gradient-subtle rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-center math-gradient bg-clip-text text-transparent">
              {problem.question}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
            {problem.options.map((opt) => {
              const isSel = answered === opt;
              const isCorrect = opt === problem.correct;
              const variant = isSel ? (isCorrect ? "hero" : "destructive") : "secondary";
              return (
                <Button
                  key={opt}
                  variant={variant as any}
                  className="h-16 text-xl font-bold hover:scale-105 transition-transform number-display"
                  onClick={() => onAnswer(opt)}
                >
                  {opt}
                </Button>
              );
            })}
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            {showTipBefore && (
              <p className="text-sm text-muted-foreground">เทคนิค: {problem.tip}</p>
            )}
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => window.location.reload()}>สุ่มข้อใหม่</Button>
              <Button onClick={next}>{index + 1 >= total ? "สรุปผล" : "ถัดไป"}</Button>
            </div>
          </CardFooter>
        </Card>
      ) : (
        <Card className="math-card shadow-math-glow">
          <CardHeader className="bg-gradient-primary text-center rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-white">🎉 สรุปผลการฝึก</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 text-center">
            <div className="text-3xl font-bold math-gradient bg-clip-text text-transparent">
              คะแนนรวม: {score} / {total}
            </div>
            <div className="text-xl text-brand-2 font-medium">⏱️ เวลาเฉลี่ยต่อข้อ: {avgSeconds} วินาที</div>
            <div className="text-lg text-muted-foreground">
              เปอร์เซ็นต์: {Math.round((score / total) * 100)}%
            </div>
          </CardContent>
          <CardFooter className="flex gap-2">
            <Link to={routes.stats}><Button variant="hero">ดูสถิติ</Button></Link>
            <Link to={routes.home}><Button variant="secondary">เลือกโหมดใหม่</Button></Link>
          </CardFooter>
        </Card>
      )}
    </main>
  );
};

export default Practice;
