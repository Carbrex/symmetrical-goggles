let API_URL = "/";

if (import.meta.env.DEV === true) {
	// API_URL = "https://localhost:443";
	API_URL = `https://${window.location.hostname}`;
}

export default API_URL;
