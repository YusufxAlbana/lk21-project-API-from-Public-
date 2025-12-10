import { useNavigate, useLocation } from 'react-router-dom';
import Logo from './Logo';

function Sidebar() {
    const navigate = useNavigate();
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/' && location.pathname === '/') return true;
        if (path !== '/' && location.pathname.startsWith(path)) return true;
        return false;
    };

    const menuItems = [
        { path: '/', label: 'Home', icon: 'fas fa-home' },
        { path: '/films', label: 'Film', icon: 'fas fa-film' },
        { path: '/contact', label: 'Kontak', icon: 'fas fa-envelope' }
    ];

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-logo" onClick={() => navigate('/')}>
                    <Logo size={60} />
                </div>
            </div>

            <nav className="sidebar-nav">
                {menuItems.map((item) => (
                    <button
                        key={item.path}
                        className={`sidebar-link ${isActive(item.path) ? 'active' : ''}`}
                        onClick={() => navigate(item.path)}
                    >
                        <i className={item.icon}></i>
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-footer">
                <p>© 2025 LK21Vibe</p>
            </div>
        </aside>
    );
}

export default Sidebar;
