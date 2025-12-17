// import { useState } from 'react';
// import { 
//   BarChart3, 
//   Users, 
//   BookOpen, 
//   Settings, 
//   LayoutDashboard,
//   LogOut,
//   ChevronDown,
//   User,
//   PieChart,
//   FileText
// } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';

// // --- Import Dropdown Components (Shadcn UI) ---
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// // --- Import Component ย่อย ---
// // ⚠️ ตรวจสอบว่าไฟล์เหล่านี้มีอยู่จริงในโฟลเดอร์เดียวกัน
// import SystemStats from './SystemStats';
// import SurveyResults from './SurveyResults';
// import UserManagement from './UserManagement'; 
// import ContentManager from './ContentManager'; // <-- หน้าเนื้อหา
// import PracticeHistory from './PracticeHistory'; 
// import SettingsPage from './SettingsPage';     // <-- หน้าโปรไฟล์/ตั้งค่า

// const AdminDashboard = () => {
//   const { signOut, user } = useAuth();
  
//   // State หลัก
//   const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'content' | 'settings'>('stats');
//   const [statsSubTab, setStatsSubTab] = useState<'overview' | 'surveys' | 'practice_history'>('overview');

//   const getDisplayName = () => {
//     return user?.user_metadata?.full_name || user?.email || 'Admin';
//   };

//   const getInitial = () => {
//     return getDisplayName().charAt(0).toUpperCase();
//   };

//   // ฟังก์ชันออกจากระบบ
//   const handleLogout = async () => {
//     await signOut(); 
//     window.location.href = '/'; 
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'stats':
//         return (
//           <div className="space-y-6">
//             <div className="bg-white rounded-lg border p-6 shadow-sm min-h-[500px]">
//                {statsSubTab === 'overview' && (
//                   <SystemStats onNavigate={(page) => {
//                       if(page === 'users') setActiveTab('users');
//                       if(page === 'surveys') setStatsSubTab('surveys');
//                       if(page === 'practice_history') setStatsSubTab('practice_history');
//                   }} />
//                )}
//                {statsSubTab === 'surveys' && (
//                   <SurveyResults onBack={() => setStatsSubTab('overview')} />
//                )}
//                {statsSubTab === 'practice_history' && (
//                   <PracticeHistory onBack={() => setStatsSubTab('overview')} />
//                )}
//             </div>
//           </div>
//         );
        
//       case 'users':
//         return (
//             <div className="bg-white rounded-lg border p-6 shadow-sm min-h-[500px]">
//                 <UserManagement />
//             </div>
//         );
        
//       case 'content': // <-- ส่วนแสดงหน้าเนื้อหา (ContentManager)
//         return (
//             <div className="bg-white rounded-lg border p-6 shadow-sm min-h-[500px]">
//                 <ContentManager />
//             </div>
//         );
      
//       case 'settings':
//         return (
//             <div className="bg-white rounded-lg border p-6 shadow-sm min-h-[500px]">
//                 <SettingsPage />
//             </div>
//         );
        
//       default: return null;
//     }
//   };

//   const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
//     <button
//       onClick={() => setActiveTab(id)}
//       className={`
//         relative flex-1 py-3 px-4 text-sm font-medium transition-all duration-200
//         flex items-center justify-center gap-2 rounded-md
//         ${activeTab === id 
//           ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200' 
//           : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
//         }
//       `}
//     >
//       <Icon className={`w-4 h-4 ${activeTab === id ? 'text-primary' : 'text-gray-400'}`} />
//       {label}
//     </button>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50/50 pb-10">
      
//       {/* === ส่วนหัว (Header) === */}
//       <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
//         <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          
//           {/* Logo Section */}
//           <div className="flex items-center gap-3">
//             <div className="bg-primary/10 p-2 rounded-lg">
//                 <LayoutDashboard className="w-6 h-6 text-primary" />
//             </div>
//             <div className="flex flex-col">
//                  <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none">
//                     Practicing Fast Math Skill
//                  </h1>
                 
//             </div>
//           </div>

//           {/* Right Section: Profile Dropdown */}
//           <div className="flex items-center gap-4">
             
//              <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                     <button className="flex items-center gap-3 pl-4 border-l ml-4 border-gray-200 h-10 hover:bg-gray-50 rounded-lg pr-2 transition-all outline-none group">
//                         <div className="hidden md:flex flex-col items-end mr-1 text-right">
//                            <span className="text-sm font-semibold text-gray-800 leading-none group-hover:text-blue-600 transition-colors">
//                                {getDisplayName()}
//                            </span>
//                            <span className="text-[10px] text-gray-500 mt-1">
//                                Admin
//                            </span>
//                         </div>
                        
