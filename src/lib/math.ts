export type Mode = "add" | "sub" | "mul" | "div" | "mix";
export type Level = "easy" | "medium" | "hard";

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function ranges(level: Level) {
  switch (level) {
    case "easy":
      return { a: [1, 20], b: [1, 20] };
    case "medium":
      return { a: [10, 99], b: [10, 99] };
    case "hard":
      return { a: [100, 999], b: [10, 99] };
  }
}

const tipsByOp: Record<Mode, string[]> = {
  add: [
    "บวกเลขเร็ว: จับคู่ให้ครบสิบก่อน (เช่น 8+2, 7+3)",
    "แยกหลัก: บวกหลักร้อย สิบ หน่วย แยกกันแล้วค่อยรวม",
  ],
  sub: [
    "ลบเลขเร็ว: ใช้วิธีเติมให้ครบสิบแล้วถอยกลับ",
    "ยืมอย่างมีระบบ: เริ่มจากหลักหน่วยแล้วไปหลักถัดไป",
  ],
  mul: [
    "คูณเร็ว: แยกตัวประกอบ (เช่น 12×15 = (3×4)×(3×5))",
    "ใช้สูตร 9: 9×n = 10×n − n",
  ],
  div: [
    "หารเร็ว: หาเลขใกล้เคียงที่หารลงตัวแล้วปรับ",
    "ท่องแม่สูตรคูณช่วยให้เห็นคำตอบไว",
  ],
  mix: [
    "สังเกตโครงสร้าง: เลือกวิธีที่ทำให้เลขง่ายขึ้นก่อน",
    "ทำข้อที่มั่นใจก่อนเพื่อเก็บเวลาและคะแนน",
  ],
};

export interface Problem {
  question: string;
  options: number[];
  correct: number;
  op: Mode;
  tip: string;
}

function uniqueOptions(correct: number) {
  const set = new Set<number>([correct]);
  while (set.size < 4) {
    const offset = randInt(-10, 10) || 1;
    set.add(correct + offset);
  }
  return Array.from(set).sort(() => Math.random() - 0.5);
}

export function generateProblem(mode: Mode, level: Level): Problem {
  const r = ranges(level);
  const a = randInt(r.a[0], r.a[1]);
  const b = randInt(r.b[0], r.b[1]);

  const actualMode: Mode = mode === "mix" ? (["add", "sub", "mul", "div"][randInt(0, 3)] as Mode) : mode;

  let question = "";
  let correct = 0;

  switch (actualMode) {
    case "add":
      question = `${a} + ${b}`;
      correct = a + b;
      break;
    case "sub":
      question = `${Math.max(a, b)} - ${Math.min(a, b)}`;
      correct = Math.max(a, b) - Math.min(a, b);
      break;
    case "mul":
      question = `${a} × ${b}`;
      correct = a * b;
      break;
    case "div": {
      // Ensure divisible
      const base = randInt(2, 12);
      const mult = randInt(2, level === "hard" ? 50 : 20);
      const prod = base * mult;
      question = `${prod} ÷ ${base}`;
      correct = mult;
      break;
    }
  }

  const options = uniqueOptions(correct);
  const tipPool = tipsByOp[actualMode];
  const tip = tipPool[randInt(0, tipPool.length - 1)];

  return { question, options, correct, op: actualMode, tip };
}

export interface SessionResult {
  mode: Mode;
  level: Level;
  score: number; // 0-10
  avgTimeMs: number;
  date: string; // ISO
}

export async function saveResult(result: SessionResult, userId: string) {
  const { supabase } = await import('@/integrations/supabase/client');
  
  try {
    const { error } = await supabase
      .from('practice_results')
      .insert({
        user_id: userId,
        mode: result.mode,
        level: result.level,
        score: result.score,
        avg_time_ms: Math.round(result.avgTimeMs)
      });

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error saving practice result:', error);
    return { success: false, error };
  }
}

export async function readResults(userId: string): Promise<SessionResult[]> {
  const { supabase } = await import('@/integrations/supabase/client');
  
  try {
    const { data, error } = await supabase
      .from('practice_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return (data || []).map(record => ({
      mode: record.mode as Mode,
      level: record.level as Level,
      score: record.score,
      avgTimeMs: record.avg_time_ms,
      date: record.created_at
    }));
  } catch (error) {
    console.error('Error reading practice results:', error);
    return [];
  }
}
