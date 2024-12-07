import {mkdir, appendFile} from 'fs/promises';
// This script runs when the file is imported.
// This ensures the log directory exists so that log files can be created.

mkdir('logs', {recursive: true});

export default class Logger {

	constructor(name) {
		this.name = name;
		this.fileErrored = false;
	}

	static now(dateOnly = false) {
		const now = new Date();
		const year = now.getFullYear();
		const month = String(now.getMonth() + 1).padStart(2, '0');
		const day = String(now.getDate()).padStart(2, '0');
		const hours = String(now.getHours()).padStart(2, '0');
		const minutes = String(now.getMinutes()).padStart(2, '0');
		const seconds = String(now.getSeconds()).padStart(2, '0');
		const milliseconds = String(now.getMilliseconds()).padStart(3, '0');
		let str = `${year}-${month}-${day}`;
		if (!dateOnly)
			str += ` ${hours}:${minutes}:${seconds}.${milliseconds}`;
		return str;
	}

	write(type, ...messages) {
		const msg = `${Logger.now()} [${this.name}] [${type.toUpperCase()}] ${messages.join(' ')}`;
		console.log(msg);
		const file = `logs/${Logger.now(true)}-${this.name.toLowerCase()}${type === 'error' ? '.error' : ''}.log`;
		appendFile(file, `${msg}\n`)
			.catch(() => {
				if (!this.fileErrored) {
					console.error(`[${this.name}] Could not write to log file.`);
					this.fileErrored = true;
				}
			});
	}

	log(...messages) {
		this.write('info', ...messages);
	}
	warn(...messages) {
		this.write('warn', ...messages);
	}
	error(...messages) {
		this.write('error', ...messages);
	}
}