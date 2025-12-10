import { useNavigate } from 'react-router-dom';
import Logo from './Logo';

function Navbar() {
    const navigate = useNavigate();

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
                <a href="/about" className="nav-link">
                    <i className="fas fa-info-circle"></i> About
                </a>
                <a href="/contact" className="nav-link">
                    <i className="fas fa-user"></i> Contact
                </a>
            </div>
        </nav>
    );
}

export default Navbar;
