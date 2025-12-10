import api from "#config/api";
import getMovieDetail from "#utils/getMovieDetail";

export const index = async (req, res) => {
  const { url } = req.query;

  if (!url) {
      return res.status(400).json({ status: "error", message: "URL parameter is required" });
  }

  try {
      // url might be full URL, we might need to extract path or use it directly.
      // The api config baseURL is usually set. 
      // If client sends full URL 'https://lk21.de/movie-name', axios(baseURL + path) might duplicate domain if we aren't careful.
      // However, api instance has baseURL.
      // If we pass an absolute URL to axios, it ignores baseURL.
      
      const response = await api.get(url);
      const htmlCode = response.data;
      const result = getMovieDetail({ htmlCode });

      res.json({
          status: "success",
          data: result
      });
  } catch (error) {
      console.error("Error fetching detail:", error.message);
      res.status(500).json({ status: "error", message: "Failed to fetch movie details" });
  }
};
