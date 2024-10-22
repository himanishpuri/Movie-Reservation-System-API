import { Router } from "express";
const router = Router();
import {
	getMovies,
	getSeats,
	getShowTimes,
	getMoviesByGenre,
} from "../Controllers/common.controller.js";

// get list of movies
// get the show times for a specific movie
// get the number of seats available for a specific showtime of a specific movie

router.get("/movies", getMovies); // /movies?limit=10&page=1
router.get("/movies/:movieID/showtime", getShowTimes);
router.get("/movies/:movieID/showtime/:showtimeID/seats", getSeats);
router.get("/movies/sort/genre", getMoviesByGenre); // /movies/sort/genre?genre=genreName

export default router;
