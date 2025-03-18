import { useState } from 'react';
import { FiUser, FiMail, FiPhone, FiMapPin, FiLock, FiLogOut } from 'react-icons/fi';
import styles from './Profile.module.css';

const Profile = () => {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+1 234 567 8900',
    location: 'New York, USA',
    avatar: 'https://via.placeholder.com/150'
  });

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ ...profile });

  const handlePasswordChange = (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }
    // Handle password change logic here
    setShowPasswordModal(false);
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setProfile(editForm);
    setIsEditing(false);
  };

  const handleLogout = () => {
    if (window.confirm('Are you sure you want to logout?')) {
      // Handle logout logic here
      console.log('Logging out...');
    }
  };

  return (
    <div className={styles.profile}>
      <div className={styles.header}>
        <h1>Profile Settings</h1>
      </div>

      <div className={styles.content}>
        <div className={styles.profileCard}>
          <div className={styles.avatarSection}>
            <img src={profile.avatar} alt="Profile" className={styles.avatar} />
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className={styles.editButton}>
                Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleProfileUpdate} className={styles.form}>
              <div className={styles.formGroup}>
                <label>
                  <FiUser className={styles.icon} />
                  Name:
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  <FiMail className={styles.icon} />
                  Email:
                </label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  <FiPhone className={styles.icon} />
                  Phone:
                </label>
                <input
                  type="tel"
                  value={editForm.phone}
                  onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>
                  <FiMapPin className={styles.icon} />
                  Location:
                </label>
                <input
                  type="text"
                  value={editForm.location}
                  onChange={(e) => setEditForm({...editForm, location: e.target.value})}
                  required
                />
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.saveButton}>
                  Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setEditForm({...profile});
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.profileInfo}>
              <div className={styles.infoGroup}>
                <FiUser className={styles.icon} />
                <div>
                  <label>Name</label>
                  <p>{profile.name}</p>
                </div>
              </div>
              <div className={styles.infoGroup}>
                <FiMail className={styles.icon} />
                <div>
                  <label>Email</label>
                  <p>{profile.email}</p>
                </div>
              </div>
              <div className={styles.infoGroup}>
                <FiPhone className={styles.icon} />
                <div>
                  <label>Phone</label>
                  <p>{profile.phone}</p>
                </div>
              </div>
              <div className={styles.infoGroup}>
                <FiMapPin className={styles.icon} />
                <div>
                  <label>Location</label>
                  <p>{profile.location}</p>
                </div>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button
              onClick={() => setShowPasswordModal(true)}
              className={styles.changePasswordButton}
            >
              <FiLock /> Change Password
            </button>
            <button onClick={handleLogout} className={styles.logoutButton}>
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <h2>Change Password</h2>
            <form onSubmit={handlePasswordChange}>
              <div className={styles.formGroup}>
                <label>Current Password:</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({
                    ...passwordForm,
                    currentPassword: e.target.value
                  })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>New Password:</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value
                  })}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label>Confirm New Password:</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({
                    ...passwordForm,
                    confirmPassword: e.target.value
                  })}
                  required
                />
              </div>
              <div className={styles.modalActions}>
                <button type="submit" className={styles.saveButton}>
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false);
                    setPasswordForm({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: ''
                    });
                  }}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;