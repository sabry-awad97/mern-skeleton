import { RequestHandler, RequestParamHandler } from 'express';

import { User } from '../models/user.model';

import { getErrorMessage } from '../helpers/dbErrorHandler';

export const httpCreateUser: RequestHandler = async (req, res, _next) => {
  try {
    await User.create(req.body);
    return res.status(200).json({
      message: 'Successfully signed up!',
    });
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

export const httpListUsers: RequestHandler = async (_req, res) => {
  try {
    let users = await User.find().select('name email updated created');
    return res.json(users);
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

export const httpGetUserByID: RequestParamHandler = async (
  req,
  res,
  next,
  id
) => {
  try {
    // If a matching user is found in the database,
    // the user object is appended to the request object in the profile key.
    let user = await User.findById(id);
    if (!user)
      return res.status(400).json({
        error: 'User not found',
      });
    req.profile = user;
    return next();
  } catch (err) {
    return res.status(400).json({
      error: 'Could not retrieve user',
    });
  }
};

// The read function retrieves the user details from req.profile and removes
// sensitive information, such as the hashed_password and salt values, before
// sending the user object in the response to the requesting client.
export const httpReadUser: RequestHandler = (req, res) => {
  const { profile } = req;
  if (!profile) return;
  profile.hashed_password = undefined;
  profile.salt = undefined;
  return res.json(req.profile);
};

export const httpUpdateUser: RequestHandler = async (req, res, _next) => {
  try {
    const user = { ...req.profile, ...req.body };

    if (!user) return;

    user.updated = Date.now();
    await user.save();
    user.hashed_password = undefined;
    user.salt = undefined;
    return res.json(user);
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};

export const httpRemoveUser: RequestHandler = async (req, res, _next) => {
  try {
    let user = req.profile;
    if (!user) return;
    const deletedUser = await user.remove();
    deletedUser.hashed_password = undefined;
    deletedUser.salt = undefined;
    return res.json(deletedUser);
  } catch (err) {
    return res.status(400).json({
      error: getErrorMessage(err),
    });
  }
};
