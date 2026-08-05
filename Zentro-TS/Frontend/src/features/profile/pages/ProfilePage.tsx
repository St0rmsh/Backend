import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useProfile } from "../hooks";
import {
  ProfileBanner,
  ProfileAvatar,
  ProfileInfo,
  ProfileStats,
  ProfileActions,
  ProfileSkeleton,
  BioSection,
  ProfileCard,
} from "../components";
import { ProfileUser } from "../types/profile.types";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { fetchFollowStatusThunk } from "@/features/follow/state/followSlice";

type ProfileParams = {
  username?: string;
} & Record<string, string | undefined>;

interface ProfilePageProps {
  isOwnProfile?: boolean;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ isOwnProfile: isOwnProfileProp = false }) => {
  const { username } = useParams<ProfileParams>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user: currentUser } = useAuth();
  const { profile, loading } = useProfile();

  // Determine if viewing own profile
  const isOwnProfile = isOwnProfileProp || !username || username === currentUser?.username;
  const displayUser = isOwnProfile ? currentUser : profile;
  const targetUser = displayUser || null;
  const targetUserId = String((targetUser as any)?._id ?? (targetUser as any)?.id ?? "");
  const relationship = useAppSelector((state) => state.follow.relationshipByUser[String(targetUserId)]);
  const isFollowing = relationship?.isFollowing ?? false;

  useEffect(() => {
    if (!isOwnProfile && targetUserId) {
      dispatch(fetchFollowStatusThunk(targetUserId));
    }
  }, [dispatch, isOwnProfile, targetUserId]);

  if (loading) {
    return (
      <div className="min-h-screen">
        <ProfileSkeleton />
      </div>
    );
  }

  if (!targetUser && !isOwnProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Profile not found</h1>
          <p className="text-muted-foreground mt-2">The user you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const user = targetUser;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const stats = {
    posts: (user as any).postsCount || 0,
    followers: (user as any).followerCount || 0,
    following: (user as any).followingCount || 0,
    bookmarks: isOwnProfile ? 12 : undefined,
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen py-8"
    >
      {/* Profile Card */}
      <div className="max-w-4xl mx-auto px-4">
        <ProfileCard>
          {/* Banner */}
          <ProfileBanner bannerUrl={(user as any).banner} />

          {/* Content */}
          <div className="px-6 md:px-10 pb-8">
            {/* Avatar and Actions */}
            <div className="flex flex-col md:flex-row md:items-end md:justify-between -mt-12 mb-6 gap-4">
              <ProfileAvatar avatarUrl={user.avatar} fullname={user.fullname} />
              <ProfileActions
                isOwnProfile={isOwnProfile}
                isFollowing={isFollowing}
                targetUserId={targetUserId}
                onMessageClick={() => console.log("Message clicked")}
              />
            </div>

            {/* Info */}
            <ProfileInfo user={user as unknown as ProfileUser} />

            {/* Bio */}
            <BioSection bio={user.bio} />

            {/* Stats */}
            <div className="mt-8 pt-6 border-t">
              <ProfileStats
                stats={stats}
                onFollowersClick={() => targetUserId && navigate(`/app/profile/${targetUserId}/followers`)}
                onFollowingClick={() => targetUserId && navigate(`/app/profile/${targetUserId}/following`)}
              />
            </div>
          </div>
        </ProfileCard>

        {/* Posts Section Placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="mt-8 p-8 text-center text-muted-foreground"
        >
          <p>Posts feature coming soon...</p>
        </motion.div>
      </div>
    </motion.div>
  );
};
