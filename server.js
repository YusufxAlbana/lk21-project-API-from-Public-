import express from "express";
import cors from "cors";

import api from "#config/api";
import v1API from "#routes/api/v1/index";

import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({ origin: "*" }));
app.set("json spaces", 2);

// API routes first
app.use("/api/v1", v1API);

app.get("/status", async (req, res) => {
  try {
    const { status, statusText } = await api.get("/");
    res.json({ statusServerLK21: status, statusText });
  } catch (error) {
    res.status(500).json({
      statusServerLK21: error.response?.status || 500,
      statusText: error.message,
      note: "Original LK21 server might be down or blocked. Check BASE_URL.",
    });
  }
});

// Serve React build files (production)
const distPath = path.join(__dirname, "client", "dist");

// Always set up static file serving - Vercel builds the client first
app.use(express.static(distPath));

// Fallback: serve React app for all other routes (SPA routing)
app.get("*", (req, res) => {
  const indexPath = path.join(distPath, "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ 
      error: "Frontend not built", 
      hint: "Run 'npm run build' first",
      distPath: distPath 
    });
  }
});

// For local development
const PORT = process.env.PORT || 8000;
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/v1`);
    console.log(`Frontend: http://localhost:${PORT}`);
  });
}

// Export for Vercel serverless
export default app;
