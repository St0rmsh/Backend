import React from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const CardSkeleton = () => (
  <div className="overflow-hidden rounded-[32px] border border-neutral-200 dark:border-neutral-800">
    {/* Image */}
    <Skeleton
      height={420}
      borderRadius={0}
      baseColor="transparent"
      highlightColor="rgba(255,255,255,0.06)"
    />

    <div className="p-6 space-y-4">
      <Skeleton width="70%" height={28} />

      <Skeleton count={2} />

      <Skeleton width="40%" height={30} />

      <Skeleton width="30%" />

      <div className="flex gap-3 pt-2">
        <Skeleton
          height={48}
          borderRadius={18}
          className="flex-1"
        />

        <Skeleton
          width={48}
          height={48}
          borderRadius={18}
        />
      </div>
    </div>
  </div>
);

const SummarySkeleton = () => (
  <div className="rounded-[28px] border border-neutral-200 dark:border-neutral-800 p-6">
    <Skeleton
      width={50}
      height={50}
      borderRadius={16}
    />

    <Skeleton
      width="70%"
      height={35}
      className="mt-6"
    />

    <Skeleton
      width="40%"
      className="mt-3"
    />
  </div>
);

const WishlistSkeleton = () => {
  return (
    <div className="space-y-14">
      {/* Hero */}

      <div className="flex flex-col lg:flex-row justify-between gap-10">
        <div className="flex-1">
          <Skeleton width={160} />

          <Skeleton
            width={420}
            height={70}
            className="mt-5"
          />

          <Skeleton
            count={2}
            className="mt-5"
          />

          <div className="flex gap-4 mt-8">
            <Skeleton
              width={200}
              height={54}
              borderRadius={18}
            />

            <Skeleton
              width={180}
              height={54}
              borderRadius={18}
            />
          </div>
        </div>

        <Skeleton
          width={340}
          height={320}
          borderRadius={32}
        />
      </div>

      {/* Summary */}

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <SummarySkeleton key={i} />
        ))}
      </div>

      {/* Cards */}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

export default WishlistSkeleton;