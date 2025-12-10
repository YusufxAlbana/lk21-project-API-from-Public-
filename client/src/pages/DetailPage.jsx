import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

function DetailPage() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_BASE = '/api/v1';
    const movieUrl = searchParams.get('url');

    useEffect(() => {
        if (!movieUrl) {
            setError('No movie specified');
            setLoading(false);
            return;
        }

        loadMovieDetail(movieUrl);
    }, [movieUrl]);

    const loadMovieDetail = async (url) => {
        try {
            const response = await fetch(`${API_BASE}/detail?url=${encodeURIComponent(url)}`);
            const result = await response.json();

            if (result.status === 'success') {
                setMovie(result.data);
                document.title = `${result.data.title || 'Movie'} - LK21 Vibe`;
            } else {
                setError('Failed to load movie details.');
            }
        } catch (err) {
            console.error('Error fetching details:', err);
            setError('Error loading movie details.');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="detail-container">
                <div className="detail-loading">
                    <div className="loading-spinner"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="detail-container">
                <div className="detail-loading">
                    <p className="error">{error}</p>
                </div>
            </div>
        );
    }

    if (!movie) return null;

    const poster = movie.poster || 'https://via.placeholder.com/300x450';
    const fullTitle = movie.title || 'Unknown Title';
    const synopsis = movie.synopsis || 'No synopsis available.';
    const rating = parseFloat(movie.rating) || 0;
    const director = movie.director || 'N/A';
    const cast = movie.cast || 'N/A';
    const country = movie.country || 'N/A';
    const duration = movie.duration || 'N/A';
    const watchLink = movie.downloadLink || movie.streamLink || '#';
    const trailerUrl = movie.trailerUrl || '';

    // Extract year from title (but don't display it)
    const yearMatch = fullTitle.match(/\((\d{4})\)/);
    let cleanTitle = yearMatch ? fullTitle.replace(/\s*\(\d{4}\)/, '') : fullTitle;

    // Extract subtitle info
    const subtitlePatterns = [
        /Sub\s+(Indo|Indonesia)/i,
        /Subtitle\s+(Indonesia|Indo)/i,
        /di\s+Lk21/i,
        /Nonton\s+/i
    ];

    let subtitleInfo = [];
    subtitlePatterns.forEach(pattern => {
        const match = cleanTitle.match(pattern);
        if (match) {
            subtitleInfo.push(match[0].trim());
            cleanTitle = cleanTitle.replace(pattern, '').trim();
        }
    });

    cleanTitle = cleanTitle.replace(/\s+/g, ' ').trim();
    const title = cleanTitle;
    const subtitle = subtitleInfo.length > 0 ? subtitleInfo.join(' ') : null;

    const ratingPercent = (rating / 10) * 100;

    return (
        <div className="detail-container">
            <div className="detail-content">
                <div className="detail-hero">
                    <div className="detail-hero-bg" style={{ backgroundImage: `url('${poster}')` }}></div>
                    <div className="detail-hero-overlay"></div>
                </div>

                <div className="detail-main">
                    <div className="detail-poster">
                        <img src={poster} alt={title} />
                    </div>

                    <div className="detail-info">
                        <h1 className="detail-title">{title}</h1>
                        {subtitle && (
                            <div className="detail-year-subtitle-wrapper">
                                <div className="detail-subtitle">
                                    <i className="fas fa-closed-captioning"></i> {subtitle}
                                </div>
                            </div>
                        )}

                        <div className="detail-rating-section">
                            <div className="rating-bar-container">
                                <i className="fas fa-star rating-star-icon"></i>
                                <div className="rating-bar-fill" style={{ width: `${ratingPercent}%` }}>
                                    <span className="rating-text">{rating > 0 ? rating : 'N/A'}</span>
                                </div>
                            </div>
                            <span className="rating-label">Rating</span>
                        </div>

                        <div className="detail-meta">
                            <span><i className="fas fa-clock"></i> {duration}</span>
                            <span><i className="fas fa-globe"></i> {country}</span>
                        </div>

                        <div className="detail-section">
                            <h3>Synopsis</h3>
                            <p className="synopsis-text">{synopsis}</p>
                        </div>

                        <div className="detail-section">
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span className="label">Director:</span>
                                    <span className="value">{director}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Cast:</span>
                                    <span className="value">{cast}</span>
                                </div>
                            </div>
                        </div>

                        <div className="detail-actions">
                            {watchLink !== '#' ? (
                                <a href={watchLink} target="_blank" rel="noopener noreferrer" className="watch-btn">
                                    <i className="fas fa-play"></i> WATCH MOVIE
                                </a>
                            ) : (
                                <button disabled className="watch-btn">Unavailable</button>
                            )}
                            {trailerUrl && (
                                <a href={trailerUrl} target="_blank" rel="noopener noreferrer" className="trailer-btn">
                                    <i className="fas fa-video"></i> TRAILER
                                </a>
                            )}
                            <button onClick={() => navigate(-1)} className="back-btn">
                                <i className="fas fa-arrow-left"></i> BACK
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DetailPage;
