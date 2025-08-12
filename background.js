// Clipboard monitoring and storage

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
    console.log('CTRL-S extension installed');
    initializeStorage();
    createContextMenus();
});

chrome.runtime.onStartup.addListener(() => {
    console.log('CTRL-S extension started');
    initializeStorage();
    createContextMenus();
});

// Create context menus
function createContextMenus() {
    // Remove existing menus first
    chrome.contextMenus.removeAll(() => {
        // Main save menu
        chrome.contextMenus.create({
            id: 'save-to-ctrl-s',
            title: 'Save to CTRL-S',
            contexts: ['selection']
        });

        // Quick save to bookmarks
        chrome.contextMenus.create({
            id: 'save-to-bookmarks',
            title: 'Save to Bookmarks',
            contexts: ['selection']
        });

        // Separator
        chrome.contextMenus.create({
            id: 'separator1',
            type: 'separator',
            contexts: ['selection']
        });

        // Quick tags submenu
        chrome.contextMenus.create({
            id: 'quick-tags',
            title: 'Quick Save with Tag',
            contexts: ['selection']
        });

        // Quick tag options
        const quickTags = ['Important', 'To Read', 'Quote', 'Idea', 'Research'];
        quickTags.forEach(tag => {
            chrome.contextMenus.create({
                id: `quick-tag-${tag.toLowerCase().replace(' ', '-')}`,
                parentId: 'quick-tags',
                title: tag,
                contexts: ['selection']
            });
        });
    });
}

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
    const selectedText = info.selectionText;
    if (!selectedText || !selectedText.trim()) return;

    try {
        if (info.menuItemId === 'save-to-ctrl-s') {
            // Save to clipboard items
            await saveClipboardItem(selectedText.trim(), tab.url);
            showNotification('Saved to Clipboard', selectedText.trim());
        } 
        else if (info.menuItemId === 'save-to-bookmarks') {
            // Save directly to bookmarks
            await saveBookmarkedItem(selectedText.trim(), tab.url);
            showNotification('Saved to Bookmarks', selectedText.trim());
        }
        else if (info.menuItemId.startsWith('quick-tag-')) {
            // Extract tag name
            const tag = info.menuItemId.replace('quick-tag-', '').replace('-', ' ');
            const capitalizedTag = tag.charAt(0).toUpperCase() + tag.slice(1);
            
            // Save to bookmarks with tag
            await saveBookmarkedItem(selectedText.trim(), tab.url, capitalizedTag);
            showNotification(`Saved with tag: ${capitalizedTag}`, selectedText.trim());
        }
    } catch (error) {
        console.error('Error handling context menu:', error);
        showNotification('Error saving text', 'Please try again');
    }
});

async function initializeStorage() {
    try {
        const data = await chrome.storage.local.get(['clipboardItems', 'bookmarkedItems']);
        
        // Initialize clipboardItems if not exists
        if (!data.clipboardItems) {
            await chrome.storage.local.set({ clipboardItems: [] });
        }
        
        // Initialize bookmarkedItems if not exists
        if (!data.bookmarkedItems) {
            await chrome.storage.local.set({ bookmarkedItems: [] });
        }
        
        console.log('Storage initialized');
    } catch (error) {
        console.error('Error initializing storage:', error);
    }
}

// Save clipboard item
async function saveClipboardItem(text, url = '') {
    try {
        const data = await chrome.storage.local.get(['clipboardItems', 'settings']);
        let clipboardItems = data.clipboardItems || [];
        let settings = data.settings || { maxClipboardItems: 50, autoSaveClipboard: true };
        
        // Check if auto-save is enabled
        if (!settings.autoSaveClipboard) {
            return;
        }
        
        // Check if item already exists
        const existingItem = clipboardItems.find(item => item.text === text);
        if (existingItem) {
            // Update timestamp and URL if needed
            existingItem.timestamp = Date.now();
            if (url && !existingItem.url) {
                existingItem.url = url;
            }
        } else {
            // Create new item
            const newItem = {
                id: generateId(),
                text: text,
                url: url,
                timestamp: Date.now(),
                bookmarked: false
            };
            
            clipboardItems.unshift(newItem);
            
            // Limit items based on settings
            if (clipboardItems.length > settings.maxClipboardItems) {
                clipboardItems = clipboardItems.slice(0, settings.maxClipboardItems);
            }
        }
        
        // Save to storage
        await chrome.storage.local.set({ clipboardItems: clipboardItems });
        console.log('Clipboard item saved:', text.substring(0, 50) + '...');
        
    } catch (error) {
        console.error('Error saving clipboard item:', error);
    }
}

// Save bookmarked item
async function saveBookmarkedItem(text, url = '', tag = '') {
    try {
        const data = await chrome.storage.local.get(['clipboardItems', 'bookmarkedItems']);
        let clipboardItems = data.clipboardItems || [];
        let bookmarkedItems = data.bookmarkedItems || [];
        
        // Check if item already exists in clipboard
        let existingItem = clipboardItems.find(item => item.text === text);
        
        if (existingItem) {
            // Update existing item to be bookmarked
            existingItem.bookmarked = true;
            existingItem.url = url || existingItem.url;
            if (tag) {
                existingItem.tag = tag;
            }
        } else {
            // Create new item
            const newItem = {
                id: generateId(),
                text: text,
                url: url,
                timestamp: Date.now(),
                bookmarked: true,
                tag: tag
            };
            
            clipboardItems.unshift(newItem);
            existingItem = newItem;
        }
        
        // Add to bookmarks if not already there
        const existingBookmark = bookmarkedItems.find(item => item.id === existingItem.id);
        if (!existingBookmark) {
            bookmarkedItems.unshift(existingItem);
        }
        
        // Save both arrays
        await chrome.storage.local.set({
            clipboardItems: clipboardItems,
            bookmarkedItems: bookmarkedItems
        });
        
        console.log('Bookmarked item saved:', text.substring(0, 50) + '...');
        
    } catch (error) {
        console.error('Error saving bookmarked item:', error);
    }
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Show notification
function showNotification(title, message) {
    chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon128.png',
        title: title,
        message: message
    });
}

// Listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'saveClipboard') {
        saveClipboardItem(message.text, message.url);
        sendResponse({ success: true });
    } else if (message.action === 'saveBookmark') {
        saveBookmarkedItem(message.text, message.url, message.tag);
        sendResponse({ success: true });
    }
});

// Handle tab updates to inject clipboard monitor
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url && tab.url.startsWith('http')) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            files: ['content.js']
        });
    }
});