import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import '../assets/styles/pages/AboutPage.css'
import me from '../assets/imgs/me.jpg'

export function AboutPage() {
    return (
        <div className="about-page">
            <Header />
            <main className="main-content">
                {/* About the App Section */}
                <section className="about-section">
                    <h1>About AI Website Builder</h1>
                    <div className="about-content">
                        <p className="lead-text">
                            AI Website Builder is a revolutionary platform that transforms your ideas into fully functional websites using the power of artificial intelligence.
                        </p>
                        
                        <div className="features-grid">
                            <div className="feature-card">
                                <h3>🤖 AI-Powered Generation</h3>
                                <p>
                                    Simply describe your website in natural language, and our AI will generate complete, production-ready HTML code using OpenAI's GPT technology. No coding knowledge required!
                                </p>
                            </div>
                            
                            <div className="feature-card">
                                <h3>✏️ Intelligent Modifications</h3>
                                <p>
                                    Want to change colors, add sections, or modify layouts? Just tell the AI what you want, and it will intelligently update your website while preserving your existing design.
                                </p>
                            </div>
                            
                            <div className="feature-card">
                                <h3>👁️ Real-Time Preview</h3>
                                <p>
                                    See your website come to life instantly with our real-time preview feature. Watch your changes appear as the AI generates them, and edit directly in the browser.
                                </p>
                            </div>
                            
                            <div className="feature-card">
                                <h3>🎨 Visual In-Browser Editor</h3>
                                <p>
                                    Fine-tune your website with precision! Click on any element in the preview to open our visual editor panel. 
                                    Edit text content, adjust colors, modify spacing (padding and margin), change font sizes, and update CSS classes - 
                                    all with instant visual feedback. No need to understand code - just click and edit!
                                </p>
                            </div>
                            
                            <div className="feature-card">
                                <h3>🌐 Community Gallery</h3>
                                <p>
                                    Share your creations with the world! Publish your websites to our community gallery where others can discover and get inspired by your projects.
                                </p>
                            </div>
                            
                            <div className="feature-card">
                                <h3>📝 Conversation History</h3>
                                <p>
                                    Every interaction with the AI is saved, so you can track how your website evolved from initial concept to final product. Review your conversation history anytime.
                                </p>
                            </div>
                            
                            <div className="feature-card">
                                <h3>💳 Credit System</h3>
                                <p>
                                    Fair and transparent pricing. Each website creation costs 5 credits, and new users start with 20 credits to get you building right away.
                                </p>
                            </div>
                        </div>
                        
                        <div className="tech-stack">
                            <h3>Built With Modern Technology</h3>
                            <p>
                                AI Website Builder is built using React, Node.js, Express.js, MongoDB, and OpenAI GPT API. 
                                The platform features secure authentication, real-time updates, and a responsive design that works seamlessly across all devices.
                                Our innovative in-browser editor allows you to visually edit any element of your generated website with instant preview updates, 
                                making website creation accessible to everyone regardless of coding experience.
                            </p>
                        </div>
                    </div>
                </section>

                {/* About the Creator Section */}
                <section className="about-section author-section">
                    <h2>Meet the Creator</h2>
                    <div className="author-content">
                        <div className="author-image-container">
                            <img src={me} alt="Me" className="author-image" />
                        </div>
                        <div className="author-text">
                            <h3>Ran Hirschorn</h3>
                            <p className="author-title">Software Engineer</p>
                            
                            <p>
                                Full-Stack developer skilled in JavaScript, React, Node.js, MongoDB, and REST APIs. 
                                With 2+ years in the tech industry, I've developed Python tools, APIs, and data analysis systems. 
                                I'm an Electrical Engineering graduate (2025) from Tel Aviv University, specializing in Computers and Machine Learning.
                            </p>
                            <div className="author-contact">
                                <p>
                                    <strong>Contact:</strong> ranhirschorn@gmail.com | Tel Aviv, Israel
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
