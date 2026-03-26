// Extended Express type definitions - Adds custom properties like req.user to Express Request

import { IUser } from "./interfaces";

declare module "express-serve-static-core" {
  interface Request {
    user?: IUser;
  }
}

export {};
