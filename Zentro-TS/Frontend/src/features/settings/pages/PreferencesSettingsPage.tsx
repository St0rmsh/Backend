import { motion } from "framer-motion";
import { useAppDispatch, useAppSelector } from "@/shared/hooks";
import { setLanguage, updatePreferences } from "../state/settingsSlice";
import { Language } from "../types";
import { SettingsHeader } from "../components/SettingsHeader";
import { SettingsCard } from "../components/SettingsCard";
import { PreferenceToggle } from "../components/PreferenceToggle";

export const PreferencesSettingsPage = () => {
  const dispatch = useAppDispatch();
  const { language, preferences } = useAppSelector((state) => state.settings);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-3xl"
    >
      <SettingsHeader 
        title="App Preferences" 
        description="Customize your overall experience." 
      />
      
      <SettingsCard title="Language" description="Select the language used throughout the application.">
        <div className="max-w-md">
          <select 
            value={language}
            onChange={(e) => dispatch(setLanguage(e.target.value as Language))}
            className="w-full flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </SettingsCard>

      <SettingsCard title="Accessibility & UX" description="Configure visual and interaction preferences.">
        <div className="space-y-2 divide-y divide-border/50">
          <PreferenceToggle 
            id="reducedMotion"
            title="Reduced Motion"
            description="Disable non-essential animations and transitions throughout the app."
            checked={preferences.reducedMotion}
            onCheckedChange={(checked) => dispatch(updatePreferences({ reducedMotion: checked }))}
          />
          <PreferenceToggle 
            id="compactMode"
            title="Compact Mode"
            description="Reduce spacing in lists and tables to show more content."
            checked={preferences.compactMode}
            onCheckedChange={(checked) => dispatch(updatePreferences({ compactMode: checked }))}
          />
          <PreferenceToggle 
            id="autoPlayMedia"
            title="Auto-play Media"
            description="Automatically play videos and animated GIFs as you scroll."
            checked={preferences.autoPlayMedia}
            onCheckedChange={(checked) => dispatch(updatePreferences({ autoPlayMedia: checked }))}
          />
        </div>
      </SettingsCard>
    </motion.div>
  );
};
