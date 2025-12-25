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