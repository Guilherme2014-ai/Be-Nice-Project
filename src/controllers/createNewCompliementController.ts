import { Request, Response } from "express";
import IComplimentInput from "../interfaces/IComplimentInput";
import IUserPayload from "../interfaces/IuserPayload";
import createNewUsersService from "../services/createNewCompliementService";

export default async (req: Request, res: Response): Promise<Response> => {
  try {
    const complimentRequestInput = req.body as IComplimentInput;
    const { email } = req["user_payload"] as IUserPayload;

    complimentRequestInput.user_sender = email;

    const complimentCreated = await createNewUsersService(
      complimentRequestInput,
    );

    return res.json({ complimentCreated });
  } catch (e) {
    throw e;
  }
};
