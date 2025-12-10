import axios from 'axios';
import getMovieData from './utils/getMovieData.js';

async function debug() {
    try {
        console.log("Fetching https://lk21.de/latest...");
        const response = await axios.get('https://lk21.de/latest', {
            headers: {
                'User-Agent': "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
            }
        });
        
        console.log("Response status:", response.status);
        console.log("Data length:", response.data.length);
        
        const data = getMovieData({ htmlCode: response.data });
        console.log("Movies found:", data.result.length);
        if (data.result.length > 0) {
            console.log("First movie keys:", Object.keys(data.result[0]));
            console.log("First movie title:", data.result[0].title);
            console.log("First movie URL:", data.result[0].options.url);
        } else {
            console.log("No movies found! Check selectors.");
        }

    } catch (error) {
        console.error("Error:", error.message);
    }
}

debug();
