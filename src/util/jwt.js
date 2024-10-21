import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const tokenSecret = process.env.TOKEN_SECRET;
const tokenExpiry = process.env.TOKEN_EXPIRY;

export const generateToken = (user) => {
	return jwt.sign(user, tokenSecret, { expiresIn: tokenExpiry });
};

export const verifyToken = (token) => {
	return jwt.verify(token, tokenSecret);
};