//                         <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-white text-lg">
//                            {getInitial()}
//                         </div>
//                         <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
//                     </button>
//                 </DropdownMenuTrigger>
                
//                 <DropdownMenuContent align="end" className="w-64 p-2 shadow-xl border-gray-100 rounded-xl">
//                     <DropdownMenuLabel className="font-normal">
//                         <div className="flex flex-col space-y-1 p-2">
//                             <p className="text-base font-semibold leading-none">{getDisplayName()}</p>
//                             <p className="text-xs leading-none text-muted-foreground mt-1">{user?.email}</p>
//                             <p className="text-xs text-blue-600 mt-1">Admin</p>
//                         </div>
//                     </DropdownMenuLabel>
//                     <DropdownMenuSeparator />
                    
//                     {/* เมนูย่อย: เมื่อกดโปรไฟล์ ให้ไปหน้า Settings */}
//                     {/* <DropdownMenuItem onClick={() => setActiveTab('settings')} className="cursor-pointer py-2.5 px-3 rounded-lg focus:bg-blue-50 focus:text-blue-700">
//                         <User className="mr-3 h-4 w-4 text-gray-500" />
//                         <span className="font-medium">โปรไฟล์</span>
//                     </DropdownMenuItem> */}
                     
//                     <DropdownMenuSeparator />
                    
//                     <DropdownMenuItem onClick={handleLogout} className="cursor-pointer py-2.5 px-3 rounded-lg text-red-600 focus:text-red-700 focus:bg-red-50 mt-1">
//                         <LogOut className="mr-3 h-4 w-4" />
//                         <span className="font-semibold">ออกจากระบบ</span>
//                     </DropdownMenuItem>
//                 </DropdownMenuContent>
//              </DropdownMenu>

//           </div>

//         </div>
//       </header>

//       {/* === เนื้อหาหลัก (Main Container) === */}
//       <main className="container mx-auto max-w-6xl px-4 py-8 space-y-6">
        
//         <div>
//             <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
//             <p className="text-gray-500">ภาพรวมระบบของเว็บแอปพลิเคชันฝึกการคิดเลขเร็ว</p>
//         </div>

//         {/* === เมนูแนวนอน === */}
//         <div className="bg-white p-1 rounded-xl flex flex-col sm:flex-row gap-1 border shadow-sm">
//             <TabButton id="stats" label="สถิติการใช้งาน" icon={BarChart3} />
//             <TabButton id="users" label="ผู้ใช้" icon={Users} />
//             {/* ปุ่มเนื้อหาอยู่นี่ครับ 👇 */}
//             <TabButton id="content" label="เนื้อหา" icon={BookOpen} />
//             <TabButton id="settings" label="ตั้งค่า" icon={Settings} />
//         </div>

//         {/* พื้นที่แสดงเนื้อหา */}
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//            {renderContent()}
//         </div>

//       </main>
//     </div>
//   );
// };

// export default AdminDashboard;


// import { useState } from 'react';
// import { 
//   BarChart3, 
//   Users, 
//   BookOpen, 
//   Settings, 
//   LayoutDashboard,
//   LogOut,
//   ChevronDown,
// //   User, // Unused
// //   PieChart, // Unused
// //   FileText // Unused
// } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';

// // --- Import Dropdown Components (Shadcn UI) ---
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// // --- Import Component ย่อย ---
// import SystemStats from './SystemStats';
// import SurveyResults from './SurveyResults';
// import UserManagement from './UserManagement'; 
// import ContentManager from './ContentManager'; 
// import PracticeHistory from './PracticeHistory'; 
// import SettingsPage from './SettingsPage'; 

// const AdminDashboard = () => {
//   const { signOut, user } = useAuth();
//   const currentYear = new Date().getFullYear(); // ดึงปีปัจจุบัน
  
//   // State หลัก
//   const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'content' | 'settings'>('stats');
//   const [statsSubTab, setStatsSubTab] = useState<'overview' | 'surveys' | 'practice_history'>('overview');

//   const getDisplayName = () => {
//     return user?.user_metadata?.full_name || user?.email || 'Admin';
//   };

//   const getInitial = () => {
//     return getDisplayName().charAt(0).toUpperCase();
//   };

