// Content Script for CTRL-S Extension

class ContentManager {
    constructor() {
        this.lastCopiedText = '';
        this.init();
    }

    async init() {
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Monitor copy events - always capture them
        document.addEventListener('copy', (e) => {
            this.handleCopyEvent(e);
        });


    }





    handleCopyEvent(e) {
        try {
            let copiedText = '';
            
            // Method 1: Get text from clipboard data (most reliable)
            if (e.clipboardData && e.clipboardData.getData) {
                copiedText = e.clipboardData.getData('text/plain');
            }
            
            // Method 2: Get selected text as fallback
            if (!copiedText || !copiedText.trim()) {
                copiedText = window.getSelection().toString();
            }
            
            // Method 3: Try to read from clipboard API as last resort
            if (!copiedText || !copiedText.trim()) {
                this.tryGetClipboardContent().then(text => {
                    if (text && text !== this.lastCopiedText) {
                        this.saveClipboardText(text);
                    }
                });
                return;
            }
            
            // Save the copied text if it's new
            if (copiedText && copiedText.trim() && copiedText !== this.lastCopiedText) {
                this.lastCopiedText = copiedText.trim();
                this.saveClipboardText(copiedText.trim());
            }
            
        } catch (error) {
            console.error('Error handling copy event:', error);
        }
    }

    async tryGetClipboardContent() {
        try {
            const text = await navigator.clipboard.readText();
            return text;
        } catch (error) {
            // Clipboard access might be restricted
            return null;
        }
    }



    async saveClipboardText(text) {
        try {
            // Send to background script
            const response = await chrome.runtime.sendMessage({
                action: 'saveClipboard',
                text: text,
                url: window.location.href
            });
            
            if (response && response.success) {
                this.showCopyFeedback();
            }
        } catch (error) {
            console.error('Error saving clipboard text:', error);
            this.showError('Error saving text');
        }
    }

    showCopyFeedback() {
        this.showNotification('Saved to CTRL-S', '#00d4ff');
    }

    showNotification(message, backgroundColor = '#00d4ff') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.ctrl-s-notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'ctrl-s-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${backgroundColor};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            z-index: 10000;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            max-width: 300px;
            word-wrap: break-word;
            animation: slideIn 0.3s ease;
        `;

        // Add animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);

        document.body.appendChild(notification);

        // Remove notification after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease';
                notification.style.transform = 'translateX(100%)';
                notification.style.opacity = '0';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }
        }, 3000);
    }

    showError(message) {
        this.showNotification(message, '#ff6b6b');
    }
}

// Initialize content manager when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ContentManager();
    });
} else {
    new ContentManager();
}

// Inject CSS for better text selection highlighting
const style = document.createElement('style');
style.textContent = `
    ::selection {
        background: rgba(0, 212, 255, 0.3);
    }
    ::-moz-selection {
        background: rgba(0, 212, 255, 0.3);
    }
`;
document.head.appendChild(style); 