

// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// // --- Layouts ---
// import UserLayout from "./components/layouts/UserLayout"; 
// import AdminLayout from "./components/layouts/AdminLayout"; 

// // --- Pages ---
// import Index from "./pages/Index";
// import ModeSelection from "./pages/ModeSelection";
// import NotFound from "./pages/NotFound";
// import Practice from "./pages/Practice";
// import Stats from "./pages/Stats";
// import Survey from "./pages/Survey";
// import Auth from "./pages/Auth";
// import { Profile } from "./pages/Profile";

// // Import หน้า Dashboard
// import AdminDashboard from "./components/admin/admindashboard"; 

// const queryClient = new QueryClient();

// // === กำหนดอีเมลแอดมิน ===
// const adminEmails = ["praengkhong@gmail.com", ''];

// // ----------------------------------------------------------------------
// // 1. เพิ่มตัวช่วยใหม่: AdminRedirector
// // หน้าที่: ถ้าเป็น Admin ห้ามเข้าหน้าแรก ให้ดีดไปหน้า Admin ทันที
// // ----------------------------------------------------------------------
// const AdminRedirector = ({ children }: { children: JSX.Element }) => {
//   const { user, loading } = useAuth();
//   if (loading) return null;

//   // ถ้าล็อกอินแล้ว และเป็น Admin
//   if (user && adminEmails.includes(user.email || '')) {
//      return <Navigate to="/admin" replace />;
//   }

//   // ถ้าไม่ใช่ Admin ก็แสดงหน้านั้นตามปกติ
//   return children;
// };
// // ----------------------------------------------------------------------

// // === ตัวคัดกรองสิทธิ์ (RouteGuard) ===
// const RouteGuard = ({ children, type }: { children: JSX.Element, type: 'auth' | 'admin' | 'guest' }) => {
//   const { user, loading } = useAuth();

//   if (loading) return null;

//   if (type === 'guest' && user) {
//     if (adminEmails.includes(user.email || '')) {
//         return <Navigate to="/admin" replace />; 
//     }
//     return <Navigate to="/" replace />;
//   }

//   if (type === 'auth' && !user) {
//     return <Navigate to="/auth" replace />;
//   }

//   if (type === 'admin') {
//     if (!user) return <Navigate to="/auth" replace />;
//     if (!adminEmails.includes(user.email || '')) {
//         return <Navigate to="/" replace />;
//     }
//   }

//   return children;
// };

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <AuthProvider>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <Routes>
            
//             {/* === ZONE 1: User === */}
//             <Route element={<UserLayout />}>
              
//               {/* แก้ตรงนี้! เอา AdminRedirector มาครอบหน้า Index 
//                   ผลลัพธ์: ถ้า Admin หลงเข้ามาหน้านี้ จะถูกดีดไป Dashboard ทันที
//               */}
//               <Route path="/" element={
//                 <AdminRedirector>
//                    <Index />
//                 </AdminRedirector>
//               } />
              
//               <Route path="/auth" element={
//                 <RouteGuard type="guest">
//                   <Auth />
//                 </RouteGuard>
//               } />

//               <Route path="/mode-selection" element={<ModeSelection />} />
//               <Route path="/practice" element={<Practice />} />

//               <Route path="/stats" element={
//                 <RouteGuard type="auth">
//                   <Stats />
//                 </RouteGuard>
//               } />
//               <Route path="/survey" element={
//                 <RouteGuard type="auth">
//                   <Survey />
//                 </RouteGuard>
//               } />
//               <Route path="/profile" element={
//                 <RouteGuard type="auth">
//                   <Profile />
//                 </RouteGuard>
//               } />
//             </Route>

//             {/* === ZONE 2: ADMIN === */}
//             <Route path="/admin" element={
//               <RouteGuard type="admin">
//                 <AdminLayout />
//               </RouteGuard>
//             }>
//               <Route index element={<AdminDashboard />} />
//             </Route>

//             <Route path="*" element={<NotFound />} />

//           </Routes>
//         </BrowserRouter>
//       </TooltipProvider>
//     </AuthProvider>
//   </QueryClientProvider>
// );

// export default App;



import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

// --- Layouts ---
import UserLayout from "./components/layouts/UserLayout"; 
import AdminLayout from "./components/layouts/AdminLayout"; 

