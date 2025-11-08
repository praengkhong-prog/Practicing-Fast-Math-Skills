import { useState } from "react";
import SEO from "@/components/SEO";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

const Survey = () => {
  const { user } = useAuth();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({ 
        title: "กรุณาเข้าสู่ระบบ", 
        description: "คุณต้องเข้าสู่ระบบก่อนส่งแบบสำรวจ",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('survey_responses')
        .insert({
          user_id: user.id,
          rating,
          comment: comment.trim() || null
        });

      if (error) throw error;

      toast({ 
        title: "ขอบคุณสำหรับคำติชม", 
        description: "เราจะนำไปพัฒนาต่อ" 
      });
      setComment("");
      setRating(5);
    } catch (error: any) {
      console.error('Error submitting survey:', error);
      toast({ 
        title: "เกิดข้อผิดพลาด", 
        description: "ไม่สามารถบันทึกแบบสำรวจได้ กรุณาลองใหม่อีกครั้ง",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <Button type="submit" variant="hero" disabled={isSubmitting || !user}>
              {isSubmitting ? "กำลังส่ง..." : "ส่งแบบสำรวจ"}
            </Button>
            {!user && (
              <p className="text-sm text-muted-foreground ml-4">
                กรุณาเข้าสู่ระบบก่อนส่งแบบสำรวจ
              </p>
            )}
          </CardFooter>
        </Card>
      </form>
    </main>
  );
};

export default Survey;
