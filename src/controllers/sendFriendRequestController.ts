import { Request, Response } from "express";
import IUserPayload from "../interfaces/IuserPayload";
import sendFriendRequestService from "../services/sendFriendRequestService";

export default async (req: Request, res: Response): Promise<Response> => {
  try {
    const inviteReceiverUserEmail = req.params["user_email"];
    const userPayload = req["user_payload"] as IUserPayload;

    await sendFriendRequestService(userPayload, inviteReceiverUserEmail);

    return res.json({ message: "Invite Sent !" });
  } catch (e) {
    throw e;
  }
};
