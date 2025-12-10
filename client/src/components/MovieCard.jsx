import { useNavigate } from 'react-router-dom';

function MovieCard({ movie }) {
    const navigate = useNavigate();

    const title = movie.title || movie.Title || movie.options?.name || 'Unknown Title';
    const poster = movie.poster || movie.thumbnail || movie.Poster || 'https://via.placeholder.com/300x450?text=No+Image';
    const rating = movie.rating || movie.imDbRating || 'N/A';
    const quality = movie.quality || movie.Quality || 'HD';
    const url = movie.options?.url || '#';

    const handleClick = () => {
        if (url && url !== '#') {
            navigate(`/detail?url=${encodeURIComponent(url)}`);
        }
    };

    return (
        <div className="movie-card" onClick={handleClick}>
            <div className="poster-wrapper">
                <img
                    src={poster}
                    alt={title}
                    loading="lazy"
                    onError={(e) => e.target.src = 'https://via.placeholder.com/300x450?text=Error'}
                />
            </div>
            <div className="movie-info">
                <h3 className="movie-title" title={title}>{title}</h3>
                <div className="movie-meta">
                    <span className="quality">{quality}</span>
                    <span className="rating-badge">
                        <i className="fas fa-star"></i> {rating}
                    </span>
                </div>
            </div>
        </div>
    );
}

export default MovieCard;
