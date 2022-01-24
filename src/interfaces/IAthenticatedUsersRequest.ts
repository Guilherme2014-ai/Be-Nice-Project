import { Request } from "express";

export default interface IAthenticatedUsersRequest extends Request {
  userPayload: object;
}
