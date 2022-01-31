import { Request, Response } from "express";
import IUserPayload from "../interfaces/IuserPayload";
import acceptFriendsRequestService from "../services/acceptFriendsRequestService";

export default async (req: Request, res: Response): Promise<Response> => {
  try {
    const userSenderEmail = req.params["user_sender_email_friend_request"];
    const user_payload = req["user_payload"] as IUserPayload;

    await acceptFriendsRequestService(user_payload, userSenderEmail);

    return res.json({ message: "Invite Accepted !" });
  } catch (e) {
    throw e;
  }
};
