import { useState, useEffect } from 'react';
import './App.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import OrderPage from './pages/OrderPage';
import AdminPage from './pages/AdminPage';
import { PRODUCTS as DEFAULT_PRODUCTS } from './data/products';

const ORDERS_KEY = 'mikat_orders';
const PRODUCTS_KEY = 'mikat_products';

function load(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) || fallback; }
  catch { return fallback; }
}

// Seed stock into default products on first load
function loadProducts() {
  const stored = load(PRODUCTS_KEY, null);
  if (stored) return stored;
  return DEFAULT_PRODUCTS.map(p => ({ ...p, stock: 10, inventoryLog: [] }));
}

export default function App() {
  const [page, setPage] = useState('home');
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState(() => load(ORDERS_KEY, []));
  const [products, setProducts] = useState(loadProducts);

  useEffect(() => { localStorage.setItem(ORDERS_KEY, JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products)); }, [products]);

  const addToCart = (product) => {
    setCart(prev => {
      const exists = prev.find(p => p.id === product.id);
      if (exists) return prev.map(p => p.id === product.id ? { ...p, quantity: (p.quantity || 1) + 1 } : p);
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const onOrderSubmit = (order) => {
    setOrders(prev => [...prev, order]);
  };

  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const deleteOrder = (id) => {
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  // Product CRUD
  const addProduct = (product) => {
    const newProduct = {
      ...product,
      id: Date.now(),
      stock: product.stock ?? 10,
      inventoryLog: [],
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id, updates) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Inventory: adjust stock with a log entry
  const adjustStock = (id, delta, reason) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== id) return p;
      const newStock = Math.max(0, (p.stock || 0) + delta);
      const logEntry = {
        date: new Date().toLocaleString('en-PH'),
        delta,
        reason,
        stockAfter: newStock,
      };
      return { ...p, stock: newStock, inventoryLog: [logEntry, ...(p.inventoryLog || [])].slice(0, 20) };
    }));
  };

  const navigate = (p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cartCount = cart.reduce((s, p) => s + (p.quantity || 1), 0);

  return (
    <div>
      <Navbar currentPage={page} setPage={navigate} cartCount={cartCount} />

      <main>
        {page === 'home' && <HomePage setPage={navigate} />}
        {page === 'products' && <ProductsPage setPage={navigate} addToCart={addToCart} products={products} />}
        {page === 'order' && (
          <OrderPage
            cart={cart}
            setCart={setCart}
            onOrderSubmit={onOrderSubmit}
            products={products}
          />
        )}
        {page === 'admin' && (
          <AdminPage
            orders={orders}
            updateOrderStatus={updateOrderStatus}
            deleteOrder={deleteOrder}
            products={products}
            addProduct={addProduct}
            updateProduct={updateProduct}
            deleteProduct={deleteProduct}
            adjustStock={adjustStock}
          />
        )}
      </main>

      {page !== 'admin' && <Footer setPage={navigate} />}

      <a
        className="messenger-float"
        href="https://m.me/glorymae.caldera"
        target="_blank"
        rel="noopener noreferrer"
        title="Message us on Facebook"
      >
        💬
      </a>
    </div>
  );
}
