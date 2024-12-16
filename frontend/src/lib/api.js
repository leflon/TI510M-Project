const api = {
	get: async (endpoint, query) => {
		const url = new URL(import.meta.env.VITE_API_URL + endpoint);
		if (query) {
			Object.keys(query).forEach(key => url.searchParams.append(key, query[key]));
		}
		const response = await fetch(url, {credentials: 'include'});
		return response.json();
	},
	post: async (endpoint, body) => {
		const url = new URL(import.meta.env.VITE_API_URL + endpoint);
		const response = await fetch(url, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(body),
			credentials: 'include'
		});
		return response.json();
	},

	public: {
		get(endpoint, query) {
			return api.get('/api/public' + endpoint, query);
		},
		post(endpoint, body) {
			return api.post('/api/public' + endpoint, body);
		}
	},
	auth: {
		get(endpoint, query) {
			return api.get('/api/auth' + endpoint, query);
		},
		post(endpoint, body) {
			return api.post('/api/auth' + endpoint, body);
		}
	},
	private: {
		get(endpoint, query) {
			return api.get('/api/private' + endpoint, query);
		},
		post(endpoint, body) {
			return api.post('/api/private' + endpoint, body);
		}
	}
};

export default api;