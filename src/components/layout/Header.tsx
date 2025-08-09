import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="font-semibold tracking-tight">
          <span className="bg-gradient-to-tr from-[hsl(var(--brand))] to-[hsl(var(--brand-2))] bg-clip-text text-transparent">Brainy Math Boost</span>
        </Link>
        <nav className="hidden gap-1 md:flex">
          <NavLink to="/practice" className={({ isActive }) => `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>โหมดฝึก</NavLink>
          <NavLink to="/stats" className={({ isActive }) => `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>สถิติ</NavLink>
          <NavLink to="/survey" className={({ isActive }) => `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>แบบสำรวจ</NavLink>
          <NavLink to="/admin" className={({ isActive }) => `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>ผู้ดูแล</NavLink>
        </nav>
        <div className="flex items-center gap-2">
          <Link to="/practice">
            <Button variant="hero" size="sm">เริ่มฝึก</Button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
