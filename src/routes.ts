import tokenValidationMiddleware from "./middlewares/tokenValidationMiddleware";
import { Router } from "express";

import usersGetByNameController from "./controllers/usersGetByNameController";
import createNewUsersController from "./controllers/createNewUsersController";
import userLoginController from "./controllers/userLoginController";
import userEmailVerificationController from "./controllers/userEmailVerificationController";
import createNewCompliementController from "./controllers/createNewCompliementController";
import userComplimentsByEmailController from "./controllers/userComplimentsByEmailController";
import emailVerificationValidationMiddleware from "./middlewares/emailVerificationValidationMiddleware";
import sendFriendRequestController from "./controllers/sendFriendRequestController";
import allFriendsRequestController from "./controllers/allFriendsRequestController";
import acceptFriendsRequestController from "./controllers/acceptFriendsRequestController";

const router = Router();

router.get(
  "/users/search/name/:userName",
  tokenValidationMiddleware,
  emailVerificationValidationMiddleware,
  usersGetByNameController,
);
router.post("/users/create", createNewUsersController);
router.post("/users/login", userLoginController);
router.get(
  "/users/email/verification/:email/:secret",
  userEmailVerificationController,
);

router.post(
  "/users/compliments/create/:user_receiver",
  tokenValidationMiddleware,
  createNewCompliementController,
);
router.get(
  "/users/compliments/:user_email",
  tokenValidationMiddleware,
  emailVerificationValidationMiddleware,
  userComplimentsByEmailController,
);

router.post(
  "/users/friends/resquests/send/:user_email",
  tokenValidationMiddleware,
  emailVerificationValidationMiddleware,
  sendFriendRequestController,
);
router.post(
  "/users/friends/resquests",
  tokenValidationMiddleware,
  allFriendsRequestController,
);
router.post(
  "/users/friends/resquests/accept/:user_sender_email_friend_request",
  tokenValidationMiddleware,
  acceptFriendsRequestController,
);

export default router;
