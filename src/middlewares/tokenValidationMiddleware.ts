import { Request, Response, NextFunction } from "express";
import { resolve } from "path";
import { config } from "dotenv";
import ErrorResponseFactory from "../error/ErrorResponseFactory";
import { verify } from "jsonwebtoken";

config({ path: resolve(__dirname, "..", "..", ".env") });

const jwtPass = process.env.JWT_PASS;

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers["authorization"];

    if (!authorization || authorization.trim() == "")
      throw new ErrorResponseFactory("Token Required !", 401);

    const token: string =
      authorization.split(" ").length > 1
        ? authorization.split(" ")[1]
        : authorization;

    const user_payload = await verify(token, jwtPass);
    req["user_payload"] = user_payload;
    next();
  } catch (e) {
    throw e;
  }
};
