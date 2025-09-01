import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ModeCardProps {
  mode: "add" | "sub" | "mul" | "div" | "mix";
  title: string;
  description: string;
}

const ModeCard = ({ mode, title, description }: ModeCardProps) => {
  const modeIcons = {
    add: "➕",
    sub: "➖", 
    mul: "✖️",
    div: "➗",
    mix: "🎯"
  };

  const modeColors = {
    add: "from-brand-success/20 to-brand-success/10",
    sub: "from-destructive/20 to-destructive/10", 
    mul: "from-brand/20 to-brand/10",
    div: "from-brand-2/20 to-brand-2/10",
    mix: "from-brand-accent/20 to-brand-accent/10"
  };

  return (
    <Card className={`math-card group hover:-translate-y-1 bg-gradient-to-br ${modeColors[mode]} border-brand/10`}>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-bold flex items-center gap-3">
          <span className="text-2xl">{modeIcons[mode]}</span>
          <span className="math-gradient bg-clip-text text-transparent">{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground/80 leading-relaxed">{description}</p>
        <div className="flex flex-wrap gap-2">
          <Link to={`/practice?mode=${mode}&level=easy`}>
            <Button variant="success" size="sm" className="text-xs">🟢 ง่าย</Button>
          </Link>
          <Link to={`/practice?mode=${mode}&level=medium`}>
            <Button variant="math" size="sm" className="text-xs">🟡 ปานกลาง</Button>
          </Link>
          <Link to={`/practice?mode=${mode}&level=hard`}>
            <Button variant="premium" size="sm" className="text-xs">🔴 ยาก</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default ModeCard;
