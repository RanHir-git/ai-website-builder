import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { Hero } from '../cmps/homepage/hero'
import '../assets/styles/pages/HomePage.css'

export function HomePage() {
    return (
        <div className="home-page">
            <Header />
            <main className="main-content relative">
                <Hero />
            </main>
            <Footer />
        </div>
    )
}
