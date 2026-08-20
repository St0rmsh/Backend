import { ReactNode } from "react";
import { motion } from "framer-motion";

interface SettingsCardProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export const SettingsCard = ({ title, description, children, className = "" }: SettingsCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm ${className}`}
    >
      {(title || description) && (
        <div className="px-6 py-5 border-b border-border/50 bg-muted/20">
          {title && <h3 className="text-lg font-semibold tracking-tight">{title}</h3>}
          {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
        </div>
      )}
      <div className="p-6">{children}</div>
    </motion.div>
  );
};
