import express from 'express';

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
	const trips = await req.app.db.query('SELECT * FROM Trip WHERE origin = ? AND destination = ?', [origin, destination]);
	res.json(trips);
});




export default router;