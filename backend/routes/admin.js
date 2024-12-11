import express from 'express';
import authMiddleware from '../middleware/auth.js';
const router = express.Router();

router.use(authMiddleware);
router.use((req, res, next) => {
	if (req.customer?.is_admin === 'false')
		return res.status(403).json({error: 'Forbidden'});
	next();
});


router.post('/trips/new', (req, res) => {
	let {origin, destination, departure, arrival} = req.body;
	// Controller
	if (!origin || !destination || !departure || !arrival) return res.status(400).json({error: 'Missing required information'});
	// Add trip to database
	departure = new Date(departure);
	arrival = new Date(arrival);
	req.app.db.addTrip({origin, destination, departure, arrival}).then(id => {
		res.status(201).json({id});
	}).catch((err) => {
		res.status(500).json({error: err.message});
	});
});

export default router;