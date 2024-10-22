import { Router } from "express";
const router = Router();
import {
	addMovie,
	addShowtime,
	deleteMovie,
	deleteShowtime,
	getAllReservations,
	promoteUser,
	updateMovie,
	updateShowtime,
} from "../Controllers/admin.controller.js";
import {
	authenticateMovieDetails,
	isAdmin,
} from "../Middlewares/admin.middleware.js";
import { uploadImageMiddleware } from "../util/imgUpload.js";

// get list of all reservations
// add a movie
// update a movie
// delete a movie
// add a showtime
// update a showtime
// delete a showtime
// promote a user to admin

router.use(isAdmin);

router.get("/reservations", getAllReservations);
router.post(
	"/movies",
	uploadImageMiddleware,
	authenticateMovieDetails,
	addMovie,
);
router
	.route("/movies/:movieID")
	.put(uploadImageMiddleware, updateMovie)
	.delete(deleteMovie);
router.post("/movies/:movieID/showtime", addShowtime);
router
	.route("/movies/:movieID/showtime/:showtimeID")
	.put(updateShowtime)
	.delete(deleteShowtime);
router.patch("/promote/:userID", promoteUser);

export default router;
