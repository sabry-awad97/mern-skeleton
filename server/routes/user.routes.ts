import express from "express";
import {
  httpCreateUser,
  httpListUsers,
  httpGetUserByID,
  httpReadUser,
  httpRemoveUser,
  httpUpdateUser,
} from "../controllers/user.controller";
import {
  requireSignin,
  hasAuthorization,
} from "../controllers/auth.controller";

const router = express.Router();

/*
 * /api/users for the following:
 *      Listing users with GET
 *      Creating a new user with POST
 
 * /api/users/:userId for the following:
 *      Fetching a user with GET
 *      Updating a user with PUT
 *      Deleting a user with DELETE
 */

router.route("/api/users").get(httpListUsers).post(httpCreateUser);

router
  .route("/api/users/:userId")
  .get(requireSignin, httpReadUser)
  .put(requireSignin, hasAuthorization, httpUpdateUser)
  .delete(requireSignin, hasAuthorization, httpRemoveUser);

router.param("userId", httpGetUserByID);

export default router;
