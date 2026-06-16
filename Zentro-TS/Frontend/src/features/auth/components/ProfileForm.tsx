import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { profileSchema, ProfileFormData } from "../schemas/profile.schema";
import { useAuth } from "../hooks/useAuth";
import { AUTH_MESSAGES } from "../constants/authMessages";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarUploader } from "./AvatarUploader";
import { BannerUploader } from "./BannerUploader";

export const ProfileForm = () => {
  const { user, updateProfile, loading } = useAuth();
  const [avatarFile, setAvatarFile] = useState<File | undefined>();
  const [bannerFile, setBannerFile] = useState<File | undefined>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: user?.username || "",
      fullname: user?.fullname || "",
      bio: user?.bio || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      await updateProfile(data, avatarFile, bannerFile);
      toast.success(AUTH_MESSAGES.UPDATE_PROFILE_SUCCESS);
    } catch (error) {
      toast.error(error as string);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-2xl mx-auto">
      <div className="space-y-6">
        <BannerUploader 
          currentBannerUrl={user?.banner} 
          onFileSelect={setBannerFile} 
        />
        <div className="relative -mt-16 ml-8">
          <AvatarUploader 
            currentAvatarUrl={user?.avatar} 
            onFileSelect={setAvatarFile} 
          />
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="fullname">Full Name</Label>
            <Input id="fullname" {...register("fullname")} />
            {errors.fullname && <p className="text-xs text-destructive">{errors.fullname.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" {...register("username")} />
            {errors.username && <p className="text-xs text-destructive">{errors.username.message}</p>}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email (Not editable)</Label>
          <Input id="email" value={user?.email || ""} disabled className="bg-muted" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <textarea
            id="bio"
            {...register("bio")}
            className="flex min-h-[120px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Tell us a little bit about yourself"
          />
          {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
        </div>
      </div>

      <div className="flex justify-end gap-4 border-t pt-6">
        <Button variant="outline" type="button" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </div>
    </form>
  );
};
