import express from "express";
import { signin, signout } from "../controllers/auth.controller";
const router = express.Router();

/*
 * '/auth/signin':
 *    POST request to authenticate the user with their email and password
 * '/auth/signout':
 *    GET request to clear the cookie containing a JWT
 *    that was set on the response object after sign-in
 */

router.route("/auth/signin").post(signin);
router.route("/auth/signout").get(signout);
export default router;
