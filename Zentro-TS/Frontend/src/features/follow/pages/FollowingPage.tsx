import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { FollowingList } from "../components/FollowingList";

export const FollowingPage: React.FC = () => {
  const { userId } = useParams<{ userId?: string }>();
  const resolvedUserId = userId || "";

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-semibold">Following</h1>
      <FollowingList userId={resolvedUserId} />
    </div>
  );
};
