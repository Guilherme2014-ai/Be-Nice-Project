import { getRepository } from "typeorm";
import { friendsRequestEntity } from "../entities/friendsRequestsEntity";
import IUserPayload from "../interfaces/IuserPayload";

export default async (
  userPayload: IUserPayload,
): Promise<friendsRequestEntity[]> => {
  try {
    const { email } = userPayload;

    return await getRepository(friendsRequestEntity).find({
      user_receiver_email: email,
    });
  } catch (e) {
    throw e;
  }
};
