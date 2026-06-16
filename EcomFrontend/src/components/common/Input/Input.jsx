import { forwardRef } from 'react';
import styles from './Input.module.css';

const Input = forwardRef((
  {
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    className = '',
    inputClassName = '',
    type = 'text',
    fullWidth = true,
    size = 'md',
    ...props
  },
  ref
) => {
  const wrapperClass = [styles.wrapper, fullWidth ? styles.fullWidth : '', className].filter(Boolean).join(' ');
  const inputClass = [styles.input, styles[size], error ? styles.error : '', leftIcon ? styles.hasLeft : '', rightIcon ? styles.hasRight : '', inputClassName].filter(Boolean).join(' ');

  return (
    <div className={wrapperClass}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        {leftIcon && <span className={styles.leftIcon}>{leftIcon}</span>}
        <input ref={ref} type={type} className={inputClass} {...props} />
        {rightIcon && <span className={styles.rightIcon}>{rightIcon}</span>}
      </div>
      {error && <p className={styles.errorMsg}>{error}</p>}
      {helperText && !error && <p className={styles.helperText}>{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
