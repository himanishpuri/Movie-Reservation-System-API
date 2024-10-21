import joi from "joi";
import * as jwtUtil from "../util/jwt.js";

export const authenticateRegistrationDetails = (req, res, next) => {
	const { name, email, password } = req.body;
	if (!name || !email || !password) {
		return next(new Error("Please provide name, email and password"));
	}
	const schema = joi.object({
		name: joi.string().required(),
		email: joi.string().email().required(),
		password: joi.string().required(),
	});
	const { error } = schema.validate({ name, email, password });
	if (error) {
		return next(new Error(error.message));
	}
	req.user = { name, email, password };
	next();
};

export const authenticateLoginDetails = (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return next(new Error("Please provide email and password"));
	}
	const schema = joi.object({
		email: joi.string().email().required(),
		password: joi.string().required(),
	});
	const { error } = schema.validate({ email, password });
	if (error) {
		return next(new Error(error.message));
	}
	req.user = { email, password };
	next();
};
export const authenticateLogoutDetails = (req, res, next) => {
	const token = req.cookies?.token;
	if (!token) {
		return next(new Error("Token Absent"));
	}
	try {
		const user = jwtUtil.verifyToken(token);
		req.user = user;
		next();
	} catch (error) {
		next(new Error(error.message));
	}
};
