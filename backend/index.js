import express from 'express';
import {config} from 'dotenv';
import cookieParser from 'cookie-parser';
import log from './middleware/log.js';
import Database from './lib/Database.js';
import Logger from './lib/Logger.js';
import publicRouter from './routes/public.js';
import privateRouter from './routes/private.js';
import adminRouter from './routes/admin.js';
import authRouter from './routes/auth.js';
import cors from 'cors';
config(); // Import env variables into process.env from the .env file.

const app = express();
app.use(cors({
	origin: process.env.CORS_ORIGIN,
	methods: ['GET', 'POST'],
	credentials: true
}));

// Bind utilities to the app object so they can be accessed from the routes.
app.db = new Database({
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	host: process.env.DB_HOST,
	database: 'WUWU'
}); // Database interface
app.logger = new Logger('App'); // Top scope logger

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

// Custom middleware
app.use(log);


// Routers
app.use('/api/public', publicRouter);
app.use('/api/auth', authRouter);
app.use('/api/private', privateRouter);
app.use('/api/admin', adminRouter);
// Catch all routes to return a JSON object, which is easier to deal with
// on the frontend in case of a wrong API call.
app.all('*', (req, res) => {
	res.status(404).json({error: 'Resource not found.'});
});

const PORT = process.env.PORT || 2525;
app.listen(PORT, () => app.logger.log(`Listening on :${PORT}`));