//   // ฟังก์ชันออกจากระบบ
//   const handleLogout = async () => {
//     await signOut(); 
//     window.location.href = '/'; 
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'stats':
//         return (
//           <div className="space-y-6">
//             <div className="bg-white rounded-lg border p-6 shadow-sm min-h-[500px]">
//                {statsSubTab === 'overview' && (
//                   <SystemStats onNavigate={(page) => {
//                       if(page === 'users') setActiveTab('users');
//                       if(page === 'surveys') setStatsSubTab('surveys');
//                       if(page === 'practice_history') setStatsSubTab('practice_history');
//                   }} />
//                )}
//                {statsSubTab === 'surveys' && (
//                   <SurveyResults onBack={() => setStatsSubTab('overview')} />
//                )}
//                {statsSubTab === 'practice_history' && (
//                   <PracticeHistory onBack={() => setStatsSubTab('overview')} />
//                )}
//             </div>
//           </div>
//         );
        
//       case 'users':
//         return (
//             <div className="bg-white rounded-lg border p-6 shadow-sm min-h-[500px]">
//                 <UserManagement />
//             </div>
//         );
        
//       case 'content': 
//         return (
//             <div className="bg-white rounded-lg border p-6 shadow-sm min-h-[500px]">
//                 <ContentManager />
//             </div>
//         );
      
//       case 'settings':
//         return (
//             <div className="bg-white rounded-lg border p-6 shadow-sm min-h-[500px]">
//                 <SettingsPage />
//             </div>
//         );
        
//       default: return null;
//     }
//   };

//   const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
//     <button
//       onClick={() => setActiveTab(id)}
//       className={`
//         relative flex-1 py-3 px-4 text-sm font-medium transition-all duration-200
//         flex items-center justify-center gap-2 rounded-md
//         ${activeTab === id 
//           ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200' 
//           : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
//         }
//       `}
//     >
//       <Icon className={`w-4 h-4 ${activeTab === id ? 'text-primary' : 'text-gray-400'}`} />
//       {label}
//     </button>
//   );

//   return (
//     // ปรับ Layout เป็น Flex Column เพื่อจัด Footer ให้ลงล่างสุด
//     <div className="min-h-screen bg-gray-50/50 flex flex-col">
      
//       {/* === ส่วนหัว (Header) === */}
//       <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
//         <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
          
//           {/* Logo Section */}
//           <div className="flex items-center gap-3">
//             <div className="bg-primary/10 p-2 rounded-lg">
//                 <LayoutDashboard className="w-6 h-6 text-primary" />
//             </div>
//             <div className="flex flex-col">
//                  <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none">
//                     Practicing Fast Math Skill
//                  </h1>
                 
//             </div>
//           </div>

//           {/* Right Section: Profile Dropdown */}
//           <div className="flex items-center gap-4">
              
//              <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                     <button className="flex items-center gap-3 pl-4 border-l ml-4 border-gray-200 h-10 hover:bg-gray-50 rounded-lg pr-2 transition-all outline-none group">
//                         <div className="hidden md:flex flex-col items-end mr-1 text-right">
//                            <span className="text-sm font-semibold text-gray-800 leading-none group-hover:text-blue-600 transition-colors">
//                                {getDisplayName()}
//                            </span>
//                            <span className="text-[10px] text-gray-500 mt-1">
//                                Admin
//                            </span>
//                         </div>
                        
//                         <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-white text-lg">
//                            {getInitial()}
//                         </div>
//                         <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
//                     </button>
//                 </DropdownMenuTrigger>
                
//                 <DropdownMenuContent align="end" className="w-64 p-2 shadow-xl border-gray-100 rounded-xl">
//                     <DropdownMenuLabel className="font-normal">
//                         <div className="flex flex-col space-y-1 p-2">
//                             <p className="text-base font-semibold leading-none">{getDisplayName()}</p>
//                             <p className="text-xs leading-none text-muted-foreground mt-1">{user?.email}</p>
//                             <p className="text-xs text-blue-600 mt-1">Admin</p>
//                         </div>
//                     </DropdownMenuLabel>
//                     <DropdownMenuSeparator />
                    
//                     <DropdownMenuItem onClick={handleLogout} className="cursor-pointer py-2.5 px-3 rounded-lg text-red-600 focus:text-red-700 focus:bg-red-50 mt-1">
//                         <LogOut className="mr-3 h-4 w-4" />
//                         <span className="font-semibold">ออกจากระบบ</span>
//                     </DropdownMenuItem>
//                 </DropdownMenuContent>
//              </DropdownMenu>

