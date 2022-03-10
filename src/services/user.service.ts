import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../prisma/database";
import { sendVerificationEmail, sendPasswordResetEmail } from "../utils/email.utils";
import { createToken, verifyGoogleIdToken } from "../utils/authentication";

const get = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      user_id: true,
      avatar_url: true,
      display_name: true,
      email_validated: true,
      email: true,
      locale: true,
      user_type_id: true,
      user_type: { select: { user_type: true } },
    },
  });
};

const SALT_ROUNDS = 10;

interface SignupData {
  email: string;
  password: string;
}

const login = async (data: any) => {
  const { email, password } = data;
  const user = await prisma.user.findUnique({
    where: { email },
    select: { password_hash: true, user_id: true, email: true },
  });

  if (!user || !user.password_hash) {
    throw { status: 404, message: "E-mail address does not exist." };
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw { status: 403, message: "Invalid credentials." };
  }

  const token = createToken(user);
  return { token };
};

const googleLogin = async (idToken: string) => {
  // handle error here
  const payload = await verifyGoogleIdToken(idToken);

  const user = await prisma.user.findUnique({
    where: { email: payload?.email },
    select: {
      password_hash: true,
      user_id: true,
      email: true,
      external_id: true,
    },
  });

  // case when the admin hasn't created an account with that email
  if (!user) {
    throw { status: 401, message: "Invalid e-mail address" };
  }

  // case when user is registering for the first time
  if (user.external_id !== payload?.sub) {
    await prisma.user.update({
      where: { email: user.email },
      data: {
        external_id: payload?.sub,
        external_type: "GOOGLE",
        display_name: payload?.name,
        avatar_url: payload?.picture,
        locale: payload?.locale,
        email_validated: payload?.email_verified,
      },
    });
  }

  const token = createToken(user);
  return { token };
};

// a user can register if the administrator has created en email input in the users table
const register = async (data: any) => {
  const { email, password } = data;
  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  const { count } = await prisma.user.updateMany({
    data: { password_hash: hash },
    where: {
      email,
      external_id: null,
      password_hash: null,
    },
  });

  // handle case where:
  // - the user with the given email already has a password or an external id
  // - there is no such user in the database

  const user = await get(data.email);

  if (user && count > 0) {
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    sendVerificationEmail(user, token);
  }
  // fix sending too much info with user
  return {
    user,
    message:
      count > 0
        ? "Success"
        : user === null
        ? "Invalid email address. Ask your admin."
        : "A user with that email is already registered.",
  };
};

const verifyToken = async (token: string) => {
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as jwt.JwtPayload;

  await prisma.user.update({
    data: {
      email_validated: true,
    },
    where: { user_id: decoded.user_id },
  });
};

const requestPasswordReset = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: { password_hash: true },
  });

  if (!user || !user.password_hash) {
    throw Error("No users with that email exist.");
  }
  // use a part of a hashed password hash to make sure that the reset token can only be used once
  const key = crypto
    .createHmac("sha256", process.env.ACCESS_TOKEN_SECRET)
    .update(user.password_hash)
    .digest("hex")
    .slice(0, 20);

  const token = jwt.sign({ email, key }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "30min",
  });

  await sendPasswordResetEmail(email, token);
};

const resetPassword = async (token: string, newPassword: string) => {
  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) as jwt.JwtPayload;

  const user = await prisma.user.findUnique({
    where: { email: decoded.email },
    select: { password_hash: true },
  });

  if (!user || !user.password_hash) {
    throw Error("No users with that email exist.");
  }

  const hash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  const key = crypto
    .createHmac("sha256", process.env.ACCESS_TOKEN_SECRET)
    .update(user.password_hash)
    .digest("hex")
    .slice(0, 20);
  if (!crypto.timingSafeEqual(Buffer.from(key), Buffer.from(decoded.key))) {
    throw Error("Invalid token.");
  }

  await prisma.user.update({
    data: { password_hash: hash },
    where: { email: decoded.email },
  });
};

const checkEmailAvalilable = async (email: string) => {
  const count = await prisma.user.count({ where: { email } });
  return count === 0;
};

const setAvatarPhoto = async (user_id: number, imageURL: string) => {
  await prisma.user.update({
    data: { avatar_url: imageURL },
    where: { user_id },
  });
};

const getRecentUsers = async () => {
  return await prisma.user.findMany({
    orderBy: { registration_date: "desc" },
    include: { user_type: true },
    take: 5,
  });
};

export {
  login,
  googleLogin,
  register,
  get,
  verifyToken,
  requestPasswordReset,
  resetPassword,
  setAvatarPhoto,
  checkEmailAvalilable,
  getRecentUsers,
};
