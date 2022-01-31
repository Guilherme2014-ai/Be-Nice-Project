import { getRepository } from "typeorm";
import { ComplimentEntity } from "../entities/complimentEntity";
import { friendsRequestEntity } from "../entities/friendsRequestsEntity";
import { UserEntity } from "../entities/userEntity";
import ErrorResponseFactory from "../error/ErrorResponseFactory";
import IUserPayload from "../interfaces/IuserPayload";

export default async (
  userPayload: IUserPayload,
  inviteReceiverUserEmail: string,
): Promise<void> => {
  try {
    const { email: userEmail } = userPayload;
    const userRepository = getRepository(UserEntity);

    const userReceiver = await userRepository.findOne(
      {
        email: inviteReceiverUserEmail,
      },
      { relations: ["friends_requests"] },
    );

    if (!userReceiver) throw new ErrorResponseFactory("User Not Found !", 404);

    const invitSent = userReceiver.friends_requests.find(
      (invit) => invit.user_sender_email == userEmail,
    );

    if (invitSent) throw new ErrorResponseFactory("Email Already Sent !", 406);

    const friendRequestRepository = getRepository(friendsRequestEntity);
    const friendRequest = friendRequestRepository.create({
      user_sender_email: userEmail,
      user_receiver_email: inviteReceiverUserEmail,
    });

    await friendRequestRepository.save(friendRequest);
  } catch (e) {
    throw e;
  }
};
