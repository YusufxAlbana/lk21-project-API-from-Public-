import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function FloatingSearch() {
    const [searchQuery, setSearchQuery] = useState('');
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/films?search=${encodeURIComponent(searchQuery)}`);
            setIsExpanded(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className={`floating-search ${isExpanded ? 'expanded' : ''}`}>
            <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                onFocus={() => setIsExpanded(true)}
                onBlur={() => setTimeout(() => setIsExpanded(false), 200)}
            />
            <button onClick={handleSearch}>
                <i className="fas fa-search"></i>
            </button>
        </div>
    );
}

export default FloatingSearch;
