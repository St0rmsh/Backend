import { motion } from "framer-motion";
import { useAppSelector } from "@/shared/hooks";
import { SettingsHeader } from "../components/SettingsHeader";
import { SettingsCard } from "../components/SettingsCard";
import { Button } from "@/shared/ui/button";

export const AccountSettingsPage = () => {
  const { user } = useAppSelector((state) => state.auth);

  if (!user) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-3xl"
    >
      <SettingsHeader 
        title="Account Settings" 
        description="View and manage your account details." 
      />
      
      <SettingsCard title="Account Details" description="Information related to your account standing.">
        <div className="space-y-4">
          <div className="flex justify-between items-center py-3 border-b border-border/50">
            <div>
              <p className="font-medium">Email Address</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-border/50">
            <div>
              <p className="font-medium">Username</p>
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            </div>
          </div>
          
          <div className="flex justify-between items-center py-3 border-b border-border/50">
            <div>
              <p className="font-medium">Role</p>
              <p className="text-sm text-muted-foreground capitalize">{user.role?.toLowerCase() || "User"}</p>
            </div>
          </div>
        </div>
      </SettingsCard>

      <SettingsCard title="Danger Zone" className="border-destructive/30">
        <div className="space-y-4">
          <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-medium text-destructive">Deactivate Account</h4>
              <p className="text-sm text-muted-foreground">Temporarily hide your profile, posts, and comments.</p>
            </div>
            <Button variant="outline" className="text-destructive border-destructive/50 hover:bg-destructive/10">
              Deactivate
            </Button>
          </div>
          
          <div className="flex sm:flex-row flex-col sm:items-center justify-between gap-4 pt-4 border-t border-border/50">
            <div>
              <h4 className="font-medium text-destructive">Delete Account</h4>
              <p className="text-sm text-muted-foreground">Permanently remove your account and all associated data.</p>
            </div>
            <Button variant="destructive">
              Delete Account
            </Button>
          </div>
        </div>
      </SettingsCard>
    </motion.div>
  );
};
