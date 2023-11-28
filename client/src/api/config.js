let API_URL = "/";

if (import.meta.env.DEV === true) {
	API_URL = "localhost:5000";
}

export default API_URL;
