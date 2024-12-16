/**
 * This project could have been a real booking website connecting to CRH API, but having no time to implement it,
 * We opted for simple dummy data. For the site to be more realistic and interesting, we need a lot of train trips.
 * This script generates random trips for the database.
 */
import Database from './lib/Database.js';
import {config} from 'dotenv';
config();
const db = new Database({
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	host: process.env.DB_HOST,
	database: 'WUWU'
});

const stations = await db.query('SELECT * FROM Station');

const distance = (start, end) => {
	const toRad = value => value * Math.PI / 180;
	const R = 6371; // Radius of the Earth in km
	const dLat = toRad(end.lat - start.lat);
	const dLon = toRad(end.lon - start.lon);
	const lat1 = toRad(start.lat);
	const lat2 = toRad(end.lat);

	const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	return R * c;
};

for (const start of stations) {
	for (const end of stations) {
		if (start.id === end.id || start.city === end.city) continue;
		console.log(`Trips from ${start.name} to ${end.name}`);
		const startLocation = {lat: start.location.x, lon: start.location.y};
		const endLocation = {lat: end.location.x, lon: end.location.y};
		const tripDistance = distance(startLocation, endLocation);
		const averageSpeed = 250; // km/h
		const travelTime = tripDistance / averageSpeed; // hours
		const DAY_COUNT = 1;
		for (let i = 0;i < DAY_COUNT;i++) {
			console.log(`Day ${i}`);
			const startTime = new Date();
			startTime.setDate(startTime.getDate() + i);
			startTime.setHours(6, 0, 0, 0); // 6am today
			const endTime = new Date();
			endTime.setDate(endTime.getDate() + i);
			endTime.setHours(23, 0, 0, 0); // 11pm today
			let currentTime = new Date(startTime);

			while (currentTime < endTime) {
				const departureTime = new Date(currentTime.getTime() + Math.random() * 10 * 60 * 1000); // randomize within 10 minutes
				const arrivalTime = new Date(departureTime.getTime() + travelTime * 60 * 60 * 1000 + Math.random() * 5 * 60 * 1000); // travelTime + random 0-5 minutes
				const trip = {
					departure_station_id: start.id,
					arrival_station_id: end.id,
					departure_time: departureTime,
					arrival_time: arrivalTime
				};
				await db.addTrip({
					origin: trip.departure_station_id,
					destination: trip.arrival_station_id,
					departure: trip.departure_time,
					arrival: trip.arrival_time,
					randomizeSeats: true,
					includeStanding: Math.random() > 5
				});

				currentTime = new Date(departureTime.getTime() + travelTime * 60 * 60 * 1000 / 2); // at least half the travelTime
			}
		}
	}
}
db.pool.end();