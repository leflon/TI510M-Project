import express from 'express';
import Database from '../lib/Database.js';
const router = express.Router();

router.get('/stations/all', async (req, res) => {
	const stations = await req.app.db.query('SELECT * FROM Station');
	res.json(stations);
});

router.get('/stations/search', async (req, res) => {
	const {name} = req.query;
	if (!name)
		return res.status(400).json({error: 'Missing name query parameter.'});
	const stations = await req.app.db.query('SELECT * FROM Station WHERE name LIKE ?', [`%${name}%`]);
	res.json(stations);
});

router.get('/trips/:origin/:destination', async (req, res) => {
	const {origin, destination} = req.params;
	const date = req.query.date;
	let query = `SELECT t.*, o.name as departure_station_name, o.city as departure_station_city, 
				 a.name as arrival_station_name, a.city as arrival_station_city,
				 MIN(s.base_price) AS start_price 
				 FROM trip t 
				 JOIN Seat s ON t.id = s.trip_id 
				 JOIN Station o ON t.departure_station_id = o.id
				 JOIN Station a ON t.arrival_station_id = a.id
				 WHERE t.departure_station_id = ? AND t.arrival_station_id = ? GROUP BY t.id`;
	let params = [origin, destination];

	if (date) {
		query += ' AND DATE(departure_time) = DATE(?)';
		params.push(date);
	}
	const trips = await req.app.db.query(query, params);
	for (const trip of trips) {
		const availableSeats = await req.app.db.query('SELECT class, COUNT(*) as seat_count FROM Seat WHERE trip_id = ? AND bought = 0 GROUP BY class', [trip.id]);
		const seatCounts = {};
		for (const seat of availableSeats) {
			seatCounts[seat.class] = seat.seat_count;
		}
		trip.seats = seatCounts;
	}
	res.json(trips);
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
		if (!passenger.first_name || !passenger.last_age || !passenger.age || !passenger.preferred_class)
			return res.status(400).json({error: 'Passenger must have name, age and preferred class.'});
	}
	// Fetch the seats
	const seats = [];
	for (const passenger of passengers) {
		const [seat] = await req.app.db.query('SELECT * FROM Seat WHERE trip_id = ? AND is_booked = 0 AND class = ? LIMIT 1', [tripId, passenger.preffered_class]);
		if (!seat)
			return res.status(400).json({error: `No available seat for passenger ${passenger.name} in class ${passenger.preffered_class}.`});
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
	await req.app.db.query('INSERT INTO Booking (id,code,booking_email) VALUES (?,?,?)', [bookingId, bookingCode, email]); // To improve later.
	// Issue the tickets
	const tickets = [];
	for (let i = 0;i < seats.length;i++) {
		const ticketId = Database.id();
		// TODO: Compute price based on passenger age
		await req.app.db.query('INSERT INTO Ticket VALUES (?, ?, ?, ?)', [ticketId, passengerIDs[i], seats[i].id, seats[i].price, bookingId]);
		tickets.push(ticketId);
	}
	const fullPrice = seats.reduce((acc, seat) => acc + seat.price, 0);
	res.json({
		id: bookingId,
		code: bookingCode,
		email,
		tickets: seats.map((seat, index) => ({
			id: tickets[index],
			seat,
			price: seat.price
		})),
	});
});

export default router;