// --- Pages ---
import Index from "./pages/Index";
import ModeSelection from "./pages/ModeSelection";
import NotFound from "./pages/NotFound";
import Practice from "./pages/Practice";
import Stats from "./pages/Stats";
import Survey from "./pages/Survey";
import Auth from "./pages/Auth";
import { Profile } from "./pages/Profile";

// Import หน้า Dashboard
import AdminDashboard from "./components/admin/admindashboard"; 

const queryClient = new QueryClient();

// === กำหนดอีเมลแอดมิน ===
const adminEmails = ["praengkhong@gmail.com"];

// --- Component แสดงผลตอนโหลด (Loading Screen) ---
const LoadingScreen = () => (
  <div className="fixed inset-0 z-[9999] flex h-screen w-full items-center justify-center bg-white/95 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
      <p className="text-muted-foreground font-medium animate-pulse">กำลังตรวจสอบข้อมูล...</p>
    </div>
  </div>
);

// ----------------------------------------------------------------------
// 1. AdminRedirector: ถ้าเป็น Admin ห้ามเข้าหน้าแรก ให้ดีดไปหน้า Admin ทันที
// ----------------------------------------------------------------------
const AdminRedirector = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  
  // ถ้ากำลังโหลด ให้โชว์ LoadingScreen ค้างไว้เลย
  if (loading) return <LoadingScreen />;

  // ถ้าล็อกอินแล้ว และเป็น Admin -> ดีดไป /admin
  if (user && adminEmails.includes(user.email || '')) {
     return <Navigate to="/admin" replace />;
  }

  // ถ้าไม่ใช่ Admin -> แสดงเนื้อหาตามปกติ (children)
  return children;
};

// ----------------------------------------------------------------------
// 2. RouteGuard: ตัวคัดกรองสิทธิ์หลัก
// ----------------------------------------------------------------------
const RouteGuard = ({ children, type }: { children: JSX.Element, type: 'auth' | 'admin' | 'guest' }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingScreen />;

  // Guest: ถ้าล็อกอินแล้ว ห้ามเข้า (เช่นหน้า Login)
  if (type === 'guest' && user) {
    if (adminEmails.includes(user.email || '')) {
        return <Navigate to="/admin" replace />; 
    }
    return <Navigate to="/" replace />;
  }

  // Auth: ต้องล็อกอิน
  if (type === 'auth' && !user) {
    return <Navigate to="/auth" replace />;
  }

  // Admin: ต้องเป็น Admin
  if (type === 'admin') {
    if (!user) return <Navigate to="/auth" replace />;
    if (!adminEmails.includes(user.email || '')) {
        return <Navigate to="/" replace />; 
    }
  }

  return children;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <Routes>
            
            {/* === ZONE 1: Public / Redirect Logic === 
                Logic พิเศษสำหรับหน้าแรก: 
                เช็ค Admin ก่อน -> ถ้าผ่าน (ไม่ใช่ Admin) ค่อย render UserLayout -> Index
            */}
            <Route path="/" element={
                <AdminRedirector>
                   <UserLayout>
                      <Index />
                   </UserLayout>
                </AdminRedirector>
            } />
            
            {/* === ZONE 2: Guest (Login/Register) === */}
            <Route path="/auth" element={
              <RouteGuard type="guest">
                <Auth />
              </RouteGuard>
            } />

            {/* === ZONE 3: User Routes (Protected) === */}
            {/* หน้า User อื่นๆ ใช้ UserLayout ครอบแบบปกติ (ผ่าน Outlet) */}
            <Route element={<UserLayout />}>
              <Route path="/mode-selection" element={<ModeSelection />} />
              <Route path="/practice" element={<Practice />} />

              <Route path="/stats" element={
                <RouteGuard type="auth">
                  <Stats />
                </RouteGuard>
              } />
              <Route path="/survey" element={
                <RouteGuard type="auth">
                  <Survey />
                </RouteGuard>
              } />
              <Route path="/profile" element={
                <RouteGuard type="auth">
                  <Profile />
                </RouteGuard>
              } />
            </Route>

            {/* === ZONE 4: ADMIN === */}
            <Route path="/admin" element={
              <RouteGuard type="admin">
                <AdminLayout />
              </RouteGuard>
            }>
              <Route index element={<AdminDashboard />} />
            </Route>

            {/* 404 Not Found */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;




