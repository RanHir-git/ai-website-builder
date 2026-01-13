import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Header } from '../cmps/Header'
import { Footer } from '../cmps/Footer'
import { fetchItems } from '../store/actions/itemsActions'
import '../assets/styles/pages/HomePage.css'

export function HomePage() {
    const dispatch = useDispatch()
    const { items, loading, error } = useSelector(state => state.items)

    useEffect(() => {
        // Fetch items when component mounts
        // dispatch(fetchItems())
    }, [dispatch])

    return (
        <div className="home-page">
            <Header />
            <main className="main-content">
                <section className="hero-section">
                    <h1>Welcome to Our Website</h1>
                    <p>This is a starter React website with Redux</p>
                </section>

                <section className="items-section">
                    <h2>Items</h2>
                    {loading && <p>Loading...</p>}
                    {error && <p className="error">Error: {error}</p>}
                    {items.length === 0 && !loading && (
                        <p>No items found. Add some items to get started!</p>
                    )}
                    <div className="items-grid">
                        {items.map((item) => (
                            <div key={item.id} className="item-card">
                                <h3>{item.name}</h3>
                                <p>{item.description}</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    )
}
