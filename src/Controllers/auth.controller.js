import prisma from "../util/prismaClient.js";
import * as bcryptUtil from "../util/bcrypt.js";
import * as jwtUtil from "../util/jwt.js";

export const login = async (req, res, next) => {
	try {
		const { email, password } = req.user;
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});
		if (!user) {
			return next(new Error("User Not Found"));
		}
		const isPasswordValid = await bcryptUtil.verifyPassword(
			password,
			user.password,
		);
		if (!isPasswordValid) {
			return next(new Error("Invalid password"));
		}
		const token = jwtUtil.generateToken(user);
		res.status(200).cookie("token", token).json({
			message: "Login Successful",
		});
	} catch (error) {
		next(error);
	}
};

export const register = async (req, res, next) => {
	try {
		const { name, email, password } = req.user;
		const user = await prisma.user.findUnique({
			where: {
				email,
			},
		});
		if (user) {
			return next(new Error("User already exists"));
		}
		const hashedPassword = await bcryptUtil.hashPassword(password);
		const newUser = await prisma.user.create({
			data: {
				name,
				email,
				password: hashedPassword,
			},
		});
		const token = jwtUtil.generateToken(newUser);
		res.status(201).cookie("token", token).json({
			message: "User created successfully",
			user: newUser,
		});
	} catch (error) {
		next(error);
	}
};

export const logout = async (req, res, next) => {
	try {
		const user = req.user;
		res.status(200).clearCookie("token").json({
			message: "Logout Successful",
			user,
		});
	} catch (error) {
		next(error);
	}
};
