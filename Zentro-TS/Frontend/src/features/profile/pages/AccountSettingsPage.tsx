import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SettingsGroup, SettingsItem, SettingsCard, SectionHeader } from "../components";
import { Mail, User, Shield, Clock } from "lucide-react";
import { Button } from "@/shared/ui/button";

export const AccountSettingsPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <SectionHeader
        title="Account Settings"
        description="Manage your account information and privacy preferences"
      />

      {/* Account Information */}
      <SettingsGroup
        title="Account Information"
        description="Your account details and personal information"
      >
        <SettingsCard
          title="Email Address"
          description="Your primary email address"
          icon={<Mail className="h-5 w-5" />}
        >
          <div className="space-y-3">
            <SettingsItem
              label="Email"
              value={user?.email}
              copyable
              description="Used for login and notifications"
            />
            {user?.isEmailVerified ? (
              <div className="text-xs text-green-600 flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-600" />
                Email verified
              </div>
            ) : (
              <Button variant="outline" size="sm">
                Verify Email
              </Button>
            )}
          </div>
        </SettingsCard>

        <SettingsCard
          title="Username"
          description="Your unique identifier on Zentro"
          icon={<User className="h-5 w-5" />}
        >
          <SettingsItem
            label="Username"
            value={user?.username}
            action={<Button variant="outline" size="sm">Change</Button>}
            description="Visible in your profile URL"
          />
        </SettingsCard>

        <SettingsCard
          title="Account Status"
          description="Your account's current status"
          icon={<Shield className="h-5 w-5" />}
        >
          <SettingsItem
            label="Account Status"
            value={
              <span className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                Active
              </span>
            }
            description="Your account is active and in good standing"
          />
        </SettingsCard>
      </SettingsGroup>

      {/* Activity */}
      <SettingsGroup
        title="Activity"
        description="Your recent account activity"
      >
        <SettingsCard
          title="Last Login"
          description="Your most recent login"
          icon={<Clock className="h-5 w-5" />}
        >
          <SettingsItem
            label="Last Login"
            value="Just now"
            description="You are currently logged in"
          />
        </SettingsCard>

        <SettingsCard
          title="Login History"
          description="View devices and locations where you've logged in"
        >
          <Button variant="outline" size="sm">
            View Login History
          </Button>
        </SettingsCard>
      </SettingsGroup>
    </motion.div>
  );
};
