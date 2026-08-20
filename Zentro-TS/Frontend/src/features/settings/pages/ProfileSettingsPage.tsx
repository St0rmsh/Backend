import { motion } from "framer-motion";
import { SettingsHeader } from "../components/SettingsHeader";
import { SettingsCard } from "../components/SettingsCard";
import { ProfileForm } from "@/features/auth/components/ProfileForm";

export const ProfileSettingsPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-3xl"
    >
      <SettingsHeader 
        title="Profile Settings" 
        description="Manage your public profile and personal information." 
      />
      
      <SettingsCard>
        <ProfileForm />
      </SettingsCard>
    </motion.div>
  );
};
