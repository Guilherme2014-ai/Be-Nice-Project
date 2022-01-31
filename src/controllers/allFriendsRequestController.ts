import { Request, Response } from "express";
import IUserPayload from "../interfaces/IuserPayload";
import allFriendsRequestService from "../services/allFriendsRequestService";

export default async (req: Request, res: Response): Promise<Response> => {
  try {
    const userPayload = req["user_payload"] as IUserPayload;

    const all_requests = await allFriendsRequestService(userPayload);

    return res.json({ all_requests });
  } catch (e) {
    throw e;
  }
};
