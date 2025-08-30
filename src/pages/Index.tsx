import SEO from "@/components/SEO";
import ModeCard from "@/components/ModeCard";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();

  return (
    <main>
      <SEO title="Brainy Math Boost — ฝึกคิดเลขเร็วออนไลน์" description="ฝึกคิดเลขเร็วหลายโหมด พร้อมจับเวลา สถิติ และเทคนิคเฉลย" canonical="/" />
      <section className="relative overflow-hidden">
        <div className="container mx-auto flex flex-col items-center gap-8 px-4 py-16 text-center sm:py-24">
          <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-5xl">
            <span className="bg-gradient-to-tr from-[hsl(var(--brand))] to-[hsl(var(--brand-2))] bg-clip-text text-transparent">พัฒนาทักษะคิดเลขเร็ว</span> อย่างสนุกและมีเป้าหมาย
          </h1>
          <p className="max-w-2xl text-muted-foreground">
            เลือกโหมด บวก ลบ คูณ หาร หรือโหมดผสม จับเวลาให้คะแนน มีสถิติส่วนตัวและเทคนิคเฉลย
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link to="/mode-selection"><Button variant="hero" size="xl">เริ่มฝึก</Button></Link>
            {user ? (
              <Link to="/stats"><Button variant="premium" size="xl">ดูสถิติ</Button></Link>
            ) : (
              <Link to="/auth"><Button variant="premium" size="xl">เข้าสู่ระบบ</Button></Link>
            )}
          </div>
          <img src="/og-image.jpg" alt="ฝึกคิดเลขเร็ว Brainy Math Boost" className="mx-auto w-full max-w-4xl rounded-lg border shadow-[var(--shadow-elevated)]" loading="lazy" />
        </div>
      </section>

      <section className="container mx-auto px-4 pb-16">
        <h2 className="mb-6 text-xl font-semibold">เลือกโหมดการฝึก</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ModeCard mode="add" title="บวก" description="ฝึกบวกเลขเร็วด้วยเทคนิคจับคู่ครบสิบ" />
          <ModeCard mode="sub" title="ลบ" description="ฝึกลบเลขอย่างเป็นระบบ ลดการยืมซ้ำซ้อน" />
          <ModeCard mode="mul" title="คูณ" description="ฝึกคูณไวด้วยการแยกตัวประกอบและสูตรลัด" />
          <ModeCard mode="div" title="หาร" description="ฝึกหารให้คล่องด้วยวิธีหารลงตัวใกล้เคียง" />
          <ModeCard mode="mix" title="ผสม" description="ฝึกแบบรวมทุกทักษะ เพิ่มความท้าทาย" />
        </div>
      </section>
    </main>
  );
};

export default Index;
