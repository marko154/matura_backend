import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const auth: RequestHandler = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    res.status(401).json({
      status: 401,
      message: "Token was not provided",
    });
    return;
  }
  const token = authorization.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    req.user = decoded;
    // console.log(req.user);
    next();
  } catch (err) {
    res.status(401).json({
      status: 401,
      message: "Invalid access token.",
    });
  }
};

const createToken = (user: { user_id: number; email: string }) => {
  return jwt.sign(
    {
      user_id: user.user_id,
      email: user.email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "3d",
    }
  );
};

const verifyGoogleIdToken = async (idToken: string) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  return ticket.getPayload();
};

const isAdmin: RequestHandler = (req, res, next) => {
  if (req?.user?.user_id === 1) {
    next();
  } else {
    res.status(401).json({ message: "Unauthorised" });
  }
};

export { auth, verifyGoogleIdToken, createToken, isAdmin };
