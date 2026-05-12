import { useState, useMemo } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';

const ADMIN_PASSWORD = 'mamamo123';
const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Preparing', 'Delivered', 'Cancelled'];
const STATUS_COLORS = {
  Pending: '#F59E0B', Confirmed: '#3B82F6', Preparing: '#8B5CF6',
  Delivered: '#10B981', Cancelled: '#EF4444',
};
const PIE_COLORS = ['#C85A7A', '#A8D8EA', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6'];
const STOCK_STATUS_OPTIONS = ['Available', 'Pre-order only', 'Seasonal', 'Out of Stock'];
const CATEGORIES_LIST = ['Birthday Cake', 'Wedding Cake', 'Custom Cake', 'Cupcakes', 'Cake Pops', 'Themed Cake', 'Flavored Cake'];
const FLAVORS_LIST = ['Chocolate', 'Vanilla', 'Red Velvet', 'Ube', 'Strawberry', 'Caramel', 'Mocha', 'Lemon'];
const LOW_STOCK_THRESHOLD = 3;

const blankProduct = {
  name: '', category: 'Birthday Cake', emoji: '🎂',
  description: '', priceMin: 250, priceMax: 1000,
  variants: [], status: 'Available', stock: 10,
};

// ─── Login Screen ───────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) { onLogin(); }
    else { setError('Incorrect password. Please try again.'); }
  };

  return (
    <div className="admin-login">
      <div className="admin-login-card">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔐</div>
        <h2>Admin Access</h2>
        <p style={{ color: 'var(--gray)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
          Mikat's Admin Dashboard — Authorized personnel only
        </p>
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ textAlign: 'left' }}>
            <label>Admin Password</label>
            <input
              type="password" value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="Enter password" autoFocus
            />
          </div>
          {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>}
          <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }}>
            🔓 Login
          </button>
        </form>
      </div>
    </div>
  );
}

// ─── Product Image helper ────────────────────────────────────────
export function ProductImage({ product, size = 48, borderRadius = 8, style = {} }) {
  if (product?.image) {
    return (
      <img
        src={product.image}
        alt={product.name}
        style={{ width: size, height: size, objectFit: 'cover', borderRadius, flexShrink: 0, ...style }}
      />
    );
  }
  return (
    <span style={{ fontSize: size * 0.55, lineHeight: 1, ...style }}>{product?.emoji || '🎂'}</span>
  );
}

