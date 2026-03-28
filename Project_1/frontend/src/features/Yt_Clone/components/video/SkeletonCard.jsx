const SkeletonCard = () => (
  <div className="animate-pulse">
    <div className="h-40 rounded-xl bg-gray-200 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"></div>

    <div className="mt-3 space-y-2">
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
    </div>
  </div>
);

export default SkeletonCard;
