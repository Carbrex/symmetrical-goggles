let API_URL = "/";

if (import.meta.env.DEV === true) {
	API_URL = "https://localhost:443";
}

export default API_URL;
