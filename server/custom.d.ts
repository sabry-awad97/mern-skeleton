import { IUserDoc } from './models/user.model';

declare global {
  namespace Express {
    interface Request {
      auth?: any;

      profile?:
        | (IUserDoc & {
            _id: any;
          })
        | null;
    }
  }
}
