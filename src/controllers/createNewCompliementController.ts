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

    const complimentCreated = await createNewUsersService(
      complimentRequestInput,
    );

    return res.json({ complimentCreated });
  } catch (e) {
    throw e;
  }
};
