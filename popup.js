// CTRL-S Popup Manager - Grain Textbook Design
class PopupManager {
    constructor() {
        this.currentTab = 'clipboard';
        this.settings = {};
        this.floatingMenuOpenId = null;
        this.expandedItemId = null;
        this.searchQuery = '';
        this.clipboardItems = [];
        this.bookmarkedItems = [];
        this.init();
    }

    async init() {
        await this.loadSettings();
        this.setupEventListeners();
        this.loadData();
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

    setupEventListeners() {
        // Tab switching
        document.getElementById('clipboardTab').addEventListener('click', () => {
            this.switchTab('clipboard');
        });

        document.getElementById('bookmarksTab').addEventListener('click', () => {
            this.switchTab('bookmarks');
        });

        // Settings button
        document.getElementById('settingsBtn').addEventListener('click', () => {
            chrome.runtime.openOptionsPage();
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const clearSearchBtn = document.getElementById('clearSearch');

        searchInput.addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        clearSearchBtn.addEventListener('click', () => {
            this.clearSearch();
        });

        // Clear all buttons
        document.getElementById('clearAllClipboard').addEventListener('click', () => {
            this.clearAll('clipboard');
        });

        document.getElementById('clearAllBookmarks').addEventListener('click', () => {
            this.clearAll('bookmarks');
        });

        // Close floating menu on click outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.floating-menu') && !e.target.closest('.action-btn')) {
                this.closeFloatingMenu();
            }
        });
    }

    handleSearch(query) {
        this.searchQuery = query.toLowerCase().trim();
        const clearSearchBtn = document.getElementById('clearSearch');
        
        if (this.searchQuery) {
            clearSearchBtn.style.display = 'flex';
        } else {
            clearSearchBtn.style.display = 'none';
        }
        
        this.filterAndDisplayItems();
    }

    clearSearch() {
        document.getElementById('searchInput').value = '';
        this.searchQuery = '';
        document.getElementById('clearSearch').style.display = 'none';
        this.filterAndDisplayItems();
    }

    filterAndDisplayItems() {
        if (this.currentTab === 'clipboard') {
            const filteredItems = this.clipboardItems.filter(item => 
                item.text.toLowerCase().includes(this.searchQuery) ||
                (item.url && item.url.toLowerCase().includes(this.searchQuery))
            );
            this.displayClipboardItems(filteredItems);
        } else {
            const filteredItems = this.bookmarkedItems.filter(item => 
                item.text.toLowerCase().includes(this.searchQuery) ||
                (item.url && item.url.toLowerCase().includes(this.searchQuery))
            );
            this.displayBookmarkedItems(filteredItems);
        }
    }

