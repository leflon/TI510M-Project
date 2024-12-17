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
	const bookingIds = await req.app.db.query('SELECT id FROM Booking WHERE customer_id = ?', [req.customer.id]);
	const bookings = [];
	for (const {id} of bookingIds) {
		bookings.push(await req.app.db.getBooking({id}));
	}
	bookings.sort((a, b) => a.trip.departure_time - b.trip.departure_time);
	res.json(bookings);
});

router.post('/save-booking/:bookingId', async (req, res) => {
	const booking = await req.app.db.getBooking({id: req.params.bookingId});
	if (!booking || booking.customer_id) {
		res.status(400).json({error: 'Invalid booking ID'});
		return;
	}
	await req.app.db.query('UPDATE Booking SET customer_id = ? WHERE id = ?', [req.customer.id, booking.id]);
	res.json({message: 'Booking saved status updated', success: true});
});

export default router;