import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent } from '@/components/ui/card';

interface ProtectedRouteProps {
  children: ReactNode;
  requireAdmin?: boolean;
  allowGuest?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false, allowGuest = false }: ProtectedRouteProps) => {
  const { user, userRole, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[hsl(var(--brand))]"></div>
            <p className="text-muted-foreground">กำลังโหลด...</p>
          </CardContent>
        </Card>
      </main>
    );
  }

  // Allow guest access if specified
  if (allowGuest && !user) {
    return <>{children}</>;
  }

  // Require authentication
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Require admin role
  if (requireAdmin && userRole !== 'admin') {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4 text-center">
            <div className="text-4xl">🔒</div>
            <h2 className="text-xl font-semibold">ไม่มีสิทธิ์เข้าถึง</h2>
            <p className="text-muted-foreground">
              คุณไม่มีสิทธิ์ผู้ดูแลในการเข้าถึงหน้านี้
            </p>
            <p className="text-sm text-muted-foreground">
              ติดต่อผู้พัฒนาหากต้องการสิทธิ์ผู้ดูแล
            </p>
          </CardContent>
        </Card>
      </main>
    );
  }

  return <>{children}</>;
};

export default ProtectedRoute;