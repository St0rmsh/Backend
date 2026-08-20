import { motion } from "framer-motion";
import { Flag, MoreVertical, ExternalLink } from "lucide-react";
import { Button } from "@/shared/ui/button";

const MOCK_REPORTS = [
  { id: 1, type: "POST", reason: "Spam", reporter: "Jane Smith", target: "Post #4912", status: "Pending", date: "2 hours ago" },
  { id: 2, type: "USER", reason: "Harassment", reporter: "Alice Brown", target: "Bob Johnson", status: "Investigating", date: "5 hours ago" },
  { id: 3, type: "COMMENT", reason: "Hate Speech", reporter: "Charlie Davis", target: "Comment #883", status: "Resolved", date: "1 day ago" },
];

export const AdminReportsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Moderation</h1>
          <p className="text-muted-foreground mt-2">Review and resolve user reports.</p>
        </div>
        <div className="flex gap-2">
          <select className="bg-card border border-border rounded-xl text-sm px-3 py-2 focus:outline-none">
            <option value="all">All Types</option>
            <option value="post">Posts</option>
            <option value="user">Users</option>
            <option value="comment">Comments</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
          <h3 className="text-3xl font-bold mt-2 text-warning">34</h3>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Investigating</p>
          <h3 className="text-3xl font-bold mt-2 text-blue-500">12</h3>
        </div>
        <div className="bg-card border border-border/50 rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-medium text-muted-foreground">Resolved (Today)</p>
          <h3 className="text-3xl font-bold mt-2 text-emerald-500">89</h3>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Reason</th>
                <th className="px-6 py-4 font-medium">Reporter</th>
                <th className="px-6 py-4 font-medium">Target</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {MOCK_REPORTS.map((report) => (
                <tr key={report.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      <Flag className="w-3 h-3" />
                      {report.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 font-medium">
                    {report.reason}
                  </td>
                  <td className="px-6 py-4 text-muted-foreground">
                    {report.reporter}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-primary hover:underline cursor-pointer">
                      {report.target}
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                      report.status === 'Pending' ? 'bg-warning/10 text-warning' : 
                      report.status === 'Investigating' ? 'bg-blue-500/10 text-blue-500' : 
                      'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                    {report.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button variant="ghost" size="sm" className="mr-2">Review</Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};
