import express from 'express';
import authMiddleware from '../middleware/auth.js';
const router = express.Router();

router.use(authMiddleware);
router.use((req, res, next) => {
	if (req.customer?.is_admin === 'false')
		return res.status(403).json({error: 'Forbidden'});
	next();
});


router.get('/trips', async (req, res) => {
	const trips = await req.app.db.query('SELECT * FROM Trip ORDER BY departure_time');
	const stations = await req.app.db.query('SELECT * FROM Station');
	res.render('adminTrips', {trips, stations});
});

export default router;