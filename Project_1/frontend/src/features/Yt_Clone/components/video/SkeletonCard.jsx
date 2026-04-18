const SkeletonCard = () => (
  <div className="animate-pulse space-y-4">
    <div className="aspect-video rounded-xl bg-gray-200 dark:bg-gray-800 border border-gray-100 dark:border-gray-700"></div>

    <div className="flex gap-3 px-1">
      <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-800 shrink-0"></div>
      <div className="flex-1 space-y-2.5">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
      </div>
    </div>
  </div>
);

export default SkeletonCard;
