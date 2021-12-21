import { Request, Response, NextFunction, RequestHandler } from "express";

import User from "../models/user.model";
import errorHandler from "./../helpers/dbErrorHandler";

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
        let users = await User.find().select("name email updated created");
        res.json(users);
    } catch (err) {
        return res.status(400).json({
            error: errorHandler.getErrorMessage(err),
        });
    }
};

const userByID = (
    req: Request,
    res: Response,
    next: NextFunction,
    id: any
) => {};
const read: RequestHandler = (req, res) => {};
const update: RequestHandler = (req, res, next) => {};
const remove: RequestHandler = (req, res, next) => {};

export default { create, userByID, read, list, remove, update };
