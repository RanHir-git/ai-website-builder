import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import '../assets/styles/pages/AboutPage.css'

export function AboutPage() {
    return (
        <div className="about-page">
            <Header />
            <main className="main-content">
                <h1>About Us</h1>
                <p>This is the about page. Add your content here.</p>
            </main>
            <Footer />
        </div>
    )
}
