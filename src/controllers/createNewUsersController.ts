import { Request, Response } from "express";
import IUserCreateRequest from "../interfaces/IUserCreateRequest";
import createNewUsersService from "../services/createNewUsersService";

export default async (req: Request, res: Response): Promise<Response> => {
  try {
    const userRequest = req.body as IUserCreateRequest;

    const userCreated = await createNewUsersService(userRequest);

    return res.json({ userCreated });
  } catch (e) {
    throw e;
  }
};
