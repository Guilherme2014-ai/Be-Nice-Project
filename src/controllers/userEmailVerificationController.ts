import { Request, Response } from "express";
import IEmailVerificationRequest from "../interfaces/IEmailVerificationRequest";
import userEmailVerificationService from "../services/userEmailVerificationService";

export default async (req: Request, res: Response): Promise<Response> => {
  try {
    const { user_payload } = req as IEmailVerificationRequest;

    const new_token = userEmailVerificationService(user_payload);

    return res.json({ new_token });
  } catch (e) {
    throw e;
  }
};
