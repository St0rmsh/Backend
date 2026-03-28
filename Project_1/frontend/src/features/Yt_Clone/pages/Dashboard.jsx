const Dashboard = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

      {["Videos", "Views", "Subscribers", "Likes"].map((item) => (
        <div
          key={item}
          className="p-5 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800"
        >
          <p className="text-sm text-gray-500">{item}</p>
          <h2 className="text-2xl font-semibold mt-2">0</h2>
        </div>
      ))}

    </div>
  );
};

export default Dashboard;
