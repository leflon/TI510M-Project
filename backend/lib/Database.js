import mysql from 'mysql2/promise';

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
}