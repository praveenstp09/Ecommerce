import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { validators, validateForm } from '../../utils/validators';
import { SlideUp } from "../../components/animations/SlideUp";
import styles from './Profile.module.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, updateUser, addAddress, deleteAddress, logout } = useAuth();
  
  // Navigation Tabs
  const [activeTab, setActiveTab] = useState('details');

  // Edit User Details State
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  // Add Address Modal / Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'Home', // Home, Work, Other
    name: '',
    phone: '',
    line1: '',
    line2: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [addressErrors, setAddressErrors] = useState({});

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
    if (profileErrors[name]) {
      setProfileErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
    if (addressErrors[name]) {
      setAddressErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  // Submit Profile update
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const rules = {
      name: validators.name,
      email: validators.email,
      phone: validators.phone,
    };

    const { isValid, errors } = validateForm(profileData, rules);
    if (!isValid) {
      setProfileErrors(errors);
      return;
    }

    updateUser(profileData);
    setUpdateSuccess(true);
    setTimeout(() => setUpdateSuccess(false), 3000);
  };

  // Submit Add Address
  const handleAddAddressSubmit = (e) => {
    e.preventDefault();
    const rules = {
      name: validators.name,
      phone: validators.phone,
      line1: validators.address,
      city: validators.required,
      state: validators.required,
      pincode: validators.pincode,
    };

    const { isValid, errors } = validateForm(newAddress, rules);
    if (!isValid) {
      setAddressErrors(errors);
      return;
    }

    addAddress(newAddress);
    setShowAddressForm(false);
    setNewAddress({
      type: 'Home',
      name: '',
      phone: '',
      line1: '',
      line2: '',
      city: '',
      state: '',
      pincode: '',
    });
    setAddressErrors({});
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className={`${styles.profileWrapper} container`}>
      <SlideUp>
        <h1 className={styles.pageTitle}>Account Profile</h1>
      </SlideUp>

      <div className={styles.layout}>
        {/* Left Side: Avatar & Navigation list */}
        <aside className={styles.sidebar}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>
              {user?.name ? user.name.charAt(0).toUpperCase() : '👤'}
            </div>
            <h3>{user?.name || 'Nexus User'}</h3>
            <p>{user?.phone}</p>
            {user?.email && <p className={styles.emailText}>{user.email}</p>}
          </div>

          <div className={styles.menuList}>
            <button
              className={`${styles.menuItem} ${activeTab === 'details' ? styles.menuActive : ''}`}
              onClick={() => setActiveTab('details')}
            >
              👤 Profile Details
            </button>
            <button
              className={`${styles.menuItem} ${activeTab === 'addresses' ? styles.menuActive : ''}`}
              onClick={() => setActiveTab('addresses')}
            >
              📍 Saved Addresses
            </button>
            <button className={`${styles.menuItem} ${styles.logoutItem}`} onClick={handleLogout}>
              🚪 Logout
            </button>
          </div>
        </aside>

        {/* Right Side: Tab Contents panels */}
        <main className={styles.mainPanel}>
          {activeTab === 'details' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.tabContentCard}
            >
              <h2 className={styles.sectionTitle}>Edit Profile Info</h2>
              <form onSubmit={handleUpdateProfile} className={styles.form}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="name-input">Full Name</label>
                    <input
                      id="name-input"
                      type="text"
                      name="name"
                      value={profileData.name}
                      onChange={handleProfileChange}
                      className={profileErrors.name ? styles.inputError : ''}
                    />
                    {profileErrors.name && (
                      <span className={styles.errorText}>{profileErrors.name}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email-input">Email Address</label>
                    <input
                      id="email-input"
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleProfileChange}
                      className={profileErrors.email ? styles.inputError : ''}
                    />
                    {profileErrors.email && (
                      <span className={styles.errorText}>{profileErrors.email}</span>
                    )}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone-input">Phone Number</label>
                    <input
                      id="phone-input"
                      type="tel"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleProfileChange}
                      disabled
                      className={styles.disabledInput}
                    />
                    <span className={styles.inputTip}>Phone number cannot be changed.</span>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button type="submit" className={styles.saveBtn}>
                    Save Changes
                  </button>
                  {updateSuccess && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={styles.successMessage}
                    >
                      ✓ Profile updated successfully!
                    </motion.span>
                  )}
                </div>
              </form>
            </motion.div>
          )}

          {activeTab === 'addresses' && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className={styles.tabContentCard}
            >
              <div className={styles.addressesHeader}>
                <h2 className={styles.sectionTitle}>Saved Shipping Addresses</h2>
                <button
                  onClick={() => setShowAddressForm(!showAddressForm)}
                  className={styles.addAddressBtn}
                >
                  {showAddressForm ? 'Cancel' : '➕ Add Address'}
                </button>
              </div>

              {/* Add Address Form Panel */}
              <AnimatePresence>
                {showAddressForm && (
                  <motion.div
                    className={styles.addressFormBlock}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <form onSubmit={handleAddAddressSubmit} className={styles.addressForm}>
                      <div className={styles.typeSelector}>
                        <span>Address Type:</span>
                        {['Home', 'Work', 'Other'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            className={`${styles.typeBtn} ${
                              newAddress.type === type ? styles.typeBtnActive : ''
                            }`}
                            onClick={() => setNewAddress((prev) => ({ ...prev, type }))}
                          >
                            {type}
                          </button>
                        ))}
                      </div>

                      <div className={styles.formGrid}>
                        <div className={styles.formGroup}>
                          <label htmlFor="address-name">Recipient Name</label>
                          <input
                            id="address-name"
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
                          <label htmlFor="address-phone">Recipient Phone</label>
                          <input
                            id="address-phone"
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

                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                          <label htmlFor="address-line1">Address (Line 1)</label>
                          <input
                            id="address-line1"
                            type="text"
                            name="line1"
                            placeholder="Flat, House no., Street Name"
                            value={newAddress.line1}
                            onChange={handleAddressChange}
                            className={addressErrors.line1 ? styles.inputError : ''}
                          />
                          {addressErrors.line1 && (
                            <span className={styles.errorText}>{addressErrors.line1}</span>
                          )}
                        </div>

                        <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                          <label htmlFor="address-line2">Address (Line 2 — Optional)</label>
                          <input
                            id="address-line2"
                            type="text"
                            name="line2"
                            placeholder="Landmark, Area, Sector"
                            value={newAddress.line2}
                            onChange={handleAddressChange}
                          />
                        </div>

                        <div className={styles.formGroup}>
                          <label htmlFor="address-city">City</label>
                          <input
                            id="address-city"
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
                          <label htmlFor="address-state">State</label>
                          <input
                            id="address-state"
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
                          <label htmlFor="address-pincode">Pincode</label>
                          <input
                            id="address-pincode"
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

                      <button type="submit" className={styles.saveAddressBtn}>
                        Save Address
                      </button>
                    </form>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Addresses List Display */}
              <div className={styles.addressesList}>
                {user?.addresses && user.addresses.length > 0 ? (
                  user.addresses.map((addr) => (
                    <div key={addr.id} className={styles.addressCard}>
                      <div className={styles.addressCardHeader}>
                        <span className={styles.addressTypeName}>{addr.type}</span>
                        <button
                          onClick={() => deleteAddress(addr.id)}
                          className={styles.deleteAddressBtn}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                      <div className={styles.addressCardBody}>
                        <strong>{addr.name}</strong>
                        <p>
                          {addr.line1}, {addr.line2 && `${addr.line2}, `}
                          {addr.city}, {addr.state} — <strong>{addr.pincode}</strong>
                        </p>
                        <span>📞 {addr.phone}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className={styles.noAddresses}>No saved addresses found. Add one above!</p>
                )}
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Profile;
