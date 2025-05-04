import { icons } from "lucide-react";

export const Icon = ({
  name,
  color,
  size,
  className,
}) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    console.warn(`Icon "${name}" does not exist in lucide-react`);
    return null; // Avoid crashing if icon is not found
  }

  return <LucideIcon color={color} size={size} className={className} />;
};
