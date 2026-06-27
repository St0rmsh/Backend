import { Outlet, Link, useLocation } from "react-router-dom";
import { ROUTES } from "@/router/routes.config";

const SETTINGS_SECTIONS = [
  { name: "Profile", href: ROUTES.PROFILE_SETTINGS, icon: "👤" },
  { name: "Security", href: ROUTES.SECURITY_SETTINGS, icon: "🔒" },
  { name: "Privacy", href: ROUTES.PRIVACY_SETTINGS, icon: "👁" },
  { name: "Preferences", href: ROUTES.PREFERENCES_SETTINGS, icon: "⚙️" },
];

/**
 * Settings Layout Component
 * Layout for settings pages with sidebar navigation
 */
export const SettingsLayout = () => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-background">
      {/* Settings Sidebar */}
      <aside className="w-64 border-r border-border bg-muted/50 p-6">
        <h2 className="text-lg font-semibold mb-6">Settings</h2>
        <nav className="space-y-2">
          {SETTINGS_SECTIONS.map((section) => (
            <Link
              key={section.href}
              to={section.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors ${
                location.pathname === section.href
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-muted"
              }`}
            >
              <span>{section.icon}</span>
              <span>{section.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Settings Content */}
      <main className="flex-1 p-8">
        <Outlet />
      </main>
    </div>
  );
};
