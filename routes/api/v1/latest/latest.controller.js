import api from "#config/api";
import getMovieData from "#utils/getMovieData";

export const index = async (req, res) => {
  try {
    const numPage = req.query.page || 1;
    console.log(`Fetching latest movies page ${numPage}...`);
    
    const latestMoviesByPage = await api.get(`/latest/page/${numPage}`);
    const htmlCode = latestMoviesByPage.data;
    
    console.log(`Received HTML length: ${htmlCode?.length || 0} characters`);
    
    if (!htmlCode || htmlCode.length < 1000) {
      console.error("HTML response too short or empty:", htmlCode?.substring(0, 500));
      return res.status(500).json({
        error: "Failed to fetch data from source",
        htmlLength: htmlCode?.length || 0,
      });
    }

    const { result, totalPages } = getMovieData({ htmlCode });
    
    console.log(`Parsed ${result.length} movies, totalPages: ${totalPages}`);
    
    // Debug: if no movies found, log part of the HTML to see what we got
    if (result.length === 0) {
      console.log("DEBUG - HTML title:", htmlCode.match(/<title>([^<]+)<\/title>/)?.[1]);
      console.log("DEBUG - Contains gallery-grid:", htmlCode.includes('gallery-grid'));
      console.log("DEBUG - Contains article:", htmlCode.includes('<article'));
      console.log("DEBUG - First 1000 chars:", htmlCode.substring(0, 1000));
    }

    res.json({
      data: result,
      totalItems: result.length,
      totalPages,
      currentPage: Number(numPage),
    });
  } catch (error) {
    console.error("Error in latest controller:", error.message);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};
