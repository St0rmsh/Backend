import React from "react";
import { motion } from "framer-motion";
// removed useTheme
import { SettingsGroup, SettingsItem, SettingsCard, SectionHeader, ThemeToggle } from "../components";
import { useSettings } from "../hooks";
import { Palette, Type, Wind } from "lucide-react";
import { Switch } from "@/shared/ui/switch";
import { Label } from "@/shared/ui/label";

export const AppearanceSettingsPage: React.FC = () => {
  const { theme, settings, updateTheme, updateSettings } = useSettings();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8"
    >
      <SectionHeader
        title="Appearance Settings"
        description="Customize how Zentro looks and feels"
      />

      {/* Theme */}
      <SettingsGroup
        title="Theme"
        description="Choose your preferred color scheme"
      >
        <SettingsCard
          title="Color Scheme"
          description="Select between light, dark, or system preference"
          icon={<Palette className="h-5 w-5" />}
        >
          <ThemeToggle
            value={theme}
            onChange={updateTheme}
          />
        </SettingsCard>

        <SettingsCard
          title="Automatic Switching"
          description="Automatically switch theme based on time of day"
        >
          <div className="flex items-center justify-between">
            <Label>Enable automatic theme switching</Label>
            <Switch defaultChecked={false} />
          </div>
        </SettingsCard>
      </SettingsGroup>

      {/* Typography */}
      <SettingsGroup
        title="Typography"
        description="Adjust text and font sizes for better readability"
      >
        <SettingsCard
          title="Font Size"
          description="Choose your preferred base font size"
          icon={<Type className="h-5 w-5" />}
        >
          <div className="space-y-3">
            {["sm", "md", "lg"].map((size) => (
              <label key={size} className="flex items-center gap-3">
                <input
                  type="radio"
                  name="fontSize"
                  value={size}
                  checked={settings.fontSize === (size as "sm" | "md" | "lg")}
                  onChange={(e) =>
                    updateSettings({
                      fontSize: e.target.value as "sm" | "md" | "lg",
                    })
                  }
                  className="w-4 h-4"
                />
                <span className="text-sm">
                  {size === "sm"
                    ? "Small"
                    : size === "md"
                    ? "Medium"
                    : "Large"}
                </span>
              </label>
            ))}
          </div>
        </SettingsCard>
      </SettingsGroup>

      {/* Accessibility */}
      <SettingsGroup
        title="Accessibility"
        description="Accessibility options for better user experience"
      >
        <SettingsCard
          title="Motion & Animation"
          description="Reduce motion and animations"
          icon={<Wind className="h-5 w-5" />}
        >
          <div className="flex items-center justify-between">
            <Label>Reduce motion (respects prefers-reduced-motion)</Label>
            <Switch
              checked={settings.reducedMotion}
              onCheckedChange={(checked) =>
                updateSettings({ reducedMotion: checked })
              }
            />
          </div>
        </SettingsCard>

        <SettingsCard
          title="Display Options"
          description="Additional display customization options"
        >
          <SettingsItem
            label="Compact Mode"
            value={
              <Switch defaultChecked={false} />
            }
            description="Reduce spacing and component sizes"
          />
        </SettingsCard>
      </SettingsGroup>
    </motion.div>
  );
};
