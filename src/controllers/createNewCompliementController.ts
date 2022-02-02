import { Request, Response } from "express";
import IComplimentInput from "../interfaces/IComplimentInput";
import IUserPayload from "../interfaces/IuserPayload";
import createNewUsersService from "../services/createNewCompliementService";

export default async (req: Request, res: Response): Promise<Response> => {
  try {
    const { email } = req["user_payload"] as IUserPayload;

    const complimentRequestInput = {
      user_receiver: req.params.user_receiver,
      user_sender: email,
      ...req.body,
    } as IComplimentInput;

    await createNewUsersService(complimentRequestInput);

    res.statusCode = 200;
    return res.json({ message: "Compliment Sent !" });
  } catch (e) {
    throw e;
  }
};
