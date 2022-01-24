import { Request, Response } from "express";
import usersGetByNameService from "../services/usersGetByNameService";

export default async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userName } = req.params;

    console.log(`NOME: ${userName}`);

    const users = await usersGetByNameService(userName);

    return res.json({
      users,
    });
  } catch (e) {
    throw e;
  }
};
