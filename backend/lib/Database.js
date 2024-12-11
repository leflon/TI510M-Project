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
		console.log('this [asses');
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
		console.log(sql);
		await this.query(sql);
		return tripId;
	}
}


