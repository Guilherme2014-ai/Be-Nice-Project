import { Request, Response, NextFunction } from "express";
import { resolve } from "path";
import { config } from "dotenv";
import ErrorResponseFactory from "../error/ErrorResponseFactory";

config({ path: resolve(__dirname, "..", "..", ".env") });

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const isVerified = req["user_payload"]["verifiedEmail"];

    if (!isVerified)
      throw new ErrorResponseFactory("Email Verification Required !", 401);

    next();
  } catch (e) {
    throw e;
  }
};
