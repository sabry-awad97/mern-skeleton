import { Request, Response, NextFunction, RequestHandler } from "express";

import User, { IUserDoc } from "../models/user.model";
import errorHandler from "./../helpers/dbErrorHandler";
import extend from "lodash/extend";

interface RequestWithProfile extends Request {
    profile?:
        | (IUserDoc & {
              _id: any;
          })
        | null;
}

/**
 * This function creates a new user with the user JSON object
 * that's received in the POST request from the frontend within req.body.
 */
const create: RequestHandler = async (req, res, next) => {
    try {
        await User.create(req.body);
        return res.status(200).json({
            message: "Successfully signed up!",
        });
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const list: RequestHandler = async (req, res) => {
    try {
        // populates only the name, email, created, and updated fields
        let users = await User.find().select("name email updated created");
        res.json(users);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const userByID = async (
    req: RequestWithProfile,
    res: Response,
    next: NextFunction,
    id: any
) => {
    try {
        let user = await User.findById(id);
        if (!user)
            return res.status(400).json({
                error: "User not found",
            });
        req.profile = user;
        next();
    } catch (err) {
        return res.status(400).json({
            error: "Could not retrieve user",
        });
    }
};

const read = (req: RequestWithProfile, res: Response) => {
    const { profile } = req;
    if (!profile) return;
    profile.hashed_password = undefined;
    profile.salt = undefined;
    return res.json(req.profile);
};

const update = async (
    req: RequestWithProfile,
    res: Response,
    next: NextFunction
) => {
    try {
        let user = req.profile;

        // merge the changes
        user = extend(user, req.body);

        if (!user) return;

        user.updated = Date.now();
        await user.save();
        user.hashed_password = undefined;
        user.salt = undefined;
        res.json(user);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};
const remove: RequestHandler = (req, res, next) => {};

export default { create, userByID, read, list, remove, update };