    switchTab(tabName) {
        this.currentTab = tabName;
        
        // Update tab buttons
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.getElementById(tabName + 'Tab').classList.add('active');
        
        // Update sections
        document.querySelectorAll('.section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById(tabName + 'Section').classList.add('active');
        
        // Load and display data for the selected tab
        this.loadData();
    }

    async loadData() {
        try {
            const data = await chrome.storage.local.get(['clipboardItems', 'bookmarkedItems']);
            
            this.clipboardItems = data.clipboardItems || [];
            this.bookmarkedItems = data.bookmarkedItems || [];
            
            // Update counts
            this.updateCounts();
            
            // Display items based on current tab
            if (this.currentTab === 'clipboard') {
                this.displayClipboardItems(this.clipboardItems);
            } else {
                this.displayBookmarkedItems(this.bookmarkedItems);
            }
        } catch (error) {
            console.error('Error loading data:', error);
            this.showNotification('Error loading data', 'error');
        }
    }

    updateCounts() {
        document.getElementById('clipboardCount').textContent = this.clipboardItems.length;
        document.getElementById('bookmarksCount').textContent = this.bookmarkedItems.length;
    }

    displayClipboardItems(items) {
        const container = document.getElementById('clipboardItems');
        const emptyState = document.getElementById('clipboardEmptyState');
        
        if (items.length === 0) {
            container.innerHTML = '';
            container.appendChild(emptyState);
            return;
        }
        
        container.innerHTML = '';
        items.forEach(item => {
            const itemElement = this.createItemElement(item, 'clipboard');
            container.appendChild(itemElement);
        });
    }

    displayBookmarkedItems(items) {
        const container = document.getElementById('bookmarksItems');
        const emptyState = document.getElementById('bookmarksEmptyState');
        
        if (items.length === 0) {
            container.innerHTML = '';
            container.appendChild(emptyState);
            return;
        }
        
        container.innerHTML = '';
        items.forEach(item => {
            const itemElement = this.createItemElement(item, 'bookmarks');
            container.appendChild(itemElement);
        });
    }

    createItemElement(item, type) {
        const div = document.createElement('div');
        div.className = 'item';
        div.dataset.id = item.id;

        // Bookmark indicator for bookmarked items
        let indicator = null;
        if (item.bookmarked) {
            indicator = document.createElement('img');
            indicator.src = 'icons/bookmark-indicator.svg';
            indicator.alt = 'Bookmarked';
            indicator.className = 'bookmark-indicator';
        }

        // Item content
        const content = document.createElement('div');
        content.className = 'item-content';

        // Header with URL and timestamp
        const header = document.createElement('div');
        header.className = 'item-header';

        if (item.url) {
            const url = document.createElement('a');
            url.href = item.url;
            url.className = 'item-url';
            url.textContent = this.getDomainFromUrl(item.url);
            url.target = '_blank';
            header.appendChild(url);
        }

        const timestamp = document.createElement('div');
        timestamp.className = 'item-timestamp';
        timestamp.textContent = this.formatTimestamp(item.timestamp);
        header.appendChild(timestamp);

        content.appendChild(header);

        // Main content with text
        const main = document.createElement('div');
        main.className = 'item-main';

        if (indicator) {
            main.appendChild(indicator);
        }

        const text = document.createElement('div');
        text.className = 'item-text' + (this.expandedItemId === item.id ? ' expanded' : '');
        text.textContent = item.text;
        text.title = 'Click to expand/collapse';
        text.addEventListener('click', () => {
            this.toggleTextExpansion(item.id);
        });

        main.appendChild(text);
        content.appendChild(main);

        // Actions
        const actions = document.createElement('div');
        actions.className = 'item-actions';

        // Copy button
        const copyBtn = document.createElement('button');
        copyBtn.className = 'action-btn primary';
        copyBtn.innerHTML = '<img src="icons/copy.svg" alt="Copy" class="action-icon"> Copy';
        copyBtn.addEventListener('click', () => {
            this.copyToClipboard(item.text);
        });

        // Bookmark/Unbookmark button
        const bookmarkBtn = document.createElement('button');
        bookmarkBtn.className = 'action-btn secondary';
        bookmarkBtn.innerHTML = item.bookmarked 
            ? '<img src="icons/bookmark-filled.svg" alt="Unbookmark" class="action-icon"> Unbookmark'
            : '<img src="icons/bookmark.svg" alt="Bookmark" class="action-icon"> Bookmark';
        bookmarkBtn.addEventListener('click', () => {
            this.toggleBookmark(item.id, !item.bookmarked);
        });

        // Menu button
        const menuBtn = document.createElement('button');
        menuBtn.className = 'action-btn';
        menuBtn.innerHTML = '<img src="icons/menu.svg" alt="Menu" class="action-icon">';
        menuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleFloatingMenu(item.id);
        });

        // Floating menu
        const floatingMenu = document.createElement('div');
        floatingMenu.className = 'floating-menu' + (this.floatingMenuOpenId === item.id ? ' open' : '');

        // Delete button in floating menu
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'floating-menu-btn';
        deleteBtn.innerHTML = '<img src="icons/delete.svg" alt="Delete" class="floating-menu-icon"> Delete';
        deleteBtn.addEventListener('click', () => {
            this.deleteItem(item.id, type);
        });

        floatingMenu.appendChild(deleteBtn);

        actions.appendChild(copyBtn);
        actions.appendChild(bookmarkBtn);
        actions.appendChild(menuBtn);

        content.appendChild(actions);
        div.appendChild(content);
        div.appendChild(floatingMenu);

