import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FollowersList } from "../components/FollowersList";

export const FollowersPage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const resolvedUserId = userId || "";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Followers</h1>
      <FollowersList userId={resolvedUserId} />
    </div>
  );
};
