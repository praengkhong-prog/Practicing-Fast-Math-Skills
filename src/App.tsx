// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route } from "react-router-dom";
// import { AuthProvider } from "@/contexts/AuthContext";
// import ProtectedRoute from "@/components/ProtectedRoute";
// import Index from "./pages/Index";
// import ModeSelection from "./pages/ModeSelection";
// import NotFound from "./pages/NotFound";
// import Practice from "./pages/Practice";
// import Stats from "./pages/Stats";
// import Survey from "./pages/Survey";
// import Admin from "./pages/Admin";
// import Auth from "./pages/Auth";
// import Header from "./components/layouts/Header";
// import { Profile } from "./pages/Profile";

// const queryClient = new QueryClient();

// const App = () => (
//   <QueryClientProvider client={queryClient}>
//     <AuthProvider>
//       <TooltipProvider>
//         <Toaster />
//         <Sonner />
//         <BrowserRouter>
//           <Header />
//           <Routes>
//             <Route path="/" element={
//               <ProtectedRoute allowGuest>
//                 <Index />
//               </ProtectedRoute>
//             } />
//             <Route path="/auth" element={<Auth />} />
//             <Route path="/mode-selection" element={
//               <ProtectedRoute allowGuest>
//                 <ModeSelection />
//               </ProtectedRoute>
//             } />
//             <Route path="/practice" element={
//               <ProtectedRoute allowGuest>
//                 <Practice />
//               </ProtectedRoute>
//             } />
//             <Route path="/stats" element={
//               <ProtectedRoute>
//                 <Stats />
//               </ProtectedRoute>
//             } />
//             <Route path="/survey" element={
//               <ProtectedRoute>
//                 <Survey />
//               </ProtectedRoute>
//             } />
//             <Route path="/admin" element={
//               <ProtectedRoute requireAdmin>
//                 <Admin />
//               </ProtectedRoute>
//             } />
//             <Route path="/profile" element={
//               <ProtectedRoute>
//                 <Profile />
//               </ProtectedRoute>
//             } />
//             {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
//             <Route path="*" element={<NotFound />} />
//           </Routes>
//         </BrowserRouter>
//       </TooltipProvider>
//     </AuthProvider>
//   </QueryClientProvider>
// );

// export default App;


// import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
// import { TooltipProvider } from "@/components/ui/tooltip";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // เพิ่ม Navigate
// import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// // --- Layouts ---
// // ถ้ายังไม่ได้สร้างไฟล์ UserLayout ให้แจ้งผมนะครับ เดี๋ยวผมส่งโค้ดให้
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

// // เปลี่ยนจาก Admin ธรรมดา เป็น AdminDashboard
// import AdminDashboard from "./components/admin/ContentManager"; 

// const queryClient = new QueryClient();

// // === ส่วนกำหนดอีเมลแอดมิน (แก้ตรงนี้) ===
// const adminEmails = ["admin@example.com", "admin@gmail.com"];

// // === ตัวคัดกรองสิทธิ์ (RouteGuard) ===
// const RouteGuard = ({ children, type }: { children: JSX.Element, type: 'auth' | 'admin' | 'guest' }) => {
//   const { user, loading } = useAuth();

//   if (loading) return null; // หรือใส่ Loading Spinner

//   // 1. Guest: ถ้าล็อกอินแล้ว ห้ามเข้าหน้า Login ให้เด้งไปหน้าแรก
//   if (type === 'guest' && user) {
//     return <Navigate to="/" replace />;
//   }

//   // 2. Auth: ต้องล็อกอินเท่านั้นถึงเข้าได้
//   if (type === 'auth' && !user) {
//     return <Navigate to="/auth" replace />;
//   }

//   // 3. Admin: ต้องล็อกอิน + อีเมลตรงกับที่ระบุ
//   if (type === 'admin') {
//     if (!user) return <Navigate to="/auth" replace />;
//     if (!adminEmails.includes(user.email || '')) {
//         // ถ้าไม่ใช่อีเมลแอดมิน ให้เด้งกลับหน้าแรก
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
            
//             {/* === ZONE 1: ผู้ใช้งานทั่วไป (ใช้ UserLayout) === */}
//             <Route element={<UserLayout />}>
              
