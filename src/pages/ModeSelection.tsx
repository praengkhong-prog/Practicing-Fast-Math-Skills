import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Mode, Level } from "@/lib/math";

const ModeSelection = () => {
  const [selectedMode, setSelectedMode] = useState<Mode>("mix");
  const [selectedLevel, setSelectedLevel] = useState<Level>("easy");
  const [showTips, setShowTips] = useState(true);
  const navigate = useNavigate();

  const modes = [
    { id: "add" as Mode, title: "บวก", description: "ฝึกบวกเลขเร็วด้วยเทคนิคจับคู่ครบสิบ" },
    { id: "sub" as Mode, title: "ลบ", description: "ฝึกลบเลขอย่างเป็นระบบ ลดการยืมซ้ำซ้อน" },
    { id: "mul" as Mode, title: "คูณ", description: "ฝึกคูณไวด้วยการแยกตัวประกอบและสูตรลัด" },
    { id: "div" as Mode, title: "หาร", description: "ฝึกหารให้คล่องด้วยวิธีหารลงตัวใกล้เคียง" },
    { id: "mix" as Mode, title: "ผสม", description: "ฝึกแบบรวมทุกทักษะ เพิ่มความท้าทาย" },
  ];

  const levels = [
    { id: "easy" as Level, title: "ง่าย", description: "เลข 1-20" },
    { id: "medium" as Level, title: "ปานกลาง", description: "เลข 10-99" },
    { id: "hard" as Level, title: "ยาก", description: "เลข 100-999" },
  ];

  const startPractice = () => {
    const params = new URLSearchParams({
      mode: selectedMode,
      level: selectedLevel,
      showTips: showTips.toString(),
    });
    navigate(`/practice?${params.toString()}`);
  };

  return (
    <main className="container mx-auto px-4 py-10 min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <SEO
        title="เลือกโหมดฝึก — Practicing Fast Math Skills"
        description="เลือกโหมดและระดับการฝึกคิดเลขเร็วที่เหมาะกับคุณ"
        canonical="/mode-selection"
      />
      
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-5">
        <div className="absolute top-20 left-10 text-6xl font-mono text-brand rotate-12 animate-bounce-gentle">⚙️</div>
        <div className="absolute top-32 right-20 text-4xl font-mono text-brand-2 -rotate-12 animate-pulse-math">🎯</div>
        <div className="absolute bottom-40 left-20 text-5xl font-mono text-brand-accent rotate-45 animate-bounce-gentle">⭐</div>
      </div>
      
      <div className="mx-auto max-w-4xl space-y-8 relative z-10">
        <div className="text-center animate-fade-in">
          <div className="inline-block p-4 rounded-full bg-gradient-primary/20 backdrop-blur-sm border border-brand/20 mb-6 animate-bounce-gentle">
            <div className="text-4xl">⚙️✨</div>
          </div>
          <h1 className="text-4xl font-bold math-gradient bg-clip-text text-transparent">เลือกโหมดการฝึก</h1>
          <p className="mt-4 text-lg text-muted-foreground">กำหนดการตั้งค่าการฝึกที่เหมาะกับคุณ</p>
        </div>

        {/* Mode Selection */}
        <Card className="math-card shadow-math-elevated hover:shadow-math-glow transition-all duration-500 animate-slide-up">
          <CardHeader className="bg-gradient-subtle rounded-t-lg">
            <CardTitle className="text-xl font-bold math-gradient bg-clip-text text-transparent flex items-center gap-2">
              <span className="text-2xl animate-pulse-math">🎯</span>
              โหมดการฝึก
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-3">
            {modes.map((mode) => (
              <Button
                key={mode.id}
                variant={selectedMode === mode.id ? "hero" : "outline"}
                className={`h-auto flex-col p-6 transition-all duration-300 hover:scale-105 group ${
                  selectedMode === mode.id ? 'shadow-math-glow animate-pulse-math' : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedMode(mode.id)}
              >
                <div className="font-bold text-lg mb-2 group-hover:animate-bounce-gentle">{mode.title}</div>
                <div className="text-xs opacity-70 text-center leading-relaxed">{mode.description}</div>
                {selectedMode === mode.id && (
                  <div className="mt-2 text-xl animate-bounce-gentle">✨</div>
                )}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Level Selection */}
        <Card className="math-card shadow-math-elevated hover:shadow-math-glow transition-all duration-500 animate-slide-up">
          <CardHeader className="bg-gradient-subtle rounded-t-lg">
            <CardTitle className="text-xl font-bold math-gradient bg-clip-text text-transparent flex items-center gap-2">
              <span className="text-2xl animate-pulse-math">📊</span>
              ระดับความยาก
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 p-6 sm:grid-cols-3">
            {levels.map((level) => (
              <Button
                key={level.id}
                variant={selectedLevel === level.id ? "premium" : "outline"}
                className={`h-auto flex-col p-6 transition-all duration-300 hover:scale-105 group ${
                  selectedLevel === level.id ? 'shadow-math-glow animate-pulse-math' : 'hover:shadow-lg'
                }`}
                onClick={() => setSelectedLevel(level.id)}
              >
                <div className="font-bold text-lg mb-2 group-hover:animate-bounce-gentle">
                  {level.id === 'easy' && '🟢'} 
                  {level.id === 'medium' && '🟡'} 
                  {level.id === 'hard' && '🔴'} 
                  {level.title}
                </div>
                <div className="text-xs opacity-70 text-center">{level.description}</div>
                {selectedLevel === level.id && (
                  <div className="mt-2 text-xl animate-bounce-gentle">✨</div>
                )}
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Tips Option */}
        <Card className="math-card shadow-math-elevated hover:shadow-math-glow transition-all duration-500 animate-slide-up">
          <CardHeader className="bg-gradient-subtle rounded-t-lg">
            <CardTitle className="text-xl font-bold math-gradient bg-clip-text text-transparent flex items-center gap-2">
              <span className="text-2xl animate-pulse-math">💡</span>
              การแสดงเทคนิค
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-gradient-to-br from-card via-card to-accent/10 border border-brand/10 hover:border-brand/20 transition-colors">
              <div className="space-y-2">
                <Label htmlFor="tips-toggle" className="text-base font-bold cursor-pointer hover:text-brand transition-colors">
                  💡 แสดงเทคนิคก่อนทำโจทย์
                </Label>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  เลือกว่าต้องการดูเทคนิคการคิดเลขเร็วก่อนตอบแต่ละข้อหรือไม่
                </p>
              </div>
              <Switch
                id="tips-toggle"
                checked={showTips}
                onCheckedChange={setShowTips}
                className="scale-125"
              />
            </div>
          </CardContent>
        </Card>

        {/* Start Button */}
        <div className="text-center animate-bounce-gentle">
          <div className="relative group">
            <div className="absolute -inset-4 math-gradient rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-lg animate-pulse-math"></div>
            <Button
              variant="hero"
              size="xl"
              onClick={startPractice}
              className="relative px-16 py-4 text-xl font-bold shadow-math-elevated hover:shadow-math-glow transition-all duration-500 hover:scale-110 group"
            >
              <span className="mr-3 text-2xl group-hover:animate-bounce-gentle">🚀</span>
              เริ่มฝึกเลย!
              <span className="ml-3 text-2xl group-hover:animate-bounce-gentle">✨</span>
            </Button>
          </div>
          
          {/* Summary of selection */}
          <div className="mt-6 p-4 rounded-xl bg-gradient-to-br from-card via-card to-accent/10 border border-brand/10 max-w-md mx-auto">
            <p className="text-sm text-muted-foreground mb-2">การตั้งค่าของคุณ:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <span className="px-3 py-1 rounded-full bg-brand/20 text-brand text-xs font-medium">
                {modes.find(m => m.id === selectedMode)?.title}
              </span>
              <span className="px-3 py-1 rounded-full bg-brand-2/20 text-brand-2 text-xs font-medium">
                {levels.find(l => l.id === selectedLevel)?.title}
              </span>
              {showTips && (
                <span className="px-3 py-1 rounded-full bg-brand-accent/20 text-brand-accent text-xs font-medium">
                  💡 เทคนิค
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ModeSelection;