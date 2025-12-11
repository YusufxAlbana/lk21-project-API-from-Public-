import api from "../config/api.js";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  try {
    const response = await api.get("/");
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
