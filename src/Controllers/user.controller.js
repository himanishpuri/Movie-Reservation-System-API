import prisma from "../util/prismaClient.js";

export const getReservations = async (req, res, next) => {
	try {
		const reservations = await prisma.reservation.findUnique({
			where: {
				userID: req.user.ID,
			},
			include: {
				showtime: true,
			},
		});
		res.status(200).json(reservations);
	} catch (error) {
		next(new Error(error));
	}
};

export const createReservation = async (req, res, next) => {
	try {
		const { showtimeID, seats } = req.reservationDetails;

		const showtime = await prisma.showTime.findUnique({
			where: {
				ID: showtimeID,
			},
			include: {
				movie: true,
			},
		});

		if (!showtime) {
			return next(new Error("Invalid Showtime"));
		}

		if (showtime.seatsAvailable < seats) {
			return next(new Error("Not enough available seats"));
		}

		const userReservation = await prisma.reservation.findFirst({
			where: {
				showtimeID,
				userID: req.user.ID,
			},
		});

		if (userReservation) {
			return next(new Error("Reservation already exists"));
		}

		const reservation = await prisma.$transaction(async (prisma) => {
			const newReservation = await prisma.reservation.create({
				data: {
					userID: req.user.ID,
					showtimeID,
					seats,
				},
				include: {
					showtime: true,
				},
			});

			await prisma.showTime.update({
				where: {
					ID: showtimeID,
				},
				data: {
					seatsAvailable: showtime.seatsAvailable - seats,
				},
			});

			return newReservation;
		});

		res.status(201).json({
			message: "Reservation created successfully",
			reservation,
		});
	} catch (error) {
		next(new Error(error));
	}
};

export const deleteReservation = async (req, res, next) => {
	try {
		const reservation = await prisma.reservation.findUnique({
			where: {
				ID: req.reservation.ID,
			},
			include: {
				showtime: true,
			},
		});

		if (!reservation) {
			return next(new Error("Reservation not found"));
		}

		await prisma.$transaction(async (prisma) => {
			await prisma.reservation.delete({
				where: {
					ID: req.reservation.ID,
				},
			});

			await prisma.showTime.update({
				where: {
					ID: reservation.showtimeID,
				},
				data: {
					seatsAvailable:
						reservation.showtime.seatsAvailable + reservation.seats,
				},
			});
		});

		res.status(200).json({
			message: "Reservation deleted and seats updated successfully",
		});
	} catch (error) {
		next(new Error(error));
	}
};
