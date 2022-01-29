import { Request, Response } from "express";
import userComplimentsByEmailService from "../services/userComplimentsByEmailService";

export default async (req: Request, res: Response): Promise<Response> => {
  try {
    const userEmail = req.params["user_email"] as string;
    const payload = req["user_payload"];

    const userCompliments = await userComplimentsByEmailService(
      userEmail,
      payload,
    );

    return res.json({ userCompliments });
  } catch (e) {
    throw e;
  }
};
