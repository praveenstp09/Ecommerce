export const validators = {
  required: (value) => {
    if (!value || (typeof value === 'string' && !value.trim())) {
      return 'This field is required';
    }
    return null;
  },

  phone: (value) => {
    if (!value) return 'Phone number is required';
    if (!/^[6-9]\d{9}$/.test(value)) return 'Enter a valid 10-digit mobile number';
    return null;
  },

  otp: (value) => {
    if (!value) return 'OTP is required';
    if (!/^\d{4}$/.test(value)) return 'OTP must be 4 digits';
    return null;
  },

  name: (value) => {
    if (!value || !value.trim()) return 'Name is required';
    if (value.trim().length < 2) return 'Name must be at least 2 characters';
    if (value.trim().length > 50) return 'Name must be under 50 characters';
    return null;
  },

  email: (value) => {
    if (!value) return null; // optional
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
    return null;
  },

  pincode: (value) => {
    if (!value) return 'Pincode is required';
    if (!/^[1-9]\d{5}$/.test(value)) return 'Enter a valid 6-digit pincode';
    return null;
  },

  address: (value) => {
    if (!value || !value.trim()) return 'Address is required';
    if (value.trim().length < 10) return 'Enter a complete address';
    return null;
  },

  cardNumber: (value) => {
    if (!value) return 'Card number is required';
    if (!/^\d{16}$/.test(value.replace(/\s/g, ''))) return 'Enter a valid 16-digit card number';
    return null;
  },

  cardExpiry: (value) => {
    if (!value) return 'Expiry date is required';
    if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(value)) return 'Enter date in MM/YY format';
    const [month, year] = value.split('/');
    const exp = new Date(2000 + parseInt(year), parseInt(month) - 1, 1);
    if (exp < new Date()) return 'Card has expired';
    return null;
  },

  cvv: (value) => {
    if (!value) return 'CVV is required';
    if (!/^\d{3,4}$/.test(value)) return 'Enter a valid CVV';
    return null;
  },

  upi: (value) => {
    if (!value) return 'UPI ID is required';
    if (!/^[\w.-]+@[\w]+$/.test(value)) return 'Enter a valid UPI ID (e.g. name@bank)';
    return null;
  },
};

export const validateForm = (fields, rules) => {
  const errors = {};
  for (const [field, validate] of Object.entries(rules)) {
    const error = validate(fields[field]);
    if (error) errors[field] = error;
  }
  return { isValid: Object.keys(errors).length === 0, errors };
};
