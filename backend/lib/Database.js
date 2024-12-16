import mysql from 'mysql2/promise';
import {hash, compare} from 'bcrypt';
const ID_ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const SALT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS);
export default class Database {
	constructor(config) {
		this.pool = mysql.createPool(config);
	}

	async query(sql, params) {
		const [results,] = await this.pool.execute(sql, params);
		return results;
	}

	async close() {
		await this.pool.end();
	}

	static id() {
		let id = '';
		for (let i = 0;i < 16;i++) {
			id += ID_ALPHABET.charAt(Math.floor(Math.random() * ID_ALPHABET.length));
		}
		return id;
	}

	async addCustomer({
		name,
		password,
		email
	}) {
		const existingCustomer = await this.query('SELECT id FROM Customer WHERE email = ?', [email]);
		if (existingCustomer.length > 0) {
			throw new Error('Email is already used.');
		}
		const id = Database.id();
		const hashedPassword = await hash(password, SALT_ROUNDS);
		const sql = 'INSERT INTO Customer(id, name, email, password_hash) VALUES (?, ?, ?, ?)';

		await this.query(sql, [id, name, email, hashedPassword]);
		return id;
	}

	async attemptLogin(email, password) {
		const [customer] = await this.query('SELECT id, password_hash FROM Customer WHERE email = ?', [email]);
		if (!customer) {
			throw new Error('Invalid email or password.');
		}
		if (!await compare(password, customer.password_hash)) {
			throw new Error('Invalid email or password.');
		}
		return customer.id;
	}

	async getCustomerById(id) {
		const [customer] = await this.query('SELECT id, name, email, is_admin FROM Customer WHERE id = ?', [id]);
		return customer;
	}

	async addTrip({
		origin,
		destination,
		departure,
		arrival,
	}) {
		const tripId = Database.id();
		let sql = 'INSERT INTO Trip VALUES (?, ?, ?, ?, ?)';
		await this.query(sql, [tripId, departure, origin, arrival, destination]);
		// Add corresponding seats
		const seats = [];
		/* Arbitrary values */
		const classes = { // Number of seats per class
			'First': 255,
			'Second': 425
		};
		const seatsPerCar = 85;
		const fares = {
			'First': 125,
			'Second': 80
		};
		let seatNumber = 0;
		while (classes['First']-- > 0 || classes['Second']-- > 0) {
			const id = Database.id();
			const formattedSeatNumber = 1 + Math.floor((seatNumber % seatsPerCar) / 5) + ['A', 'B', 'C', 'D', 'E'][(seatNumber) % 5];
			const car = Math.ceil(++seatNumber / seatsPerCar);
			const currentClass = classes['First'] >= 0 ? 'First' : 'Second';
			seats.push([id, car, formattedSeatNumber, currentClass, fares[currentClass]]);
		} // For easier debugging, we create the Seats and write their SQL query separately
		sql = 'INSERT INTO Seat VALUES ';
		for (const seat of seats) {
			sql += `('${seat[0]}',${seat[1]},'${seat[2]}','${seat[3]}',${seat[4]},FALSE,'${tripId}'),`; // Since all the inserted data is generated here, there is no risk of sql dump. We can proceed with escaping safely.
		}
		sql = sql.slice(0, -1); // Remove the trailing comma
		await this.query(sql);
		return tripId;
	}

	async getTrip(id) {
		let query = `SELECT t.*, o.name as departure_station_name, o.city as departure_station_city, 
				 a.name as arrival_station_name, a.city as arrival_station_city,
				 MIN(s.base_price) AS lowest_price 
				 FROM trip t 
				 JOIN Seat s ON t.id = s.trip_id 
				 JOIN Station o ON t.departure_station_id = o.id
				 JOIN Station a ON t.arrival_station_id = a.id
				 WHERE t.id = ? GROUP BY t.id`;
		const [trip] = await this.query(query, [id]);
		const availableSeats = await this.query('SELECT class, COUNT(*) as seat_count FROM Seat WHERE trip_id = ? AND bought = 0 GROUP BY class', [id]);
		const class_prices_raw = await this.query('SELECT class, MIN(base_price) FROM Seat WHERE trip_id = ? GROUP BY class', [id]);
		const seatCounts = {};
		const class_prices = {};
		for (const seat of availableSeats) {
			seatCounts[seat.class] = seat.seat_count;
		}
		for (const price of class_prices_raw) {
			class_prices[price.class] = price['MIN(base_price)'];
		}
		return {
			id: trip.id,
			departure_station: {
				id: trip.departure_station_id,
				name: trip.departure_station_name,
				city: trip.departure_station_city
			},
			arrival_station: {
				id: trip.arrival_station_id,
				name: trip.arrival_station_name,
				city: trip.arrival_station_city
			},
			departure_time: trip.departure_time,
			arrival_time: trip.arrival_time,
			available_seats: seatCounts,
			class_prices,
			lowest_price: trip.lowest_price
		};
	}

	async getBooking({id, code}) {
		let booking;
		if (id)
			[booking] = await this.query('SELECT * FROM Booking WHERE id = ?', [id]);
		else if (code)
			[booking] = await this.query('SELECT * FROM Booking WHERE code = ?', [code]);
		else
			throw new Error('No identifier provided.');
		if (!booking)
			throw new Error('Booking not found.');

		const tickets = await this.query('SELECT * FROM Ticket WHERE booking_id = ?', [booking.id]);
		const passengers = [];
		const seats = [];
		for (const ticket of tickets) {
			const [passenger] = await this.query('SELECT * FROM Passenger WHERE id = ?', [ticket.passenger]);
			passengers.push(passenger);
			const [seat] = await this.query('SELECT * FROM Seat WHERE id = ?', [ticket.seat_id]);
			seats.push(seat);
		}
		const trip = await this.getTrip(seats[0].trip_id); // So far, all tickets in a same booking belong to the same trip
		return {
			id: booking.id,
			code: booking.code,
			email: booking.booking_email,
			payed: booking.payed,
			refund_status: booking.refund_status,
			trip,
			tickets: tickets.map((ticket, i) => ({
				id: ticket.id,
				passenger: passengers[i],
				seat: seats[i]
			}))
		};
	}
}


