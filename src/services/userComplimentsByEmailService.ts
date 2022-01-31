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

    const userExists = await userRepository.findOne(
      {
        email: userReceivedEmail,
      },
      {
        select: ["id"],
        relations: ["compliments_receiveds"],
      },
    );

    if (!userExists) throw new ErrorResponseFactory("User Not Found !", 404);

    const { sub: userId } = userPayload;
    const { id: userReceivedId } = userExists;

    const isFriend =
      (await getRepository(UserFriendsEntity).findOne({
        user: Number(userId),
        other_user: userReceivedId,
      })) ||
      (await getRepository(UserFriendsEntity).findOne({
        user: userReceivedId,
        other_user: Number(userId),
      }));

    const isTheSameUser = Number(userId) == userReceivedId;

    if (!isFriend && !isTheSameUser)
      throw new ErrorResponseFactory("This User is not your friend :/", 401);

    return await userExists.compliments_receiveds;
  } catch (e) {
    throw e;
  }
};
