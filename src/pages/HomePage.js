import { PRODUCTS } from '../data/products';
import { ProductImage } from './AdminPage';

const WHY_ITEMS = [
  { icon: '🌿', text: 'No preservatives, all-natural ingredients' },
  { icon: '☀️', text: 'Made fresh every day' },
  { icon: '🚗', text: 'Available for delivery and pick-up' },
  { icon: '💰', text: 'Affordable prices for every budget' },
  { icon: '🎉', text: 'Bulk and event orders welcome' },
  { icon: '✏️', text: 'Full customization available' },
];

const TESTIMONIALS = [
  { name: 'Maria Santos', text: 'The birthday cake was absolutely stunning! My daughter loved every bite. Will order again!', rating: 5 },
  { name: 'Jose Reyes', text: 'Best wedding cake in San Jose! All our guests kept asking where we got it. Highly recommended!', rating: 5 },
  { name: 'Ana Cruz', text: 'Love the cupcakes for our office party. Fresh, delicious, and beautifully decorated!', rating: 5 },
];

export default function HomePage({ setPage }) {
  const featured = PRODUCTS.filter(p => p.status === 'Available').slice(0, 3);

  return (
    <div>
      {/* Promo Banner */}
      <div className="promo-banner">
        🎉 FREE DELIVERY within San Jose, Antique!
        <span>|</span>
        Order now: 0930-225-0223
        <span>|</span>
        GCash & COD accepted 💚
      </div>

      {/* Hero */}
      <section className="hero">
        <div className="container">
          <div className="hero-content fade-in">
            <div className="hero-badge">
              <span className="badge badge-pink">🏡 Home-Based Bakery · San Jose, Antique</span>
            </div>
            <h1>
              Sweet Moments,<br />
              <span>Perfect Bite</span>
            </h1>
            <p>Indulge in custom cakes that make every moment sweeter. Baked fresh with love, delivered to your door.</p>
            <div className="hero-btns">
              <button className="btn btn-primary" onClick={() => setPage('order')}>
                🎂 Order Your Dream Cake Today
              </button>
              <button className="btn btn-secondary" onClick={() => setPage('products')}>
                Browse Products
              </button>
            </div>
            <div className="hero-stats">
              <div className="hero-stat">
                <div className="hero-stat-num">100+</div>
                <div className="hero-stat-label">Happy Customers</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">8+</div>
                <div className="hero-stat-label">Cake Varieties</div>
              </div>
              <div className="hero-stat">
                <div className="hero-stat-num">5★</div>
                <div className="hero-stat-label">Rating</div>
              </div>
            </div>
          </div>
        </div>
        <div className="hero-floating">
          <span className="hero-floating-emoji">🎂</span>
          <p style={{ textAlign: 'center', fontWeight: 700, marginTop: '0.5rem', color: 'var(--brick-pink)' }}>
            Custom Cakes
          </p>
          <p style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--gray)' }}>Starting ₱250</p>
        </div>
      </section>

      {/* About */}
      <section className="section">
        <div className="container">
          <div className="about-grid">
            <div className="about-image-wrap">🍰</div>
            <div className="about">
              <div className="about-badges">
                <span className="badge badge-pink">Our Story</span>
              </div>
              <h2>At Mikat's Sweet Cravings, we bake <span className="text-pink">with love</span></h2>
              <p>
                Every cake we create tells a story. Located in the heart of San Jose, Antique, we're a
                passionate home-based bakery dedicated to making your celebrations unforgettable. From
                simple birthdays to grand weddings, we pour our hearts into every bite.
              </p>
              <ul className="why-list">
                {WHY_ITEMS.map((item, i) => (
                  <li className="why-item" key={i}>
                    <div className="why-icon">{item.icon}</div>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section section-pink">
        <div className="container">
          <h2 className="section-title">🌟 Featured Products</h2>
          <p className="section-subtitle">Our most-loved cakes and treats</p>
          <div className="grid-3">
            {featured.map(product => (
              <div className="featured-card card" key={product.id}>
                <div className="featured-img" style={{ position: 'relative', overflow: 'hidden' }}>
                  {product.image
                    ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                    : <ProductImage product={product} size={80} />
                  }
                </div>
                <div className="featured-body">
                  <div style={{ marginBottom: '0.4rem' }}>
                    <span className="badge badge-pink" style={{ fontSize: '0.72rem' }}>{product.category}</span>
                  </div>
                  <h3>{product.name}</h3>
                  <p>{product.description.slice(0, 80)}...</p>
                  <div className="flex justify-between items-center" style={{ marginTop: '0.75rem' }}>
                    <span className="featured-price">₱{product.priceMin.toLocaleString()}+</span>
                    <button className="btn btn-primary btn-sm" onClick={() => setPage('order')}>Order</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-3">
            <button className="btn btn-outline" onClick={() => setPage('products')}>
              View All Products →
            </button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="section">
        <div className="container">
          <h2 className="section-title">💬 What Our Customers Say</h2>
          <p className="section-subtitle">Hear from our happy customers</p>
          <div className="grid-3">
            {TESTIMONIALS.map((t, i) => (
              <div className="card" key={i} style={{ padding: '1.5rem' }}>
                <div style={{ color: '#F59E0B', fontSize: '1.1rem', marginBottom: '0.75rem' }}>
                  {'★'.repeat(t.rating)}
                </div>
                <p style={{ color: 'var(--gray)', fontStyle: 'italic', marginBottom: '1rem', lineHeight: 1.7 }}>
                  "{t.text}"
                </p>
                <div style={{ fontWeight: 700 }}>{t.name}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>Verified Customer</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section-blue">
        <div className="container text-center">
          <h2 className="section-title">Ready to Order? 🎂</h2>
          <p className="section-subtitle">Let us bake something special for your next celebration</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => setPage('order')}>
              🛒 Place an Order
            </button>
            <a className="btn btn-secondary" href="tel:09302250223">
              📞 Call Us Now
            </a>
          </div>
          <p style={{ marginTop: '1.5rem', color: 'var(--gray)', fontSize: '0.9rem' }}>
            📍 Calixto Zaldivar St, San Jose, Antique &nbsp;·&nbsp; Mon–Sat 8AM–5PM
          </p>
        </div>
      </section>
    </div>
  );
}
