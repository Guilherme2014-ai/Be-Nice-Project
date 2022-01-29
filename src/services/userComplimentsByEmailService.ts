import { getRepository } from "typeorm";
import { ComplimentEntity } from "../entities/complimentEntity";
import { UserEntity } from "../entities/userEntity";
import { UserFriendsEntity } from "../entities/userFriendsEntity";
import ErrorResponseFactory from "../error/ErrorResponseFactory";
import IUserPayload from "../interfaces/IuserPayload";

export default async (
  userReceivedEmail: string,
  userPayload: IUserPayload,
): Promise<ComplimentEntity[]> => {
  try {
    const userRepository = getRepository(UserEntity);
    const { id: userReceivedId } = await userRepository.findOne(
      {
        email: userReceivedEmail,
      },
      {
        select: ["id"],
      },
    );
    const { sub: userId } = userPayload;

    const userExists = await userRepository.findOne(userReceivedId);

    if (!userExists) throw new ErrorResponseFactory("User Not Found !", 404);

    const isFriend = await getRepository(UserFriendsEntity).findOne({
      user: Number(userId),
      other_user: userReceivedId,
    });

    const isTheSameUser = Number(userId) == userReceivedId;

    if (!isFriend && !isTheSameUser)
      throw new ErrorResponseFactory("This User is not your friend :/", 401);

    return await getRepository(ComplimentEntity).find({
      user_receiver: userExists,
    });
  } catch (e) {
    throw e;
  }
};
