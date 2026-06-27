export interface IUserProfileResponse {
  user: {
    _id: string;
    username: string;
    fullname: string;
    bio?: string;
    avatar?: string;
  };
  followersCount: number;
  followingCount: number;
  postsCount: number;
}