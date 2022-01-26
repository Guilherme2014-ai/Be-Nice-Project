import { config } from "dotenv";
import { resolve } from "path";
import { sign } from "jsonwebtoken";
import { getRepository } from "typeorm";
import { UserEntity } from "../entities/userEntity";
import ErrorResponseFactory from "../error/ErrorResponseFactory";
import IUserLoginRequest from "../interfaces/IUserLoginRequest";
import Hasher from "../password/Hash";
import fieldsEmptyValidation from "../validation/fieldsEmptyValidation";
import { queueHandler } from "../queue";

config({ path: resolve(__dirname, "..", "..", ".env") });

const secretPass = process.env.JWT_PASS;

export default async (
  userLoginRequestData: IUserLoginRequest,
): Promise<string> => {
  try {
    const { email, password } = userLoginRequestData;

    if (!email || !password)
      throw new ErrorResponseFactory("Some field wasn't filled !", 400);
    fieldsEmptyValidation([email, password]);

    const userRepository = await getRepository(UserEntity);

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

    return sign(
      {
        email: `${dbsUser.email}`,
        name: `${dbsUser.name}`,
        verifiedEmail: false,
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