//               {/* หน้าแรก (เข้าได้ทุกคน) */}
//               <Route path="/" element={<Index />} />
              
//               {/* หน้า Login (เข้าได้เฉพาะคนยังไม่ล็อกอิน) */}
//               <Route path="/auth" element={
//                 <RouteGuard type="guest">
//                   <Auth />
//                 </RouteGuard>
//               } />

//               {/* หน้าที่ต้องล็อกอินก่อน */}
//               <Route path="/mode-selection" element={
//                 <RouteGuard type="auth">
//                   <ModeSelection />
//                 </RouteGuard>
//               } />
//               <Route path="/practice" element={
//                 <RouteGuard type="auth">
//                   <Practice />
//                 </RouteGuard>
//               } />
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

//             {/* === ZONE 2: ADMIN (ใช้ AdminLayout) === */}
//             <Route path="/admin" element={
//               <RouteGuard type="admin">
//                 <AdminLayout />
//               </RouteGuard>
//             }>
//               {/* เมื่อเข้า /admin ให้แสดง Dashboard */}
//               <Route index element={<AdminDashboard />} />
//             </Route>

//             {/* === 404 Not Found === */}
//             <Route path="*" element={<NotFound />} />

//           </Routes>
//         </BrowserRouter>
//       </TooltipProvider>
//     </AuthProvider>
//   </QueryClientProvider>
// );

// export default App;




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

// // เปลี่ยนจาก Admin ธรรมดา เป็น AdminDashboard (ContentManager)
// import AdminDashboard from "./components/admin/admindashboard"; 

// const queryClient = new QueryClient();

// // === ส่วนกำหนดอีเมลแอดมิน ===
// const adminEmails = ["praengkhong@gmail.com", ''];

// // === ตัวคัดกรองสิทธิ์ (RouteGuard) ===
// const RouteGuard = ({ children, type }: { children: JSX.Element, type: 'auth' | 'admin' | 'guest' }) => {
//   const { user, loading } = useAuth();

//   if (loading) return null;

//   // 1. Guest: ถ้าล็อกอินแล้ว ห้ามเข้าหน้า Login ให้เด้งไปหน้าแรก
//   if (type === 'guest' && user) {
//     return <Navigate to="/" replace />;
//   }

//   // 2. Auth: ต้องล็อกอินเท่านั้นถึงเข้าได้
//   if (type === 'auth' && !user) {
//     return <Navigate to="/auth" replace />;
//   }

//   // 3. Admin: ต้องล็อกอิน + อีเมลตรงกับที่ระบุ
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
            
//             {/* === ZONE 1: ผู้ใช้งานทั่วไป (ใช้ UserLayout) === */}
//             <Route element={<UserLayout />}>
              
//               {/* หน้าแรก (เข้าได้ทุกคน) */}
//               <Route path="/" element={<Index />} />
              
//               {/* หน้า Login (เข้าได้เฉพาะคนยังไม่ล็อกอิน) */}
//               <Route path="/auth" element={
//                 <RouteGuard type="guest">
//                   <Auth />
//                 </RouteGuard>
//               } />

//               {/* --- แก้ไข: ปลดล็อกให้เข้าได้เลย ไม่ต้อง Login --- */}
//               <Route path="/mode-selection" element={<ModeSelection />} />
//               <Route path="/practice" element={<Practice />} />

//               {/* --- ส่วนที่ต้อง Login ถึงจะเข้าได้ --- */}
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

//             {/* === ZONE 2: ADMIN (ใช้ AdminLayout) === */}
//             <Route path="/admin" element={
//               <RouteGuard type="admin">
//                 <AdminLayout />
//               </RouteGuard>
//             }>
//               {/* เมื่อเข้า /admin ให้แสดง ContentManager */}
//               <Route index element={<AdminDashboard />} />
//             </Route>

//             {/* === 404 Not Found === */}
//             <Route path="*" element={<NotFound />} />

//           </Routes>
//         </BrowserRouter>
//       </TooltipProvider>
//     </AuthProvider>
//   </QueryClientProvider>
// );

// export default App;




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