import React from "react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { FollowButton } from "./FollowButton";
import { FollowUser } from "../services/follow.service";

interface FollowCardProps {
  user: FollowUser;
}

export const FollowCard: React.FC<FollowCardProps> = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-between rounded-2xl border border-border/50 bg-card p-4"
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-12 w-12">
          <AvatarImage src={user.avatar} alt={user.username} />
          <AvatarFallback>{user.fullname?.charAt(0) ?? "U"}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold">{user.fullname}</div>
          <div className="text-sm text-muted-foreground">@{user.username}</div>
          {user.bio ? <div className="text-sm text-muted-foreground line-clamp-1">{user.bio}</div> : null}
        </div>
      </div>
      <FollowButton userId={user._id} />
    </motion.div>
  );
};
