import { Request, Response, NextFunction } from "express";
import ErrorResponseFactory from "../error/ErrorResponseFactory";

export default (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
): Response => {
  if (process.env.NODE_ENV != "test") console.error(err);

  if (!(err instanceof ErrorResponseFactory)) {
    res.statusCode = 500;
    return res.json({ error: `${err}` });
  }
  const { message, status } = err as ErrorResponseFactory;
  res.statusCode = status;
  return res.json({ Error: message });
};
