import axios from "axios";
//import { json } from "react-router";
console.log("Api Url: ", import.meta.env.VITE_APP_API_URL);

//creating axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_APP_API_URL + "/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  withCredentials: true,
  // withCredentials: true: Ensures cookies (like session tokens) are sent with requests — essential if you're doing cookie-based auth.
});

// Add a request interceptor to include JWT and CSRF tokens

api.interceptors.request.use(
  //(successCallback, error)
  async (config) => {
    const token = localStorage.getItem("JWT_TOKEN");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // object key fetching with .dot
    }

    //getting csrf token
    let csrfToken = localStorage.getItem("CSRF_TOKEN");

    if (!csrfToken) {
      csrfToken = await fetchCsrfToken();
    }

    if (csrfToken) {
      config.headers["X-XSRF-TOKEN"] = csrfToken;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Function to fetch a new CSRF token and store it
async function fetchCsrfToken() {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_APP_API_URL}/api/csrf-token`,
      { withCredentials: true }
    );
    const csrfToken = response.data.token;
    localStorage.setItem("CSRF_TOKEN", csrfToken);
    return csrfToken;
  } catch (error) {
    console.error("Failed to fetch CSRF token", error);
    throw error;
  }
}

// This whole csrf token section needs to be modified latter, as csrf token gets expired after each post request

// Add a response interceptor to handle CSRF token expiration
api.interceptors.response.use(
  (response) => {
    return response; // If response is successful, just return it
  },
  async (error) => {
    const originalRequest = error.config;

    // Check if error is due to CSRF token expiry (typically 403 or a specific error message)
    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true; // Prevent infinite retry loops

      try {
        const newCsrfToken = await fetchCsrfToken(); // Fetch a new CSRF token
        originalRequest.headers["X-XSRF-TOKEN"] = newCsrfToken; // Update the header with new token

        // Retry the original request with the new CSRF token
        return api(originalRequest);
      } catch (tokenRefreshError) {
        return Promise.reject(tokenRefreshError); // If token refresh fails, reject the promise
      }
    }
    console.error("Backend error response:", error.response?.data); // 👈 logs the message
    return Promise.reject(error); // If error is not due to CSRF, reject it as usual
  }
);

export default api;
