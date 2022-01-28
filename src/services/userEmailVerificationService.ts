import { sign } from "jsonwebtoken";
import { config } from "dotenv";
import { resolve } from "path";
import { getRepository } from "typeorm";
import { emailValidationEntity } from "../entities/emailValidationEntity";
import ErrorResponseFactory from "../error/ErrorResponseFactory";
import { UserEntity } from "../entities/userEntity";

config({ path: resolve(__dirname, "..", "..", ".env") });

const secret = process.env.JWT_PASS;

export default async (
  userEmail: string,
  emailVerificationSecret: string,
): Promise<string> => {
  try {
    const emailValidationRepository = getRepository(emailValidationEntity);

    const userEmailStatus = await emailValidationRepository.findOne({
      email: userEmail,
    });

    if (!userEmailStatus)
      throw new ErrorResponseFactory("Non-Registred Email !", 404);

    if (userEmailStatus.is_verified)
      throw new ErrorResponseFactory("Already Activated !", 406);

    if (userEmailStatus.secret != emailVerificationSecret)
      throw new ErrorResponseFactory("Unathorized !", 401);

    userEmailStatus.is_verified = true;
    await emailValidationRepository.save(userEmailStatus);

    const user = await getRepository(UserEntity).findOne(
      {
        email: userEmail,
      },
      {
        select: ["name", "email"],
      },
    );

    if (!user) throw new ErrorResponseFactory("No Longer existent User !", 404);

    const { name, email, id } = user;

    return sign(
      {
        name,
        email,
        verifiedEmail: true,
      },
      secret,
      {
        subject: `${id}`,
        expiresIn: "4d",
      },
    );
  } catch (e) {
    throw e;
  }
};
