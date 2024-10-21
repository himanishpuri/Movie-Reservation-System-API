import prisma from "../util/prismaClient.js";
import * as jwtUtil from "../util/jwt.js";

export const isUser = async (req, res, next) => {
	const token = req.cookies?.token;
	if (!token) {
		return next(new Error("Token not found"));
	}
	let decodedToken;
	try {
		decodedToken = jwtUtil.verifyToken(token);
	} catch (error) {
		return next(new Error(error.message));
	}
	try {
		const user = await prisma.user.findUnique({
			where: {
				ID: decodedToken.ID,
			},
		});
		if (!user) {
			return next(new Error("User not found"));
		}
		req.user = user;
		next();
	} catch (error) {
		return next(new Error(error));
	}
};

export const reservationMiddleware = async (req, res, next) => {
	try {
		const { reservationID } = req.params;
		if (!reservationID) {
			return next(new Error("Please provide reservationID"));
		}
		const reservation = await prisma.reservation.findUnique({
			where: {
				ID: reservationID,
			},
		});
		if (!reservation) {
			return next(new Error("Reservation not found"));
		}
		if (reservation.userID !== req.user.ID) {
			return next(new Error("Reservation does not belong to the user"));
		}
		req.reservation = reservation;
		next();
	} catch (error) {
		return next(new Error(error));
	}
};
export const authenticateReservationDetails = async (req, res, next) => {
	try {
		const { showtimeID, seats } = req.body;
		if (!showtimeID || !seats) {
			return next(
				new Error("Please provide showtimeID and number of seats"),
			);
		}
		const showtime = await prisma.showTime.findUnique({
			where: {
				ID: showtimeID,
			},
		});
		if (!showtime) {
			return next(new Error("Showtime not found"));
		}
		req.reservationDetails = { showtimeID, seats };
		next();
	} catch (error) {
		return next(new Error(error));
	}
};
