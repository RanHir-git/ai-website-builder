import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import logo from '../assets/imgs/websiteLogo.png' // Update path to your logo
import LoginModal from './LoginModal'
import SignupModal from './SignupModal'

export function Header() {
    const navigate = useNavigate()
    const { user, isAuthenticated, logout } = useAuth()
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false)

    // Define your navigation items
    const navItems = [
        { path: '/', label: 'home' },
        { path: '/about', label: 'about' },
        { path: '/MyProjects', label: 'my projects' },
        { path: '/Company', label: 'Comunity' },
        { path: '/Pricing', label: 'pricing' },
    ]

    const handleLogout = async () => {
        await logout()
        navigate('/')
    }

    const handleOpenLogin = () => {
        setIsLoginModalOpen(true)
        setIsSignupModalOpen(false)
    }

    const handleOpenSignup = () => {
        setIsSignupModalOpen(true)
        setIsLoginModalOpen(false)
    }

    const handleCloseModals = () => {
        setIsLoginModalOpen(false)
        setIsSignupModalOpen(false)
    }

    const handleSwitchToSignup = () => {
        setIsLoginModalOpen(false)
        setIsSignupModalOpen(true)
    }

    const handleSwitchToLogin = () => {
        setIsSignupModalOpen(false)
        setIsLoginModalOpen(true)
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
                        <img src={logo} alt="logo" className="logo-img" />
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
                            <span className="user-credit">$ {user?.credits || user?.credit || '0'}</span>
                            <div className="header-user-info">
                                <span className="header-user-initials">{user?.name?.slice(0, 1)?.toUpperCase() || 'U'}</span>
                                <span className="header-user-name">{user?.name || 'User'}</span>
                            </div>
                            <button 
                                className="logout-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="header-auth-buttons">
                            <button 
                                className="login-btn"
                                onClick={handleOpenLogin}
                            >
                                Login
                            </button>
                            <button 
                                className="contact-btn"
                                onClick={() => navigate('/Contact')}
                            >
                                contact us
                            </button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Modals */}
            <LoginModal 
                isOpen={isLoginModalOpen}
                onClose={handleCloseModals}
                onSwitchToSignup={handleSwitchToSignup}
            />
            <SignupModal 
                isOpen={isSignupModalOpen}
                onClose={handleCloseModals}
                onSwitchToLogin={handleSwitchToLogin}
            />
        </header>
    )
}
