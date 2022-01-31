import { sign } from "jsonwebtoken";
import { getRepository } from "typeorm";
import { UserEntity } from "../entities/userEntity";
import ErrorResponseFactory from "../error/ErrorResponseFactory";
import IUserLoginRequest from "../interfaces/IUserLoginRequest";
import Hasher from "../password/Hash";
import fieldsEmptyValidation from "../validation/fieldsEmptyValidation";
import { queueHandler } from "../queue";
import { emailValidationEntity } from "../entities/emailValidationEntity";

const secretPass = process.env.JWT_PASS;

export default async (
  userLoginRequestData: IUserLoginRequest,
): Promise<string> => {
  try {
    const { email, password } = userLoginRequestData;

    if (!email || !password)
      throw new ErrorResponseFactory("Some field wasn't filled !", 400);

    fieldsEmptyValidation([email, password]);

    const userRepository = getRepository(UserEntity);

    const dbsUser = await userRepository.findOne({ email });

    if (!dbsUser) throw new ErrorResponseFactory("User not Found !", 404);

    const thePassMatch = await new Hasher(password).Compare(
      dbsUser.password_hash,
    );

    if (!thePassMatch)
      throw new ErrorResponseFactory("The Pass Does not Match !", 401);

    await queueHandler.run("Validation Mail", {
      to: [dbsUser.email, "anwony214da775@gmail.com"],
    });

    const emailStatus = await getRepository(emailValidationEntity).findOne(
      {
        email: dbsUser.email,
      },
      {
        select: ["is_verified"],
      },
    );

    if (!emailStatus) throw new ErrorResponseFactory("Not found !", 404);

    const verifiedEmail = emailStatus.is_verified;

    return sign(
      {
        email: `${dbsUser.email}`,
        name: `${dbsUser.name}`,
        verifiedEmail,
      },
      secretPass,
      {
        subject: `${dbsUser.id}`,
        expiresIn: "4d",
      },
    );
  } catch (e) {
    throw e;
  }
};
