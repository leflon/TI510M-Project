import Logger from '../lib/Logger.js';

const logger = new Logger('Access');

export default async function log(req, res, next) {
	logger.log(`${req.method} ${req.url} ${req.headers['x-forwarded-for'] || req.connection.remoteAddress}`);
	next();
}