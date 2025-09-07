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
      <section className="relative overflow-hidden bg-gradient-to-br from-background via-background to-accent/30 min-h-screen">
        {/* Animated background mathematical patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 text-6xl font-mono text-brand rotate-12 animate-bounce-gentle">+</div>
          <div className="absolute top-32 right-20 text-4xl font-mono text-brand-2 -rotate-12 animate-pulse-math">×</div>
          <div className="absolute bottom-40 left-20 text-5xl font-mono text-brand-accent rotate-45 animate-bounce-gentle">÷</div>
          <div className="absolute bottom-20 right-32 text-4xl font-mono text-brand -rotate-45 animate-pulse-math">−</div>
          <div className="absolute top-1/2 left-1/2 text-8xl font-mono text-brand/30 -translate-x-1/2 -translate-y-1/2 rotate-12 animate-pulse-math">=</div>
          
          {/* Floating geometric shapes */}
          <div className="absolute top-1/4 left-1/4 w-16 h-16 bg-gradient-primary rounded-full opacity-20 animate-bounce-gentle"></div>
          <div className="absolute top-3/4 right-1/4 w-12 h-12 bg-gradient-accent rounded-lg opacity-20 animate-pulse-math"></div>
          <div className="absolute bottom-1/4 left-3/4 w-20 h-20 bg-gradient-subtle rounded-full opacity-15 animate-bounce-gentle"></div>
        </div>
        
        <div className="container mx-auto flex flex-col items-center gap-8 px-4 py-16 text-center sm:py-24 relative z-10">
          <div className="animate-fade-in space-y-4">
            <div className="inline-block p-4 rounded-full bg-gradient-primary/20 backdrop-blur-sm border border-brand/20 mb-6 animate-bounce-gentle">
              <div className="text-4xl">🧠✨</div>
            </div>
            <h1 className="max-w-4xl text-4xl font-extrabold leading-tight sm:text-6xl lg:text-7xl">
              <span className="math-gradient bg-clip-text text-transparent animate-pulse-math block mb-2">
                พัฒนาสมองคิดเลขเร็ว
              </span>
              <span className="text-foreground/80 text-3xl sm:text-4xl lg:text-5xl">
                อย่างสนุกและมีเป้าหมาย
              </span>
            </h1>
          </div>
          
          <div className="animate-slide-up max-w-3xl">
            <p className="text-xl text-muted-foreground/90 leading-relaxed mb-6">
              ฝึกฝนทักษะคณิตศาสตร์ด้วยวิธีที่สนุกสนาน
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-gradient-to-br from-brand/10 to-brand/5 border border-brand/20 hover:scale-105 transition-transform">
                <div className="text-2xl mb-2">➕</div>
                <div className="text-sm font-medium text-brand">บวก</div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-brand-2/10 to-brand-2/5 border border-brand-2/20 hover:scale-105 transition-transform">
                <div className="text-2xl mb-2">➖</div>
                <div className="text-sm font-medium text-brand-2">ลบ</div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-brand-accent/10 to-brand-accent/5 border border-brand-accent/20 hover:scale-105 transition-transform">
                <div className="text-2xl mb-2">✖️</div>
                <div className="text-sm font-medium text-brand-accent">คูณ</div>
              </div>
              <div className="p-4 rounded-xl bg-gradient-to-br from-brand-success/10 to-brand-success/5 border border-brand-success/20 hover:scale-105 transition-transform">
                <div className="text-2xl mb-2">➗</div>
                <div className="text-sm font-medium text-brand-success">หาร</div>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center justify-center gap-6 animate-bounce-gentle">
            <Link to="/mode-selection">
              <Button variant="hero" size="xl" className="group hover:animate-pulse-math shadow-math-elevated hover:shadow-math-glow transition-all duration-500">
                <span className="mr-2 text-2xl group-hover:animate-bounce-gentle">🚀</span>
                เริ่มฝึกเลย
                <span className="ml-2 text-xl group-hover:animate-bounce-gentle">✨</span>
              </Button>
            </Link>
            {user ? (
              <Link to="/stats">
                <Button variant="success" size="xl" className="group hover:scale-105 transition-transform">
                  <span className="mr-2 text-xl group-hover:animate-pulse-math">📊</span>
                  ดูสถิติ
                </Button>
              </Link>
            ) : (
              <Link to="/auth">
                <Button variant="premium" size="xl" className="group hover:scale-105 transition-transform">
                  <span className="mr-2 text-xl group-hover:animate-bounce-gentle">🔐</span>
                  เข้าสู่ระบบ
                </Button>
              </Link>
            )}
          </div>
          
          {/* Feature highlights */}
          <div className="animate-fade-in w-full max-w-5xl mt-12">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-card via-card to-accent/10 border border-brand/10 hover:border-brand/20 transition-all hover:scale-105 group">
                <div className="text-4xl mb-4 group-hover:animate-bounce-gentle">⚡</div>
                <h3 className="font-bold text-lg mb-2 math-gradient bg-clip-text text-transparent">จับเวลาแม่นยำ</h3>
                <p className="text-sm text-muted-foreground">วัดความเร็วในการคิดเลขของคุณแบบเรียลไทม์</p>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-card via-card to-accent/10 border border-brand-2/10 hover:border-brand-2/20 transition-all hover:scale-105 group">
                <div className="text-4xl mb-4 group-hover:animate-bounce-gentle">📈</div>
                <h3 className="font-bold text-lg mb-2 math-gradient bg-clip-text text-transparent">ติดตามความคืบหน้า</h3>
                <p className="text-sm text-muted-foreground">ดูสถิติและกราฟการพัฒนาของคุณ</p>
              </div>
              <div className="p-6 rounded-2xl bg-gradient-to-br from-card via-card to-accent/10 border border-brand-accent/10 hover:border-brand-accent/20 transition-all hover:scale-105 group">
                <div className="text-4xl mb-4 group-hover:animate-bounce-gentle">🎯</div>
                <h3 className="font-bold text-lg mb-2 math-gradient bg-clip-text text-transparent">เทคนิคเฉลย</h3>
                <p className="text-sm text-muted-foreground">เรียนรู้เทคนิคการคิดเลขที่เร็วและแม่นยำ</p>
              </div>
            </div>
          </div>
          
          <div className="relative group animate-fade-in mt-8">
            <div className="absolute -inset-8 math-gradient rounded-3xl opacity-20 group-hover:opacity-30 transition-opacity blur-2xl animate-pulse-math"></div>
            <div className="relative bg-gradient-to-br from-card via-card to-accent/10 rounded-3xl border border-brand/20 p-8 backdrop-blur-sm">
              <img 
                src="/og-image.jpg" 
                alt="ฝึกคิดเลขเร็ว Brainy Math Boost" 
                className="mx-auto w-full max-w-4xl rounded-2xl shadow-math-elevated hover:shadow-math-glow transition-all duration-500 hover:scale-[1.02]" 
                loading="lazy" 
              />
              <div className="mt-6 text-center">
                <p className="text-muted-foreground">เริ่มต้นการเดินทางสู่การเป็นมาสเตอร์คณิตศาสตร์</p>
              </div>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
};

export default Index;