        return div;
    }

    toggleTextExpansion(itemId) {
        if (this.expandedItemId === itemId) {
            this.expandedItemId = null;
        } else {
            this.expandedItemId = itemId;
        }
        this.loadData(); // Refresh display
    }

    toggleFloatingMenu(itemId) {
        if (this.floatingMenuOpenId === itemId) {
            this.closeFloatingMenu();
        } else {
            this.closeFloatingMenu();
            this.floatingMenuOpenId = itemId;
            this.loadData(); // Refresh display
        }
    }

    closeFloatingMenu() {
        this.floatingMenuOpenId = null;
        this.loadData(); // Refresh display
    }

    async toggleBookmark(itemId, shouldBookmark) {
        try {
            // Find the item in clipboard items
            const clipboardItem = this.clipboardItems.find(item => item.id === itemId);
            if (!clipboardItem) return;

            // Update bookmark status
            clipboardItem.bookmarked = shouldBookmark;

            if (shouldBookmark) {
                // Add to bookmarks if not already there
                const existingBookmark = this.bookmarkedItems.find(item => item.id === itemId);
                if (!existingBookmark) {
                    this.bookmarkedItems.unshift(clipboardItem);
                }
            } else {
                // Remove from bookmarks
                this.bookmarkedItems = this.bookmarkedItems.filter(item => item.id !== itemId);
            }

            // Save to storage
            await chrome.storage.local.set({
                clipboardItems: this.clipboardItems,
                bookmarkedItems: this.bookmarkedItems
            });

            // Refresh display
            this.loadData();

            // Show notification
            const message = shouldBookmark ? 'Added to bookmarks' : 'Removed from bookmarks';
            this.showNotification(message, 'success');

        } catch (error) {
            console.error('Error toggling bookmark:', error);
            this.showNotification('Error updating bookmark', 'error');
        }
    }

    async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            this.showNotification('Copied to clipboard', 'success');
        } catch (error) {
            console.error('Error copying to clipboard:', error);
            this.showNotification('Error copying text', 'error');
        }
    }

    async deleteItem(itemId, type) {
        try {
            if (type === 'clipboard') {
                this.clipboardItems = this.clipboardItems.filter(item => item.id !== itemId);
                // Also remove from bookmarks if it was bookmarked
                this.bookmarkedItems = this.bookmarkedItems.filter(item => item.id !== itemId);
            } else {
                // If deleting from bookmarks, just unbookmark it
                const item = this.clipboardItems.find(item => item.id === itemId);
                if (item) {
                    item.bookmarked = false;
                }
                this.bookmarkedItems = this.bookmarkedItems.filter(item => item.id !== itemId);
            }

            // Save to storage
            await chrome.storage.local.set({
                clipboardItems: this.clipboardItems,
                bookmarkedItems: this.bookmarkedItems
            });

            // Close floating menu and refresh
            this.closeFloatingMenu();
            this.loadData();

            this.showNotification('Item deleted', 'success');

        } catch (error) {
            console.error('Error deleting item:', error);
            this.showNotification('Error deleting item', 'error');
        }
    }

    async clearAll(type) {
        try {
            if (type === 'clipboard') {
                this.clipboardItems = [];
                // Also clear bookmarks since they reference clipboard items
                this.bookmarkedItems = [];
            } else {
                // Clear bookmarks but keep clipboard items
                this.bookmarkedItems = [];
                // Unbookmark all clipboard items
                this.clipboardItems.forEach(item => {
                    item.bookmarked = false;
                });
            }

            // Save to storage
            await chrome.storage.local.set({
                clipboardItems: this.clipboardItems,
                bookmarkedItems: this.bookmarkedItems
            });

            // Refresh display
            this.loadData();

            const message = type === 'clipboard' ? 'All clipboard items cleared' : 'All bookmarks cleared';
            this.showNotification(message, 'success');

        } catch (error) {
            console.error('Error clearing items:', error);
            this.showNotification('Error clearing items', 'error');
        }
    }

    getDomainFromUrl(url) {
        try {
            const domain = new URL(url).hostname;
            return domain.startsWith('www.') ? domain.substring(4) : domain;
        } catch {
            return 'Unknown site';
        }
    }

    formatTimestamp(timestamp) {
        if (!timestamp) return '';
        
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Just now';
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString();
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.popup-notification');
        existingNotifications.forEach(notification => notification.remove());

        // Create new notification
        const notification = document.createElement('div');
        notification.className = `popup-notification ${type}`;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Show notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Hide and remove notification
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new PopupManager();
}); 