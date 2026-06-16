export interface User {
  _id: string;
  username: string;
  fullname: string;
  email: string;
  avatar?: string;
  banner?: string;
  bio?: string;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
