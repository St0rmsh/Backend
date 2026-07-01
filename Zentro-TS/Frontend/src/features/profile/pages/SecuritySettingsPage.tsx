import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { SettingsGroup, SettingsItem, SettingsCard, SectionHeader, DangerZone } from "../components";
import { Lock, Smartphone, KeyRound, LogOut } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "@/router/routes.config";

export const SecuritySettingsPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <SectionHeader
        title="Security Settings"
        description="Manage your account security and privacy"
      />

      {/* Password */}
      <SettingsGroup
        title="Password & Authentication"
        description="Secure your account with a strong password"
      >
        <SettingsCard
          title="Password"
          description="Change your password regularly"
          icon={<Lock className="h-5 w-5" />}
        >
          <SettingsItem
            label="Password"
            value="••••••••"
            action={
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(ROUTES.CHANGE_PASSWORD)}
              >
                Change
              </Button>
            }
            description="Last changed 3 months ago"
          />
        </SettingsCard>

        <SettingsCard
          title="Two-Factor Authentication"
          description="Add an extra layer of security to your account"
          icon={<Smartphone className="h-5 w-5" />}
        >
          <SettingsItem
            label="Two-Factor Authentication"
            value={
              <span className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-gray-400" />
                Not enabled
              </span>
            }
            action={<Button variant="outline" size="sm">Enable</Button>}
            description="Use an authenticator app for extra security"
          />
        </SettingsCard>

        <SettingsCard
          title="Recovery Codes"
          description="Save backup codes to recover your account"
          icon={<KeyRound className="h-5 w-5" />}
        >
          <SettingsItem
            label="Recovery Codes"
            value="Not generated"
            action={<Button variant="outline" size="sm">Generate</Button>}
            description="Backup codes for account recovery"
          />
        </SettingsCard>
      </SettingsGroup>

      {/* Connected Devices */}
      <SettingsGroup
        title="Connected Devices"
        description="Manage devices and sessions"
      >
        <SettingsCard
          title="Active Sessions"
          description="Devices currently logged into your account"
        >
          <div className="space-y-3">
            <SettingsItem
              label="Current Session"
              value={
                <span className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  Chrome on Windows
                </span>
              }
              description="Current session • 127.0.0.1 • Now"
            />
          </div>
          <Button variant="outline" size="sm" className="mt-4">
            View all sessions
          </Button>
        </SettingsCard>
      </SettingsGroup>

      {/* Email Verification */}
      <SettingsGroup
        title="Verification"
        description="Verify your email and identity"
      >
        <SettingsCard
          title="Email Verification"
          description="Your email verification status"
        >
          <SettingsItem
            label="Email Status"
            value={
              user?.isEmailVerified ? (
                <span className="flex items-center gap-2 text-green-600">
                  <div className="h-2 w-2 rounded-full bg-green-600" />
                  Verified
                </span>
              ) : (
                <span className="flex items-center gap-2 text-yellow-600">
                  <div className="h-2 w-2 rounded-full bg-yellow-600" />
                  Pending verification
                </span>
              )
            }
            description={user?.email}
          />
        </SettingsCard>
      </SettingsGroup>

      {/* Danger Zone */}
      <SettingsGroup title="Danger Zone" description="Irreversible account actions">
        <DangerZone
          title="Log Out of All Devices"
          description="This will log you out of your account on all devices. You'll need to sign in again."
          actionLabel="Log Out All"
          onAction={() => console.log("Log out all devices")}
        />

        <DangerZone
          title="Delete Account"
          description="Permanently delete your account and all associated data. This action cannot be undone."
          actionLabel="Delete Account"
          onAction={() => console.log("Delete account")}
        />
      </SettingsGroup>
    </motion.div>
  );
};
