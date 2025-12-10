import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCard from '../components/MovieCard';

function Landing() {
    const [topMovies, setTopMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchTopMovies();
    }, []);

    const fetchTopMovies = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/v1/latest?page=1');
            const data = await response.json();

            console.log('API Response:', data); // Debug log

            // Parse movies from API response
            let movies = [];
            if (data.data && Array.isArray(data.data)) {
                movies = data.data;
            } else if (data.result && Array.isArray(data.result)) {
                movies = data.result;
            } else if (Array.isArray(data)) {
                movies = data;
            }

            // Filter and sort by rating
            const sortedMovies = movies
                .filter(movie => {
                    const rating = movie.rating || movie.Rating || movie.imdbRating;
                    return rating && rating !== 'N/A' && parseFloat(rating) > 0;
                })
                .sort((a, b) => {
                    const ratingA = parseFloat(a.rating || a.Rating || a.imdbRating || 0);
                    const ratingB = parseFloat(b.rating || b.Rating || b.imdbRating || 0);
                    return ratingB - ratingA;
                })
                .slice(0, 10);

            console.log('Top Movies:', sortedMovies); // Debug log
            setTopMovies(sortedMovies);
        } catch (error) {
            console.error('Error fetching top movies:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="landing-hero">
                <div className="landing-hero-overlay"></div>
                <div className="landing-hero-content">
                    <div className="landing-hero-text">
                        <h1 className="landing-title">
                            Selamat Datang di <span className="highlight">LK21 Vibe</span>
                        </h1>
                        <p className="landing-subtitle">
                            Streaming film terbaru dengan kualitas HD.
                            Nikmati koleksi film pilihan dengan rating terbaik.
                        </p>
                        <div className="landing-cta-buttons">
                            <button className="cta-primary" onClick={() => navigate('/films')}>
                                <i className="fas fa-film"></i> Jelajahi Semua Film
                            </button>
                            <button className="cta-secondary" onClick={() => window.scrollTo({ top: 600, behavior: 'smooth' })}>
                                <i className="fas fa-star"></i> Lihat Top 10
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Top 10 Movies Section */}
            <section className="top-movies-section">
                <div className="container">
                    <div className="section-header">
                        <h2>
                            <i className="fas fa-trophy"></i> Top 10 Film Terbaik
                        </h2>
                        <p className="section-description">
                            Film-film dengan rating tertinggi pilihan pengguna
                        </p>
                    </div>

                    {loading ? (
                        <div className="loading-spinner">
                            <i className="fas fa-spinner fa-spin"></i>
                        </div>
                    ) : topMovies.length > 0 ? (
                        <div className="top-movies-grid">
                            {topMovies.map((movie, index) => (
                                <div key={movie.link || index} className="top-movie-item">
                                    <div className="rank-badge">#{index + 1}</div>
                                    <MovieCard movie={movie} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="no-results">
                            <i className="fas fa-film"></i>
                            <h3>Belum ada data</h3>
                            <p>Film sedang dimuat, silakan refresh halaman</p>
                        </div>
                    )}

                    <div className="view-all-container">
                        <button className="view-all-btn" onClick={() => navigate('/films')}>
                            Lihat Semua Film <i className="fas fa-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="features-section">
                <div className="container">
                    <div className="features-grid">
                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-play-circle"></i>
                            </div>
                            <h3>Kualitas HD</h3>
                            <p>Streaming dengan kualitas video terbaik untuk pengalaman menonton maksimal</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-film"></i>
                            </div>
                            <h3>Film Terbaru</h3>
                            <p>Koleksi film terbaru dari berbagai genre yang terus diperbarui</p>
                        </div>
                        <div className="feature-card">
                            <div className="feature-icon">
                                <i className="fas fa-bolt"></i>
                            </div>
                            <h3>Update Rutin</h3>
                            <p>Film-film yang baru rilis langsung tersedia dengan subtitle berkualitas</p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}

export default Landing;
