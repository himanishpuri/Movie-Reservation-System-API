import { Router } from "express";
const router = Router();
import {
	getReservations,
	createReservation,
	deleteReservation,
} from "../Controllers/user.controller.js";
import {
	authenticateReservationDetails,
	isUser,
	reservationMiddleware,
} from "../Middlewares/user.middleware.js";

// get his/her reservation
// post a reservation
// delete a reservation

router.use(isUser);

router
	.route("/reservation")
	.get(getReservations)
	.post(authenticateReservationDetails, createReservation);
router.delete(
	"/reservation/:reservationID",
	reservationMiddleware,
	deleteReservation,
);

export default router;
