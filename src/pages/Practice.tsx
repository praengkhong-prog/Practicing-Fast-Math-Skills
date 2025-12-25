import { useEffect, useRef, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { routes } from "@/routes/web";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/supabaseClient"; 
import { Loader2, Star, AlertTriangle } from "lucide-react"; 
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

// Interface ให้ตรงกับ Database
interface MathProblemDB {
  id: string;
  question: string;
  choice_a: string;
  choice_b: string;
  choice_c: string;
  choice_d: string;
  correct_answer: string; 
  category: string;
  difficulty: string;
  techniques?: {
    title: string;
    description: string;
  } | null;
}

const Practice = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const currentYear = new Date().getFullYear(); 
  
  const modeId = params.get("modeId") || "mix"; 
  const modeName = params.get("modeName") || "โหมดผสม"; 
  const difficulty = params.get("difficulty") || "easy";
  const showTipsParam = params.get("showTips") === "true";

  const [problems, setProblems] = useState<MathProblemDB[]>([]);
  const [loading, setLoading] = useState(true);

  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [times, setTimes] = useState<number[]>([]);
  const [answered, setAnswered] = useState<string | null>(null);
  const [showTipBefore, setShowTipBefore] = useState(showTipsParam);
  const startRef = useRef<number>(performance.now());
  const [gameFinished, setGameFinished] = useState(false);

  // --- Survey States ---
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [nextPath, setNextPath] = useState<string>("");
  const [submittingSurvey, setSubmittingSurvey] = useState(false);

  // --- Exit Alert States ---
  const [showExitAlert, setShowExitAlert] = useState(false);
  const [pendingPath, setPendingPath] = useState<string | null>(null);

  // 1. ดักจับการปิด Browser
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!gameFinished && index > 0) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [gameFinished, index]);

  // ฟังก์ชันสลับโจทย์
  const shuffleArray = (array: any[]) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Fetch โจทย์
  useEffect(() => {
    const fetchProblems = async () => {
      setLoading(true);
      try {
        let query = supabase.from("math_problems").select(`*, techniques ( title, description )`);
        
        // Logic เลือกโหมด
        if (modeId !== "mixed" && modeId !== "mix" && modeName !== "โหมดผสม") {
             query = query.eq("category", modeName);
        }
        query = query.ilike("difficulty", difficulty);
        
        const { data, error } = await query;
        if (error) throw error;

        if (data && data.length > 0) {
          const shuffled = shuffleArray(data).slice(0, 10);
          setProblems(shuffled);
        } else {
           setProblems([]);
        }
      } catch (err) {
        console.error("Error loading problems:", err);
        toast({ title: "เกิดข้อผิดพลาด", description: "ไม่สามารถโหลดโจทย์ได้", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };
    fetchProblems();
  }, [modeId, modeName, difficulty]);

  // จับเวลา
  useEffect(() => {
    if (!gameFinished) {
        startRef.current = performance.now();
    }
  }, [index, problems, gameFinished]);

  const total = problems.length;
  const currentProblem = problems[index];

  // ตรวจคำตอบ
  const onAnswer = (choiceKey: string) => { 
    if (answered !== null) return;
    const elapsed = performance.now() - startRef.current;
    setTimes((t) => [...t, elapsed]);
    setAnswered(choiceKey);
    const correct = choiceKey === currentProblem.correct_answer;
    if (correct) setScore((s) => s + 1);
    
    // @ts-ignore
    const correctText = currentProblem[`choice_${currentProblem.correct_answer.toLowerCase()}`];

    toast({
      title: correct ? "ถูกต้อง!" : "ยังไม่ถูก",
      description: correct ? "เยี่ยมมาก!" : `คำตอบที่ถูกคือ ${correctText}`,
      className: correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200",
    });
  };

  const next = async () => {
    if (index + 1 >= total) {
      finishGame(); 
    } else {
      setAnswered(null);
      setIndex((i) => i + 1);
    }
  };

  // จบเกม (Completed)
  const finishGame = async () => {
    setGameFinished(true);
    const avg = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    
    if (user) {
        await saveToDB('completed', score, avg, total);
        toast({ title: "ฝึกครบแล้ว!", description: "บันทึกสถิติเรียบร้อย" });
    }
  };

  // --- 🛠️ ฟังก์ชันบันทึกข้อมูล (แก้ไขแล้ว) ---
  const saveToDB = async (status: 'completed' | 'incomplete', finalScore: number, avgTime: number, totalQs: number) => {
    if (!user) {
        console.error("User not logged in");
        return;
    }

    try {
        console.log("Preparing to save...", { status, finalScore, avgTime });

        // ตรวจสอบว่า modeId เป็น mix หรือไม่ ถ้าใช่ให้เป็น null (เพราะ DB เก็บเป็น UUID)
        // ถ้าเป็น ID ของโหมดจริงๆ ก็ส่งไปตามปกติ
        const modeIdToSend = (modeId === 'mix' || modeId === 'mixed') ? null : modeId;

        const { data, error } = await supabase.from('practice_results').insert({
            user_id: user.id,
            mode_id: modeIdToSend, // ✅ แก้ไขตรงนี้: เปลี่ยน key เป็น mode_id
            level: difficulty || 'easy',
            score: finalScore,
            total_questions: totalQs,
            avg_time_ms: Math.round(avgTime),
            status: status, 
            created_at: new Date().toISOString()
        }).select();

        if (error) {
            toast({ 
                title: "บันทึกไม่สำเร็จ", 
                description: error.message, 
                variant: "destructive" 
            });
            console.error("Supabase Save Error:", error);
        } else {
            console.log("Save Success!", data);
        }
    } catch (err) {
        console.error("Unexpected Error:", err);
    }
  };

  // --- Navigation Logic ---
  const handleNavigationRequest = (path: string) => {
    if (gameFinished) {
        setNextPath(path);
        setRating(0);
        setComment("");
        setIsSurveyOpen(true);
    } else {
        setPendingPath(path);
        setShowExitAlert(true);
    }
  };

  // --- confirmExit ---
  const confirmExit = async () => {
    setShowExitAlert(false);
    
    const currentAvg = times.length ? times.reduce((a, b) => a + b, 0) / times.length : 0;
    const questionsAnswered = times.length; 
    
    // บันทึกแบบ Incomplete
    if (questionsAnswered > 0) {
        // ใช้ 'total' แทน 'questionsAnswered' เพื่อให้ตัวส่วนเป็นจำนวนเต็มของชุดข้อสอบ
        await saveToDB('incomplete', score, currentAvg, total); 
        toast({ title: "บันทึกความคืบหน้าแล้ว", description: "สถานะ: ไม่สมบูรณ์" });
    }

    if (pendingPath) navigate(pendingPath);
  };

  const submitSurvey = async (skip: boolean = false) => {
    setSubmittingSurvey(true);
    try {
      if (!skip && user && rating > 0) {
        await supabase.from("survey_responses").insert({
          user_id: user.id,
          rating: rating,
          comment: comment,
        });
        toast({ title: "ขอบคุณครับ!", description: "เราได้รับความคิดเห็นของคุณแล้ว" });
      }
    } catch (error) { console.error(error); } 
    finally {
      setSubmittingSurvey(false);
      setIsSurveyOpen(false);
      navigate(nextPath);
    }
  };

  const avgSeconds = times.length ? (times.reduce((a, b) => a + b, 0) / times.length / 1000).toFixed(1) : "0.0";

  if (loading) return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
  if (problems.length === 0) return <div>ไม่พบโจทย์ <Link to={routes.home}><Button>กลับ</Button></Link></div>;

  return (
    // เพิ่ม flex flex-col justify-between เพื่อดัน footer ลงล่าง
    <main className="container mx-auto px-4 py-10 min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex flex-col justify-between">
      <SEO title={`ฝึกคิดเลขเร็ว (${modeName})`} description="โหมดฝึกคิดเลขเร็ว" canonical="/practice" />
      
      {/* Wrapper สำหรับเนื้อหาหลัก (ให้ยืดเต็มพื้นที่ flex-1) */}
      <div className="w-full flex-1">
        <div className="mb-8 flex flex-col md:flex-row items-center justify-between animate-fade-in relative z-10 gap-4">
            <div className="space-y-2 text-center md:text-left">
            <h1 className="text-3xl font-bold math-gradient bg-clip-text text-transparent">
                {modeName} • <span className="capitalize text-gray-500 text-2xl">{difficulty}</span>
            </h1>
            <div className="flex items-center justify-center md:justify-start gap-4">
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
            {!gameFinished && (
                <div className="text-xs px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full border border-yellow-200">
                    สถานะ: กำลังเล่น
                </div>
            )}
            <div className="text-center p-4 rounded-xl bg-white border shadow-sm">
                <div className="text-brand-2 font-bold text-lg">⏱️ {avgSeconds} วินาที</div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-xl bg-white border shadow-sm">
                <Switch id="show-tip" checked={showTipBefore} onCheckedChange={setShowTipBefore} />
                <Label htmlFor="show-tip" className="text-sm font-medium cursor-pointer">💡 เฉลยเทคนิค</Label>
            </div>
            </div>
        </div>

        {!gameFinished ? (
            <Card className="math-card shadow-math-elevated">
            <CardHeader className="bg-gradient-subtle rounded-t-lg py-10">
                <CardTitle className="text-4xl md:text-5xl font-bold text-center math-gradient bg-clip-text text-transparent">
                {currentProblem.question}
                </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
                {['a', 'b', 'c', 'd'].map((key) => {
                const choiceKey = key.toUpperCase(); 
                // @ts-ignore
                const choiceText = currentProblem[`choice_${key}`]; 
                const isSel = answered === choiceKey;
                const isCorrect = choiceKey === currentProblem.correct_answer;
                let variant = "outline"; 
                if (answered) {
                    if (isSel) variant = isCorrect ? "default" : "destructive"; 
                    else if (isCorrect) variant = "default"; 
                } else { variant = "secondary"; }

                return (
                    <Button key={key} 
                    // @ts-ignore
                    variant={variant}
                    className={`h-20 text-2xl font-bold hover:scale-105 transition-transform number-display ${answered && isCorrect ? 'bg-green-600 hover:bg-green-700 text-white' : ''}`}
                    onClick={() => onAnswer(choiceKey)} disabled={answered !== null}
                    >
                    {choiceText}
                    </Button>
                );
                })}
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between p-6 bg-gradient-subtle rounded-b-lg">
                <div className="w-full sm:w-auto flex-1 mr-4">
                    {showTipBefore && currentProblem.techniques ? (
                    <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 animate-fade-in">
                        <div className="flex items-center gap-2 mb-1">
                        <span className="text-xl">💡</span>
                        <span className="font-bold text-yellow-700">{currentProblem.techniques.title}:</span>
                        </div>
                        <p className="text-sm text-yellow-800 leading-relaxed">{currentProblem.techniques.description}</p>
                    </div>
                    ) : <div className="hidden sm:block"></div>}
                </div>
                <div className="flex gap-3 w-full sm:w-auto justify-end">
                <Button variant="outline" onClick={() => handleNavigationRequest(routes.home)}>ออก</Button>
                <Button onClick={next} disabled={answered === null}>
                    {index + 1 >= total ? <>🏁 สรุปผล</> : <>ถัดไป →</>}
                </Button>
                </div>
            </CardFooter>
            </Card>
        ) : (
            /* --- หน้าสรุปผล --- */
            <Card className="math-card shadow-math-glow max-w-2xl mx-auto">
            <CardHeader className="bg-gradient-primary text-center rounded-t-lg">
                <CardTitle className="text-2xl font-bold text-white">🎉 สรุปผลการฝึก</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-6 p-8 text-center">
                <div>
                    <div className="text-6xl font-bold math-gradient bg-clip-text text-transparent mb-2">{score} / {total}</div>
                    <p className="text-muted-foreground">คะแนนของคุณ</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-brand-2">{avgSeconds}s</div>
                        <div className="text-xs text-muted-foreground">เวลาเฉลี่ยต่อข้อ</div>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-brand">{Math.round((score / total) * 100)}%</div>
                        <div className="text-xs text-muted-foreground">ความแม่นยำ</div>
                    </div>
                </div>
            </CardContent>
            <CardFooter className="flex gap-4 justify-center p-6 bg-gray-50/50">
                <Button variant="default" size="lg" onClick={() => handleNavigationRequest(routes.stats)}>
                    📊 ดูสถิติ
                </Button>
                <Button variant="outline" size="lg" onClick={() => handleNavigationRequest(routes.home)}>
                    🏠 หน้าหลัก
                </Button>
            </CardFooter>
            </Card>
        )}
      </div>

      {/* --- Footer Start --- */}
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
      {/* --- Footer End --- */}

      {/* --- ALERT DIALOG --- */}
      <AlertDialog open={showExitAlert} onOpenChange={setShowExitAlert}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2 text-amber-600">
                    <AlertTriangle /> ยืนยันการออก?
                </AlertDialogTitle>
                <AlertDialogDescription>
                    คุณยังทำแบบฝึกหัดไม่ครบ ระบบจะบันทึกคะแนนเท่าที่คุณทำไป ({score} คะแนน) เป็นสถานะ "ไม่สมบูรณ์"
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setPendingPath(null)}>ทำต่อ</AlertDialogCancel>
                <AlertDialogAction onClick={confirmExit} className="bg-red-600 hover:bg-red-700">
                    บันทึกและออก
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* --- SURVEY DIALOG --- */}
      <Dialog open={isSurveyOpen} onOpenChange={setIsSurveyOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
                <DialogTitle className="text-center">ความพึงพอใจ</DialogTitle>
                <DialogDescription className="text-center">ให้คะแนนการฝึกครั้งนี้หน่อยครับ</DialogDescription>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-4">
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110">
                            <Star className={`w-10 h-10 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        </button>
                    ))}
                </div>
                <div className="w-full space-y-2">
                    <Label>ข้อเสนอแนะ</Label>
                    <Textarea placeholder="พิมพ์ข้อเสนอแนะ..." value={comment} onChange={(e) => setComment(e.target.value)} className="resize-none"/>
                </div>
            </div>
            <DialogFooter className="flex gap-2 w-full justify-between">
                <Button variant="ghost" onClick={() => submitSurvey(true)}>ข้าม</Button>
                <Button onClick={() => submitSurvey(false)} disabled={rating === 0}>ส่ง</Button>
            </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Practice;