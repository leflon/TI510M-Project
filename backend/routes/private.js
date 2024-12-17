import express from 'express';
import authMiddleware from '../middleware/auth.js';
const router = express.Router();

router.use(authMiddleware(true));

router.get('/test', (req, res) => {
	res.json({message: 'This is a test route', customer: req.customer});
});

router.get('/me', (req, res) => {
	res.json({customer: req.customer});
});

router.get('/my-bookings', async (req, res) => {
	const bookingIds = await req.app.db.query('SELECT b.id FROM Booking b JOIN Trip t ON t.id = b.trip_id WHERE customer_id = ? ORDER BY t.departure_date', [req.customer.id]);
	const bookings = [];
	for (const {id} of bookingIds) {
		bookings.push(await req.app.db.getBooking({id}));
	}
	res.json(bookings);
});

export default router;