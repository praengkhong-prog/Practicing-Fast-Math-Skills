import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';
import { AuthService } from '@/services/AuthService';
import { routes } from '@/routes/web';
import { config } from '@/config/app';

const Auth = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('signin');
  
  const { signIn, signUp, user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await AuthService.handleLogin(email, password);
    
    if (result.success) {
      navigate(routes.home);
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const result = await AuthService.handleRegister(email, password, displayName);
    
    if (result.success) {
      toast({
        title: "สมัครสมาชิกสำเร็จ",
        description: "กรุณาตรวจสอบอีเมลเพื่อยืนยันบัญชี",
      });
      setActiveTab('signin');
      setIsLoading(false);
    } else {
      setError(result.error);
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <SEO 
        title="เข้าสู่ระบบ | Brainy Math Boost" 
        description="เข้าสู่ระบบหรือสมัครสมาชิกเพื่อเริ่มฝึกคิดเลขเร็วและติดตามผลการฝึก"
        canonical="/auth"
      />
      
      <div className="w-full max-w-md space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-block">
            <h1 className="text-2xl font-bold bg-gradient-to-tr from-[hsl(var(--brand))] to-[hsl(var(--brand-2))] bg-clip-text text-transparent">
              Brainy Math Boost
            </h1>
          </Link>
          <p className="text-muted-foreground">ฝึกคิดเลขเร็วอย่างสนุกและมีเป้าหมาย</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>เข้าสู่ระบบ / สมัครสมาชิก</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">เข้าสู่ระบบ</TabsTrigger>
                <TabsTrigger value="signup">สมัครสมาชิก</TabsTrigger>
              </TabsList>
              
              <TabsContent value="signin" className="space-y-4">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signin-email">อีเมล</Label>
                    <Input
                      id="signin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signin-password">รหัสผ่าน</Label>
                    <Input
                      id="signin-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full" 
                    variant="hero"
                    disabled={isLoading}
                  >
                    {isLoading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
                  </Button>
                </form>
              </TabsContent>
              
              <TabsContent value="signup" className="space-y-4">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-name">ชื่อแสดง</Label>
                    <Input
                      id="signup-name"
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      disabled={isLoading}
                      placeholder="ชื่อที่จะแสดงในระบบ"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-email">อีเมล</Label>
                    <Input
                      id="signup-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password">รหัสผ่าน</Label>
                    <Input
                      id="signup-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={isLoading}
                      minLength={6}
                    />
                    <p className="text-xs text-muted-foreground">รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร</p>
                  </div>
                  {error && (
                    <Alert variant="destructive">
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <Button 
                    type="submit" 
                    className="w-full"
                    variant="hero"
                    disabled={isLoading}
                  >
                    {isLoading ? 'กำลังสมัครสมาชิก...' : 'สมัครสมาชิก'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            ต้องการฝึกแบบไม่ลงทะเบียน?
          </p>
          <Link to="/">
            <Button variant="outline" size="sm">
              ลองใช้แบบไม่ลงทะเบียน
            </Button>
          </Link>
        </div>

        <div className="bg-accent/50 rounded-lg p-4 text-center">
          <h3 className="font-semibold mb-2">สำหรับผู้ดูแลระบบ</h3>
          <p className="text-sm text-muted-foreground mb-3">
            หากคุณเป็นผู้ดูแลระบบ สมัครสมาชิกแล้วติดต่อผู้พัฒนาเพื่อให้สิทธิ์ผู้ดูแล
          </p>
          <div className="text-xs text-muted-foreground">
            ผู้ดูแลสามารถจัดการข้อมูลผู้ใช้และดูสถิติทั้งหมดได้
          </div>
        </div>
      </div>
    </main>
  );
};

export default Auth;