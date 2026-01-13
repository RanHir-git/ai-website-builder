import { useNavigate } from 'react-router-dom'
// import logo from '../assets/imgs/logo.png' // Update path to your logo

export function Footer() {
    const navigate = useNavigate()

    // Define your navigation items
    const navItems = [
        { path: '/', label: 'home' },
        { path: '/about', label: 'about' },
        // Add more navigation items as needed
    ]

    // Social media links
    const socialLinks = [
        { 
            name: 'Facebook', 
            url: 'https://www.facebook.com',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" fill="currentColor"/>
                </svg>
            )
        },
        { 
            name: 'Twitter', 
            url: 'https://www.twitter.com',
            icon: (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" fill="currentColor"/>
                </svg>
            )
        },
    ]

    // Contact information
    const contactInfo = {
        address: [
            '123 Main Street',
            'City, State',
            'ZIP Code'
        ],
        phone: '123-456-7890',
        email: 'contact@example.com'
    }

    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Logo and Navigation */}
                <div className="footer-navs">
                    <button 
                        className="footer-logo-btn"
                        onClick={() => navigate('/')}
                    >
                        {/* <img src={logo} alt="logo" className="logo-img" /> */}
                        <span className="logo-text">LOGO</span>
                    </button>
                    <nav className="footer-nav">
                        {navItems.map((item) => (
                            <button 
                                key={item.path}
                                className="footer-nav-btn"
                                onClick={() => navigate(item.path)}
                            >
                                {item.label}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Contact Information */}
                <div className="footer-location">
                    {contactInfo.address.map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                    <p>Call Us: {contactInfo.phone}</p>
                    <p>Email: {contactInfo.email}</p>
                </div>

                {/* Social Links and Copyright */}
                <div className="footer-links">
                    <div className="footer-social">
                        {socialLinks.map((social) => (
                            <a 
                                key={social.name}
                                href={social.url} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="social-link"
                                aria-label={social.name}
                            >
                                {social.icon}
                            </a>
                        ))}
                    </div>
                    <p className="footer-copyright">
                        Copyright {new Date().getFullYear()}. All Rights Reserved
                    </p>
                </div>
            </div>
        </footer>
    )
}
