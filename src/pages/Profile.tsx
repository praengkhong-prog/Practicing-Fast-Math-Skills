// import React, { useState, useEffect } from 'react';
// import { User, Mail, Calendar, Settings } from 'lucide-react';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { Textarea } from '@/components/ui/textarea';
// import { ProfileUpload } from '@/components/ProfileUpload';
// import { useToast } from '@/hooks/use-toast';
// import { useAuth } from '@/contexts/AuthContext';
// import { ProfileController } from '@/controllers/ProfileController';
// import { Profile as ProfileModel } from '@/models/User';
// import { config } from '@/config/app';
// import SEO from '@/components/SEO';

// interface Profile {
//   id: string;
//   user_id: string;
//   display_name: string | null;
//   avatar_url: string | null;
//   bio: string | null;
//   created_at: string;
//   updated_at: string;
// }

// export const Profile: React.FC = () => {
//   const [profile, setProfile] = useState<Profile | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [displayName, setDisplayName] = useState('');
//   const [bio, setBio] = useState('');
//   const { user } = useAuth();
//   const { toast } = useToast();

//   useEffect(() => {
//     if (user) {
//       fetchProfile();
//     }
//   }, [user]);

//   const fetchProfile = async () => {
//     if (!user) return;
    
//     const result = await ProfileController.getProfile(user.id);
    
//     if (result.success && result.data) {
//       setProfile(result.data as Profile);
//       setDisplayName(result.data.display_name || '');
//       setBio((result.data as any).bio || '');
//     } else if (result.error) {
//       toast({
//         title: "ข้อผิดพลาด",
//         description: "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้",
//         variant: "destructive"
//       });
//     }
    
//     setLoading(false);
//   };

//   const saveProfile = async () => {
//     if (!user) return;

//     setSaving(true);
    
//     try {
//       // ดึงข้อมูลโปรไฟล์ล่าสุดก่อนบันทึก เพื่อให้แน่ใจว่าได้ avatar_url ที่ถูกต้อง
//       const currentProfileResult = await ProfileController.getProfile(user.id);
//       const currentAvatarUrl = currentProfileResult.success && currentProfileResult.data 
//         ? currentProfileResult.data.avatar_url 
//         : profile?.avatar_url;

//       const updates = {
//         display_name: displayName || null,
//         bio: bio || null,
//         avatar_url: currentAvatarUrl
//       };
      
//       console.log('Saving profile with data:', updates);
      
//       const result = await ProfileController.updateProfile(user.id, updates);
      
//       if (result.success) {
//         setProfile(result.data as Profile);
//         toast({
//           title: "สำเร็จ",
//           description: "บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว"
//         });
//       } else {
//         console.error('Profile update error:', result.error);
//         toast({
//           title: "ข้อผิดพลาด",
//           description: result.error || "ไม่สามารถบันทึกข้อมูลได้",
//           variant: "destructive"
//         });
//       }
//     } catch (error) {
//       console.error('Save profile error:', error);
//       toast({
//         title: "ข้อผิดพลาด",
//         description: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
//         variant: "destructive"
//       });
//     }
    
//     setSaving(false);
//   };

//   const handleAvatarUpdate = (newAvatarUrl: string) => {
//     setProfile(prev => prev ? { ...prev, avatar_url: newAvatarUrl } : null);
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-subtle py-8">
//       <SEO 
//         title="โปรไฟล์ | Brainy Math Boost" 
//         description="จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชีของคุณ"
//         canonical="/profile"
//       />
//       <div className="container mx-auto px-4 max-w-2xl">
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
//             โปรไฟล์ของฉัน
//           </h1>
//           <p className="text-muted-foreground mt-2">
//             จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชี
//           </p>
//         </div>

//         <Card className="backdrop-blur-sm bg-background/95 border-primary/20 shadow-elegant">
//           <CardHeader>
//             <CardTitle className="flex items-center gap-2">
//               <Settings className="w-5 h-5 text-primary" />
//               ข้อมูลโปรไฟล์
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-6">
//             {/* Avatar Upload */}
//             <div className="flex flex-col items-center space-y-4">
//               <ProfileUpload
//                 currentAvatarUrl={profile?.avatar_url || undefined}
//                 onAvatarUpdate={handleAvatarUpdate}
//                 size="lg"
//               />
//             </div>

//             {/* Email (Read-only) */}
//             <div className="space-y-2">
//               <Label htmlFor="email" className="flex items-center gap-2">
//                 <Mail className="w-4 h-4" />
//                 อีเมล
//               </Label>
//               <Input
//                 id="email"
//                 value={user?.email || ''}
//                 disabled
//                 className="bg-muted"
//               />
//               <p className="text-sm text-muted-foreground">
//                 ไม่สามารถเปลี่ยนแปลงอีเมลได้
//               </p>
//             </div>

//             {/* Display Name */}
//             <div className="space-y-2">
//               <Label htmlFor="displayName" className="flex items-center gap-2">
//                 <User className="w-4 h-4" />
//                 ชื่อที่แสดง
//               </Label>
//               <Input
//                 id="displayName"
//                 value={displayName}
//                 onChange={(e) => setDisplayName(e.target.value)}
//                 placeholder="ระบุชื่อที่ต้องการแสดง"
//               />
//             </div>

//             {/* Bio */}
//             <div className="space-y-2">
//               <Label htmlFor="bio">เกี่ยวกับตัวเอง</Label>
//               <Textarea
//                 id="bio"
//                 value={bio}
//                 onChange={(e) => setBio(e.target.value)}
//                 placeholder="เขียนอะไรบางอย่างเกี่ยวกับตัวเอง..."
//                 rows={4}
//               />
//             </div>

