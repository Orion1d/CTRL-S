// CTRL-S Settings Manager
class SettingsManager {
    constructor() {
        this.settings = {};
        this.init();
    }

    async init() {
        await this.loadSettings();
        this.populateForm();
        this.setupEventListeners();
    }

    async loadSettings() {
        try {
            const data = await chrome.storage.local.get(['settings']);
            this.settings = data.settings || this.getDefaultSettings();
        } catch (error) {
            console.error('Error loading settings:', error);
            this.settings = this.getDefaultSettings();
        }
    }

    getDefaultSettings() {
        return {
            maxClipboardItems: 50,
            autoSaveClipboard: true
        };
    }

    populateForm() {
        // Clipboard settings
        const maxClipboardItems = document.getElementById('maxClipboardItems');
        if (maxClipboardItems) {
            maxClipboardItems.value = this.settings.maxClipboardItems || 50;
        }

        const autoSaveClipboard = document.getElementById('autoSaveClipboard');
        if (autoSaveClipboard) {
            this.updateToggleButton(autoSaveClipboard, this.settings.autoSaveClipboard !== false);
        }
    }

    setupEventListeners() {
        // Save settings
        const saveBtn = document.getElementById('saveSettings');
        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveSettings();
            });
        }

        // Reset settings
        const resetBtn = document.getElementById('resetSettings');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetSettings();
            });
        }

        // Clear all data
        const clearAllBtn = document.getElementById('clearAllData');
        if (clearAllBtn) {
            clearAllBtn.addEventListener('click', () => {
                this.clearAllData();
            });
        }

        // Max clipboard items change
        const maxClipboardItems = document.getElementById('maxClipboardItems');
        if (maxClipboardItems) {
            maxClipboardItems.addEventListener('change', (e) => {
                this.settings.maxClipboardItems = parseInt(e.target.value) || 50;
            });
        }

        // Auto save clipboard toggle
        const autoSaveClipboard = document.getElementById('autoSaveClipboard');
        if (autoSaveClipboard) {
            autoSaveClipboard.addEventListener('click', () => {
                this.settings.autoSaveClipboard = !this.settings.autoSaveClipboard;
                this.updateToggleButton(autoSaveClipboard, this.settings.autoSaveClipboard);
            });
        }
    }

    async saveSettings() {
        try {
            await chrome.storage.local.set({ settings: this.settings });
            
            // Show success message
            this.showNotification('Settings saved successfully!', 'success');
            

            
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showNotification('Error saving settings', 'error');
        }
    }

    async resetSettings() {
        if (confirm('Are you sure you want to reset all settings to default values?')) {
            try {
                this.settings = this.getDefaultSettings();
                await chrome.storage.local.set({ settings: this.settings });
                
                // Repopulate form
                this.populateForm();
                
                this.showNotification('Settings reset to defaults', 'success');
                
            } catch (error) {
                console.error('Error resetting settings:', error);
                this.showNotification('Error resetting settings', 'error');
            }
        }
    }

    updateToggleButton(button, isEnabled) {
        if (isEnabled) {
            button.className = 'toggle-btn enabled';
            button.dataset.enabled = 'true';
            button.querySelector('.toggle-text').textContent = 'Enabled';
        } else {
            button.className = 'toggle-btn disabled';
            button.dataset.enabled = 'false';
            button.querySelector('.toggle-text').textContent = 'Disabled';
        }
    }

    async clearAllData() {
        if (confirm('Are you sure you want to clear ALL data? This will permanently delete all clipboard items and bookmarks. This action cannot be undone.')) {
            try {
                // Clear all data
                await chrome.storage.local.clear();
                
                // Reinitialize with default settings
                await chrome.storage.local.set({ 
                    settings: this.getDefaultSettings(),
                    clipboardItems: [],
                    bookmarkedItems: []
                });
                
                // Reload settings
                await this.loadSettings();
                this.populateForm();
                
                this.showNotification('All data cleared successfully', 'success');
                
            } catch (error) {
                console.error('Error clearing data:', error);
                this.showNotification('Error clearing data', 'error');
            }
        }
    }



    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `settings-notification ${type}`;
        notification.textContent = message;
        
        // Style the notification
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#f0fdf4' : type === 'error' ? '#fef2f2' : '#eff6ff'};
            color: ${type === 'success' ? '#166534' : type === 'error' ? '#dc2626' : '#1d4ed8'};
            border: 1px solid ${type === 'success' ? '#bbf7d0' : type === 'error' ? '#fecaca' : '#bfdbfe'};
            padding: 16px 20px;
            border-radius: 12px;
            font-size: 14px;
            font-weight: 500;
            z-index: 1000;
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
            max-width: 300px;
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Hide and remove notification
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize settings when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new SettingsManager();
}); 