// ─── Product Form Modal ──────────────────────────────────────────
function ProductModal({ initial, onSave, onClose }) {
  const isEdit = !!initial?.id;
  const [form, setForm] = useState(initial || blankProduct);
  const [variantInput, setVariantInput] = useState('');
  const [errors, setErrors] = useState({});

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const addVariant = () => {
    const v = variantInput.trim();
    if (v && !form.variants.includes(v)) {
      set('variants', [...form.variants, v]);
      setVariantInput('');
    }
  };

  const removeVariant = (v) => set('variants', form.variants.filter(x => x !== v));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name required';
    if (!form.description.trim()) e.description = 'Description required';
    if (!form.priceMin || form.priceMin <= 0) e.priceMin = 'Enter a valid min price';
    if (!form.priceMax || form.priceMax < form.priceMin) e.priceMax = 'Max must be ≥ min';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    onSave({ ...form, priceMin: Number(form.priceMin), priceMax: Number(form.priceMax), stock: Number(form.stock) });
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>{isEdit ? '✏️ Edit Product' : '➕ Add New Product'}</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>

        <div style={styles.modalBody}>
          {/* Image upload */}
          <div className="form-group">
            <label>Product Image</label>
            <div style={styles.uploadArea}>
              {form.image ? (
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  <img
                    src={form.image}
                    alt="preview"
                    style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 12, display: 'block' }}
                  />
                  <button
                    type="button"
                    onClick={() => set('image', null)}
                    style={styles.removeImgBtn}
                    title="Remove image"
                  >✕</button>
                </div>
              ) : (
                <div style={styles.uploadPlaceholder}>
                  <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🖼️</span>
                  <span style={{ fontSize: '0.88rem', color: 'var(--gray)' }}>Click to upload a photo</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--gray)', marginTop: '0.2rem', display: 'block' }}>JPG, PNG, WebP — max 2 MB</span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                style={styles.fileInput}
                onChange={e => {
                  const file = e.target.files[0];
                  if (!file) return;
                  if (file.size > 2 * 1024 * 1024) {
                    alert('Image must be under 2 MB');
                    return;
                  }
                  const reader = new FileReader();
                  reader.onload = ev => set('image', ev.target.result);
                  reader.readAsDataURL(file);
                  e.target.value = '';
                }}
              />
            </div>
            <span style={{ fontSize: '0.78rem', color: 'var(--gray)', marginTop: '0.4rem', display: 'block' }}>
              Image is stored locally in the browser. If no image is uploaded, a default icon is shown.
            </span>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Product Name *</label>
              <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Classic Birthday Cake" />
              {errors.name && <span style={styles.err}>{errors.name}</span>}
            </div>
            <div className="form-group">
              <label>Category</label>
              <select value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES_LIST.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description *</label>
            <textarea value={form.description} onChange={e => set('description', e.target.value)}
              placeholder="Describe the product..." rows={3} />
            {errors.description && <span style={styles.err}>{errors.description}</span>}
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Min Price (₱) *</label>
              <input type="number" value={form.priceMin} onChange={e => set('priceMin', e.target.value)} min={1} />
              {errors.priceMin && <span style={styles.err}>{errors.priceMin}</span>}
            </div>
            <div className="form-group">
              <label>Max Price (₱) *</label>
              <input type="number" value={form.priceMax} onChange={e => set('priceMax', e.target.value)} min={1} />
              {errors.priceMax && <span style={styles.err}>{errors.priceMax}</span>}
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label>Stock Quantity</label>
              <input type="number" value={form.stock} onChange={e => set('stock', e.target.value)} min={0} />
            </div>
            <div className="form-group">
              <label>Availability Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                {STOCK_STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Variants */}
          <div className="form-group">
            <label>Flavor Variants</label>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <select value={variantInput} onChange={e => setVariantInput(e.target.value)}
                style={{ flex: 1, padding: '0.6rem', border: '2px solid var(--border)', borderRadius: 8 }}>
                <option value="">Pick a flavor...</option>
                {FLAVORS_LIST.filter(f => !form.variants.includes(f)).map(f => <option key={f}>{f}</option>)}
              </select>
              <button type="button" className="btn btn-secondary btn-sm" onClick={addVariant}>+ Add</button>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {form.variants.map(v => (
                <span key={v} style={styles.variantTag}>
                  {v}
                  <button type="button" onClick={() => removeVariant(v)} style={styles.variantRemove}>✕</button>
                </span>
              ))}
              {form.variants.length === 0 && <span style={{ color: 'var(--gray)', fontSize: '0.85rem' }}>No variants added</span>}
            </div>
          </div>
        </div>

        <div style={styles.modalFooter}>
          <button className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={handleSave}>
            {isEdit ? '💾 Save Changes' : '➕ Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Stock Adjust Modal ──────────────────────────────────────────
function StockModal({ product, onSave, onClose }) {
  const [delta, setDelta] = useState(0);
  const [reason, setReason] = useState('');
  const [type, setType] = useState('add');

  const handleSave = () => {
    const amount = Math.abs(Number(delta));
    if (!amount) return;
    const actualDelta = type === 'add' ? amount : -amount;
    onSave(product.id, actualDelta, reason || (type === 'add' ? 'Restock' : 'Stock used'));
    onClose();
  };

  const preview = Math.max(0, (product.stock || 0) + (type === 'add' ? Math.abs(delta) : -Math.abs(delta)));

  return (
    <div style={styles.overlay}>
      <div style={{ ...styles.modal, maxWidth: 420 }}>
        <div style={styles.modalHeader}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>📦 Adjust Stock — {product.name}</h2>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        <div style={styles.modalBody}>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            {['add', 'remove'].map(t => (
              <button key={t} type="button"
                className={`delivery-btn${type === t ? ' active' : ''}`}
                onClick={() => setType(t)}
              >
                {t === 'add' ? '➕ Add Stock' : '➖ Use / Remove'}
              </button>
            ))}
          </div>

          <div style={{ background: 'var(--light-gray)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Current Stock</span>
            <strong>{product.stock ?? 0} units</strong>
          </div>

          <div className="form-group">
            <label>Quantity *</label>
            <input type="number" value={delta} min={0}
              onChange={e => setDelta(e.target.value)} placeholder="e.g. 5" />
          </div>
          <div className="form-group">
            <label>Reason / Note</label>
            <input value={reason} onChange={e => setReason(e.target.value)}
              placeholder="e.g. Weekend restock, order used..." />
          </div>

          {delta > 0 && (
            <div style={{ background: 'var(--pale-pink)', borderRadius: 10, padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.9rem' }}>New Stock After Adjustment</span>
              <strong style={{ color: 'var(--brick-pink)' }}>{preview} units</strong>
            </div>
          )}
        </div>
        <div style={styles.modalFooter}>
          <button className="btn btn-outline btn-sm" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary btn-sm" onClick={handleSave}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

// ─── Order Detail Modal ──────────────────────────────────────────
function OrderModal({ order, onClose, onUpdateStatus }) {
  return (
    <div style={styles.overlay}>
      <div style={{ ...styles.modal, maxWidth: 560 }}>
        <div style={styles.modalHeader}>
          <div>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Order #{order.id}</h2>
            <span style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{order.date}</span>
          </div>
          <button onClick={onClose} style={styles.closeBtn}>✕</button>
        </div>
        <div style={styles.modalBody}>
          <div className="grid-2" style={{ marginBottom: '1rem' }}>
            <div style={styles.detailBox}>
              <div style={styles.detailLabel}>Customer</div>
              <div style={{ fontWeight: 600 }}>{order.customerName}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>{order.contactNumber}</div>
            </div>
            <div style={styles.detailBox}>
              <div style={styles.detailLabel}>Delivery</div>
              <div style={{ fontWeight: 600 }}>{order.deliveryType}</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--gray)' }}>{order.address}</div>
            </div>
            <div style={styles.detailBox}>
              <div style={styles.detailLabel}>Payment</div>
              <div style={{ fontWeight: 600 }}>{order.paymentMethod}</div>
            </div>
            <div style={styles.detailBox}>
              <div style={styles.detailLabel}>Preferred Date</div>
              <div style={{ fontWeight: 600 }}>{order.deliveryDate}</div>
            </div>
          </div>

          {(order.flavor || order.theme) && (
            <div style={{ ...styles.detailBox, marginBottom: '1rem' }}>
              {order.flavor && <div><span style={styles.detailLabel}>Flavor: </span>{order.flavor}</div>}
              {order.theme && <div><span style={styles.detailLabel}>Theme: </span>{order.theme}</div>}
              {order.specialInstructions && <div><span style={styles.detailLabel}>Notes: </span>{order.specialInstructions}</div>}
            </div>
          )}

          <div style={styles.detailBox}>
            <div style={styles.detailLabel}>Items Ordered</div>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid var(--border)' }}>
                <span>{item.name} ×{item.quantity}</span>
                <span style={{ fontWeight: 600 }}>₱{(item.price * item.quantity).toLocaleString()}+</span>
              </div>
            ))}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontWeight: 700, fontSize: '1rem' }}>
              <span>Est. Total</span>
              <span style={{ color: 'var(--brick-pink)' }}>₱{order.total.toLocaleString()}+</span>
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem', marginBottom: 0 }}>
            <label>Update Order Status</label>
            <select
              className="status-select"
              value={order.status}
              onChange={e => onUpdateStatus(order.id, e.target.value)}
              style={{ width: '100%', padding: '0.6rem', borderColor: STATUS_COLORS[order.status] }}
            >
              {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <div style={styles.modalFooter}>
          <button className="btn btn-primary btn-sm" onClick={onClose}>Done</button>
        </div>
      </div>
    </div>
  );
}

// ─── Shared inline styles ────────────────────────────────────────
const styles = {
  overlay: {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
    zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: '1rem', overflowY: 'auto',
  },
  modal: {
    background: 'white', borderRadius: 20, width: '100%', maxWidth: 640,
    boxShadow: '0 20px 60px rgba(0,0,0,0.2)', display: 'flex', flexDirection: 'column',
    maxHeight: '90vh',
  },
  modalHeader: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
    padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--border)',
  },
  modalBody: { padding: '1.5rem', overflowY: 'auto', flex: 1 },
  modalFooter: {
    padding: '1rem 1.5rem', borderTop: '1px solid var(--border)',
    display: 'flex', justifyContent: 'flex-end', gap: '0.75rem',
  },
  closeBtn: {
    background: 'var(--light-gray)', border: 'none', borderRadius: 8,
    width: 32, height: 32, cursor: 'pointer', fontSize: '0.9rem', fontWeight: 700,
  },
  err: { color: 'var(--danger)', fontSize: '0.8rem', display: 'block', marginTop: '0.2rem' },
  variantTag: {
    display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
    padding: '0.2rem 0.6rem', borderRadius: 20, background: 'var(--pale-pink)',
    color: 'var(--brick-pink)', fontSize: '0.82rem', fontWeight: 600,
  },
  variantRemove: {
    background: 'none', border: 'none', cursor: 'pointer',
    color: 'var(--brick-pink)', fontSize: '0.75rem', lineHeight: 1, padding: 0,
  },
  detailBox: {
    background: 'var(--light-gray)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '0.5rem',
  },
  detailLabel: { fontSize: '0.75rem', fontWeight: 700, color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '0.2rem' },
  uploadArea: {
    position: 'relative', border: '2px dashed var(--border)', borderRadius: 12,
    padding: '1.25rem', textAlign: 'center', cursor: 'pointer',
    background: 'var(--light-gray)', transition: 'border-color 0.2s',
    overflow: 'hidden',
  },
  uploadPlaceholder: { pointerEvents: 'none' },
  fileInput: {
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    opacity: 0, cursor: 'pointer',
  },
  removeImgBtn: {
    position: 'absolute', top: -6, right: -6, width: 22, height: 22,
    borderRadius: '50%', background: 'var(--danger)', color: 'white',
    border: 'none', cursor: 'pointer', fontSize: '0.7rem', fontWeight: 700,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    zIndex: 1,
  },
};

