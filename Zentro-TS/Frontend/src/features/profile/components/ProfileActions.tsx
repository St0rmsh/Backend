import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/shared/ui/button";
import { MoreVertical } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/routes.config";

interface ProfileActionsProps {
  isOwnProfile: boolean;
  isFollowing?: boolean;
  onFollowClick?: () => void;
  onMessageClick?: () => void;
  className?: string;
}

export const ProfileActions: React.FC<ProfileActionsProps> = ({
  isOwnProfile,
  isFollowing = false,
  onFollowClick,
  onMessageClick,
  className,
}) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className={`flex gap-2 flex-wrap ${className}`}
    >
      {isOwnProfile ? (
        <>
          <Button
            variant="default"
            onClick={() => navigate(ROUTES.PROFILE_SETTINGS)}
          >
            Edit Profile
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate(ROUTES.SETTINGS)}
          >
            Settings
          </Button>
        </>
      ) : (
        <>
          <Button
            variant={isFollowing ? "outline" : "default"}
            onClick={onFollowClick}
          >
            {isFollowing ? "Following" : "Follow"}
          </Button>
          <Button variant="outline" onClick={onMessageClick}>
            Message
          </Button>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </>
      )}
    </motion.div>
  );
};
