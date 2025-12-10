import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

function Navbar() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <nav className="navbar">
            <div className="logo" onClick={() => navigate('/')}>
                <Logo size={80} />
            </div>

            {/* Hamburger Menu Button */}
            <button className={`hamburger ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                <span></span>
                <span></span>
                <span></span>
            </button>

            {/* Navigation Links */}
            <div className={`nav-links ${isMenuOpen ? 'active' : ''}`}>
                <a href="/" className="nav-link" onClick={closeMenu}>
                    <i className="fas fa-home"></i> Home
                </a>
                <a href="/films" className="nav-link" onClick={closeMenu}>
                    <i className="fas fa-film"></i> Film
                </a>
                <a href="/about" className="nav-link" onClick={closeMenu}>
                    <i className="fas fa-info-circle"></i> About
                </a>
                <a href="/contact" className="nav-link" onClick={closeMenu}>
                    <i className="fas fa-user"></i> Contact
                </a>
            </div>

            {/* Overlay for mobile menu */}
            {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
        </nav>
    );
}

export default Navbar;
