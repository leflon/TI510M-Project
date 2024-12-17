import jwt from 'jsonwebtoken';
import Logger from '../lib/Logger.js';

const logger = new Logger('Auth');
export default function authMiddleware(blocking) {
	return async function authMiddleware(req, res, next) {
		const token = req.cookies.auth;
		if (!token) {
			if (blocking)
				return res.status(401).json({error: 'Unauthorized'});
			else return next();
		}
		try {
			const {customerId} = jwt.verify(token, process.env.JWT_SECRET);
			console.log(customerId);
			const customer = await req.app.db.getCustomerById(customerId);
			if (!customer && blocking)
				return res.status(401).json({error: 'Unauthorized'});
			req.customer = customer;
			next();
		} catch (err) {
			logger.error(err);
			if (blocking)
				return res.status(401).json({error: 'Unauthorized'});
		}
	};
}