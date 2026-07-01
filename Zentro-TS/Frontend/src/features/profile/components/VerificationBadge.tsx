import React from "react";
import { motion } from "framer-motion";
import { BadgeCheck } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface VerificationBadgeProps {
  verified: boolean;
  className?: string;
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({ verified, className }) => {
  if (!verified) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className={cn("inline-flex", className)}
      title="Verified account"
    >
      <BadgeCheck className="h-5 w-5 text-blue-500" fill="currentColor" />
    </motion.div>
  );
};
