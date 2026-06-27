import { ProfileForm } from "../components/ProfileForm";

export const ProfileSettingsPage = () => {
  return (
    <div className="container py-10 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Profile Settings</h1>
        <p className="text-muted-foreground">Manage your public profile and personal information.</p>
      </div>
      <div className="bg-card rounded-xl border p-6 sm:p-10 shadow-sm">
        <ProfileForm />
      </div>
    </div>
  );
};
