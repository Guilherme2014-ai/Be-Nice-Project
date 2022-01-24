import { getRepository } from "typeorm";
import { UserEntity } from "../entities/userEntity";
import ErrorResponseFactory from "../error/ErrorResponseFactory";
import IUserCreateRequest from "../interfaces/IUserCreateRequest";
import fieldsEmptyValidation from "../validation/fieldsEmptyValidation";

export default async (
  userRequestData: IUserCreateRequest,
): Promise<UserEntity> => {
  try {
    const { name, email, password } = userRequestData;

    if (!name || !email || !password)
      throw new ErrorResponseFactory("Some field wasn't filled !", 400);
    fieldsEmptyValidation([name, email, password]);

    const userRepository = await getRepository(UserEntity);

    const emailAlreadyRegistred = await userRepository.findOne({ email });

    if (emailAlreadyRegistred)
      throw new ErrorResponseFactory("Email Already Registred !", 406);

    const userCreated = userRepository.create({
      email,
      name,
      password_hash: password,
    });
    await userRepository.save(userCreated);

    return userCreated;
  } catch (e) {
    throw e;
  }
};
