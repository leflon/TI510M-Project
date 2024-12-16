import express from 'express';
import authMiddleware from '../middleware/auth.js';
const router = express.Router();

router.use(authMiddleware);

router.get('/test', (req, res) => {
	res.json({message: 'This is a test route', customer: req.customer});
});

router.get('/me', (req, res) => {
	res.json({customer: req.customer});
});

export default router;