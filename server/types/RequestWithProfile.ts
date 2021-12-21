import { Request } from "express";
import { IUserDoc } from "../models/user.model";

export interface RequestWithProfile extends Request {
    profile?:
        | (IUserDoc & {
              _id: any;
          })
        | null;
}
