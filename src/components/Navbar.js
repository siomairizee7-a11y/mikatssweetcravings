import { useState } from 'react';

export default function Navbar({ currentPage, setPage, cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { label: 'Home', page: 'home' },
    { label: 'Products', page: 'products' },
    { label: 'Order Now', page: 'order' },
  ];

  const navigate = (page) => {
    setPage(page);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <div className="navbar-brand" onClick={() => navigate('home')}>
          <div className="brand-logo">M</div>
          <div>
            <div className="brand-name">Mikat's Sweet Cravings</div>
            <div className="brand-tagline">Sweet Moments, Perfect Bites</div>
          </div>
        </div>

        <div className={`navbar-links${menuOpen ? ' open' : ''}`}>
          {links.map(l => (
            <button
              key={l.page}
              className={`nav-link${currentPage === l.page ? ' active' : ''}`}
              onClick={() => navigate(l.page)}
            >
              {l.label}
            </button>
          ))}
          <button
            className={`nav-cart-btn${menuOpen ? ' w-full mt-1' : ''}`}
            onClick={() => navigate('order')}
          >
            🛒 Cart
            {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
          </button>
          <button
            className="nav-link nav-link-admin"
            onClick={() => navigate('admin')}
          >
            🔐 Admin
          </button>
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          <span></span><span></span><span></span>
        </button>
      </div>
    </nav>
  );
}
