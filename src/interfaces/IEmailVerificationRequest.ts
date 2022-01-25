import { Request } from "express";
import IUserPayload from "./IuserPayload";

export default interface IEmailVerificationRequest extends Request {
  user_payload: IUserPayload;
}
