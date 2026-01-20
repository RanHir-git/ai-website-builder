import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import PricingTickets from '../cmps/pricingPage/pricingTickets'
import '../assets/styles/pages/PricingPage.css'

export function PricingPage() {
    return (
        <div className="pricing-page">
            <Header />
            <main className="main-content">
                <PricingTickets/>
            </main>
            <Footer />
        </div>
    )
}
