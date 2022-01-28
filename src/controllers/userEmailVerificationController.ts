import { Request, Response } from "express";
import userEmailVerificationService from "../services/userEmailVerificationService";

export default async (req: Request, res: Response): Promise<Response> => {
  try {
    const userEmail = req.params.email as string;
    const emailVerificationSecret = `${req.params.secret}` as string;

    const new_token = await userEmailVerificationService(
      userEmail,
      emailVerificationSecret,
    );

    return res.json({ new_token });
  } catch (e) {
    throw e;
  }
};
