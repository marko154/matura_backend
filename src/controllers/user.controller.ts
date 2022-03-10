import { RequestHandler } from "express";
import * as userService from "../services/user.service";

const login: RequestHandler = async (req, res, next) => {
  try {
    const data = await userService.login(req.body);
    res.status(200).json(data);
  } catch (err: any) {
    if (err?.status) {
      res.status(err.status).json(err);
      return;
    }
    next(err);
  }
};

const googleLogin: RequestHandler = async (req, res, next) => {
  try {
    const data = await userService.googleLogin(req.body.id_token);
    res.status(200).json(data);
  } catch (err) {
    next(err);
  }
};

const register: RequestHandler = async (req, res, next) => {
  try {
    const data = await userService.register(req.body);
    res.status(200).json(data);
  } catch (err: any) {
    if (err?.status) {
      res.status(err.status).json(err);
      return;
    }
    next(err);
  }
};

const get: RequestHandler = async (req, res, next) => {
  try {
    const userData = await userService.get(req.user.email);
    res.status(200).json(userData);
  } catch (e) {
    next(e);
  }
};

const verify: RequestHandler = async (req, res, next) => {
  try {
    userService.verifyToken(req.params.token);
    res.redirect(process.env.SOLID_APP_URL);
  } catch (err) {
    return next(err);
  }
};

const requestPasswordReset: RequestHandler = async (req, res, next) => {
  try {
    await userService.requestPasswordReset(req.body.email);
  } catch (err) {
    next(err);
  }
};

const resetPassword: RequestHandler = async (req, res, next) => {
  try {
    await userService.resetPassword(req.body.token, req.body.newPassword);
  } catch (err) {
    next(err);
  }
};

const checkEmailAvailable: RequestHandler = async (req, res, next) => {
  try {
    const available = await userService.checkEmailAvalilable(req.params.email);
    res.status(200).json({ available });
  } catch (err) {
    next(err);
  }
};

const setAvatarPhoto: RequestHandler = async (req, res, next) => {
  try {
    await userService.setAvatarPhoto(req.user.user_id, req.body.avatar_url);
    res.status(200).json({ message: "success" });
  } catch (err) {
    next(err);
  }
};

const getRecentUsers: RequestHandler = async (req, res, next) => {
  try {
    const users = await userService.getRecentUsers();
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export {
  login,
  googleLogin,
  register,
  get,
  verify,
  requestPasswordReset,
  resetPassword,
  checkEmailAvailable,
  setAvatarPhoto,
  getRecentUsers,
};
