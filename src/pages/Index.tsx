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
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/30">
        {/* Background mathematical patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-10 text-6xl font-mono text-brand rotate-12">+</div>
          <div className="absolute top-32 right-20 text-4xl font-mono text-brand-2 -rotate-12">×</div>
          <div className="absolute bottom-40 left-20 text-5xl font-mono text-brand-accent rotate-45">÷</div>
          <div className="absolute bottom-20 right-32 text-4xl font-mono text-brand -rotate-45">−</div>
          <div className="absolute top-1/2 left-1/2 text-8xl font-mono text-brand/30 -translate-x-1/2 -translate-y-1/2 rotate-12">=</div>
        </div>
        
        <div className="container mx-auto flex flex-col items-center gap-8 px-4 py-16 text-center sm:py-24 relative z-10">
          <div className="animate-fade-in">
            <h1 className="max-w-3xl text-4xl font-extrabold leading-tight sm:text-6xl lg:text-7xl">
              <span className="math-gradient bg-clip-text text-transparent animate-pulse-math">
                พัฒนาทักษะคิดเลขเร็ว
              </span>
              <br />
              <span className="text-foreground/80 text-3xl sm:text-4xl lg:text-5xl">
                อย่างสนุกและมีเป้าหมาย
              </span>
            </h1>
          </div>
          
          <div className="animate-slide-up">
            <p className="max-w-2xl text-lg text-muted-foreground/90 leading-relaxed">
              เลือกโหมด <span className="font-semibold text-brand">บวก ลบ คูณ หาร</span> หรือ<span className="font-semibold text-brand-2">โหมดผสม</span> 
              <br />จับเวลาให้คะแนน มีสถิติส่วนตัวและเทคนิคเฉลย
            </p>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-4 animate-bounce-gentle">
            <Link to="/mode-selection">
              <Button variant="hero" size="xl" className="hover:animate-pulse-math">
                🚀 เริ่มฝึกเลย
              </Button>
            </Link>
            {user ? (
              <Link to="/stats">
                <Button variant="success" size="xl">
                  📊 ดูสถิติ
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="premium" size="xl">
                  🔐 เข้าสู่ระบบ
                </Button>
              </Link>
            )}
          </div>
          
          <div className="relative group animate-fade-in">
            <div className="absolute -inset-4 math-gradient rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity blur-lg"></div>
            <img 
              src="/og-image.jpg" 
              alt="ฝึกคิดเลขเร็ว Brainy Math Boost" 
              className="relative mx-auto w-full max-w-4xl rounded-2xl border border-brand/20 shadow-math-elevated hover:shadow-math-glow transition-all duration-500 hover:scale-[1.02]" 
              loading="lazy" 
            />
          </div>
        </div>
      </section>

    </main>
  );
};

export default Index;
