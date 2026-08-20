import { motion } from "framer-motion";
import { SettingsHeader } from "../components/SettingsHeader";
import { SettingsCard } from "../components/SettingsCard";
import { ChangePasswordForm } from "@/features/auth/components/ChangePasswordForm";

export const SecuritySettingsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-3xl"
    >
      <SettingsHeader 
        title="Security Settings" 
        description="Manage your password and security preferences." 
      />
      
      <SettingsCard title="Change Password" description="Ensure your account is using a long, random password to stay secure.">
        <div className="max-w-md">
          <ChangePasswordForm />
        </div>
      </SettingsCard>
    </motion.div>
  );
};
