import { Request } from "express";
import { IUserDoc } from "../models/user.model";

export interface RequestWithAuth extends Request {
    auth?: any;
}
