import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface ProfileStats {
  posts: number;
  followers: number;
  following: number;
  bookmarks?: number;
}

interface ProfileStatsProps {
  stats: ProfileStats;
  className?: string;
}

export const ProfileStats: React.FC<ProfileStatsProps> = ({ stats, className }) => {
  const statItems = [
    { label: "Posts", value: stats.posts },
    { label: "Followers", value: stats.followers },
    { label: "Following", value: stats.following },
    ...(stats.bookmarks !== undefined ? [{ label: "Bookmarks", value: stats.bookmarks }] : []),
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("grid grid-cols-3 md:grid-cols-4 gap-4", className)}
    >
      {statItems.map((stat) => (
        <motion.div
          key={stat.label}
          variants={itemVariants}
          className="flex flex-col items-center justify-center p-3 rounded-lg bg-card border"
        >
          <div className="text-lg md:text-2xl font-bold">{stat.value.toLocaleString()}</div>
          <div className="text-xs md:text-sm text-muted-foreground">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
};
