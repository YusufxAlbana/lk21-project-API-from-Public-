import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

function Navbar() {
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = () => {
        if (searchQuery.trim()) {
            navigate(`/?search=${encodeURIComponent(searchQuery)}`);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <nav className="navbar">
            <div className="logo" onClick={() => navigate('/')}>
                <Logo size={80} />
            </div>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search movies..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                />
                <button onClick={handleSearch}>
                    <i className="fas fa-search"></i>
                </button>
            </div>
        </nav>
    );
}

export default Navbar;
