import { Request, Response } from "express";

import User from "../models/user.model";
import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import config from "./../../config/config";

const signin = async (req: Request, res: Response) => {
    try {
        let user = await User.findOne({ email: req.body.email as string });
        if (!user) return res.status(401).json({ error: "User not found" });
        if (!user.authenticate(req.body.password as string)) {
            return res
                .status(401)
                .send({ error: "Email and password don't match." });
        }
        const token = jwt.sign({ _id: user._id }, config.jwtSecret);
        res.cookie("t", token, {
            expires: new Date(Date.now() + 9999),
        });
        return res.json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (err) {
        return res.status(401).json({ error: "Could not sign in" });
    }
};

const requireSignin = expressJwt({
    algorithms: ["HS256"],
    secret: config.jwtSecret,
    userProperty: "auth",
});

const hasAuthorization = (req: Request, res: Response) => {};
export default { signin, signout, requireSignin, hasAuthorization };
