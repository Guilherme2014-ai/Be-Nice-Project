import { sign } from "jsonwebtoken";
import IUserPayload from "../interfaces/IuserPayload";
import { config } from "dotenv";
import { resolve } from "path";

config({ path: resolve(__dirname, "..", "..", ".env") });

const secret = process.env.JWT_PASS;

export default (userPayload: IUserPayload): string => {
  try {
    userPayload.verifiedEmail = true;
    const { name, email, verifiedEmail } = userPayload;

    return sign(
      {
        name,
        email,
        verifiedEmail,
      },
      secret,
      {
        expiresIn: "4d",
      },
    );
  } catch (e) {
    throw e;
  }
};
