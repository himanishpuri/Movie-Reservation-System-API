import prisma from "../util/prismaClient.js";

export const getAllReservations = async (req, res, next) => {
	try {
		const reservations = await prisma.reservation.findMany({
			include: {
				showtime: {
					include: {
						movie: true,
					},
				},
				user: true,
			},
		});
		res.json(reservations);
	} catch (error) {
		next(error);
	}
};

export const addMovie = async (req, res, next) => {
	try {
		const {
			name,
			description,
			duration,
			genres,
			director,
			releaseDate,
			posterImageURL,
		} = req.body;

		const existingMovie = await prisma.movie.findFirst({
			where: {
				name,
				releaseDate: new Date(releaseDate),
				director,
			},
		});

		if (existingMovie) {
			return next(
				new Error(
					"Movie with the same name, release date, and director already exists.",
				),
			);
		}

		const movie = await prisma.$transaction(async (prisma) => {
			const genreConnections = await Promise.all(
				genres.map(async (genreName) => {
					let genre = await prisma.genre.findUnique({
						where: { name: genreName },
					});
					if (!genre) {
						genre = await prisma.genre.create({
							data: {
								name: genreName,
							},
						});
					}
					return { ID: genre.ID };
				}),
			);

			return prisma.movie.create({
				data: {
					name,
					description: description || null,
					duration,
					genres: {
						connect: genreConnections,
					},
					director,
					releaseDate: new Date(releaseDate),
					posterImageURL: posterImageURL || null,
				},
			});
		});

		res.status(201).json(movie);
	} catch (error) {
		next(error);
	}
};

export const updateMovie = async (req, res, next) => {
	try {
		const { movieID } = req.params;
		const {
			name,
			description,
			duration,
			genres,
			director,
			releaseDate,
			posterImageURL,
		} = req.body;

		const existingMovie = await prisma.movie.findUnique({
			where: {
				ID: movieID,
			},
		});

		if (!existingMovie) {
			return next(new Error("Movie not found"));
		}

		const movie = await prisma.$transaction(async (prisma) => {
			const genreConnections = await Promise.all(
				genres.map(async (genreName) => {
					let genre = await prisma.genre.findUnique({
						where: { name: genreName },
					});
					if (!genre) {
						genre = await prisma.genre.create({
							data: {
								name: genreName,
							},
						});
					}
					return { ID: genre.ID };
				}),
			);

			return prisma.movie.update({
				where: {
					ID: movieID,
				},
				data: {
					name,
					description: description || null,
					duration,
					genres: {
						connect: genreConnections,
					},
					director,
					releaseDate: new Date(releaseDate),
					posterImageURL: posterImageURL || null,
				},
			});
		});

		res.status(200).json(movie);
	} catch (error) {
		if (error.code === "P2025") {
			return next(new Error("Movie not found"));
		}
		next(error);
	}
};

export const deleteMovie = async (req, res, next) => {
	try {
		const { movieID } = req.params;

		const existingMovie = await prisma.movie.findUnique({
			where: {
				ID: movieID,
			},
		});

		if (!existingMovie) {
			return next(new Error("Movie not found"));
		}

		await prisma.movie.delete({
			where: {
				ID: movieID,
			},
		});

		res.status(200).json({
			message: "Movie deleted successfully",
		});
	} catch (error) {
		if (error.code === "P2025") {
			return next(new Error("Movie not found"));
		}
		next(error);
	}
};

export const addShowtime = async (req, res, next) => {
	try {
		const { movieID } = req.params;
		const { startTime, endTime, seatsAvailable } = req.body;

		if (!Number.isInteger(seatsAvailable) || seatsAvailable <= 0) {
			return next(new Error("Seats available must be a positive integer"));
		}

		const existingMovie = await prisma.movie.findUnique({
			where: {
				ID: movieID,
			},
		});

		if (!existingMovie) {
			return next(new Error("Movie not found"));
		}

		if (new Date(endTime) <= new Date(startTime)) {
			return next(new Error("End time should be after start time"));
		}

		const existingShowtime = await prisma.showTime.findFirst({
			where: {
				movieID,
				startTime: new Date(startTime),
				endTime: new Date(endTime),
			},
		});

		if (existingShowtime) {
			return next(new Error("Showtime for this movie already exists"));
		}

		const newShowtime = await prisma.showTime.create({
			data: {
				startTime: new Date(startTime),
				endTime: new Date(endTime),
				seatsAvailable,
				movie: {
					connect: {
						ID: movieID,
					},
				},
			},
		});

		res.status(201).json(newShowtime);
	} catch (error) {
		next(error);
	}
};

export const updateShowtime = async (req, res, next) => {
	try {
		const { movieID, showtimeID } = req.params;
		const { startTime, endTime, seatsAvailable } = req.body;

		if (!Number.isInteger(seatsAvailable) || seatsAvailable <= 0) {
			return next(new Error("Seats available must be a positive integer"));
		}

		const existingShowtime = await prisma.showTime.findFirst({
			where: {
				ID: showtimeID,
				movieID,
			},
		});

		if (!existingShowtime) {
			return next(new Error("Showtime not found for this movie"));
		}

		if (new Date(endTime) <= new Date(startTime)) {
			return next(new Error("End time should be after start time"));
		}

		const updatedShowtime = await prisma.showTime.update({
			where: {
				ID: showtimeID,
			},
			data: {
				startTime: new Date(startTime),
				endTime: new Date(endTime),
				seatsAvailable,
			},
		});

		res.status(200).json(updatedShowtime);
	} catch (error) {
		next(error);
	}
};

export const deleteShowtime = async (req, res, next) => {
	try {
		const { movieID, showtimeID } = req.params;

		const existingShowtime = await prisma.showTime.findFirst({
			where: {
				ID: showtimeID,
				movieID,
			},
		});

		if (!existingShowtime) {
			return next(new Error("Showtime not found for this movie"));
		}

		await prisma.showTime.delete({
			where: {
				ID: showtimeID,
			},
		});

		res.status(200).json({
			message: "Showtime deleted successfully",
		});
	} catch (error) {
		next(error);
	}
};

export const promoteUser = async (req, res, next) => {
	try {
		const { userID } = req.params;

		const existingUser = await prisma.user.findUnique({
			where: {
				ID: userID,
			},
		});

		if (!existingUser) {
			return next(new Error("User not found"));
		}

		if (existingUser.role === "ADMIN") {
			return next(new Error("User is already an admin"));
		}

		const updatedUser = await prisma.user.update({
			where: {
				ID: userID,
			},
			data: {
				role: "ADMIN",
			},
		});

		res.status(200).json(updatedUser);
	} catch (error) {
		next(error);
	}
};
