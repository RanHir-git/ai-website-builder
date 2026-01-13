import { useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { logoutUser } from '../store/actions/usersActions'
// import logo from '../assets/imgs/logo.png' // Update path to your logo

export function Header() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { currentUser, isAuthenticated } = useSelector(state => state.users)

    // Define your navigation items
    const navItems = [
        { path: '/', label: 'home' },
        { path: '/about', label: 'about' },
        // Add more navigation items as needed
    ]

    const handleLogout = () => {
        dispatch(logoutUser())
        navigate('/')
    }

    return (
        <header className="fixed-header">
            <div className="header-content">
                <div className="header-left">
                    {/* Logo button - navigate to home */}
                    <button 
                        className="logo-btn"
                        onClick={() => navigate('/')}
                    >
                        {/* <img src={logo} alt="logo" className="logo-img" /> */}
                        <span className="logo-text">LOGO</span>
                    </button>
                    
                    {/* Navigation menu */}
                    <nav className="header-nav">
                        {navItems.map((item) => (
                            <button 
                                key={item.path}
                                className="nav-btn"
                                onClick={() => navigate(item.path)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>
                
                <div className="header-right">
                    {/* User section */}
                    {isAuthenticated ? (
                        <div className="user-menu">
                            <span className="user-name">Hello, {currentUser?.name || 'User'}</span>
                            <button 
                                className="logout-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <button 
                            className="contact-btn"
                            onClick={() => navigate('/contact')}
                        >
                            contact us
                        </button>
                    )}
                </div>
            </div>
        </header>
    )
}
