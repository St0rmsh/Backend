import { useState } from "react";
import { motion } from "framer-motion";
import { SettingsHeader } from "../components/SettingsHeader";
import { SettingsCard } from "../components/SettingsCard";
import { PreferenceToggle } from "../components/PreferenceToggle";
import { Shield, Users, Lock, EyeOff } from "lucide-react";

export const PrivacySettingsPage = () => {
  const [privateAccount, setPrivateAccount] = useState(false);
  const [activityStatus, setActivityStatus] = useState(true);
  const [searchVisibility, setSearchVisibility] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-3xl"
    >
      <SettingsHeader 
        title="Privacy Settings" 
        description="Control who can see your content and activity." 
      />
      
      <SettingsCard title="Account Visibility" description="Manage who can interact with you.">
        <div className="space-y-2 divide-y divide-border/50">
          <PreferenceToggle 
            id="privateAccount"
            title="Private Account"
            description="When your account is private, only people you approve can see your posts and followers."
            checked={privateAccount}
            onCheckedChange={setPrivateAccount}
          />
          <PreferenceToggle 
            id="activityStatus"
            title="Activity Status"
            description="Allow accounts you follow and anyone you message to see when you were last active."
            checked={activityStatus}
            onCheckedChange={setActivityStatus}
          />
          <PreferenceToggle 
            id="searchVisibility"
            title="Search Visibility"
            description="Allow your profile to be discovered in search results and recommendations."
            checked={searchVisibility}
            onCheckedChange={setSearchVisibility}
          />
        </div>
      </SettingsCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <div className="border border-border/50 rounded-xl p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium text-sm">Blocked Users</h4>
            <p className="text-xs text-muted-foreground">Manage blocked accounts</p>
          </div>
        </div>
        
        <div className="border border-border/50 rounded-xl p-4 flex items-center gap-4 hover:bg-muted/50 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-medium text-sm">Muted Users</h4>
            <p className="text-xs text-muted-foreground">Manage muted accounts</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
