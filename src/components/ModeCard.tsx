import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ModeCardProps {
  mode: "add" | "sub" | "mul" | "div" | "mix";
  title: string;
  description: string;
}

const ModeCard = ({ mode, title, description }: ModeCardProps) => {
  return (
    <Card className="group transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-[var(--shadow-elevated)]">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{description}</p>
        <div className="flex flex-wrap gap-2">
          <Link to={`/practice?mode=${mode}&level=easy`}>
            <Button variant="secondary" size="sm">ง่าย</Button>
          </Link>
          <Link to={`/practice?mode=${mode}&level=medium`}>
            <Button variant="outline" size="sm">ปานกลาง</Button>
          </Link>
          <Link to={`/practice?mode=${mode}&level=hard`}>
            <Button variant="premium" size="sm">ยาก</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModeCard;