//           </div>

//         </div>
//       </header>

//       {/* === เนื้อหาหลัก (Main Container) === */}
//       {/* เพิ่ม flex-1 เพื่อให้ content ยืดเต็มพื้นที่ที่เหลือ */}
//       <main className="container mx-auto max-w-6xl px-4 py-8 space-y-6 flex-1">
        
//         <div>
//             <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
//             <p className="text-gray-500">ภาพรวมระบบของเว็บแอปพลิเคชันฝึกการคิดเลขเร็ว</p>
//         </div>

//         {/* === เมนูแนวนอน === */}
//         <div className="bg-white p-1 rounded-xl flex flex-col sm:flex-row gap-1 border shadow-sm">
//             <TabButton id="stats" label="สถิติการใช้งาน" icon={BarChart3} />
//             <TabButton id="users" label="ผู้ใช้" icon={Users} />
//             <TabButton id="content" label="เนื้อหา" icon={BookOpen} />
//             <TabButton id="settings" label="ตั้งค่า" icon={Settings} />
//         </div>

//         {/* พื้นที่แสดงเนื้อหา */}
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//            {renderContent()}
//         </div>

//       </main>

//       {/* --- Footer Start --- */}
//       <footer className="w-full py-6 text-center border-t border-slate-200/50 bg-white">
//           <div className="container mx-auto px-4">
//             <p className="text-xs md:text-sm text-muted-foreground/70 font-light">
//               &copy; {currentYear} ภาควิชาคอมพิวเตอร์ คณะวิทยาศาสตร์และเทคโนโลยี 
//               <span className="hidden sm:inline"> • </span> 
//               <br className="sm:hidden" /> 
//               มหาวิทยาลัยราชภัฏเชียงใหม่
//             </p>
//           </div>
//       </footer>
//       {/* --- Footer End --- */}

//     </div>
//   );
// };

// export default AdminDashboard;



// import { useState } from 'react';
// import { 
//   BarChart3, 
//   Users, 
//   BookOpen, 
//   Settings, 
//   LayoutDashboard,
//   LogOut,
//   ChevronDown,
//   Loader2 // ✅ 1. เพิ่ม Loader2 สำหรับทำ Animation หมุนๆ
// } from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext';

// // --- Import Dropdown Components (Shadcn UI) ---
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";

// // --- Import Component ย่อย ---
// import SystemStats from './SystemStats';
// import SurveyResults from './SurveyResults';
// import UserManagement from './UserManagement'; 
// import ContentManager from './ContentManager'; 
// import PracticeHistory from './PracticeHistory'; 
// import SettingsPage from './SettingsPage'; 

// const AdminDashboard = () => {
//   // ✅ 2. ดึง loading ออกมาจาก useAuth เพื่อเช็คสถานะ
//   const { signOut, user, loading } = useAuth();
//   const currentYear = new Date().getFullYear();
  
//   const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'content' | 'settings'>('stats');
//   const [statsSubTab, setStatsSubTab] = useState<'overview' | 'surveys' | 'practice_history'>('overview');

//   // ✅ 3. ส่วนสำคัญ: ถ้ากำลังโหลด ให้แสดงหน้า Loading แทนหน้า Admin
//   if (loading) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50/50">
//         <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
//         <p className="text-muted-foreground font-medium">กำลังโหลดข้อมูลระบบ...</p>
//       </div>
//     );
//   }

//   // ✅ 4. ถ้าโหลดเสร็จแล้วแต่ไม่มี User (หลุด) ให้ return null ไปก่อน (เดี๋ยวระบบจะดีดไปหน้า Login เอง)
//   if (!user) {
//       return null;
//   }

//   const getDisplayName = () => {
//     return user?.user_metadata?.full_name || user?.email || 'Admin';
//   };

//   const getInitial = () => {
//     return getDisplayName().charAt(0).toUpperCase();
//   };

//   const handleLogout = async () => {
//     await signOut(); 
//     window.location.href = '/'; 
//   };

