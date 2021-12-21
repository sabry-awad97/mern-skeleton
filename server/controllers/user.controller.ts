import { Request, Response, NextFunction, RequestHandler } from "express";

import User from "../models/user.model";

const create: RequestHandler = (req, res, next) => {};
const list: RequestHandler = (req, res) => {};
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