//             {/* Created Date */}
//             {profile?.created_at && (
//               <div className="space-y-2">
//                 <Label className="flex items-center gap-2">
//                   <Calendar className="w-4 h-4" />
//                   วันที่สมัครสมาชิก
//                 </Label>
//                 <Input
//                   value={new Date(profile.created_at).toLocaleDateString('th-TH', {
//                     year: 'numeric',
//                     month: 'long',
//                     day: 'numeric'
//                   })}
//                   disabled
//                   className="bg-muted"
//                 />
//               </div>
//             )}

//             {/* Save Button */}
//             <Button
//               onClick={saveProfile}
//               disabled={saving}
//               className="w-full gap-2"
//             >
//               {saving ? (
//                 <>
//                   <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
//                   กำลังบันทึก...
//                 </>
//               ) : (
//                 'บันทึกข้อมูล'
//               )}
//             </Button>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// };



import React, { useState, useEffect } from 'react';
import { User, Mail, Calendar, Settings } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ProfileUpload } from '@/components/ProfileUpload';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ProfileController } from '@/controllers/ProfileController';
// import { Profile as ProfileModel } from '@/models/User'; // Unused import
import { config } from '@/config/app';
import SEO from '@/components/SEO';

interface Profile {
  id: string;
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
  bio: string | null;
  created_at: string;
  updated_at: string;
}

export const Profile: React.FC = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const currentYear = new Date().getFullYear(); // ดึงปีปัจจุบัน

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    const result = await ProfileController.getProfile(user.id);
    
    if (result.success && result.data) {
      setProfile(result.data as Profile);
      setDisplayName(result.data.display_name || '');
      setBio((result.data as any).bio || '');
    } else if (result.error) {
      toast({
        title: "ข้อผิดพลาด",
        description: "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  const saveProfile = async () => {
    if (!user) return;

    setSaving(true);
    
    try {
      // ดึงข้อมูลโปรไฟล์ล่าสุดก่อนบันทึก เพื่อให้แน่ใจว่าได้ avatar_url ที่ถูกต้อง
      const currentProfileResult = await ProfileController.getProfile(user.id);
      const currentAvatarUrl = currentProfileResult.success && currentProfileResult.data 
        ? currentProfileResult.data.avatar_url 
        : profile?.avatar_url;

      const updates = {
        display_name: displayName || null,
        bio: bio || null,
        avatar_url: currentAvatarUrl
      };
      
      console.log('Saving profile with data:', updates);
      
      const result = await ProfileController.updateProfile(user.id, updates);
      
      if (result.success) {
        setProfile(result.data as Profile);
        toast({
          title: "สำเร็จ",
          description: "บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว"
        });
      } else {
        console.error('Profile update error:', result.error);
        toast({
          title: "ข้อผิดพลาด",
          description: result.error || "ไม่สามารถบันทึกข้อมูลได้",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Save profile error:', error);
      toast({
        title: "ข้อผิดพลาด",
        description: "เกิดข้อผิดพลาดในการบันทึกข้อมูล",
        variant: "destructive"
      });
    }
    
    setSaving(false);
  };

  const handleAvatarUpdate = (newAvatarUrl: string) => {
    setProfile(prev => prev ? { ...prev, avatar_url: newAvatarUrl } : null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    // ปรับ Layout เป็น Flex Column เพื่อจัด Footer ให้ลงล่างสุด
    <div className="min-h-screen bg-gradient-subtle py-8 flex flex-col">
      <SEO 
        title="โปรไฟล์ | Brainy Math Boost" 
        description="จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชีของคุณ"
        canonical="/profile"
      />
      
      {/* Content Wrapper: ให้ขยายเต็มพื้นที่ที่เหลือ (flex-1) */}
      <div className="container mx-auto px-4 max-w-2xl flex-1">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            โปรไฟล์ของฉัน
          </h1>
          <p className="text-muted-foreground mt-2">
            จัดการข้อมูลส่วนตัวและการตั้งค่าบัญชี
          </p>
        </div>

        <Card className="backdrop-blur-sm bg-background/95 border-primary/20 shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary" />
              ข้อมูลโปรไฟล์
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar Upload */}
            <div className="flex flex-col items-center space-y-4">
              <ProfileUpload
                currentAvatarUrl={profile?.avatar_url || undefined}
                onAvatarUpdate={handleAvatarUpdate}
                size="lg"
              />
            </div>

            {/* Email (Read-only) */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                อีเมล
              </Label>
              <Input
                id="email"
                value={user?.email || ''}
                disabled
                className="bg-muted"
              />
              <p className="text-sm text-muted-foreground">
                ไม่สามารถเปลี่ยนแปลงอีเมลได้
              </p>
            </div>

            {/* Display Name */}
            <div className="space-y-2">
              <Label htmlFor="displayName" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                ชื่อที่แสดง
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="ระบุชื่อที่ต้องการแสดง"
              />
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">เกี่ยวกับตัวเอง</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="เขียนอะไรบางอย่างเกี่ยวกับตัวเอง..."
                rows={4}
              />
            </div>

            {/* Created Date */}
            {profile?.created_at && (
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  วันที่สมัครสมาชิก
                </Label>
                <Input
                  value={new Date(profile.created_at).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                  disabled
                  className="bg-muted"
                />
              </div>
            )}

            {/* Save Button */}
            <Button
              onClick={saveProfile}
              disabled={saving}
              className="w-full gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  กำลังบันทึก...
                </>
              ) : (
                'บันทึกข้อมูล'
              )}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* --- Footer Start --- */}
      <footer className="w-full py-6 text-center mt-8 border-t border-slate-200/20">
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

    </div>
  );
};