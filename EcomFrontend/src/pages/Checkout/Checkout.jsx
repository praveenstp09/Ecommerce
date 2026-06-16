import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { orderService } from '../../services/orderService';
import { formatPrice } from '../../utils/formatCurrency';
// import { PAYMENT_METHODS } from '../../utils/constants';
import { validators, validateForm } from '../../utils/validators';
import Loader from '../../components/common/Loader/Loader';
import { SlideUp } from '../../components/animations/SlideUp';
import styles from './Checkout.module.css';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, totals, clearCart } = useCart();

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    navigate('/cart');
  }

  // Address State
  const [selectedAddressId, setSelectedAddressId] = useState(
    user?.addresses && user.addresses.length > 0 ? user.addresses[0].id : 'new'
  );

  const [newAddress, setNewAddress] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const [addressErrors, setAddressErrors] = useState({});

  // Checkout Status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Input Changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
    if (addressErrors[name]) {
      setAddressErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  /*
  // Commented out payment handlers from screenshots
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === 'cardNumber') {
      val = value.replace(/\D/g, '').substring(0, 16);
      val = val.replace(/(\d{4})(?=\d)/g, '$1 ');
    } else if (name === 'cardExpiry') {
      val = value.replace(/\D/g, '').substring(0, 4);
      if (val.length >= 2) {
        val = val.substring(0, 2) + '/' + val.substring(2);
      }
    } else if (name === 'cvv') {
      val = value.replace(/\D/g, '').substring(0, 4);
    }
    setCardDetails((prev) => ({ ...prev, [name]: val }));
    if (paymentErrors[name]) {
      setPaymentErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleUpiChange = (e) => {
    setUpiId(e.target.value);
    if (paymentErrors.upi) {
      setPaymentErrors((prev) => ({ ...prev, upi: null }));
    }
  };
  */

  // Submission validation
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validate Address
    if (selectedAddressId === 'new') {
      const addressRules = {
        name: validators.name,
        phone: validators.phone,
        line1: validators.address,
        city: validators.required,
        state: validators.required,
        pincode: validators.pincode,
      };

      const { isValid, errors } = validateForm(newAddress, addressRules);
      if (!isValid) {
        setAddressErrors(errors);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    const finalAddress =
      selectedAddressId === 'new'
        ? newAddress
        : user.addresses.find((addr) => addr.id === selectedAddressId);

    // 2. Place Order
    setIsSubmitting(true);

    const orderData = {
      paymentMethod: "razorpay",
      items: cartItems,
      subtotal: totals.subtotal,
      tax: totals.tax,
      shipping: totals.shipping,
      discount: totals.discount,
      total: totals.total,
      address: finalAddress,
    };

    try {
      handlePayment(orderData, finalAddress);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const handlePayment = (orderData, finalAddress) => {
    const options = {
      key: "rzp_test_TOfj0KQyTHNu8h",
      amount: Math.round(totals.total * 100),
      currency: "INR",
      name: "Ecommerce",
      description: "Order Payment",
      handler: async function (response) {
        console.log("Payment Success:", response);
        try {
          const result = await orderService.placeOrder(orderData);
          if (result.success) {
            clearCart();
            navigate(`/order-success?id=${result.order.id}`);
          } else {
            alert("Payment succeeded, but failed to save order to database.");
            setIsSubmitting(false);
          }
        } catch (err) {
          console.error("Order placement failed:", err);
          alert("Payment succeeded, but failed to save order to database. Error: " + err.message);
          setIsSubmitting(false);
        }
      },
      modal: {
        ondismiss: () => {
          setIsSubmitting(false);
        },
      },
      prefill: {
        name: user?.name || "Guest",
        contact: user?.phone || "9999999999",
      },
      theme: {
        color: "#1a3a38",
      },
    };

    const rzp = new window.Razorpay(options);

    // PAYMENT FAILURE HANDLING
    rzp.on("payment.failed", function (response) {
      console.log("Payment Failed:", response);
      alert("Payment Failed");
      setIsSubmitting(false);
    });

    rzp.open();
  };



  return (
    <div className={`${styles.checkoutWrapper} container`}>
      {isSubmitting && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loadingBox}>
            <Loader size="lg" />
            <h3>Processing Payment...</h3>
            <p>Please do not refresh the page or click back.</p>
          </div>
        </div>
      )}

      <SlideUp>
        <h1 className={styles.pageTitle}>Secure Checkout</h1>
      </SlideUp>

      <form onSubmit={handleSubmit} className={styles.layout}>
        {/* Left Column: Form Details */}
        <div className={styles.detailsColumn}>
          {/* Step 1: Shipping Address */}
          <div className={styles.sectionCard}>
            <div className={styles.sectionHeader}>
              <span className={styles.stepNum}>1</span>
              <h2>Delivery Address</h2>
            </div>

            {/* Saved Addresses list */}
            {user?.addresses && user.addresses.length > 0 && (
              <div className={styles.savedAddresses}>
                {user.addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`${styles.addressLabel} ${
                      selectedAddressId === addr.id ? styles.addressActive : ''
                    }`}
                  >
                    <input
                      type="radio"
                      name="selected-address"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className={styles.radioInput}
                    />
                    <div className={styles.addressInfo}>
                      <span className={styles.addressName}>{addr.name}</span>
                      <span className={styles.addressType}>{addr.type}</span>
                      <p className={styles.addressText}>
                        {addr.line1}, {addr.line2 && `${addr.line2}, `}
                        {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                      </p>
                      <span className={styles.addressPhone}>📞 {addr.phone}</span>
                    </div>
                  </label>
                ))}
              </div>
            )}

            <label
              className={`${styles.addressLabel} ${
                selectedAddressId === 'new' ? styles.addressActive : ''
              }`}
            >
              <input
                type="radio"
                name="selected-address"
                value="new"
                checked={selectedAddressId === 'new'}
                onChange={() => setSelectedAddressId('new')}
                className={styles.radioInput}
              />
              <div className={styles.addressInfo}>
                <span className={styles.addressName}>➕ Add New Address</span>
                <p className={styles.addressText}>Enter a new shipping destination</p>
              </div>
            </label>

            {/* New Address Input Fields */}
            <AnimatePresence>
              {selectedAddressId === 'new' && (
                <motion.div
                  className={styles.addressFormFields}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="name-input">Full Name</label>
                      <input
                        id="name-input"
                        type="text"
                        name="name"
                        value={newAddress.name}
                        onChange={handleAddressChange}
                        className={addressErrors.name ? styles.inputError : ''}
                      />
                      {addressErrors.name && (
                        <span className={styles.errorText}>{addressErrors.name}</span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="phone-input">Phone Number</label>
                      <input
                        id="phone-input"
                        type="tel"
                        name="phone"
                        value={newAddress.phone}
                        onChange={handleAddressChange}
                        className={addressErrors.phone ? styles.inputError : ''}
                      />
                      {addressErrors.phone && (
                        <span className={styles.errorText}>{addressErrors.phone}</span>
                      )}
                    </div>
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="line1-input">Flat, House no., Building, Street</label>
                    <input
                      id="line1-input"
                      type="text"
                      name="line1"
                      value={newAddress.line1}
                      onChange={handleAddressChange}
                      className={addressErrors.line1 ? styles.inputError : ''}
                    />
                    {addressErrors.line1 && (
                      <span className={styles.errorText}>{addressErrors.line1}</span>
                    )}
                  </div>

                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="line2-input">Area, Colony, Road, Sector, Landmark (Optional)</label>
                    <input
                      id="line2-input"
                      type="text"
                      name="line2"
                      value={newAddress.line2}
                      onChange={handleAddressChange}
                    />
                  </div>

                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="city-input">City</label>
                      <input
                        id="city-input"
                        type="text"
                        name="city"
                        value={newAddress.city}
                        onChange={handleAddressChange}
                        className={addressErrors.city ? styles.inputError : ''}
                      />
                      {addressErrors.city && (
                        <span className={styles.errorText}>{addressErrors.city}</span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="state-input">State</label>
                      <input
                        id="state-input"
                        type="text"
                        name="state"
                        value={newAddress.state}
                        onChange={handleAddressChange}
                        className={addressErrors.state ? styles.inputError : ''}
                      />
                      {addressErrors.state && (
                        <span className={styles.errorText}>{addressErrors.state}</span>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="pincode-input">Pincode (6-digit)</label>
                      <input
                        id="pincode-input"
                        type="text"
                        name="pincode"
                        value={newAddress.pincode}
                        onChange={handleAddressChange}
                        className={addressErrors.pincode ? styles.inputError : ''}
                      />
                      {addressErrors.pincode && (
                        <span className={styles.errorText}>{addressErrors.pincode}</span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>


        </div>

        {/* Right Column: Summaries */}
        <div className={styles.summaryColumn}>
          {/* Items Summary list */}
          <div className={styles.summaryCard}>
            <h3 className={styles.cardTitle}>Items in Order</h3>
            <div className={styles.itemsList}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                  <img src={item.image} alt={item.name} className={styles.orderItemImg} />
                  <div className={styles.orderItemMeta}>
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity} | {formatPrice(item.price)}</p>
                  </div>
                  <span className={styles.orderItemTotal}>
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout Totals Summary */}
          <div className={styles.summaryCard}>
            <h3 className={styles.cardTitle}>Bill Details</h3>
            <div className={styles.totalsTable}>
              <div className={styles.row}>
                <span>Subtotal</span>
                <span>{formatPrice(totals.subtotal)}</span>
              </div>
              <div className={styles.row}>
                <span>Delivery Charges</span>
                <span>
                  {totals.shipping === 0 ? 'FREE' : formatPrice(totals.shipping)}
                </span>
              </div>
              <div className={styles.row}>
                <span>Estimated Taxes (18%)</span>
                <span>{formatPrice(totals.tax)}</span>
              </div>

              {totals.discount > 0 && (
                <div className={`${styles.row} ${styles.discountRow}`}>
                  <span>Discounts applied</span>
                  <span>-{formatPrice(totals.discount)}</span>
                </div>
              )}

              <div className={styles.divider}></div>
              <div className={`${styles.row} ${styles.totalRow}`}>
                <span>Total Payable</span>
                <span>{formatPrice(totals.total)}</span>
              </div>
            </div>
          </div>

          <button type="submit" className={styles.placeOrderBtn}>
            Place Order &amp; Pay ({formatPrice(totals.total)})
          </button>
        </div>
      </form>


    </div>
  );
};

export default Checkout;
