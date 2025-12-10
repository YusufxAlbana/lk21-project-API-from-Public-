import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FloatingSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/films?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    return (
        <div className="custom-search-wrapper">
            <form className={`custom-search-bar ${isFocused ? 'focused' : ''}`} onSubmit={handleSearch}>
                <div className="search-icon-wrapper">
                    <i className="fas fa-search"></i>
                </div>
                <input
                    type="text"
                    placeholder="Cari film favorit Anda..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="search-input"
                />
                <button type="submit" className="search-btn">
                    <i className="fas fa-arrow-right"></i>
                </button>
            </form>
        </div>
    );
}

export default FloatingSearch;
