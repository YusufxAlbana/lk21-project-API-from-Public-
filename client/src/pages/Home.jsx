import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Hero from '../components/Hero';
import GenreTags from '../components/GenreTags';
import MovieGrid from '../components/MovieGrid';
import FloatingSearch from '../components/FloatingSearch';

function Home() {
    const [searchParams] = useSearchParams();
    const [movies, setMovies] = useState([]);
    const [allMovies, setAllMovies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentEndpoint, setCurrentEndpoint] = useState('latest');
    const [loading, setLoading] = useState(false);
    const [activeGenre, setActiveGenre] = useState('all');
    const [sectionTitle, setSectionTitle] = useState('Film Terbaru');

    const API_BASE = '/api/v1';

    // Handle search from URL params
    useEffect(() => {
        const searchQuery = searchParams.get('search');
        if (searchQuery) {
            filterMovies(searchQuery);
        }
    }, [searchParams]);

    // Initial load
    useEffect(() => {
        fetchMovies('latest', 1, true);
    }, []);

    const fetchMovies = async (endpoint, page = 1, reset = true) => {
        if (loading) return;
        setLoading(true);

        try {
            let url;
            if (endpoint === 'latest') {
                url = `${API_BASE}/latest?page=${page}`;
            } else if (endpoint.startsWith('genre/')) {
                url = `${API_BASE}/${endpoint}?page=${page}`;
            } else {
                url = `${API_BASE}/${endpoint}?page=${page}`;
            }

            const response = await fetch(url);
            const data = await response.json();

            let moviesData = [];
            if (data.data) {
                moviesData = data.data;
            } else if (data.result) {
                moviesData = data.result;
            } else if (Array.isArray(data)) {
                moviesData = data;
            }

            if (reset) {
                setMovies(moviesData);
                setAllMovies(moviesData);
                setCurrentEndpoint(endpoint);
                setCurrentPage(page);
                setSectionTitle(formatTitle(endpoint));
            } else {
                setMovies(prev => [...prev, ...moviesData]);
                setAllMovies(prev => [...prev, ...moviesData]);
                setCurrentPage(page);
            }
        } catch (error) {
            console.error('Error fetching movies:', error);
        } finally {
            setLoading(false);
        }
    };

    const filterMovies = (query) => {
        if (!query) {
            setMovies(allMovies);
            setSectionTitle('Film Terbaru');
            return;
        }

        const filtered = allMovies.filter(movie => {
            const title = (movie.title || movie.Title || movie.options?.name || '').toLowerCase();
            return title.includes(query.toLowerCase());
        });

        setMovies(filtered);
        setSectionTitle(`Search Results for "${query}"`);
    };

    const handleGenreChange = (genre) => {
        setActiveGenre(genre);
        if (genre === 'all') {
            fetchMovies('latest', 1, true);
        } else {
            fetchMovies(`genre/${genre}`, 1, true);
        }
    };

    const handleLoadMore = () => {
        fetchMovies(currentEndpoint, currentPage + 1, false);
    };

    const formatTitle = (endpoint) => {
        if (endpoint === 'latest') return 'Latest Updates';
        if (endpoint.startsWith('genre/')) {
            const genre = endpoint.split('/')[1];
            return `${genre.charAt(0).toUpperCase() + genre.slice(1)} Movies`;
        }
        return 'Movies';
    };

    return (
        <>
            <FloatingSearch />
            <Hero />
            <main className="container">
                <section id="latest-section">
                    <div className="section-header">
                        <h2>{sectionTitle}</h2>
                        <GenreTags activeGenre={activeGenre} onGenreChange={handleGenreChange} />
                    </div>
                    <MovieGrid movies={movies} loading={loading} />
                    {movies.length > 0 && !searchParams.get('search') && (
                        <div className="load-more-container">
                            <button
                                id="loadMoreBtn"
                                className="primary-btn"
                                onClick={handleLoadMore}
                                disabled={loading}
                            >
                                {loading ? 'Loading...' : 'Load More Movies'}
                            </button>
                        </div>
                    )}
                </section>
            </main>
        </>
    );
}

export default Home;