//   const renderContent = () => {
//     switch (activeTab) {
//       case 'stats':
//         return (
//           <div className="space-y-6">
//             <div className="bg-white rounded-lg border p-6 shadow-sm min-h-[500px]">
//                {statsSubTab === 'overview' && (
//                   <SystemStats onNavigate={(page) => {
//                       if(page === 'users') setActiveTab('users');
//                       if(page === 'surveys') setStatsSubTab('surveys');
//                       if(page === 'practice_history') setStatsSubTab('practice_history');
//                   }} />
//                )}
//                {statsSubTab === 'surveys' && (
//                   <SurveyResults onBack={() => setStatsSubTab('overview')} />
//                )}
//                {statsSubTab === 'practice_history' && (
//                   <PracticeHistory onBack={() => setStatsSubTab('overview')} />
//                )}
//             </div>
//           </div>
//         );
//       case 'users':
//         return <div className="bg-white rounded-lg border p-6 shadow-sm min-h-[500px]"><UserManagement /></div>;
//       case 'content': 
//         return <div className="bg-white rounded-lg border p-6 shadow-sm min-h-[500px]"><ContentManager /></div>;
//       case 'settings':
//         return <div className="bg-white rounded-lg border p-6 shadow-sm min-h-[500px]"><SettingsPage /></div>;
//       default: return null;
//     }
//   };

//   const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
//     <button
//       onClick={() => setActiveTab(id)}
//       className={`
//         relative flex-1 py-3 px-4 text-sm font-medium transition-all duration-200
//         flex items-center justify-center gap-2 rounded-md
//         ${activeTab === id 
//           ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200' 
//           : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
//         }
//       `}
//     >
//       <Icon className={`w-4 h-4 ${activeTab === id ? 'text-primary' : 'text-gray-400'}`} />
//       {label}
//     </button>
//   );

//   return (
//     <div className="min-h-screen bg-gray-50/50 flex flex-col">
//       <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
//         <div className="container mx-auto max-w-6xl px-4 h-16 flex items-center justify-between">
//           <div className="flex items-center gap-3">
//             <div className="bg-primary/10 p-2 rounded-lg">
//                 <LayoutDashboard className="w-6 h-6 text-primary" />
//             </div>
//             <div className="flex flex-col">
//                  <h1 className="text-xl font-bold tracking-tight text-gray-900 leading-none">
//                     Practicing Fast Math Skill
//                  </h1>
//             </div>
//           </div>
//           <div className="flex items-center gap-4">
//              <DropdownMenu>
//                 <DropdownMenuTrigger asChild>
//                     <button className="flex items-center gap-3 pl-4 border-l ml-4 border-gray-200 h-10 hover:bg-gray-50 rounded-lg pr-2 transition-all outline-none group">
//                         <div className="hidden md:flex flex-col items-end mr-1 text-right">
//                            <span className="text-sm font-semibold text-gray-800 leading-none group-hover:text-blue-600 transition-colors">
//                                {getDisplayName()}
//                            </span>
//                            <span className="text-[10px] text-gray-500 mt-1">Admin</span>
//                         </div>
//                         <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold shadow-sm ring-2 ring-white text-lg">
//                            {getInitial()}
//                         </div>
//                         <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
//                     </button>
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent align="end" className="w-64 p-2 shadow-xl border-gray-100 rounded-xl">
//                     <DropdownMenuLabel className="font-normal">
//                         <div className="flex flex-col space-y-1 p-2">
//                             <p className="text-base font-semibold leading-none">{getDisplayName()}</p>
//                             <p className="text-xs leading-none text-muted-foreground mt-1">{user?.email}</p>
//                             <p className="text-xs text-blue-600 mt-1">Admin</p>
//                         </div>
//                     </DropdownMenuLabel>
//                     <DropdownMenuSeparator />
//                     <DropdownMenuItem onClick={handleLogout} className="cursor-pointer py-2.5 px-3 rounded-lg text-red-600 focus:text-red-700 focus:bg-red-50 mt-1">
//                         <LogOut className="mr-3 h-4 w-4" />
//                         <span className="font-semibold">ออกจากระบบ</span>
//                     </DropdownMenuItem>
//                 </DropdownMenuContent>
//              </DropdownMenu>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto max-w-6xl px-4 py-8 space-y-6 flex-1">
//         <div>
//             <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
//             <p className="text-gray-500">ภาพรวมระบบของเว็บแอปพลิเคชันฝึกการคิดเลขเร็ว</p>
//         </div>
//         <div className="bg-white p-1 rounded-xl flex flex-col sm:flex-row gap-1 border shadow-sm">
//             <TabButton id="stats" label="สถิติการใช้งาน" icon={BarChart3} />
//             <TabButton id="users" label="ผู้ใช้" icon={Users} />
//             <TabButton id="content" label="เนื้อหา" icon={BookOpen} />
//             <TabButton id="settings" label="ตั้งค่า" icon={Settings} />
//         </div>
//         <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
//            {renderContent()}
//         </div>
//       </main>

