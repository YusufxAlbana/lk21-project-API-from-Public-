import express from "express";
import cors from "cors";

import api from "#config/api";
import v1API from "#routes/api/v1/index";

import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.use(cors({ origin: "*" }));
app.set("json spaces", 2);
app.use(express.static(path.join(__dirname, "public")));

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

app.use("/api/v1", v1API);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  console.log(`API endpoint: http://localhost:${PORT}/api/v1`);
});
