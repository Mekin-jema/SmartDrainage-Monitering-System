import { icons } from "lucide-react";

export const Icon = ({
  name,
  color,
  size,
  className,
}) => {
  const LucideIcon = icons[name ];

  return <LucideIcon color={color} size={size} className={className} />;
};
