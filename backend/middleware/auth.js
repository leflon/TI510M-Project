import jwt from 'jsonwebtoken';
import Logger from '../lib/Logger.js';

const logger = new Logger('Auth');
export default async function authMiddleware(req, res, next) {
	const token = req.cookies.auth;
	if (!token) {
		return res.status(401).json({error: 'Unauthorized'});
	}
	try {
		const {customerId} = jwt.verify(token, process.env.JWT_SECRET);
		const customer = await req.app.db.getCustomerById(customerId);
		if (!customer)
			return res.status(401).json({error: 'Unauthorized'});
		req.customer = customer;
		next();
	} catch (err) {
		logger.error(err);
		return res.status(401).json({error: 'Unauthorized'});
	}
}