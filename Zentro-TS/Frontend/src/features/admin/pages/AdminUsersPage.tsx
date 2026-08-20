import { motion } from "framer-motion";
import { Search, MoreVertical, Shield, Ban, CheckCircle } from "lucide-react";
import { Button } from "@/shared/ui/button";

// Dummy data for users table
const MOCK_USERS = [
  { id: 1, name: "John Doe", email: "john@example.com", role: "USER", status: "Active", joined: "2023-01-15", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=John" },
  { id: 2, name: "Jane Smith", email: "jane@example.com", role: "ADMIN", status: "Active", joined: "2022-11-04", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane" },
  { id: 3, name: "Bob Johnson", email: "bob@example.com", role: "USER", status: "Suspended", joined: "2023-03-22", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob" },
  { id: 4, name: "Alice Brown", email: "alice@example.com", role: "USER", status: "Active", joined: "2023-05-10", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice" },
  { id: 5, name: "Charlie Davis", email: "charlie@example.com", role: "USER", status: "Active", joined: "2023-06-01", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Charlie" },
];

export const AdminUsersPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-2">Manage user accounts, roles, and statuses.</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Export CSV</Button>
          <Button>Invite User</Button>
        </div>
      </div>

      <div className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-sm">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-border/50 flex flex-col sm:flex-row justify-between gap-4">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search users by name or email..." 
              className="w-full pl-9 pr-4 py-2 bg-muted/50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            />
          </div>
          <div className="flex gap-2">
            <select className="bg-muted/50 border border-border rounded-xl text-sm px-3 py-2 focus:outline-none">
              <option value="all">All Roles</option>
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <select className="bg-muted/50 border border-border rounded-xl text-sm px-3 py-2 focus:outline-none">
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b border-border/50">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {MOCK_USERS.map((user) => (
                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full bg-muted" />
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-muted-foreground text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.role === 'ADMIN' ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
                    }`}>
                      {user.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                      user.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-destructive/10 text-destructive'
                    }`}>
                      {user.status === 'Active' ? <CheckCircle className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-muted-foreground">
                    {user.joined}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="p-4 border-t border-border/50 flex items-center justify-between text-sm text-muted-foreground">
          <span>Showing 1 to 5 of 12,482 entries</span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