// ─── Main AdminPage ──────────────────────────────────────────────
export default function AdminPage({
  orders, updateOrderStatus, deleteOrder,
  products, addProduct, updateProduct, deleteProduct, adjustStock,
}) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('orders');

  // Orders state
  const [statusFilter, setStatusFilter] = useState('All');
  const [orderSearch, setOrderSearch] = useState('');
  const [viewOrder, setViewOrder] = useState(null);

  // Products state
  const [productSearch, setProductSearch] = useState('');
  const [productModal, setProductModal] = useState(null); // null | 'add' | product obj
  const [productCatFilter, setProductCatFilter] = useState('All');

  // Inventory state
  const [stockModal, setStockModal] = useState(null); // null | product obj
  const [invSearch, setInvSearch] = useState('');
  const [logProduct, setLogProduct] = useState(null); // product whose log is expanded

  // ── Analytics ──
  const analytics = useMemo(() => {
    const now = new Date();
    const thisMonth = orders.filter(o => {
      const d = new Date(o.timestamp);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    });
    const totalRevenue = orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.total, 0);
    const monthRevenue = thisMonth.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.total, 0);
    const avgOrderValue = orders.length > 0 ? Math.round(orders.reduce((s, o) => s + o.total, 0) / orders.length) : 0;

    const productCount = {};
    orders.forEach(o => o.items.forEach(item => {
      productCount[item.name] = (productCount[item.name] || 0) + item.quantity;
    }));
    const bestSelling = Object.entries(productCount)
      .map(([name, count]) => ({ name: name.length > 20 ? name.slice(0, 18) + '…' : name, count }))
      .sort((a, b) => b.count - a.count).slice(0, 6);

    const byStatus = STATUS_OPTIONS.map(s => ({ status: s, count: orders.filter(o => o.status === s).length }));

    const dailyMap = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now); d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
      dailyMap[key] = 0;
    }
    orders.forEach(o => {
      const key = new Date(o.timestamp).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
      if (key in dailyMap) dailyMap[key]++;
    });
    const dailyVolume = Object.entries(dailyMap).map(([date, orders]) => ({ date, orders }));

    const customerMap = {};
    orders.forEach(o => {
      if (!customerMap[o.customerName]) customerMap[o.customerName] = { count: 0, total: 0 };
      customerMap[o.customerName].count++;
      customerMap[o.customerName].total += o.total;
    });
    const topCustomers = Object.entries(customerMap)
      .map(([name, d]) => ({ name, ...d }))
      .sort((a, b) => b.count - a.count).slice(0, 5);

    return { totalRevenue, monthRevenue, avgOrderValue, bestSelling, byStatus, dailyVolume, topCustomers, thisMonthCount: thisMonth.length };
  }, [orders]);

  // ── Export CSV ──
  const exportOrdersCSV = () => {
    const headers = ['Order ID', 'Date', 'Customer', 'Contact', 'Items', 'Total', 'Payment', 'Delivery', 'Address', 'Status'];
    const rows = orders.map(o => [
      o.id, o.date, o.customerName, o.contactNumber,
      o.items.map(i => `${i.name}×${i.quantity}`).join('; '),
      o.total, o.paymentMethod, o.deliveryType, o.address, o.status,
    ]);
    downloadCSV([headers, ...rows], `mikat-orders-${Date.now()}.csv`);
  };

  const exportProductsCSV = () => {
    const headers = ['ID', 'Name', 'Category', 'Description', 'Min Price', 'Max Price', 'Variants', 'Status', 'Stock'];
    const rows = products.map(p => [
      p.id, p.name, p.category, p.description, p.priceMin, p.priceMax,
      p.variants.join('; '), p.status, p.stock,
    ]);
    downloadCSV([headers, ...rows], `mikat-products-${Date.now()}.csv`);
  };

  const downloadCSV = (data, filename) => {
    const csv = data.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  // ── Filtered lists ──
  const filteredOrders = useMemo(() => {
    let list = statusFilter === 'All' ? orders : orders.filter(o => o.status === statusFilter);
    if (orderSearch.trim()) {
      const q = orderSearch.toLowerCase();
      list = list.filter(o =>
        o.customerName.toLowerCase().includes(q) ||
        o.id.toLowerCase().includes(q) ||
        o.contactNumber.includes(q)
      );
    }
    return list.slice().reverse();
  }, [orders, statusFilter, orderSearch]);

  const productCategories = ['All', ...new Set(products.map(p => p.category))];
  const filteredProducts = useMemo(() => {
    let list = productCatFilter === 'All' ? products : products.filter(p => p.category === productCatFilter);
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      list = list.filter(p => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
    }
    return list;
  }, [products, productCatFilter, productSearch]);

  const filteredInventory = useMemo(() => {
    if (!invSearch.trim()) return products;
    const q = invSearch.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(q));
  }, [products, invSearch]);

  const lowStockItems = products.filter(p => (p.stock ?? 0) <= LOW_STOCK_THRESHOLD);

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  const TABS = [
    { key: 'orders', label: '📋 Orders', count: orders.filter(o => o.status === 'Pending').length },
    { key: 'products', label: '🎂 Products', count: null },
    { key: 'inventory', label: '📦 Inventory', count: lowStockItems.length || null },
    { key: 'analytics', label: '📊 Analytics', count: null },
  ];

  return (
    <div className="admin-page">
      {/* Product Modal */}
      {productModal && (
        <ProductModal
          initial={productModal === 'add' ? null : productModal}
          onSave={(data) => {
            if (productModal === 'add') addProduct(data);
            else updateProduct(productModal.id, data);
            setProductModal(null);
          }}
          onClose={() => setProductModal(null)}
        />
      )}

      {/* Stock Adjust Modal */}
      {stockModal && (
        <StockModal
          product={stockModal}
          onSave={adjustStock}
          onClose={() => setStockModal(null)}
        />
      )}

      {/* Order Detail Modal */}
      {viewOrder && (
        <OrderModal
          order={viewOrder}
          onClose={() => setViewOrder(null)}
          onUpdateStatus={(id, status) => {
            updateOrderStatus(id, status);
            setViewOrder(o => ({ ...o, status }));
          }}
        />
      )}

      <div className="container">
        {/* Header */}
        <div className="admin-header">
          <div>
            <h1>🎂 Mikat's Admin</h1>
            <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Welcome back, Admin!</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            {activeTab === 'orders' && (
              <button className="btn btn-secondary btn-sm" onClick={exportOrdersCSV}>📥 Export Orders</button>
            )}
            {activeTab === 'products' && (
              <button className="btn btn-secondary btn-sm" onClick={exportProductsCSV}>📥 Export Products</button>
            )}
            <button className="btn btn-outline btn-sm" onClick={() => setLoggedIn(false)}>🚪 Logout</button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid-4 mb-3">
          <div className="stat-card">
            <div className="stat-label">Total Revenue</div>
            <div className="stat-value">₱{analytics.totalRevenue.toLocaleString()}</div>
            <div className="stat-sub">This month: ₱{analytics.monthRevenue.toLocaleString()}</div>
          </div>
          <div className="stat-card blue">
            <div className="stat-label">Total Orders</div>
            <div className="stat-value">{orders.length}</div>
            <div className="stat-sub">This month: {analytics.thisMonthCount}</div>
          </div>
          <div className="stat-card green">
            <div className="stat-label">Total Products</div>
            <div className="stat-value">{products.length}</div>
            <div className="stat-sub">
              {lowStockItems.length > 0
                ? <span style={{ color: 'var(--danger)' }}>⚠ {lowStockItems.length} low stock</span>
                : 'All stocked'}
            </div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-label">Pending Orders</div>
            <div className="stat-value">{orders.filter(o => o.status === 'Pending').length}</div>
            <div className="stat-sub">Needs attention</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="admin-tabs">
          {TABS.map(tab => (
            <button
              key={tab.key}
              className={`admin-tab${activeTab === tab.key ? ' active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
              style={{ position: 'relative' }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span style={{
                  marginLeft: '0.4rem', background: activeTab === tab.key ? 'rgba(255,255,255,0.35)' : 'var(--brick-pink)',
                  color: 'white', borderRadius: 50, fontSize: '0.7rem', padding: '0 6px', fontWeight: 700,
                }}>{tab.count}</span>
              )}
            </button>
          ))}
        </div>

        {/* ══════════ ORDERS TAB ══════════ */}
        {activeTab === 'orders' && (
          <div className="fade-in">
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                style={{ padding: '0.5rem 1rem', border: '2px solid var(--border)', borderRadius: 10, fontSize: '0.9rem', flex: '1 1 200px' }}
                placeholder="🔍 Search by name, order ID, phone..."
                value={orderSearch}
                onChange={e => setOrderSearch(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {['All', ...STATUS_OPTIONS].map(s => (
                  <button key={s}
                    className={`cat-tab${statusFilter === s ? ' active' : ''}`}
                    style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                    onClick={() => setStatusFilter(s)}
                  >{s}</button>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '0.75rem', color: 'var(--gray)', fontSize: '0.85rem' }}>
              Showing {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">📋</span>
                <h3>No orders found</h3>
                <p>Try adjusting the filter or search</p>
              </div>
            ) : (
              <div className="card orders-table-wrap">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Items</th>
                      <th>Total</th>
                      <th>Payment</th>
                      <th>Delivery</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr key={order.id}>
                        <td>
                          <button onClick={() => setViewOrder(order)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--brick-pink)', fontWeight: 700, fontSize: '0.8rem', textDecoration: 'underline' }}>
                            {order.id}
                          </button>
                        </td>
                        <td style={{ whiteSpace: 'nowrap', fontSize: '0.8rem' }}>{order.date}</td>
                        <td>
                          <div style={{ fontWeight: 600 }}>{order.customerName}</div>
                          <div style={{ fontSize: '0.78rem', color: 'var(--gray)' }}>{order.contactNumber}</div>
                        </td>
                        <td style={{ maxWidth: 160 }}>
                          {order.items.map((item, i) => (
                            <div key={i} style={{ fontSize: '0.8rem' }}>{item.name} ×{item.quantity}</div>
                          ))}
                          {order.flavor && <div style={{ fontSize: '0.75rem', color: 'var(--gray)' }}>🍫 {order.flavor}</div>}
                        </td>
                        <td><strong className="text-pink">₱{order.total.toLocaleString()}+</strong></td>
                        <td>
                          <span className={`badge ${order.paymentMethod === 'GCash' ? 'badge-green' : 'badge-blue'}`}>
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.82rem' }}>{order.deliveryType}</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--gray)', maxWidth: 110 }}>{order.address}</div>
                        </td>
                        <td>
                          <select className="status-select" value={order.status}
                            onChange={e => updateOrderStatus(order.id, e.target.value)}
                            style={{ borderColor: STATUS_COLORS[order.status] }}>
                            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => setViewOrder(order)}>👁</button>
                            <button className="btn btn-danger btn-sm"
                              onClick={() => { if (window.confirm(`Delete order ${order.id}?`)) deleteOrder(order.id); }}>
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══════════ PRODUCTS TAB ══════════ */}
        {activeTab === 'products' && (
          <div className="fade-in">
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                style={{ padding: '0.5rem 1rem', border: '2px solid var(--border)', borderRadius: 10, fontSize: '0.9rem', flex: '1 1 200px' }}
                placeholder="🔍 Search products..."
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {productCategories.map(c => (
                  <button key={c}
                    className={`cat-tab${productCatFilter === c ? ' active' : ''}`}
                    style={{ padding: '0.3rem 0.75rem', fontSize: '0.8rem' }}
                    onClick={() => setProductCatFilter(c)}
                  >{c}</button>
                ))}
              </div>
              <button className="btn btn-primary btn-sm" onClick={() => setProductModal('add')}>
                ➕ Add Product
              </button>
            </div>

            <div style={{ marginBottom: '0.75rem', color: 'var(--gray)', fontSize: '0.85rem' }}>
              {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            </div>

            {filteredProducts.length === 0 ? (
              <div className="empty-state">
                <span className="empty-icon">🎂</span>
                <h3>No products found</h3>
                <p>Add your first product or adjust the filter</p>
              </div>
            ) : (
              <div className="card orders-table-wrap">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Price Range</th>
                      <th>Variants</th>
                      <th>Stock</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <ProductImage product={product} size={40} borderRadius={8} />
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{product.name}</div>
                              <div style={{ fontSize: '0.78rem', color: 'var(--gray)', maxWidth: 180 }}>{product.description.slice(0, 60)}…</div>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge badge-pink" style={{ fontSize: '0.75rem' }}>{product.category}</span></td>
                        <td style={{ fontWeight: 600, color: 'var(--brick-pink)', whiteSpace: 'nowrap' }}>
                          ₱{product.priceMin.toLocaleString()} – ₱{product.priceMax.toLocaleString()}
                        </td>
                        <td>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', maxWidth: 160 }}>
                            {product.variants.slice(0, 3).map(v => (
                              <span key={v} style={{ padding: '0.1rem 0.4rem', background: 'var(--light-gray)', borderRadius: 20, fontSize: '0.72rem' }}>{v}</span>
                            ))}
                            {product.variants.length > 3 && (
                              <span style={{ fontSize: '0.72rem', color: 'var(--gray)' }}>+{product.variants.length - 3}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span style={{
                            fontWeight: 700,
                            color: (product.stock ?? 0) <= LOW_STOCK_THRESHOLD ? 'var(--danger)' : 'var(--success)',
                          }}>
                            {product.stock ?? 0}
                            {(product.stock ?? 0) <= LOW_STOCK_THRESHOLD && ' ⚠'}
                          </span>
                        </td>
                        <td>
                          <span className={`badge ${
                            product.status === 'Available' ? 'badge-green' :
                            product.status === 'Out of Stock' ? 'badge-red' :
                            product.status === 'Seasonal' ? 'badge-blue' : 'badge-yellow'
                          }`}>{product.status}</span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button className="btn btn-secondary btn-sm" onClick={() => setProductModal(product)}>✏️</button>
                            <button className="btn btn-danger btn-sm"
                              onClick={() => { if (window.confirm(`Delete "${product.name}"?`)) deleteProduct(product.id); }}>
                              🗑
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ══════════ INVENTORY TAB ══════════ */}
        {activeTab === 'inventory' && (
          <div className="fade-in">
            {/* Low stock alert */}
            {lowStockItems.length > 0 && (
              <div style={{ background: '#FEF3C7', border: '1px solid #F59E0B', borderRadius: 12, padding: '1rem 1.25rem', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '1.5rem' }}>⚠️</span>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: '0.25rem' }}>Low Stock Alert</div>
                  <div style={{ fontSize: '0.88rem', color: '#92400E' }}>
                    {lowStockItems.map(p => `${p.name} (${p.stock ?? 0} left)`).join(' · ')}
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <input
                style={{ padding: '0.5rem 1rem', border: '2px solid var(--border)', borderRadius: 10, fontSize: '0.9rem', flex: '1 1 200px' }}
                placeholder="🔍 Search products..."
                value={invSearch}
                onChange={e => setInvSearch(e.target.value)}
              />
            </div>

            <div className="card orders-table-wrap">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th>Current Stock</th>
                    <th>Status</th>
                    <th>Last Updated</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map(product => {
                    const lastLog = product.inventoryLog?.[0];
                    const isLow = (product.stock ?? 0) <= LOW_STOCK_THRESHOLD;
                    return (
                      <tr key={product.id}>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                            <ProductImage product={product} size={36} borderRadius={6} />
                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{product.name}</span>
                          </div>
                        </td>
                        <td><span className="badge badge-pink" style={{ fontSize: '0.75rem' }}>{product.category}</span></td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontWeight: 700, fontSize: '1.1rem', color: isLow ? 'var(--danger)' : 'var(--success)' }}>
                              {product.stock ?? 0}
                            </span>
                            <span style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>units</span>
                            {isLow && <span className="badge badge-red" style={{ fontSize: '0.7rem' }}>Low</span>}
                          </div>
                        </td>
                        <td>
                          <select
                            className="status-select"
                            value={product.status}
                            onChange={e => updateProduct(product.id, { status: e.target.value })}
                            style={{ fontSize: '0.82rem' }}
                          >
                            {STOCK_STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                        <td style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>
                          {lastLog ? (
                            <div>
                              <div>{lastLog.date}</div>
                              <div style={{ color: lastLog.delta > 0 ? 'var(--success)' : 'var(--danger)' }}>
                                {lastLog.delta > 0 ? `+${lastLog.delta}` : lastLog.delta} — {lastLog.reason}
                              </div>
                            </div>
                          ) : '—'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                            <button className="btn btn-primary btn-sm" onClick={() => setStockModal(product)}>
                              📦 Adjust
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setLogProduct(logProduct?.id === product.id ? null : product)}
                            >
                              📜 Log
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Inventory log panel */}
            {logProduct && (
              <div className="card" style={{ marginTop: '1.5rem', padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 700 }}>
                    {logProduct.emoji} {products.find(p => p.id === logProduct.id)?.name} — Inventory Log
                  </h3>
                  <button onClick={() => setLogProduct(null)} style={styles.closeBtn}>✕</button>
                </div>
                {(products.find(p => p.id === logProduct.id)?.inventoryLog || []).length === 0 ? (
                  <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>No adjustments recorded yet.</p>
                ) : (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
                    <thead>
                      <tr>
                        {['Date', 'Change', 'Reason', 'Stock After'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '2px solid var(--border)', color: 'var(--gray)', fontWeight: 600, fontSize: '0.8rem' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {(products.find(p => p.id === logProduct.id)?.inventoryLog || []).map((entry, i) => (
                        <tr key={i}>
                          <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)', color: 'var(--gray)' }}>{entry.date}</td>
                          <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)', fontWeight: 700, color: entry.delta > 0 ? 'var(--success)' : 'var(--danger)' }}>
                            {entry.delta > 0 ? `+${entry.delta}` : entry.delta}
                          </td>
                          <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)' }}>{entry.reason}</td>
                          <td style={{ padding: '0.5rem', borderBottom: '1px solid var(--border)', fontWeight: 600 }}>{entry.stockAfter}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </div>
        )}

        {/* ══════════ ANALYTICS TAB ══════════ */}
        {activeTab === 'analytics' && (
          <div className="fade-in">
            <div className="grid-2">
              <div className="chart-card">
                <h3>📦 Orders by Status</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={analytics.byStatus}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                      {analytics.byStatus.map((entry, i) => (
                        <Cell key={i} fill={STATUS_COLORS[entry.status] || '#C85A7A'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="chart-card">
                <h3>📈 Daily Order Volume (Last 7 Days)</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={analytics.dailyVolume}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip />
                    <Line type="monotone" dataKey="orders" stroke="#C85A7A" strokeWidth={2.5} dot={{ fill: '#C85A7A', r: 5 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid-2">
              <div className="chart-card">
                <h3>🏆 Best-Selling Products</h3>
                {analytics.bestSelling.length === 0 ? (
                  <div className="empty-state" style={{ padding: '2rem 0' }}><p>No order data yet</p></div>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={analytics.bestSelling} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis type="number" tick={{ fontSize: 11 }} allowDecimals={false} />
                      <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#A8D8EA" radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="chart-card">
                <h3>🎯 Order Status Distribution</h3>
                {orders.length === 0 ? (
                  <div className="empty-state" style={{ padding: '2rem 0' }}><p>No order data yet</p></div>
                ) : (
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={analytics.byStatus.filter(d => d.count > 0)}
                        cx="50%" cy="50%" outerRadius={90}
                        dataKey="count" nameKey="status"
                        label={({ status, percent }) => `${status} ${(percent * 100).toFixed(0)}%`}
                        labelLine={false}
                      >
                        {analytics.byStatus.map((entry, i) => (
                          <Cell key={i} fill={STATUS_COLORS[entry.status] || PIE_COLORS[i]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Inventory snapshot in analytics */}
            <div className="chart-card">
              <h3>📦 Current Stock Levels</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={products.map(p => ({ name: p.name.length > 16 ? p.name.slice(0, 14) + '…' : p.name, stock: p.stock ?? 0 }))}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="stock" radius={[6, 6, 0, 0]}>
                    {products.map((p, i) => (
                      <Cell key={i} fill={(p.stock ?? 0) <= LOW_STOCK_THRESHOLD ? '#EF4444' : '#C85A7A'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
              <p style={{ fontSize: '0.8rem', color: 'var(--gray)', marginTop: '0.5rem' }}>
                🔴 Red bars = low stock (≤{LOW_STOCK_THRESHOLD} units)
              </p>
            </div>

            {analytics.topCustomers.length > 0 && (
              <div className="chart-card">
                <h3>👑 Top Customers</h3>
                {analytics.topCustomers.map((c, i) => (
                  <div className="top-customer-row" key={i}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontWeight: 700, color: 'var(--brick-pink)', minWidth: 20 }}>#{i + 1}</span>
                      <div>
                        <div style={{ fontWeight: 600 }}>{c.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>{c.count} order{c.count !== 1 ? 's' : ''}</div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--brick-pink)' }}>₱{c.total.toLocaleString()}+</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
