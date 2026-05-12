import { useState } from 'react';
import { ProductImage } from './AdminPage';

const generateOrderId = () => 'MSC-' + Date.now().toString(36).toUpperCase();

const FLAVORS = ['Chocolate', 'Vanilla', 'Red Velvet', 'Ube', 'Strawberry', 'Caramel'];

const initialForm = {
  customerName: '',
  contactNumber: '',
  flavor: '',
  theme: '',
  deliveryType: 'Delivery',
  address: '',
  paymentMethod: 'GCash',
  deliveryDate: '',
  specialInstructions: '',
};

export default function OrderPage({ cart, setCart, onOrderSubmit, products = [] }) {
  const [form, setForm] = useState(initialForm);
  const [productSelections, setProductSelections] = useState(
    cart.length > 0
      ? cart.map(item => ({ ...item, quantity: item.quantity || 1 }))
      : []
  );
  const [submitted, setSubmitted] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState(null);
  const [errors, setErrors] = useState({});

  const allProducts = products;

  const toggleProduct = (product) => {
    const exists = productSelections.find(p => p.id === product.id);
    if (exists) {
      setProductSelections(productSelections.filter(p => p.id !== product.id));
    } else {
      setProductSelections([...productSelections, { ...product, quantity: 1 }]);
    }
  };

  const updateQty = (id, qty) => {
    setProductSelections(productSelections.map(p =>
      p.id === id ? { ...p, quantity: Math.max(1, qty) } : p
    ));
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const total = productSelections.reduce((sum, p) => sum + p.priceMin * p.quantity, 0);

  const validate = () => {
    const errs = {};
    if (!form.customerName.trim()) errs.customerName = 'Name is required';
    if (!form.contactNumber.trim()) errs.contactNumber = 'Contact number is required';
    if (!form.flavor) errs.flavor = 'Please select a flavor';
    if (form.deliveryType === 'Delivery' && !form.address.trim()) errs.address = 'Address is required for delivery';
    if (productSelections.length === 0) errs.products = 'Please select at least one product';
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const order = {
      id: generateOrderId(),
      date: new Date().toLocaleString('en-PH'),
      timestamp: Date.now(),
      customerName: form.customerName,
      contactNumber: form.contactNumber,
      flavor: form.flavor,
      theme: form.theme,
      deliveryType: form.deliveryType,
      address: form.deliveryType === 'Delivery' ? form.address : 'Pick-up at bakery',
      paymentMethod: form.paymentMethod,
      deliveryDate: form.deliveryDate || 'ASAP',
      specialInstructions: form.specialInstructions,
      items: productSelections.map(p => ({ name: p.name, quantity: p.quantity, price: p.priceMin })),
      total,
      status: 'Pending',
    };

    onOrderSubmit(order);
    setConfirmedOrder(order);
    setSubmitted(true);
    setCart([]);
  };

  if (submitted && confirmedOrder) {
    return (
      <div className="confirm-page fade-in">
        <div className="container">
          <div className="confirm-card">
            <span className="confirm-icon">🎉</span>
            <h1>Order Confirmed!</h1>
            <p>Your cake order is confirmed! We'll bake fresh and notify you when it's ready to pick up/deliver.</p>
            <span className="badge badge-pink" style={{ fontSize: '1rem', padding: '0.5rem 1.25rem' }}>
              Order #{confirmedOrder.id}
            </span>

            <table className="order-detail-table">
              <tbody>
                <tr><td>Customer</td><td>{confirmedOrder.customerName}</td></tr>
                <tr><td>Contact</td><td>{confirmedOrder.contactNumber}</td></tr>
                <tr><td>Flavor</td><td>{confirmedOrder.flavor}</td></tr>
                {confirmedOrder.theme && <tr><td>Theme</td><td>{confirmedOrder.theme}</td></tr>}
                <tr><td>Items</td><td>{confirmedOrder.items.map(i => `${i.name} ×${i.quantity}`).join(', ')}</td></tr>
                <tr><td>Delivery</td><td>{confirmedOrder.deliveryType}</td></tr>
                <tr><td>Address</td><td>{confirmedOrder.address}</td></tr>
                <tr><td>Payment</td><td>{confirmedOrder.paymentMethod}</td></tr>
                <tr><td>Date</td><td>{confirmedOrder.deliveryDate}</td></tr>
                <tr><td>Est. Total</td><td style={{ color: 'var(--brick-pink)', fontWeight: 800 }}>₱{confirmedOrder.total.toLocaleString()}+</td></tr>
              </tbody>
            </table>

            {confirmedOrder.paymentMethod === 'GCash' && (
              <div style={{ background: 'var(--pale-pink)', borderRadius: 12, padding: '1rem', marginBottom: '1rem' }}>
                <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>💚 GCash Payment</p>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray)' }}>Send payment to: <strong>0962-353-7072 (Glory Mae)</strong></p>
              </div>
            )}

            <p style={{ color: 'var(--gray)', fontSize: '0.88rem' }}>
              📞 Questions? Call us at <strong>0930-225-0223</strong>
            </p>

            <button
              className="btn btn-primary w-full mt-2"
              style={{ justifyContent: 'center' }}
              onClick={() => { setSubmitted(false); setForm(initialForm); setProductSelections([]); }}
            >
              🎂 Place Another Order
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <div className="container">
        <span className="badge badge-pink">Order Form</span>
        <h1 className="mt-1">Place Your Order 🛒</h1>
        <p className="text-gray mt-1">Fill in the details below and we'll bake your dream cake!</p>

        <div className="order-layout">
          <form onSubmit={handleSubmit} className="order-form-card">
            <h2>Customer Details</h2>
            <div className="grid-2">
              <div className="form-group">
                <label>Full Name *</label>
                <input name="customerName" value={form.customerName} onChange={handleInput} placeholder="Your full name" />
                {errors.customerName && <span style={{ color: 'var(--danger)', fontSize: '0.82rem' }}>{errors.customerName}</span>}
              </div>
              <div className="form-group">
                <label>Contact Number *</label>
                <input name="contactNumber" value={form.contactNumber} onChange={handleInput} placeholder="09XX-XXX-XXXX" />
                {errors.contactNumber && <span style={{ color: 'var(--danger)', fontSize: '0.82rem' }}>{errors.contactNumber}</span>}
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Cake Flavor *</label>
                <select name="flavor" value={form.flavor} onChange={handleInput}>
                  <option value="">Select flavor</option>
                  {FLAVORS.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                {errors.flavor && <span style={{ color: 'var(--danger)', fontSize: '0.82rem' }}>{errors.flavor}</span>}
              </div>
              <div className="form-group">
                <label>Cake Theme / Design</label>
                <input name="theme" value={form.theme} onChange={handleInput} placeholder="e.g. Unicorn, Floral, Sports..." />
              </div>
            </div>

            <hr className="divider" />
            <h2>Select Products *</h2>
            {errors.products && <p style={{ color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{errors.products}</p>}
            {allProducts.map(product => {
              const selected = productSelections.find(p => p.id === product.id);
              return (
                <div className={`selected-product-card${selected ? ' active' : ''}`} key={product.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1 }}>
                    <input
                      type="checkbox"
                      checked={!!selected}
                      onChange={() => toggleProduct(product)}
                      style={{ width: 18, height: 18, cursor: 'pointer' }}
                    />
                    <ProductImage product={product} size={36} borderRadius={6} />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{product.name}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--gray)' }}>
                        ₱{product.priceMin.toLocaleString()} – ₱{product.priceMax.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  {selected && (
                    <div className="qty-control">
                      <button type="button" className="qty-btn" onClick={() => updateQty(product.id, selected.quantity - 1)}>−</button>
                      <input
                        type="number"
                        className="qty-input"
                        value={selected.quantity}
                        min={1}
                        onChange={e => updateQty(product.id, parseInt(e.target.value) || 1)}
                      />
                      <button type="button" className="qty-btn" onClick={() => updateQty(product.id, selected.quantity + 1)}>+</button>
                    </div>
                  )}
                </div>
              );
            })}

            <hr className="divider" />
            <h2>Delivery Details</h2>
            <div className="form-group">
              <label>Delivery Option</label>
              <div className="delivery-toggle">
                <button type="button" className={`delivery-btn${form.deliveryType === 'Delivery' ? ' active' : ''}`}
                  onClick={() => setForm({ ...form, deliveryType: 'Delivery' })}>🚗 Delivery</button>
                <button type="button" className={`delivery-btn${form.deliveryType === 'Pick-up' ? ' active' : ''}`}
                  onClick={() => setForm({ ...form, deliveryType: 'Pick-up' })}>🏪 Pick-up</button>
              </div>
            </div>

            {form.deliveryType === 'Delivery' && (
              <div className="form-group">
                <label>Delivery Address *</label>
                <input name="address" value={form.address} onChange={handleInput} placeholder="Street, Barangay, San Jose, Antique" />
                {errors.address && <span style={{ color: 'var(--danger)', fontSize: '0.82rem' }}>{errors.address}</span>}
                <span style={{ fontSize: '0.8rem', color: 'var(--success)' }}>✓ Free delivery within San Jose, Antique</span>
              </div>
            )}

            <div className="form-group">
              <label>Preferred Delivery Date (Optional)</label>
              <input type="date" name="deliveryDate" value={form.deliveryDate} onChange={handleInput}
                min={new Date().toISOString().split('T')[0]} />
            </div>

            <hr className="divider" />
            <h2>Payment Method</h2>
            <div className="payment-methods form-group">
              {['GCash', 'Cash on Delivery'].map(method => (
                <label className={`payment-option${form.paymentMethod === method ? ' selected' : ''}`} key={method}>
                  <input type="radio" name="paymentMethod" value={method}
                    checked={form.paymentMethod === method}
                    onChange={() => setForm({ ...form, paymentMethod: method })} />
                  <span className="pay-icon">{method === 'GCash' ? '💚' : '💵'}</span>
                  <span>{method}</span>
                </label>
              ))}
            </div>

            {form.paymentMethod === 'GCash' && (
              <div style={{ background: 'var(--pale-pink)', borderRadius: 10, padding: '0.75rem 1rem', marginBottom: '1rem', fontSize: '0.88rem' }}>
                💚 Send GCash to: <strong>0962-353-7072</strong> (Glory Mae)
              </div>
            )}

            <div className="form-group">
              <label>Special Instructions / Notes</label>
              <textarea name="specialInstructions" value={form.specialInstructions} onChange={handleInput}
                placeholder="e.g. Message on cake, allergies, custom design details..." />
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center', fontSize: '1.05rem' }}>
              🎂 Confirm Order
            </button>
          </form>

          {/* Order Summary */}
          <div className="order-summary-card">
            <h2>📋 Order Summary</h2>
            {productSelections.length === 0 ? (
              <div className="empty-state" style={{ padding: '2rem 0' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '0.5rem' }}>🛒</span>
                <p style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>Select products from the form</p>
              </div>
            ) : (
              <>
                {productSelections.map(item => (
                  <div className="cart-item" key={item.id}>
                    <div className="cart-item-info">
                      <h4>{item.name}</h4>
                      <p>Qty: {item.quantity}</p>
                    </div>
                    <div className="cart-item-price">₱{(item.priceMin * item.quantity).toLocaleString()}+</div>
                  </div>
                ))}
                <div className="order-total">
                  <span>Estimated Total</span>
                  <span className="text-pink">₱{total.toLocaleString()}+</span>
                </div>
                <p style={{ fontSize: '0.78rem', color: 'var(--gray)', marginTop: '0.5rem' }}>
                  * Final price may vary based on design complexity
                </p>
              </>
            )}

            <hr className="divider" />
            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div><strong>📍 Location:</strong> Calixto Zaldivar St, San Jose, Antique</div>
              <div><strong>📞 Contact:</strong> 0930-225-0223</div>
              <div><strong>🕐 Hours:</strong> Mon–Sat, 8AM–5PM</div>
              <div><strong>💚 GCash:</strong> 0962-353-7072</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
