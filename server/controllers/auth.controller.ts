import { Request, Response, NextFunction, RequestHandler } from 'express';

import { User } from '../models/user.model';

import jwt from 'jsonwebtoken';
import { expressjwt as expjwt } from 'express-jwt';

import { config } from '../../config';

export const signin = async (req: Request, res: Response) => {
  try {
    let user = await User.findOne({ email: req.body.email as string });
    if (!user) return res.status(401).json({ error: 'User not found' });
    if (!user.authenticate(req.body.password as string)) {
      return res.status(401).send({ error: "Email and password don't match." });
    }
    const token = jwt.sign({ _id: user._id }, config.jwtSecret);
    res.cookie('t', token, {
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
    return res.status(401).json({ error: 'Could not sign in' });
  }
};

export const signout = (_req: Request, res: Response) => {
  res.clearCookie('t');
  return res.status(200).json({
    message: 'signed out',
  });
};

// verify that the incoming request has a valid JWT in the Authorization header.
// If the token is valid, it appends the verified user's ID in an 'auth' key
// to the request object; otherwise, it throws an authentication error.
export const requireSignin = expjwt({
  algorithms: ['HS256'],
  secret: config.jwtSecret,
  // requestProperty: "auth",
});

// make sure the requesting user is only updating or
// deleting their own user information
export const hasAuthorization: RequestHandler = (req, res, next) => {
  const authorized =
    req.profile && req.auth && req.profile._id === req.auth._id;

  if (!authorized) {
    return res.status(403).json({
      error: 'User is not authorized',
    });
  }

  return next();
};
