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
    <main className="container mx-auto px-4 py-10">
      <SEO
        title="เลือกโหมดฝึก — Brainy Math Boost"
        description="เลือกโหมดและระดับการฝึกคิดเลขเร็วที่เหมาะกับคุณ"
        canonical="/mode-selection"
      />
      
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold">เลือกโหมดการฝึก</h1>
          <p className="mt-2 text-muted-foreground">กำหนดการตั้งค่าการฝึกของคุณ</p>
        </div>

        {/* Mode Selection */}
        <Card>
          <CardHeader>
            <CardTitle>โหมดการฝึก</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {modes.map((mode) => (
              <Button
                key={mode.id}
                variant={selectedMode === mode.id ? "hero" : "outline"}
                className="h-auto flex-col p-4"
                onClick={() => setSelectedMode(mode.id)}
              >
                <div className="font-semibold">{mode.title}</div>
                <div className="text-xs opacity-70">{mode.description}</div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Level Selection */}
        <Card>
          <CardHeader>
            <CardTitle>ระดับความยาก</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3">
            {levels.map((level) => (
              <Button
                key={level.id}
                variant={selectedLevel === level.id ? "premium" : "outline"}
                className="h-auto flex-col p-4"
                onClick={() => setSelectedLevel(level.id)}
              >
                <div className="font-semibold">{level.title}</div>
                <div className="text-xs opacity-70">{level.description}</div>
              </Button>
            ))}
          </CardContent>
        </Card>

        {/* Tips Option */}
        <Card>
          <CardHeader>
            <CardTitle>การแสดงเทคนิค</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="tips-toggle" className="text-base font-medium">
                  แสดงเทคนิคก่อนทำโจทย์
                </Label>
                <p className="text-sm text-muted-foreground">
                  เลือกว่าต้องการดูเทคนิคการคิดเลขเร็วก่อนตอบแต่ละข้อหรือไม่
                </p>
              </div>
              <Switch
                id="tips-toggle"
                checked={showTips}
                onCheckedChange={setShowTips}
              />
            </div>
          </CardContent>
        </Card>

        {/* Start Button */}
        <div className="text-center">
          <Button
            variant="hero"
            size="xl"
            onClick={startPractice}
            className="px-12"
          >
            เริ่มฝึกเลย!
          </Button>
        </div>
      </div>
    </main>
  );
};

export default ModeSelection;