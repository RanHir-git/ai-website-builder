import { useState } from 'react'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import '../assets/styles/pages/ContactPage.css'

export function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    })

    const handleChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('Form submitted:', formData)
        // Add your form submission logic here
    }

    return (
        <div className="contact-page">
            <Header />
            <main className="main-content">
                <h1>Contact Us</h1>
                <form onSubmit={handleSubmit} className="contact-form">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            rows="5"
                            required
                        />
                    </div>
                    <button type="submit" className="submit-btn">Send Message</button>
                </form>
            </main>
            <Footer />
        </div>
    )
}
