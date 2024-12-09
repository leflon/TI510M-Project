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

	static async id() {
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
		const id = await Database.id();
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
		const [customer] = await this.query('SELECT id, name, email FROM Customer WHERE id = ?', [id]);
		return customer;
	}
}