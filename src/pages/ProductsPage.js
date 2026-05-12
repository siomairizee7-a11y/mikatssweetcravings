import { useState } from 'react';
import { ProductImage } from './AdminPage';

const STATUS_BADGE = {
  Available: 'badge-green',
  'Pre-order only': 'badge-yellow',
  Seasonal: 'badge-blue',
};

export default function ProductsPage({ setPage, addToCart, products = [] }) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filtered = products.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div>
      <div className="products-header section-pink" style={{ padding: '3rem 0 0' }}>
        <div className="container">
          <span className="badge badge-pink" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>
            Our Menu
          </span>
          <h1 className="section-title">🎂 Our Cakes & Treats</h1>
          <p className="section-subtitle">Handcrafted with love — choose your perfect cake</p>

          <div style={{ maxWidth: 400, margin: '0 auto 1.5rem' }}>
            <div className="form-group" style={{ marginBottom: 0 }}>
              <input
                type="text"
                placeholder="🔍 Search cakes..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="category-tabs">
            {categories.map(cat => (
              <button
                key={cat}
                className={`cat-tab${activeCategory === cat ? ' active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      <section className="section">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="empty-state">
              <span className="empty-icon">🔍</span>
              <h3>No products found</h3>
              <p>Try a different search or category</p>
            </div>
          ) : (
            <div className="grid-4">
              {filtered.map(product => (
                <div className="product-card" key={product.id}>
                  <div className="product-img">
                    {product.image
                      ? <img src={product.image} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', inset: 0 }} />
                      : <ProductImage product={product} size={80} />
                    }
                    <span className={`badge ${STATUS_BADGE[product.status] || 'badge-gray'} product-stock-badge`}>
                      {product.status}
                    </span>
                  </div>
                  <div className="product-body">
                    <div className="product-category">{product.category}</div>
                    <div className="product-name">{product.name}</div>
                    <div className="product-desc">{product.description}</div>
                    <div className="product-price">
                      ₱{product.priceMin.toLocaleString()} – ₱{product.priceMax.toLocaleString()}
                    </div>
                    <div className="product-variants">
                      {product.variants.map(v => (
                        <span className="variant-chip" key={v}>{v}</span>
                      ))}
                    </div>
                    <div className="product-actions">
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ flex: 1, justifyContent: 'center' }}
                        onClick={() => {
                          addToCart(product);
                          setPage('order');
                        }}
                      >
                        🛒 Order
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Info Cards */}
      <section className="section section-pink" style={{ paddingTop: '3rem' }}>
        <div className="container">
          <div className="grid-3">
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>💚</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>GCash Accepted</h3>
              <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>0962-353-7072 (Glory Mae)</p>
            </div>
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🚗</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Free Delivery</h3>
              <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Within San Jose, Antique</p>
            </div>
            <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✏️</div>
              <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Custom Orders</h3>
              <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Message us for custom designs</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