//       <footer className="w-full py-6 text-center border-t border-slate-200/50 bg-white">
//           <div className="container mx-auto px-4">
//             <p className="text-xs md:text-sm text-muted-foreground/70 font-light">
//               &copy; {currentYear} ภาควิชาคอมพิวเตอร์ คณะวิทยาศาสตร์และเทคโนโลยี 
//               <span className="hidden sm:inline"> • </span> 
//               <br className="sm:hidden" /> 
//               มหาวิทยาลัยราชภัฏเชียงใหม่
//             </p>
//           </div>
//       </footer>
//     </div>
//   );
// };

// export default AdminDashboard;






import { useState } from 'react';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Settings, 
  Loader2 
} from 'lucide-react';
// import { useAuth } from '@/contexts/AuthContext'; // ไม่จำเป็นต้องใช้แล้วในหน้านี้

// --- Import Component ย่อย ---
import SystemStats from './SystemStats';
import SurveyResults from './SurveyResults';
import UserManagement from './UserManagement'; 
import ContentManager from './ContentManager'; 
import PracticeHistory from './PracticeHistory'; 
import SettingsPage from './SettingsPage'; 

const AdminDashboard = () => {
  // ไม่ต้องดึง user หรือ signOut ที่นี่แล้ว เพราะ Layout จัดการให้หมดแล้ว
  
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'content' | 'settings'>('stats');
  const [statsSubTab, setStatsSubTab] = useState<'overview' | 'surveys' | 'practice_history'>('overview');

  const renderContent = () => {
    switch (activeTab) {
      case 'stats':
        return (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6 shadow-sm min-h-[500px]">
               {statsSubTab === 'overview' && (
                  <SystemStats onNavigate={(page) => {
                      if(page === 'users') setActiveTab('users');
                      if(page === 'surveys') setStatsSubTab('surveys');
                      if(page === 'practice_history') setStatsSubTab('practice_history');
                  }} />
               )}
               {statsSubTab === 'surveys' && (
                  <SurveyResults onBack={() => setStatsSubTab('overview')} />
               )}
               {statsSubTab === 'practice_history' && (
                  <PracticeHistory onBack={() => setStatsSubTab('overview')} />
               )}
            </div>
          </div>
        );
      case 'users':
        return <div className="bg-white rounded-lg border p-6 shadow-sm min-h-[500px]"><UserManagement /></div>;
      case 'content': 
        return <div className="bg-white rounded-lg border p-6 shadow-sm min-h-[500px]"><ContentManager /></div>;
      case 'settings':
        return <div className="bg-white rounded-lg border p-6 shadow-sm min-h-[500px]"><SettingsPage /></div>;
      default: return null;
    }
  };

  const TabButton = ({ id, label, icon: Icon }: { id: typeof activeTab, label: string, icon: any }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`
        relative flex-1 py-3 px-4 text-sm font-medium transition-all duration-200
        flex items-center justify-center gap-2 rounded-md
        ${activeTab === id 
          ? 'bg-white text-primary shadow-sm ring-1 ring-gray-200' 
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100/50'
        }
      `}
    >
      <Icon className={`w-4 h-4 ${activeTab === id ? 'text-primary' : 'text-gray-400'}`} />
      {label}
    </button>
  );

  return (
    <div className="space-y-6">
      
      {/* ส่วนหัวข้อของ Dashboard (Title) */}
      <div>
          <h2 className="text-2xl font-bold text-gray-800">Admin Dashboard</h2>
          <p className="text-gray-500">ภาพรวมระบบของเว็บแอปพลิเคชันฝึกการคิดเลขเร็ว</p>
      </div>

      {/* แถบเมนูเปลี่ยน Tab */}
      <div className="bg-white p-1 rounded-xl flex flex-col sm:flex-row gap-1 border shadow-sm">
          <TabButton id="stats" label="สถิติการใช้งาน" icon={BarChart3} />
          <TabButton id="users" label="ผู้ใช้" icon={Users} />
          <TabButton id="content" label="เนื้อหา" icon={BookOpen} />
          <TabButton id="settings" label="ตั้งค่า" icon={Settings} />
      </div>

      {/* พื้นที่แสดงเนื้อหา */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
         {renderContent()}
      </div>

    </div>
  );
};

export default AdminDashboard;