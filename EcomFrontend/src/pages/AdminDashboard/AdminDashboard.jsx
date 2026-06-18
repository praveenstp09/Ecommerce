import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { adminService } from '../../services/adminService';
import { productService } from '../../services/productService';
import AddProductModal from '../../components/AddProductModal/AddProductModal';
import Button from '../../components/common/Button/Button';
import styles from './AdminDashboard.module.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('orders'); // default to orders
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Fetch data depending on active tab
  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'users') {
        const data = await adminService.getUsers();
        setUsers(data);
      } else if (activeTab === 'products') {
        const data = await productService.getAllProducts();
        setProducts(data);
      } else if (activeTab === 'orders') {
        const data = await adminService.getAllOrders();
        setOrders(data);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const handleProductAdded = () => {
    fetchData(); // reload products
  };

  const handleStatusChange = async (orderId, newStatus, currentPaymentStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await adminService.updateOrderStatus(orderId, newStatus, currentPaymentStatus);
      // Refresh order list
      const updatedOrders = await adminService.getAllOrders();
      setOrders(updatedOrders);
    } catch (err) {
      setError(err.message || 'Failed to update order status.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handlePaymentStatusChange = async (orderId, currentOrderStatus, newPaymentStatus) => {
    setUpdatingOrderId(orderId);
    try {
      await adminService.updateOrderStatus(orderId, currentOrderStatus, newPaymentStatus);
      // Refresh order list
      const updatedOrders = await adminService.getAllOrders();
      setOrders(updatedOrders);
    } catch (err) {
      setError(err.message || 'Failed to update payment status.');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDeleteProduct = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      setLoading(true);
      setError('');
      try {
        await productService.deleteProduct(id);
        // Refresh product list
        const updatedProducts = await productService.getAllProducts();
        setProducts(updatedProducts);
      } catch (err) {
        setError(err.message || 'Failed to delete product.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={`${styles.wrapper} container`}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Administration Panel</h1>
          <p className={styles.subtitle}>Manage users, catalog inventory, and customer orders</p>
        </div>
      </div>

      {/* Tabs Menu */}
      <div className={styles.tabs}>
        {[
          { id: 'orders', label: '📦 Orders Management', count: orders.length },
          { id: 'products', label: '🛍️ Catalog Inventory', count: products.length },
          { id: 'users', label: '👤 User Registry', count: users.length }
        ].map(tab => (
          <button
            key={tab.id}
            className={`${styles.tabBtn} ${activeTab === tab.id ? styles.activeTab : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
            {tab.count > 0 && <span className={styles.tabBadge}>{tab.count}</span>}
          </button>
        ))}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {/* Main Panel Content */}
      <div className={styles.panel}>
        {loading ? (
          <div className={styles.loader}>Loading panel details...</div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
            >
              {/* ── ORDERS TAB ── */}
              {activeTab === 'orders' && (
                <div className={styles.tableCard}>
                  {orders.length === 0 ? (
                    <p className={styles.empty}>No customer orders found in system.</p>
                  ) : (
                    <div className={styles.responsiveTable}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>Order ID</th>
                            <th>User ID</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total Amount</th>
                            <th>Order Status</th>
                            <th>Payment Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {orders.map(order => (
                            <tr key={order.id}>
                              <td className={styles.monoId}>{order.id.substring(0, 8)}...</td>
                              <td className={styles.monoId}>{order.userId.substring(0, 8)}...</td>
                              <td>{new Date(order.orderDate || order.date).toLocaleDateString()}</td>
                              <td>
                                <div className={styles.orderItemsCol}>
                                  {order.items.map((item, idx) => (
                                    <div key={idx} className={styles.orderItemRow}>
                                      <span>{item.name} (x{item.quantity})</span>
                                    </div>
                                  ))}
                                </div>
                              </td>
                              <td className={styles.priceCell}>₹{order.totalAmount || order.total}</td>
                              <td>
                                <select
                                  value={order.orderStatus || order.status}
                                  onChange={(e) => handleStatusChange(order.id, e.target.value, order.paymentStatus || order.paymentStatus)}
                                  className={styles.select}
                                  disabled={updatingOrderId === order.id}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Confirmed">Confirmed</option>
                                  <option value="Packed">Packed</option>
                                  <option value="Shipped">Shipped</option>
                                  <option value="Delivered">Delivered</option>
                                  <option value="Cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td>
                                <select
                                  value={order.paymentStatus}
                                  onChange={(e) => handlePaymentStatusChange(order.id, order.orderStatus || order.status, e.target.value)}
                                  className={styles.select}
                                  disabled={updatingOrderId === order.id}
                                >
                                  <option value="Pending">Pending</option>
                                  <option value="Paid">Paid</option>
                                  <option value="Refunded">Refunded</option>
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* ── PRODUCTS TAB ── */}
              {activeTab === 'products' && (
                <div className={styles.productsPanel}>
                  <div className={styles.panelAction}>
                    <Button onClick={() => setAddModalOpen(true)} className="shimmer-cta">
                      ＋ Add New Product
                    </Button>
                  </div>

                  <div className={styles.tableCard}>
                    {products.length === 0 ? (
                      <p className={styles.empty}>No products found in catalog.</p>
                    ) : (
                      <div className={styles.responsiveTable}>
                        <table className={`${styles.table} ${styles.productTable}`}>
                          <thead>
                            <tr>
                              <th>Image</th>
                              <th>Product Info</th>
                              <th>Category</th>
                              <th>Price</th>
                              <th>Stock</th>
                              <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {products.map(product => (
                              <tr key={product.id}>
                                <td>
                                  <img
                                    src={product.images?.[0] || 'https://via.placeholder.com/80'}
                                    alt={product.name}
                                    className={styles.productThumbnail}
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/80'; }}
                                  />
                                </td>
                                <td>
                                  <div className={styles.productMeta}>
                                    <span className={styles.productName}>{product.name}</span>
                                    <span className={styles.productBrand}>{product.brand}</span>
                                    {product.badge && <span className={styles.productBadge}>{product.badge}</span>}
                                  </div>
                                </td>
                                <td>
                                  <span className={styles.productCategory}>{product.category}</span>
                                </td>
                                <td className={styles.priceCell}>₹{product.price.toLocaleString('en-IN')}</td>
                                <td className={product.stock > 0 ? '' : styles.outOfStock}>
                                  {product.stock > 0 ? `${product.stock} items` : 'Out of Stock'}
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                  <button
                                    className={styles.deleteBtn}
                                    onClick={() => handleDeleteProduct(product.id, product.name)}
                                    title="Delete Product"
                                  >
                                    🗑️ Delete
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ── USERS TAB ── */}
              {activeTab === 'users' && (
                <div className={styles.tableCard}>
                  {users.length === 0 ? (
                    <p className={styles.empty}>No registered users in registry.</p>
                  ) : (
                    <div className={styles.responsiveTable}>
                      <table className={styles.table}>
                        <thead>
                          <tr>
                            <th>User ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Role</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map(user => (
                            <tr key={user.id}>
                              <td className={styles.monoId}>{user.id}</td>
                              <td className={styles.boldText}>{user.name}</td>
                              <td>{user.email || 'N/A'}</td>
                              <td>{user.phone}</td>
                              <td>
                                <span className={`${styles.role} ${user.role === 'admin' ? styles.adminRole : styles.customerRole}`}>
                                  {user.role}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      <AddProductModal
        isOpen={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onProductAdded={handleProductAdded}
      />
    </div>
  );
};

export default AdminDashboard;
