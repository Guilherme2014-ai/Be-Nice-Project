import { getRepository } from "typeorm";
import { UserEntity } from "../entities/userEntity";

export default async (userName: string): Promise<UserEntity[]> => {
  try {
    const userRepository = await getRepository(UserEntity);
    return await userRepository.find({ name: userName });
  } catch (e) {
    throw e;
  }
};
