import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import styles from './ChangePassword.module.css';

function ChangePassword() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters long';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your new password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Add password change logic here
      console.log('Password change submitted');
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Change Password</h1>
        <p className={styles.description}>
          Please enter your current password and choose a new password to update your credentials.
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Current Password</label>
            <div className={styles.passwordInput}>
              <input
                type={showPasswords.current ? 'text' : 'password'}
                value={formData.currentPassword}
                onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                className={errors.currentPassword ? styles.error : ''}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('current')}
                className={styles.togglePassword}
              >
                {showPasswords.current ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.currentPassword && (
              <span className={styles.errorMessage}>{errors.currentPassword}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>New Password</label>
            <div className={styles.passwordInput}>
              <input
                type={showPasswords.new ? 'text' : 'password'}
                value={formData.newPassword}
                onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                className={errors.newPassword ? styles.error : ''}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('new')}
                className={styles.togglePassword}
              >
                {showPasswords.new ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.newPassword && (
              <span className={styles.errorMessage}>{errors.newPassword}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Confirm New Password</label>
            <div className={styles.passwordInput}>
              <input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                className={errors.confirmPassword ? styles.error : ''}
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility('confirm')}
                className={styles.togglePassword}
              >
                {showPasswords.confirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className={styles.errorMessage}>{errors.confirmPassword}</span>
            )}
          </div>

          <div className={styles.passwordRequirements}>
            <h3>Password Requirements:</h3>
            <ul>
              <li>At least 8 characters long</li>
              <li>Contains at least one uppercase letter</li>
              <li>Contains at least one number</li>
              <li>Contains at least one special character</li>
            </ul>
          </div>

          <div className={styles.actions}>
            <button type="submit" className={styles.submitButton}>
              Change Password
            </button>
            <button type="button" className={styles.cancelButton}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ChangePassword;