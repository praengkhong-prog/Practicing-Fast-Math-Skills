import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <SEO 
        title="หน้าไม่พบ - 404 | Brainy Math Boost" 
        description="ขออภัย หน้าที่คุณต้องการไม่พบ กลับไปหน้าหลักเพื่อเริ่มฝึกคิดเลขเร็ว"
        canonical="/404"
      />
      <div className="text-center space-y-6 px-4">
        <div className="space-y-2">
          <h1 className="text-6xl font-bold bg-gradient-to-tr from-[hsl(var(--brand))] to-[hsl(var(--brand-2))] bg-clip-text text-transparent">
            404
          </h1>
          <h2 className="text-2xl font-semibold text-foreground">หน้าไม่พบ</h2>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            ขออภัย หน้าที่คุณต้องการไม่พบ กลับไปหน้าหลักเพื่อเริ่มฝึกคิดเลขเร็วกันเถอะ
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/">
            <Button variant="hero" size="lg">กลับหน้าหลัก</Button>
          </Link>
          <Link to="/mode-selection">
            <Button variant="outline" size="lg">เริ่มฝึกเลย</Button>
          </Link>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
