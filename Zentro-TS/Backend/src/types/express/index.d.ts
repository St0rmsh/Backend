import { JwtPayload } from "jsonwebtoken";

export {};


declare global {
  namespace Express {
    interface Request {
      user?: {
        _id: string;
        email?: string;
         roles?: ("user" | "author" | "admin")[];
      };
    }
  }
}