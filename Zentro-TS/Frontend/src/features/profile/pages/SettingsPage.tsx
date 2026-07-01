import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { User, Palette, Lock } from "lucide-react";
import { ProfileTabs } from "../components";
import { AccountSettingsPage } from "./AccountSettingsPage";
import { AppearanceSettingsPage } from "./AppearanceSettingsPage";
import { SecuritySettingsPage } from "./SecuritySettingsPage";
import { PROFILE_TABS } from "../constants/profile.constants";

interface SettingsTab {
  id: string;
  label: string;
  icon: React.ReactNode;
}

const SETTINGS_TABS: SettingsTab[] = [
  {
    id: PROFILE_TABS.ACCOUNT,
    label: "Account",
    icon: <User className="h-4 w-4" />,
  },
  {
    id: PROFILE_TABS.APPEARANCE,
    label: "Appearance",
    icon: <Palette className="h-4 w-4" />,
  },
  {
    id: PROFILE_TABS.SECURITY,
    label: "Security",
    icon: <Lock className="h-4 w-4" />,
  },
];

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState(PROFILE_TABS.ACCOUNT);
  const navigate = useNavigate();

  const renderContent = () => {
    switch (activeTab) {
      case PROFILE_TABS.ACCOUNT:
        return <AccountSettingsPage />;
      case PROFILE_TABS.APPEARANCE:
        return <AppearanceSettingsPage />;
      case PROFILE_TABS.SECURITY:
        return <SecuritySettingsPage />;
      default:
        return <AccountSettingsPage />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen"
    >
      <div className="max-w-6xl mx-auto py-8 px-4 md:px-6">
        {/* Desktop Layout - Side by side */}
        <div className="hidden md:grid md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="col-span-1"
          >
            <div className="space-y-2 sticky top-8">
              {SETTINGS_TABS.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ x: 4 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all text-left ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-foreground"
                  }`}
                >
                  {tab.icon}
                  <span className="text-sm font-medium">{tab.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.aside>

          {/* Main Content */}
          <motion.main
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="col-span-3"
          >
            <div className="bg-card rounded-lg border p-8">
              {renderContent()}
            </div>
          </motion.main>
        </div>

        {/* Mobile Layout - Tabs on top */}
        <div className="md:hidden space-y-6">
          <div className="bg-card rounded-lg border overflow-hidden">
            <ProfileTabs
              tabs={SETTINGS_TABS}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-card rounded-lg border p-6"
          >
            {renderContent()}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};
