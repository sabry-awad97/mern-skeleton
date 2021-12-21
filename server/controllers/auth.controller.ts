import { Request, Response } from "express";

import User from "../models/user.model";
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import config from "./../../config/config";
const signin = (req: Request, res: Response) => {};
const signout = (req: Request, res: Response) => {};
const requireSignin = expressJwt({
    algorithms: ["HS256"],
    secret: config.jwtSecret,
    userProperty: "auth",
});
const hasAuthorization = (req: Request, res: Response) => {};
export default { signin, signout, requireSignin, hasAuthorization };
