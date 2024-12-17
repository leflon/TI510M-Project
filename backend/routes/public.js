import express from 'express';
import Database from '../lib/Database.js';
import authMiddleware from '../middleware/auth.js';
const router = express.Router();

router.use(authMiddleware(false));
router.get('/stations/all', async (req, res) => {
	const stations = await req.app.db.query('SELECT * FROM Station');
	res.json(stations);
});

router.get('/stations/search', async (req, res) => {
	const {name} = req.query;
	if (!name)
		return res.status(400).json({error: 'Missing name query parameter.'});
	const stations = await req.app.db.query(`
		SELECT * FROM Station 
		WHERE name LIKE ? 
		ORDER BY 
			CASE 
				WHEN name LIKE ? THEN 1 
				ELSE 2 
			END, 
			name
	`, [`%${name}%`, `${name}%`]);
	res.json(stations);
});


router.get('/trips/search', async (req, res) => {
	const {origin, destination, date} = req.query;
	let query = 'SELECT id from Trip WHERE departure_station_id = ? AND arrival_station_id = ?';
	let params = [origin, destination];
	if (date) {
		query += ' AND DATE(departure_time) = ?';
		params.push(date);
	}
	query += ' ORDER BY departure_time';
	const tripIDs = await req.app.db.query(query, params);
	const trips = [];
	for (const {id} of tripIDs) {
		trips.push(await req.app.db.getTrip(id));
	}
	res.json(trips);
});

router.get('/trips/:id', async (req, res) => {
	const {id} = req.params;
	try {
		const trip = await req.app.db.getTrip(id);
		res.json(trip);
	} catch (error) {
		res.status(404).json({error: error.message});
	}
});

router.get('/bookings/:id', async (req, res) => {
	const {id} = req.params;
	try {
		const booking = await req.app.db.getBooking({id});
		res.json(booking);
	} catch (error) {
		res.status(404).json({error: error.message});
	}
});

router.get('/bookings/code/:code', async (req, res) => {
	const {code} = req.params;
	const {email} = req.query;
	if (!email)
		return res.status(400).json({error: 'Missing email query parameter.'});
	try {
		const booking = await req.app.db.getBooking({code});
		if (!booking)
			return res.status(404).json({error: 'Booking not found.'});
		if (booking.email !== email)
			return res.status(403).json({error: 'Email does not match booking.'});
		res.json(booking);
	} catch (error) {
		res.status(404).json({error: error.message});
	}
});
router.post('/book/:tripId', async (req, res) => {
	const {tripId} = req.params;
	const {passengers, email} = req.body;
	// Controller
	if (!passengers || !email)
		return res.status(400).json({error: 'Missing body parameters.'});
	if (!Array.isArray(passengers))
		return res.status(400).json({error: 'Passengers must be an array.'});
	if (passengers.length === 0)
		return res.status(400).json({error: 'Passengers array must not be empty.'});
	for (const passenger of passengers) {
		if (!passenger.first_name || !passenger.last_name || !passenger.age || !passenger.preferred_class)
			return res.status(400).json({error: 'Passenger must have name, age and preferred class.'});
	}
	// Fetch the seats
	const seats = [];
	for (const passenger of passengers) {
		const [seat] = await req.app.db.query('SELECT * FROM Seat WHERE trip_id = ? AND bought = 0 AND class = ? LIMIT 1', [tripId, passenger.preferred_class]);
		if (!seat)
			return res.status(400).json({error: `No available seat for passenger ${passenger.name} in class ${passenger.preffered_class}.`});
		seat.bought = true;
		seats.push(seat);
		req.app.db.query('UPDATE Seat SET bought = 1 WHERE id = ?', [seat.id]);
	}
	// Register the passengers;
	const passengerIDs = [];
	for (const passenger of passengers) {
		const id = Database.id();
		await req.app.db.query('INSERT INTO Passenger VALUES (?, ?, ?, ?, ?)', [id, passenger.first_name, passenger.last_name, passenger.age, null]); /* Customer feature to be added later */
		passengerIDs.push(id);
	}
	// Save the booking
	const bookingId = Database.id();
	const bookingCode = Math.random().toString(36).substring(2, 8).toUpperCase();
	if (req.customer)
		await req.app.db.query('INSERT INTO Booking (id,code,booking_email,customer_id) VALUES (?,?,?,?)', [bookingId, bookingCode, email, req.customer.id]);
	else
		await req.app.db.query('INSERT INTO Booking (id,code,booking_email) VALUES (?,?,?)', [bookingId, bookingCode, email]);
	// Issue the tickets
	const tickets = [];
	for (let i = 0;i < seats.length;i++) {
		const ticketId = Database.id();
		// TODO: Compute price based on passenger age (if we have time)
		await req.app.db.query('INSERT INTO Ticket VALUES (?, ?, ?, ?, ?)', [ticketId, passengerIDs[i], seats[i].id, seats[i].base_price, bookingId]);
		tickets.push(ticketId);
	}
	// Fetch trip info
	const [trip] = await req.app.db.query('SELECT * FROM Trip WHERE id = ?', [tripId]);
	const fullPrice = seats.reduce((acc, seat) => acc + seat.base_price, 0);
	res.json({
		id: bookingId,
		code: bookingCode,
		email,
		trip,
		tickets: seats.map((seat, index) => ({
			id: tickets[index],
			seat,
			price: seat.price
		})),
		fullPrice
	});
});

export default router;