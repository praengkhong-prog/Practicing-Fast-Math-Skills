import { useState } from "react";
import SEO from "@/components/SEO";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";

const Survey = () => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const key = "bmb:survey";
    const arr = JSON.parse(localStorage.getItem(key) || "[]");
    arr.push({ rating, comment, date: new Date().toISOString() });
    localStorage.setItem(key, JSON.stringify(arr));
    toast({ title: "ขอบคุณสำหรับคำติชม", description: "เราจะนำไปพัฒนาต่อ" });
    setComment("");
  };

  return (
    <main className="container mx-auto px-4 py-10">
      <SEO title="แบบสำรวจความพึงพอใจ — Brainy Math Boost" description="ช่วยประเมินประสบการณ์ใช้งานของคุณ" canonical="/survey" />
      <form onSubmit={submit} className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle>แบบสำรวจความพึงพอใจ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">ให้คะแนนความพึงพอใจ (1-5)</label>
              <input
                type="range"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground">คะแนน: {rating}</div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">ความคิดเห็นเพิ่มเติม</label>
              <Textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="บอกเราหน่อยว่าชอบอะไร หรืออยากให้ปรับปรุงอะไร" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" variant="hero">ส่งแบบสำรวจ</Button>
          </CardFooter>
        </Card>
      </form>
    </main>
  );
};

export default Survey;
