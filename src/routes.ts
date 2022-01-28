import tokenValidationMiddleware from "./middlewares/tokenValidationMiddleware";
import { Router } from "express";

import usersGetByNameController from "./controllers/usersGetByNameController";
import createNewUsersController from "./controllers/createNewUsersController";
import userLoginController from "./controllers/userLoginController";
import userEmailVerificationController from "./controllers/userEmailVerificationController";

const router = Router();

router.get(
  "/users/search/name/:userName",
  tokenValidationMiddleware,
  usersGetByNameController,
);

router.post("/users/create", createNewUsersController);

router.post("/users/login", userLoginController);

router.get(
  "/users/email/verification/:email/:secret",
  userEmailVerificationController,
);

export default router;
