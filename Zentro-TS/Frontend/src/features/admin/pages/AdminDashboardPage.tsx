import { motion } from "framer-motion";
import { Users, FileText, MessageSquare, Flag } from "lucide-react";
import { StatsCard } from "../components/StatsCard";
import { AnalyticsChart } from "../components/AnalyticsChart";

// Dummy data for charts
const userGrowthData = [
  { name: "Jan", users: 400 },
  { name: "Feb", users: 600 },
  { name: "Mar", users: 800 },
  { name: "Apr", users: 1200 },
  { name: "May", users: 1500 },
  { name: "Jun", users: 2100 },
  { name: "Jul", users: 2800 },
];

const postActivityData = [
  { name: "Mon", posts: 24 },
  { name: "Tue", posts: 35 },
  { name: "Wed", posts: 42 },
  { name: "Thu", posts: 38 },
  { name: "Fri", posts: 55 },
  { name: "Sat", posts: 65 },
  { name: "Sun", posts: 48 },
];

export const AdminDashboardPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard Overview</h1>
        <p className="text-muted-foreground mt-2">Welcome to the Zentro Admin Portal. Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard 
          title="Total Users" 
          value="12,482" 
          icon={<Users className="w-6 h-6" />} 
          trend={12.5} 
          trendLabel="vs last month" 
        />
        <StatsCard 
          title="Total Posts" 
          value="48,291" 
          icon={<FileText className="w-6 h-6" />} 
          trend={8.2} 
          trendLabel="vs last month" 
        />
        <StatsCard 
          title="Total Comments" 
          value="142,884" 
          icon={<MessageSquare className="w-6 h-6" />} 
          trend={15.3} 
          trendLabel="vs last month" 
        />
        <StatsCard 
          title="Pending Reports" 
          value="34" 
          icon={<Flag className="w-6 h-6" />} 
          trend={-5.1} 
          trendLabel="vs last month" 
          className="border-warning/30"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalyticsChart 
          title="User Growth" 
          data={userGrowthData} 
          xKey="name" 
          yKey="users" 
          color="#8b5cf6" 
        />
        <AnalyticsChart 
          title="Weekly Post Activity" 
          data={postActivityData} 
          xKey="name" 
          yKey="posts" 
          type="bar" 
          color="#ec4899" 
        />
      </div>

      {/* Recent Activity or Quick Actions could go here */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">Recent Reports</h3>
          <div className="text-center py-10 text-muted-foreground">
            No recent reports to show.
          </div>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <h3 className="font-semibold text-lg mb-4">System Status</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm">API Server</span>
              <span className="text-xs font-medium px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Database</span>
              <span className="text-xs font-medium px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">Storage (Cloudinary)</span>
              <span className="text-xs font-medium px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full">Operational</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm">WebSocket</span>
              <span className="text-xs font-medium px-2 py-1 bg-emerald-500/10 text-emerald-500 rounded-full">Operational</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
