import axios from "axios";

const baseURL = process.env.LK21_BASE_URL || "https://lk21.de";

const api = axios.create({
  baseURL,
  headers: {
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
  },
});

export default api;
