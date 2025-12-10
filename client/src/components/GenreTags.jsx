function GenreTags({ activeGenre, onGenreChange }) {
    const genres = [
        'All', 'Action', 'Adventure', 'Animation', 'Biography', 'Comedy',
        'Crime', 'Documentary', 'Drama', 'Family', 'Fantasy', 'History',
        'Horror', 'Music', 'Mystery', 'Romance', 'Sci-Fi', 'Sport',
        'Thriller', 'War', 'Western'
    ];

    return (
        <div className="tags-container">
            <div className="tags">
                {genres.map(genre => (
                    <span
                        key={genre}
                        className={`tag ${activeGenre === genre.toLowerCase() ? 'active' : ''}`}
                        onClick={() => onGenreChange(genre.toLowerCase())}
                    >
                        {genre}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default GenreTags;
