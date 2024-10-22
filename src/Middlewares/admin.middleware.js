import prisma from "../util/prismaClient.js";
import * as jwtUtil from "../util/jwt.js";
import joi from "joi";

export const isAdmin = async (req, res, next) => {
	try {
		const token = req.cookies?.token;
		if (!token) {
			return next(new Error("Token Absent"));
		}

		const decodedToken = jwtUtil.verifyToken(token);
		const user = await prisma.user.findUnique({
			where: {
				ID: decodedToken.ID,
			},
		});

		if (!user) {
			return next(new Error("User Not Found"));
		}
		if (user.role !== "ADMIN") {
			return next(new Error("Unauthorized"));
		}
		req.user = user;
		next();
	} catch (error) {
		return next(error);
	}
};

export const authenticateMovieDetails = async (req, res, next) => {
	// Trim and sanitize input fields
	const sanitizeInput = (input) => input?.trim();

	req.body = {
		name: sanitizeInput(req.body?.name),
		description: sanitizeInput(req.body?.description),
		director: sanitizeInput(req.body?.director),
		posterImageURL: sanitizeInput(req.body?.posterImageURL),
		genres: req.body?.genres?.map(sanitizeInput),
		duration: parseInt(req.body?.duration, 10),
		posterImageURL: sanitizeInput(req.body?.posterImageURL),
		releaseDate: new Date(req.body?.releaseDate),
	};
	try {
		const schema = joi.object({
			name: joi.string().required(),
			description: joi.string().optional(),
			duration: joi.number().integer().required(),
			genres: joi.array().items(joi.string()).min(1).required(),
			director: joi.string().required(),
			releaseDate: joi.date().required(),
			posterImageURL: joi.string().uri().optional(),
		});

		const { error } = schema.validate(req.body);
		if (error) {
			return next(new Error(error));
		}
		req.movie = req.body;
		next();
	} catch (error) {
		return next(error);
	}
};
