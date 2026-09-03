import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { SettingsHeader } from "../components/SettingsHeader";
import { SettingsCard } from "../components/SettingsCard";
import { PreferenceToggle } from "../components/PreferenceToggle";
import { Shield, EyeOff } from "lucide-react";
import { authService } from "@/features/auth/services/auth.service";
import { Button } from "@/shared/ui/button";

export const PrivacySettingsPage = () => {
  const [privateAccount, setPrivateAccount] = useState(false);
  const [activityStatus, setActivityStatus] = useState(true);
  const [searchVisibility, setSearchVisibility] = useState(true);
  const [blockedUsers, setBlockedUsers] = useState<{ _id: string; username: string }[]>([]);
  const [mutedUsers, setMutedUsers] = useState<{ _id: string; username: string }[]>([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    authService.getSettings().then((data) => {
      setPrivateAccount(data?.privacy.privateAccount ?? false);
      setActivityStatus(data?.privacy.activityStatus ?? true);
      setSearchVisibility(data?.privacy.searchVisibility ?? true);
    }).catch(() => undefined);
  }, []);

  useEffect(() => {
    authService.getPrivacyLists().then((data) => {
      setBlockedUsers(data.blockedUsers);
      setMutedUsers(data.mutedUsers);
    }).catch(() => undefined);
  }, []);

  const updatePrivacy = (key: "privateAccount" | "activityStatus" | "searchVisibility", value: boolean) => {
    authService.updateSettings({ [key]: value }).catch(() => undefined);
  };

  const updateList = async (list: "blockedUsers" | "mutedUsers", add: boolean, selectedUsername = username) => {
    if (!selectedUsername.trim()) return;
    try {
      const users = await authService.updatePrivacyList(list, selectedUsername, add);
      if (list === "blockedUsers") setBlockedUsers(users);
      else setMutedUsers(users);
      setUsername("");
    } catch {
      return;
    }
  };

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
            onCheckedChange={(value) => { setPrivateAccount(value); updatePrivacy("privateAccount", value); }}
          />
          <PreferenceToggle 
            id="activityStatus"
            title="Activity Status"
            description="Allow accounts you follow and anyone you message to see when you were last active."
            checked={activityStatus}
            onCheckedChange={(value) => { setActivityStatus(value); updatePrivacy("activityStatus", value); }}
          />
          <PreferenceToggle 
            id="searchVisibility"
            title="Search Visibility"
            description="Allow your profile to be discovered in search results and recommendations."
            checked={searchVisibility}
            onCheckedChange={(value) => { setSearchVisibility(value); updatePrivacy("searchVisibility", value); }}
          />
        </div>
      </SettingsCard>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        <div className="border border-border/50 rounded-xl p-4 space-y-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm">Blocked Users</h4>
            <p className="text-xs text-muted-foreground">Manage blocked accounts</p>
          </div>
          <div className="flex gap-2">
            <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username" aria-label="Username to block" className="min-w-0 flex-1 rounded-md border bg-background px-2 py-1 text-sm" />
            <Button size="sm" onClick={() => void updateList("blockedUsers", true)}>Add</Button>
          </div>
          {blockedUsers.map((user) => <div key={user._id} className="flex items-center justify-between text-sm"><span>@{user.username}</span><Button size="sm" variant="ghost" onClick={() => void updateList("blockedUsers", false, user.username)}>Remove</Button></div>)}
        </div>
        
        <div className="border border-border/50 rounded-xl p-4 space-y-4">
          <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <EyeOff className="w-5 h-5" />
          </div>
          <div className="flex-1">
            <h4 className="font-medium text-sm">Muted Users</h4>
            <p className="text-xs text-muted-foreground">Manage muted accounts</p>
          </div>
          <div className="flex gap-2">
            <input value={username} onChange={(event) => setUsername(event.target.value)} placeholder="Username" aria-label="Username to mute" className="min-w-0 flex-1 rounded-md border bg-background px-2 py-1 text-sm" />
            <Button size="sm" onClick={() => void updateList("mutedUsers", true)}>Add</Button>
          </div>
          {mutedUsers.map((user) => <div key={user._id} className="flex items-center justify-between text-sm"><span>@{user.username}</span><Button size="sm" variant="ghost" onClick={() => void updateList("mutedUsers", false, user.username)}>Remove</Button></div>)}
        </div>
      </div>
    </motion.div>
  );
};
