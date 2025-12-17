import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import SEO from "@/components/SEO";

const NotFound = () => {
  const location = useLocation();
  const currentYear = new Date().getFullYear(); // ดึงปีปัจจุบัน

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    // ปรับ Layout เป็น Flex Column เพื่อจัด Footer ให้ลงล่างสุด
    <main className="min-h-screen flex flex-col bg-background">
      <SEO 
        title="หน้าไม่พบ - 404 | Brainy Math Boost" 
        description="ขออภัย หน้าที่คุณต้องการไม่พบ กลับไปหน้าหลักเพื่อเริ่มฝึกคิดเลขเร็ว"
        canonical="/404"
      />
      
      {/* Content Wrapper: ให้ขยายเต็มพื้นที่ที่เหลือ (flex-1) และจัดเนื้อหาให้อยู่กึ่งกลาง */}
      <div className="flex-1 flex items-center justify-center w-full">
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
      </div>

      {/* --- Footer Start --- */}
      <footer className="w-full py-6 text-center border-t border-slate-200/50">
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
      
    </main>
  );
};

export default NotFound;