import { Router } from "express";
const router = Router();
import {
	getMovies,
	getSeats,
	getShowTimes,
} from "../Controllers/common.controller.js";

// get list of movies
// get the show times for a specific movie
// get the number of seats available for a specific showtime of a specific movie

router.get("/movies/page/:page/limit/:limit", getMovies);
router.get("/movies/:movieID/showtime", getShowTimes);
router.get("/movies/:movieID/showtime/:showtimeID/seats", getSeats);

export default router;
