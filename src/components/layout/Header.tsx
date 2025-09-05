import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, userRole, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/" className="font-semibold tracking-tight">
          <span className="bg-gradient-to-tr from-[hsl(var(--brand))] to-[hsl(var(--brand-2))] bg-clip-text text-transparent">Brainy Math Boost</span>
        </Link>
        
        <nav className="hidden gap-1 md:flex">
          <NavLink to="/practice" className={({ isActive }) => `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>โหมดฝึก</NavLink>
          {user && (
            <>
              <NavLink to="/stats" className={({ isActive }) => `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>สถิติ</NavLink>
              <NavLink to="/survey" className={({ isActive }) => `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>แบบสำรวจ</NavLink>
              {userRole === 'admin' && (
                <NavLink to="/admin" className={({ isActive }) => `px-3 py-2 rounded-md text-sm ${isActive ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}>ผู้ดูแล</NavLink>
              )}
            </>
          )}
        </nav>
        
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-10 w-10 rounded-full p-0">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[hsl(var(--brand))] text-primary-foreground">
                      {user.email?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-medium">{user.email}</p>
                  {userRole && (
                    <p className="text-xs text-muted-foreground">
                      {userRole === 'admin' ? 'ผู้ดูแลระบบ' : 'ผู้ใช้'}
                    </p>
                  )}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile">โปรไฟล์</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/stats">สถิติของฉัน</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/survey">แบบสำรวจ</Link>
                </DropdownMenuItem>
                {userRole === 'admin' && (
                  <DropdownMenuItem asChild>
                    <Link to="/admin">จัดการระบบ</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={signOut}
                  className="text-destructive focus:text-destructive"
                >
                  ออกจากระบบ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="outline" size="sm">เข้าสู่ระบบ</Button>
              </Link>
              <Link to="/practice">
                <Button variant="hero" size="sm">เริ่มฝึก</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
