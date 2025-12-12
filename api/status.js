import axios from "axios";

const baseURL = process.env.LK21_BASE_URL || "https://tv.lk21official.love";

const api = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
  },
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const response = await api.get("/latest");
    res.json({ 
      statusServerLK21: response.status, 
      statusText: response.statusText 
    });
  } catch (error) {
    res.status(500).json({
      statusServerLK21: error.response?.status || 500,
      statusText: error.message,
      note: "Original LK21 server might be down or blocked.",
    });
  }
}
