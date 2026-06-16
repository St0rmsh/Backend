import { axiosInstance } from "../utils/axiosInstance";
import { ProfileFormData } from "../schemas/profile.schema";
import { ApiResponse } from "../types/api.types";
import { User } from "../types/user.types";

export const profileService = {
  updateProfile: async (data: ProfileFormData, avatarFile?: File, bannerFile?: File) => {
    const formData = new FormData();
    
    // Append text data
    if (data.username) formData.append("username", data.username);
    if (data.fullname) formData.append("fullname", data.fullname);
    if (data.bio) formData.append("bio", data.bio);

    // Append file data with the field names required by multer
    if (avatarFile) formData.append("avatar", avatarFile);
    if (bannerFile) formData.append("banner", bannerFile);

    const response = await axiosInstance.patch<ApiResponse<User>>("/auth/update-profile", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  },
};
