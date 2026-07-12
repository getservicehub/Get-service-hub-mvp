import {
  Car,
  Truck,
  Sparkles,
  CircleDot,
  Hammer,
  Trees,
  SprayCan,
  Paintbrush,
  Home,
  Wrench,
  Zap,
  Waves,
  Warehouse,
  Refrigerator,
  LayoutGrid,
  Scissors,
  Flower2,
  HardHat,
  Infinity as InfinityIcon,
  Wrench as DefaultIcon,
} from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  "Mobile Mechanic": Car,
  "Tow Service": Truck,
  "Auto Detailing": Sparkles,
  "Tire Service": CircleDot,
  "Body Shop": Hammer,
  "Landscaping": Trees,
  "Cleaning": SprayCan,
  "Painting": Paintbrush,
  "Remodeling": Home,
  "Plumber": Wrench,
  "Electrician": Zap,
  "Pool Services": Waves,
  "Roofing": Warehouse,
  "Appliance Repair": Refrigerator,
  "Flooring": LayoutGrid,
  "Beauty Services": Scissors,
  "Florist": Flower2,
  "Construction": HardHat,
  "Others": InfinityIcon,
};

export function CategoryIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICON_MAP[name] || DefaultIcon;
  return <Icon className={className || "w-6 h-6"} />;
}
