import React, { useState } from 'react';
import styles from './Settings.module.css';

function Settings() {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      desktop: false,
      mobile: true
    },
    privacy: {
      profileVisibility: 'public',
      showEmail: true,
      showPhone: false
    },
    preferences: {
      language: 'English',
      timezone: 'UTC-5',
      theme: 'light'
    }
  });

  const handleNotificationChange = (type) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handlePrivacyChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [field]: value
      }
    }));
  };

  const handlePreferenceChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [field]: value
      }
    }));
  };

  return (
    <div className={styles.container}>
      <h1>Settings</h1>
      
      <section className={styles.section}>
        <h2>Notifications</h2>
        <div className={styles.settingGroup}>
          <div className={styles.setting}>
            <label>
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={() => handleNotificationChange('email')}
              />
              Email Notifications
            </label>
          </div>
          <div className={styles.setting}>
            <label>
              <input
                type="checkbox"
                checked={settings.notifications.desktop}
                onChange={() => handleNotificationChange('desktop')}
              />
              Desktop Notifications
            </label>
          </div>
          <div className={styles.setting}>
            <label>
              <input
                type="checkbox"
                checked={settings.notifications.mobile}
                onChange={() => handleNotificationChange('mobile')}
              />
              Mobile Notifications
            </label>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Privacy</h2>
        <div className={styles.settingGroup}>
          <div className={styles.setting}>
            <label>Profile Visibility</label>
            <select
              value={settings.privacy.profileVisibility}
              onChange={(e) => handlePrivacyChange('profileVisibility', e.target.value)}
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
              <option value="connections">Connections Only</option>
            </select>
          </div>
          <div className={styles.setting}>
            <label>
              <input
                type="checkbox"
                checked={settings.privacy.showEmail}
                onChange={(e) => handlePrivacyChange('showEmail', e.target.checked)}
              />
              Show Email to Others
            </label>
          </div>
          <div className={styles.setting}>
            <label>
              <input
                type="checkbox"
                checked={settings.privacy.showPhone}
                onChange={(e) => handlePrivacyChange('showPhone', e.target.checked)}
              />
              Show Phone Number
            </label>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Preferences</h2>
        <div className={styles.settingGroup}>
          <div className={styles.setting}>
            <label>Language</label>
            <select
              value={settings.preferences.language}
              onChange={(e) => handlePreferenceChange('language', e.target.value)}
            >
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
          <div className={styles.setting}>
            <label>Timezone</label>
            <select
              value={settings.preferences.timezone}
              onChange={(e) => handlePreferenceChange('timezone', e.target.value)}
            >
              <option value="UTC-8">Pacific Time (UTC-8)</option>
              <option value="UTC-5">Eastern Time (UTC-5)</option>
              <option value="UTC+0">UTC</option>
              <option value="UTC+1">Central European Time (UTC+1)</option>
            </select>
          </div>
          <div className={styles.setting}>
            <label>Theme</label>
            <select
              value={settings.preferences.theme}
              onChange={(e) => handlePreferenceChange('theme', e.target.value)}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="system">System Default</option>
            </select>
          </div>
        </div>
      </section>

      <div className={styles.actions}>
        <button className={styles.saveButton}>Save Changes</button>
        <button className={styles.resetButton}>Reset to Defaults</button>
      </div>
    </div>
  );
}

export default Settings;