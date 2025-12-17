// import { Link } from "react-router-dom";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";

// interface ModeCardProps {
//   mode: "add" | "sub" | "mul" | "div" | "mix";
//   title: string;
//   description: string;
// }

// const ModeCard = ({ mode, title, description }: ModeCardProps) => {
//   const modeIcons = {
//     add: "➕",
//     sub: "➖", 
//     mul: "✖️",
//     div: "➗",
//     mix: "🎯"
//   };

//   const modeColors = {
//     add: "from-brand-success/20 to-brand-success/10",
//     sub: "from-destructive/20 to-destructive/10", 
//     mul: "from-brand/20 to-brand/10",
//     div: "from-brand-2/20 to-brand-2/10",
//     mix: "from-brand-accent/20 to-brand-accent/10"
//   };

//   return (
//     <Card className={`math-card group hover:-translate-y-2 hover:scale-105 bg-gradient-to-br ${modeColors[mode]} border-brand/10 hover:border-brand/20 transition-all duration-500 hover:shadow-math-glow relative overflow-hidden`}>
//       {/* Animated background pattern */}
//       <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500">
//         <div className="absolute top-2 right-2 text-4xl opacity-20 animate-pulse-math">{modeIcons[mode]}</div>
//         <div className="absolute bottom-2 left-2 text-2xl opacity-10 rotate-12">{modeIcons[mode]}</div>
//       </div>
      
//       <CardHeader className="pb-3 relative z-10">
//         <CardTitle className="text-xl font-bold flex items-center gap-3 group-hover:scale-110 transition-transform duration-300">
//           <span className="text-3xl group-hover:animate-bounce-gentle group-hover:rotate-12 transition-transform duration-500">{modeIcons[mode]}</span>
//           <span className="math-gradient bg-clip-text text-transparent group-hover:animate-pulse-math">{title}</span>
//         </CardTitle>
//       </CardHeader>
//       <CardContent className="space-y-6 relative z-10">
//         <p className="text-sm text-muted-foreground/80 leading-relaxed group-hover:text-muted-foreground transition-colors">{description}</p>
        
//         {/* Enhanced difficulty buttons */}
//         <div className="flex flex-wrap gap-3">
//           <Link to={`/practice?mode=${mode}&level=easy`} className="flex-1 min-w-[100px]">
//             <Button variant="success" size="sm" className="w-full text-xs hover:scale-110 transition-transform group hover:shadow-lg">
//               <span className="mr-1">🟢</span> ง่าย
//             </Button>
//           </Link>
//           <Link to={`/practice?mode=${mode}&level=medium`} className="flex-1 min-w-[100px]">
//             <Button variant="math" size="sm" className="w-full text-xs hover:scale-110 transition-transform group hover:shadow-lg">
//               <span className="mr-1">🟡</span> ปานกลาง
//             </Button>
//           </Link>
//           <Link to={`/practice?mode=${mode}&level=hard`} className="flex-1 min-w-[100px]">
//             <Button variant="premium" size="sm" className="w-full text-xs hover:scale-110 transition-transform group hover:shadow-lg">
//               <span className="mr-1">🔴</span> ยาก
//             </Button>
//           </Link>
//         </div>
        
//         {/* Progress indicator (placeholder for future feature) */}
//         <div className="pt-2 border-t border-border/50">
//           <div className="flex items-center justify-between text-xs text-muted-foreground/60">
//             <span>เริ่มฝึกเลย!</span>
//             <span className="group-hover:animate-bounce-gentle">→</span>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

// export default ModeCard;
