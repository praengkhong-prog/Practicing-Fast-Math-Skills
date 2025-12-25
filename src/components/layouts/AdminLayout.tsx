
import { Outlet, useNavigate, Link } from "react-router-dom";
import { LayoutDashboard, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Footer from "@/components/footer"; 

const AdminLayout = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  // ✅ 1. Logic ดึงชื่อมาแสดง (แก้ตรงนี้)
  // ลำดับการดึง: display_name -> full_name -> email
  const displayName = 
    user?.user_metadata?.display_name || 
    user?.user_metadata?.full_name || 
    user?.email || 
    "Admin";

  // ✅ 2. ดึงตัวอักษรแรกของ "ชื่อ" มาแสดงในวงกลม (ไม่ใช่จากอีเมลแล้ว)
  const userInitial = displayName?.charAt(0).toUpperCase() || "A";

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* === Header === */}
      <header className="h-16 bg-white border-b flex items-center justify-between px-4 md:px-8 shadow-sm sticky top-0 z-50">
        
        {/* ฝั่งซ้าย: โลโก้ / ชื่อระบบ */}
        <Link to="/admin" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
           <div className="bg-blue-100 p-2 rounded-lg">
             <LayoutDashboard className="w-5 h-5" />
           </div>
           <span className="font-bold text-lg hidden sm:block"> Practicing-Fast-Math-Skills Admin Dashboard </span>
        </Link>

        {/* ฝั่งขวา: เมนูโปรไฟล์ */}
        <div className="flex items-center gap-4">
           
           <DropdownMenu>
             <DropdownMenuTrigger className="outline-none">
                <Avatar className="h-10 w-10 border-2 border-white shadow-sm hover:ring-2 hover:ring-blue-100 transition-all cursor-pointer">
                  <AvatarFallback className="bg-blue-600 text-white font-bold">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
             </DropdownMenuTrigger>

             <DropdownMenuContent align="end" className="w-64 p-2 shadow-xl border-slate-100 rounded-xl mt-2">
               <DropdownMenuLabel className="font-normal">
                 <div className="flex flex-col space-y-1 p-2 bg-slate-50 rounded-lg mb-2">
                   
                   {/* ✅ 3. แสดงชื่อจริงตรงนี้ */}
                   <p className="text-sm font-semibold text-slate-900 truncate">
                     {displayName}
                   </p>
                   
                   {/* แสดงอีเมลเป็นตัวเล็กๆ ด้านล่างแทน */}
                   <p className="text-xs text-gray-500 truncate">
                     {user?.email}
                   </p>

                   <p className="text-[10px] text-blue-600 font-medium mt-1 uppercase tracking-wider">
                     Administrator
                   </p>
                 </div>
               </DropdownMenuLabel>
               
               <DropdownMenuSeparator />

               <DropdownMenuItem 
                 onClick={handleLogout} 
                 className="text-red-600 cursor-pointer focus:text-red-600 focus:bg-red-50 py-2.5 rounded-lg"
               >
                 <LogOut className="mr-2 h-4 w-4" /> ออกจากระบบ
               </DropdownMenuItem>
             </DropdownMenuContent>
           </DropdownMenu>

        </div>
      </header>

      {/* === เนื้อหาหลัก === */}
      <main className="flex-1 container mx-auto p-4 md:p-8 max-w-7xl animate-fade-in flex flex-col">
         <Outlet /> 
      </main>

      {/* === Footer === */}
      <Footer />

    </div>
  );
};

export default AdminLayout;