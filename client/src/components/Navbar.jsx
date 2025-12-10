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

            <div className="nav-links">
                <a href="/" className="nav-link">
                    <i className="fas fa-home"></i> Home
                </a>
                <a href="/films" className="nav-link">
                    <i className="fas fa-film"></i> Film
                </a>
                <a href="/contact" className="nav-link">
                    <i className="fas fa-envelope"></i> Kontak
                </a>
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
