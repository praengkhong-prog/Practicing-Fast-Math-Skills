// import { Outlet } from "react-router-dom";
// import Header from "@/components/layouts/Header"; // ตรวจสอบว่าไฟล์ Header อยู่ที่ path นี้จริงไหม

// const UserLayout = () => {
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Header /> {/* แสดงเมนูแบบ User */}
//       <main className="flex-1 container mx-auto px-4 py-8">
//         <Outlet /> {/* เนื้อหาแต่ละหน้าจะมาโผล่ตรงนี้ */}
//       </main>
//     </div>
//   );
// };

// export default UserLayout;


import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
// ⚠️ ตรวจสอบ Path ของ Header ให้ถูกต้องตามโปรเจกต์คุณนะครับ
// เช่นถ้า Header อยู่ใน components/Header.tsx ก็ใช้ import Header from "../../components/Header";
import Header from "@/components/layouts/Header"; 

interface UserLayoutProps {
  children?: ReactNode; // ✅ เพิ่มบรรทัดนี้เพื่อให้รับ children ได้
}

const UserLayout = ({ children }: UserLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* ส่วน Header */}
      <Header /> 

      {/* ส่วนเนื้อหาหลัก */}
      <main className="flex-1">
        {/* Logic: ถ้ามี children (เช่นหน้า Index) ให้แสดง children, ถ้าไม่มีให้แสดง Outlet (หน้าอื่นๆ) */}
        {children ? children : <Outlet />}
      </main>

      {/* ถ้ามี Footer ก็ใส่ตรงนี้ */}
      {/* <Footer /> */}
    </div>
  );
};

export default UserLayout;