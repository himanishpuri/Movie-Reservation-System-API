import prisma from "../util/prismaClient.js";

export const getMovies = async (req, res, next) => {
	const { limit, page } = req.params;
	const skip = (page - 1) * limit;

	try {
		const movies = await prisma.movie.findMany({
			skip: limit && page ? parseInt(skip) : undefined,
			take: limit ? parseInt(limit) : undefined,
		});
		res.status(200).json(movies);
	} catch (error) {
		next(error);
	}
};

export const getShowTimes = async (req, res, next) => {
	const { movieID } = req.params;

	try {
		const movie = await prisma.movie.findUnique({
			where: {
				ID: movieID,
			},
			include: {
				showTimes: true,
			},
		});

		if (!movie) {
			return res.status(404).json({ message: "Movie not found" });
		}

		res.status(200).json(movie.showTimes);
	} catch (error) {
		next(error);
	}
};

export const getSeats = async (req, res, next) => {
	const { movieID, showtimeID } = req.params;

	try {
		const showTime = await prisma.showTime.findUnique({
			where: {
				ID: showtimeID,
			},
		});

		if (!showTime) {
			return next(new Error("Showtime not found"));
		}

		if (showTime.movieID !== movieID) {
			return next(new Error("Showtime not found for this movie"));
		}

		res.status(200).json({ seatsAvailable: showTime.seatsAvailable });
	} catch (error) {
		next(error);
	}
};
