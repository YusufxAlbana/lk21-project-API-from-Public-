import MovieCard from './MovieCard';

function MovieGrid({ movies, loading }) {
    if (loading && movies.length === 0) {
        return (
            <div className="movie-grid">
                <div className="loading-spinner"></div>
            </div>
        );
    }

    if (movies.length === 0) {
        return (
            <div className="movie-grid">
                <div className="no-results">
                    <i className="fas fa-search"></i>
                    <h3>No movies found matching your search</h3>
                    <p>Try different keywords or browse all movies</p>
                </div>
            </div>
        );
    }

    return (
        <div className="movie-grid">
            {movies.map((movie, index) => (
                <MovieCard key={index} movie={movie} />
            ))}
        </div>
    );
}

export default MovieGrid;
