import { getRepository } from "typeorm";
import IComplimentInput from "../interfaces/IComplimentInput";
import ErrorResponseFactory from "../error/ErrorResponseFactory";
import fieldsEmptyValidation from "../validation/fieldsEmptyValidation";
import { UserEntity } from "../entities/userEntity";
import { ComplimentEntity } from "../entities/complimentEntity";

export default async (complimentInput: IComplimentInput): Promise<void> => {
  try {
    fieldsEmptyValidation([
      complimentInput.message,
      complimentInput.user_receiver,
      complimentInput.user_sender,
    ]);

    const { message, user_receiver, user_sender } = complimentInput;

    const userRepository = getRepository(UserEntity);

    if (user_receiver == user_sender)
      throw new ErrorResponseFactory("Not Acceptable !", 406);

    const userReceiverExists = await userRepository.findOne({
      email: user_receiver,
    });
    const userSendExists = await userRepository.findOne({ email: user_sender });

    if (!userReceiverExists || !userSendExists)
      throw new ErrorResponseFactory("Not Found", 404);

    const compliementRepository = getRepository(ComplimentEntity);

    const compliment = compliementRepository.create({
      message,
      user_receiver: userReceiverExists, // ou id as userEntity
      user_sender: userSendExists, // ou id as userEntity
    });

    await compliementRepository.save(compliment);
  } catch (e) {
    throw e;
  }
};
