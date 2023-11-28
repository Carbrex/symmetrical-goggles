let API_URL = "/";

if (import.meta.env.DEV === true) {
	API_URL = "localhost:443";
}

export default API_URL;
