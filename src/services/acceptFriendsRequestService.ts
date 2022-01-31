import { getRepository } from "typeorm";
import { friendsRequestEntity } from "../entities/friendsRequestsEntity";
import { UserEntity } from "../entities/userEntity";
import { UserFriendsEntity } from "../entities/userFriendsEntity";
import ErrorResponseFactory from "../error/ErrorResponseFactory";
import IUserPayload from "../interfaces/IuserPayload";

export default async (userPayload: IUserPayload, userSenderEmail: string) => {
  try {
    const { email: userReceiverEmail, sub: userReceiverId } = userPayload;

    const userSender = await getRepository(UserEntity).findOne(
      { email: userSenderEmail },
      { select: ["id"] },
    );

    if (!userSender) throw new ErrorResponseFactory("User not found !", 404);

    const invite = await getRepository(friendsRequestEntity).findOne({
      user_receiver_email: userReceiverEmail,
      user_sender_email: userSenderEmail,
    });

    if (!invite) throw new ErrorResponseFactory("Invite not Found !", 404);

    const userFriendsRepository = getRepository(UserFriendsEntity);

    const { id: userSenderId } = userSender;
    const friendShip = userFriendsRepository.create({
      user: userSenderId,
      other_user: Number(userReceiverId),
    });
    await userFriendsRepository.save(friendShip);

    await invite.remove();
  } catch (e) {
    throw e;
  }
};
