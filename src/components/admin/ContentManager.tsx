import { useState, useEffect } from 'react';
import { BookOpen, Settings, Plus, Edit2, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AdminService } from '@/services/AdminService';

interface PracticeMode {
  id: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  enabled: boolean;
}

const ContentManager = () => {
  const [practiceStats, setPracticeStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modes] = useState<PracticeMode[]>([
    { id: 'addition', name: 'บวก', description: 'การบวกเลขพื้นฐาน', difficulty: 'easy', enabled: true },
    { id: 'subtraction', name: 'ลบ', description: 'การลบเลขพื้นฐาน', difficulty: 'easy', enabled: true },
    { id: 'multiplication', name: 'คูณ', description: 'การคูณเลขพื้นฐาน', difficulty: 'medium', enabled: true },
    { id: 'division', name: 'หาร', description: 'การหารเลขพื้นฐาน', difficulty: 'medium', enabled: true },
    { id: 'mixed', name: 'ผสม', description: 'การฝึกแบบผสมทุกโหมด', difficulty: 'hard', enabled: true },
  ]);

  const loadPracticeStats = async () => {
    setLoading(true);
    const result = await AdminService.getPracticeStats();
    if (result.success) {
      setPracticeStats(result.data);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadPracticeStats();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'ง่าย';
      case 'medium': return 'ปานกลาง';
      case 'hard': return 'ยาก';
      default: return 'ไม่ระบุ';
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-4">
              <div className="h-4 bg-muted rounded w-1/4"></div>
              <div className="h-8 bg-muted rounded"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Practice Modes Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            จัดการโหมดการฝึก
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modes.map((mode) => (
              <div key={mode.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div>
                    <h3 className="font-medium">{mode.name}</h3>
                    <p className="text-sm text-muted-foreground">{mode.description}</p>
                  </div>
                  <Badge className={getDifficultyColor(mode.difficulty)}>
                    {getDifficultyText(mode.difficulty)}
                  </Badge>
                  <Badge variant={mode.enabled ? 'default' : 'secondary'}>
                    {mode.enabled ? 'เปิดใช้งาน' : 'ปิดใช้งาน'}
                  </Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Edit2 className="w-4 h-4 mr-1" />
                    แก้ไข
                  </Button>
                  <Button size="sm" variant="outline">
                    <Settings className="w-4 h-4 mr-1" />
                    ตั้งค่า
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Practice Statistics */}
      {practiceStats && (
        <Card>
          <CardHeader>
            <CardTitle>สถิติการฝึก</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Object.entries(practiceStats.modeStats).map(([mode, stats]: [string, any]) => (
                <div key={mode} className="p-4 border rounded-lg">
                  <h3 className="font-medium mb-2">โหมด: {mode}</h3>
                  <div className="space-y-1 text-sm">
                    <p>จำนวนเซสชัน: {stats.count}</p>
                    <p>คะแนนเฉลี่ย: {stats.count > 0 ? (stats.totalScore / stats.count).toFixed(1) : 0}</p>
                    <p>เวลาเฉลี่ย: {stats.count > 0 ? ((stats.totalTime / stats.count) / 1000).toFixed(1) : 0} วินาที</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Add New Mode */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            เพิ่มโหมดใหม่
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="mode-name">ชื่อโหมด</Label>
              <Input id="mode-name" placeholder="เช่น การคำนวณเศษส่วน" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="difficulty">ระดับความยาก</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="เลือกระดับ" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">ง่าย</SelectItem>
                  <SelectItem value="medium">ปานกลาง</SelectItem>
                  <SelectItem value="hard">ยาก</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">คำอธิบาย</Label>
              <Textarea id="description" placeholder="อธิบายโหมดการฝึกนี้" />
            </div>
            <div className="sm:col-span-2">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                เพิ่มโหมดใหม่
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ContentManager;