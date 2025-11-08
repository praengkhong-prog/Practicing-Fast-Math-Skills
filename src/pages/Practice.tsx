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
import { useAuth } from "@/contexts/AuthContext";

const Practice = () => {
  const { user } = useAuth();
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

  const next = async () => {
    if (index + 1 >= total) {
      const avg = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
      
      if (user) {
        const result = await saveResult(
          { mode, level, score, avgTimeMs: avg, date: new Date().toISOString() },
          user.id
        );
        
        if (result.success) {
          toast({ title: "บันทึกผลแล้ว", description: "ดูสถิติของคุณได้ในหน้า สถิติ" });
        } else {
          toast({ 
            title: "ไม่สามารถบันทึกผลได้", 
            description: "กรุณาลองใหม่อีกครั้ง",
            variant: "destructive"
          });
        }
      }
    }
    setAnswered(null);
    setIndex((i) => i + 1);
  };

  const avgSeconds = times.length ? (times.reduce((a, b) => a + b, 0) / times.length / 1000).toFixed(1) : "0.0";

  return (
    <main className="container mx-auto px-4 py-10 min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <SEO
        title={`ฝึกคิดเลขเร็ว (${mode.toUpperCase()}) — Brainy Math Boost`}
        description="โหมดฝึกคิดเลขเร็ว จับเวลาให้คะแนน พร้อมเทคนิคเฉลย"
        canonical="/practice"
      />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute top-20 left-10 text-6xl font-mono text-brand rotate-12 animate-bounce-gentle">🧮</div>
        <div className="absolute top-32 right-20 text-4xl font-mono text-brand-2 -rotate-12 animate-pulse-math">⚡</div>
        <div className="absolute bottom-40 left-20 text-5xl font-mono text-brand-accent rotate-45 animate-bounce-gentle">🎯</div>
      </div>
      
      <div className="mb-8 flex items-center justify-between animate-fade-in relative z-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold math-gradient bg-clip-text text-transparent">
            ฝึกโหมด: {mode.toUpperCase()} • ระดับ: {level}
          </h1>
          <div className="flex items-center gap-4">
            <p className="text-lg text-muted-foreground">
              <span className="font-bold text-brand">ข้อที่ {Math.min(index + 1, total)}</span>
              <span className="mx-2">/</span>
              <span>{total}</span>
            </p>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🏆</span>
              <span className="text-xl font-bold text-brand-success">{score}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center p-4 rounded-xl bg-gradient-to-br from-card via-card to-accent/10 border border-brand-2/20">
            <div className="text-brand-2 font-bold text-lg">⏱️ {avgSeconds} วินาที</div>
            <div className="text-xs text-muted-foreground">เวลาเฉลี่ย</div>
          </div>
          <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-br from-card via-card to-accent/10 border border-brand/10">
            <Switch id="show-tip" checked={showTipBefore} onCheckedChange={setShowTipBefore} />
            <Label htmlFor="show-tip" className="text-sm font-medium cursor-pointer">💡 เทคนิค</Label>
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
          <CardFooter className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between p-6 bg-gradient-subtle rounded-b-lg">
            {showTipBefore && (
              <div className="flex-1 p-4 rounded-xl bg-gradient-to-br from-card via-card to-accent/10 border border-brand-accent/20">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">💡</span>
                  <span className="font-bold text-brand-accent">เทคนิค:</span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{problem.tip}</p>
              </div>
            )}
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => window.location.reload()} className="hover:scale-105 transition-transform">
                🔄 สุ่มข้อใหม่
              </Button>
              <Button onClick={next} className="hover:scale-105 transition-transform group">
                {index + 1 >= total ? (
                  <>🏁 สรุปผล</>
                ) : (
                  <>ถัดไป <span className="ml-1 group-hover:animate-bounce-gentle">→</span></>
                )}
              </Button>
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
          <CardFooter className="flex gap-4 justify-center p-6">
            <Link to={routes.stats}>
              <Button variant="hero" className="hover:scale-105 transition-transform group">
                <span className="mr-2 text-xl group-hover:animate-pulse-math">📊</span>
                ดูสถิติ
              </Button>
            </Link>
            <Link to={routes.home}>
              <Button variant="secondary" className="hover:scale-105 transition-transform group">
                <span className="mr-2 text-xl group-hover:animate-bounce-gentle">🏠</span>
                เลือกโหมดใหม่
              </Button>
            </Link>
          </CardFooter>
        </Card>
      )}
    </main>
  );
};

export default Practice;
