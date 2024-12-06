-- database: :memory:
/* Please run this file using MySQL to initialize WuWu Database correctly. */

/* Uncomment this part to perform a full reset of the WuWu Database. */
/* WARNING: RUNNING THE FOLLOWING INSTRUCTIONS WILL ERASE ALL DATA RELATED TO WUWU. PLEASE PROCEED CAREFULLY. 
DROP DATABASE IF EXISTS WUWU;
*/

CREATE DATABASE IF NOT EXISTS WUWU;

CREATE TABLE IF NOT EXISTS WUWU.Customer(
	id CHAR(16) PRIMARY KEY,
	email VARCHAR(255) NOT NULL UNIQUE,
	home_address VARCHAR(255),
	phone VARCHAR(255),
	password_hash VARCHAR(60) NOT NULL
);


CREATE TABLE IF NOT EXISTS WUWU.Station(
	id CHAR(16) PRIMARY KEY,
	name VARCHAR(255) NOT NULL,
	location POINT NOT NULL
);

CREATE TABLE IF NOT EXISTS WUWU.Trip(
	id CHAR(16) PRIMARY KEY,
	departure_time DATE NOT NULL,
	departure_station_id CHAR(16) NOT NULL,
	arrival_time DATE NOT NULL,
	arrival_station_id CHAR(16) NOT NULL,
	FOREIGN KEY (departure_station_id) REFERENCES WUWU.Station(id),
	FOREIGN KEY (arrival_station_id) REFERENCES WUWU.Station(id)
);

CREATE TABLE IF NOT EXISTS WUWU.Seat(
	id CHAR(16) PRIMARY KEY,
	car INT NOT NULL,
	seat_number CHAR(3),
	class ENUM('First','Second','Standing') NOT NULL,
	base_price FLOAT NOT NULL,
	bought BOOLEAN NOT NULL DEFAULT FALSE,
	trip_id CHAR(16) NOT NULL,
	FOREIGN KEY (trip_id) REFERENCES WUWU.Trip(id)
);

CREATE TABLE IF NOT EXISTS WUWU.Passenger(
	id CHAR(16) PRIMARY KEY,
	first_name VARCHAR(255) NOT NULL,
	last_name VARCHAR(255) NOT NULL,
	age INT NOT NULL,
	/* If a customer registers on the website, they can save Passenger informations for future use.
	   If they don't, this data is not bound to any to account and just serves identification for a ticket.
	   */
	customer_id CHAR(16),
	FOREIGN KEY (customer_id) REFERENCES WUWU.Customer(id)
);


CREATE TABLE IF NOT EXISTS WUWU.Booking(
	id CHAR(16) PRIMARY KEY,
	payed BOOLEAN DEFAULT FALSE,
	refund_status ENUM('none','requested','granted','rejected') DEFAULT 'none',
	customer_id CHAR(16),
	FOREIGN KEY (customer_id) REFERENCES WUWU.Customer(id)
);

CREATE TABLE IF NOT EXISTS WUWU.Ticket(
	id CHAR(16) PRIMARY KEY,
	passenger CHAR(16) NOT NULL,
	seat_id CHAR(16) NOT NULL,
	price FLOAT NOT NULL,
	booking_id CHAR(16) NOT NULL,
	FOREIGN KEY (seat_id) REFERENCES WUWU.Seat(id),
	FOREIGN KEY (booking_id) REFERENCES WUWU.Booking(id)
);