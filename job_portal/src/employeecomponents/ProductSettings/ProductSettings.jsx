import React, { useState } from 'react';
import styles from './ProductSettings.module.css';

function ProductSettings() {
  const [settings, setSettings] = useState({
    general: {
      productName: 'FutureFit Pro',
      version: '2.5.0',
      environment: 'production'
    },
    features: {
      analytics: true,
      automation: true,
      customReports: false,
      apiAccess: true
    },
    integration: {
      slackWebhook: 'https://hooks.slack.com/services/xxx',
      githubToken: '**********************',
      jiraApiKey: '**********************'
    }
  });

  const handleGeneralChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      general: {
        ...prev.general,
        [field]: value
      }
    }));
  };

  const handleFeatureToggle = (feature) => {
    setSettings(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature]
      }
    }));
  };

  const handleIntegrationChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      integration: {
        ...prev.integration,
        [field]: value
      }
    }));
  };

  return (
    <div className={styles.container}>
      <h1>Product Settings</h1>

      <section className={styles.section}>
        <h2>General Settings</h2>
        <div className={styles.settingGroup}>
          <div className={styles.setting}>
            <label>Product Name</label>
            <input
              type="text"
              value={settings.general.productName}
              onChange={(e) => handleGeneralChange('productName', e.target.value)}
            />
          </div>
          <div className={styles.setting}>
            <label>Version</label>
            <input
              type="text"
              value={settings.general.version}
              disabled
            />
          </div>
          <div className={styles.setting}>
            <label>Environment</label>
            <select
              value={settings.general.environment}
              onChange={(e) => handleGeneralChange('environment', e.target.value)}
            >
              <option value="development">Development</option>
              <option value="staging">Staging</option>
              <option value="production">Production</option>
            </select>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Feature Toggles</h2>
        <div className={styles.settingGroup}>
          <div className={styles.setting}>
            <label>
              <input
                type="checkbox"
                checked={settings.features.analytics}
                onChange={() => handleFeatureToggle('analytics')}
              />
              Analytics
            </label>
            <span className={styles.featureDescription}>
              Enable detailed usage analytics and reporting
            </span>
          </div>
          <div className={styles.setting}>
            <label>
              <input
                type="checkbox"
                checked={settings.features.automation}
                onChange={() => handleFeatureToggle('automation')}
              />
              Automation
            </label>
            <span className={styles.featureDescription}>
              Enable workflow automation features
            </span>
          </div>
          <div className={styles.setting}>
            <label>
              <input
                type="checkbox"
                checked={settings.features.customReports}
                onChange={() => handleFeatureToggle('customReports')}
              />
              Custom Reports
            </label>
            <span className={styles.featureDescription}>
              Allow creation of custom report templates
            </span>
          </div>
          <div className={styles.setting}>
            <label>
              <input
                type="checkbox"
                checked={settings.features.apiAccess}
                onChange={() => handleFeatureToggle('apiAccess')}
              />
              API Access
            </label>
            <span className={styles.featureDescription}>
              Enable API access for external integrations
            </span>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <h2>Integrations</h2>
        <div className={styles.settingGroup}>
          <div className={styles.setting}>
            <label>Slack Webhook URL</label>
            <input
              type="text"
              value={settings.integration.slackWebhook}
              onChange={(e) => handleIntegrationChange('slackWebhook', e.target.value)}
            />
          </div>
          <div className={styles.setting}>
            <label>GitHub Access Token</label>
            <input
              type="password"
              value={settings.integration.githubToken}
              onChange={(e) => handleIntegrationChange('githubToken', e.target.value)}
            />
          </div>
          <div className={styles.setting}>
            <label>Jira API Key</label>
            <input
              type="password"
              value={settings.integration.jiraApiKey}
              onChange={(e) => handleIntegrationChange('jiraApiKey', e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className={styles.actions}>
        <button className={styles.saveButton}>Save Changes</button>
        <button className={styles.testButton}>Test Integrations</button>
      </div>
    </div>
  );
}

export default ProductSettings;