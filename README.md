# CTRL-S - Clipboard & Highlights Manager

A powerful Chrome extension that saves your clipboard history and lets you highlight and collect text from any website with reminders and tags.

## 🚀 Features

### 📋 Clipboard History
- **Automatic Tracking**: Monitors Ctrl+C/Cmd+C and right-click copy operations
- **Smart Storage**: Stores up to 50 recent clipboard items (configurable)
- **Domain Tracking**: Shows which website each item came from
- **Duplicate Prevention**: Avoids saving the same text multiple times
- **Quick Access**: View and copy previous clipboard items instantly

### 💡 Text Highlights
- **Right-Click Save**: Select text and right-click to save as highlight
- **Quick Tags**: Pre-defined tags (To Read, Quote, Idea, Research, Important)
- **Custom Tags**: Add your own tags for better organization
- **Reminders**: Set optional reminders for important highlights
- **Source Tracking**: Automatically saves the URL where text was found

### ⏰ Reminder System
- **Local Notifications**: Chrome notifications for due reminders
- **Smart Scheduling**: Automatic reminder checking every hour
- **Visual Alerts**: See upcoming reminders in the popup
- **Click to View**: Click notifications to open the extension popup

### 🔍 Search & Filter
- **Global Search**: Search across both clipboard history and highlights
- **Real-time Filtering**: Instant results as you type
- **Highlighted Matches**: Search terms are highlighted in results
- **Multiple Criteria**: Search by text content, tags, or domains

### 📤 Export & Backup
- **CSV Export**: Export clipboard history or highlights to CSV
- **Local Storage**: All data stored locally in your browser
- **No Cloud Required**: Works completely offline
- **Privacy First**: Your data never leaves your device

## 🛠️ Installation

### Method 1: Load Unpacked Extension (Development)

1. **Download/Clone** this repository to your computer
2. **Open Chrome** and go to `chrome://extensions/`
3. **Enable Developer Mode** (toggle in top-right corner)
4. **Click "Load unpacked"** and select the extension folder
5. **Pin the extension** to your toolbar for easy access

### Method 2: Chrome Web Store (Coming Soon)

The extension will be available on the Chrome Web Store soon!

## 📖 Usage Guide

### Basic Clipboard Tracking
1. **Copy any text** using Ctrl+C/Cmd+C or right-click → Copy
2. **Click the CTRL-S icon** in your toolbar
3. **View your clipboard history** in the "Clipboard" tab
4. **Click any item** to copy it back to your clipboard

### Saving Highlights
1. **Select text** on any webpage
2. **Right-click** and choose "Save to CTRL-S"
3. **Add optional tag** and reminder
4. **Click Save** to store the highlight

### Quick Highlight Saving
1. **Select text** on any webpage
2. **Press Ctrl+Shift+S** (or Cmd+Shift+S on Mac)
3. **Text is saved instantly** with a success notification

### Using Quick Tags
1. **Select text** on any webpage
2. **Right-click** and go to "Quick Save with Tag"
3. **Choose a pre-defined tag** (To Read, Quote, Idea, etc.)
4. **Text is saved instantly** with the selected tag

### Setting Reminders
1. **Save a highlight** with the reminder option
2. **Set date and time** for when you want to be reminded
3. **Receive notification** when the reminder is due
4. **Click notification** to view the saved highlight

### Searching Your Data
1. **Open the extension popup**
2. **Type in the search box** at the top
3. **View filtered results** across both clipboard and highlights
4. **Clear search** to see all items again

### Exporting Data
1. **Open the extension popup**
2. **Go to Clipboard or Highlights tab**
3. **Click the export button** (📄 icon)
4. **Download CSV file** with all your data

## ⌨️ Keyboard Shortcuts

- **Ctrl+C/Cmd+C**: Copy text (automatically tracked)
- **Ctrl+Shift+S/Cmd+Shift+S**: Quick save selected text as highlight
- **Escape**: Close modals and dialogs

## 🔧 Settings

The extension uses these default settings (stored locally):

- **Max Clipboard Items**: 50
- **Enable Notifications**: Yes
- **Auto Save Clipboard**: Yes

## 🛡️ Privacy & Security

- **Local Storage**: All data is stored locally in your browser
- **No Cloud Sync**: Your data never leaves your device
- **No External APIs**: Works completely offline
- **Minimal Permissions**: Only requests necessary permissions

## 📁 File Structure

```
CTRL-S/
├── manifest.json          # Extension configuration
├── popup.html            # Main popup interface
├── popup.css             # Popup styling
├── popup.js              # Popup functionality
├── background.js         # Background service worker
├── content.js            # Content script for webpage integration
├── content.css           # Content script styling
├── icons/                # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md             # This file
```

## 🐛 Troubleshooting

### Extension Not Working
1. **Check permissions**: Go to `chrome://extensions/` and ensure the extension is enabled
2. **Reload extension**: Click the refresh icon on the extension card
3. **Check console**: Open DevTools (F12) and look for error messages

### Clipboard Not Being Tracked
1. **Check clipboard permission**: Ensure the extension has clipboard access
2. **Try manual copy**: Use Ctrl+C instead of right-click copy
3. **Check for conflicts**: Disable other clipboard managers temporarily

### Notifications Not Working
1. **Check notification permission**: Allow notifications when prompted
2. **Check system settings**: Ensure Chrome can show notifications
3. **Test with a reminder**: Set a reminder for 1 minute from now

## 🤝 Contributing

This is an open-source project! Contributions are welcome:

1. **Fork the repository**
2. **Create a feature branch**
3. **Make your changes**
4. **Test thoroughly**
5. **Submit a pull request**

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have feature requests:

1. **Check the troubleshooting section** above
2. **Search existing issues** on GitHub
3. **Create a new issue** with detailed information

## 🔄 Version History

### v1.0.0 (Current)
- ✅ Clipboard history tracking
- ✅ Text highlighting with tags and context menu
- ✅ Search and filter functionality
- ✅ CSV export capability
- ✅ Modern gradient UI design
- ✅ Keyboard shortcuts
- ✅ Context menu integration
- ✅ Right-click save with quick tags

### Planned Features
- 🔜 Cross-device sync (optional)
- 🔜 Advanced filtering options
- 🔜 Bulk operations
- 🔜 Import functionality
- 🔜 Cloud backup (optional)

---

**Made with ❤️ for productivity enthusiasts** 