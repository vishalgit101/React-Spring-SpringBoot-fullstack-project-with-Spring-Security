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
    let csrf = localStorage.getItem("CSRF_TOKEN");
    /*if (!csrf) {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/api/csrf-token`,
          { withCredentials: true }
        );
        csrf = response.data.token;
        localStorage.setItem("CSRF_TOKEN", csrf);
      } catch (err) {
        console.error("Failed to fetch CSRF token", err);
      }
    }*/

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_APP_API_URL}/api/csrf-token`,
        { withCredentials: true }
      );
      csrf = response.data.token;
      localStorage.setItem("CSRF_TOKEN", csrf);
    } catch (err) {
      console.error("Failed to fetch CSRF token", err);
    }

    if (csrf) {
      config.headers["X-XSRF-TOKEN"] = csrf; // // object key fetching with [ ]
    }
    console.log("csrf-token: ", csrf);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// This whole csrf token section needs to be modified latter, as csrf token gets expired after each post request

export default api;
