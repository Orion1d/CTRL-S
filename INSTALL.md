# Installation Guide for CTRL-S Chrome Extension

## Prerequisites

- Google Chrome browser (version 88 or higher)
- Basic knowledge of Chrome extensions

## Step-by-Step Installation

### 1. Download the Extension

1. **Clone or download** this repository to your computer
2. **Extract** the files if you downloaded a ZIP file
3. **Navigate** to the extension folder in your file explorer

### 2. Load the Extension in Chrome

1. **Open Chrome** and go to `chrome://extensions/`
2. **Enable Developer Mode** by toggling the switch in the top-right corner
3. **Click "Load unpacked"** button
4. **Select the extension folder** (the folder containing `manifest.json`)
5. **Click "Select Folder"**

### 3. Verify Installation

1. **Check** that the extension appears in your extensions list
2. **Look for** the CTRL-S icon in your Chrome toolbar
3. **Click** the icon to open the popup interface

### 4. Grant Permissions

When you first use the extension, Chrome will ask for permissions:

- **Storage**: To save your clipboard history and bookmarks
- **Active Tab**: To access the current webpage
- **Notifications**: To show success/error notifications
- **Clipboard**: To read clipboard content
- **Context Menus**: To add right-click options

**Click "Allow"** for all permissions.

## Testing the Extension

### Test Clipboard Tracking

1. **Copy some text** from any webpage (Ctrl+C)
2. **Click the CTRL-S icon**
3. **Check** that the text appears in the Clipboard tab

### Test Bookmarking

1. **Select text** on any webpage
2. **Right-click** and choose "Save to Bookmarks"
3. **Check** that it appears in the Bookmarks tab

### Test Context Menu

1. **Select text** on any webpage
2. **Right-click** and choose from the CTRL-S menu options
3. **Check** that the text is saved appropriately

## Features

### Clipboard Management
- **Automatic saving** of copied text (Ctrl+C)
- **Recent copies** displayed in chronological order
- **Search functionality** across all clipboard items
- **Clear all** option to reset clipboard history

### Bookmark System
- **Bookmark important items** for later reference
- **Separate bookmarks tab** for saved content
- **Quick bookmarking** via right-click context menu
- **Tagged bookmarks** with predefined categories

### User Interface
- **Grain-colored textbook design** for elegant appearance
- **Responsive layout** that works on different screen sizes
- **Smooth animations** and modern interactions
- **Clean, organized** tab-based navigation

## Troubleshooting

### Extension Not Loading

- **Check** that all files are present in the folder
- **Verify** `manifest.json` is valid JSON
- **Reload** the extension from `chrome://extensions/`

### Permissions Issues

- **Go to** `chrome://extensions/`
- **Find** CTRL-S extension
- **Click** "Details"
- **Check** that all permissions are granted

### Clipboard Not Working

- **Check** clipboard permission is granted
- **Try** copying text manually (Ctrl+C)
- **Look for** error messages in Chrome DevTools console

## Updating the Extension

To update the extension after making changes:

1. **Go to** `chrome://extensions/`
2. **Find** the CTRL-S extension
3. **Click** the refresh icon (↻)
4. **Test** the updated functionality

## Uninstalling

To remove the extension:

1. **Go to** `chrome://extensions/`
2. **Find** the CTRL-S extension
3. **Click** "Remove"
4. **Confirm** the removal

## Development Notes

- The extension uses **Manifest V3** (latest Chrome extension standard)
- All data is stored **locally** in Chrome's storage
- The extension works **offline** without external dependencies
- **No build process** required - just load the folder directly
- **Modern UI design** with grain-colored textbook aesthetic

## Support

If you encounter issues:

1. **Check** the troubleshooting section above
2. **Look at** the browser console for error messages
3. **Verify** all files are present and correctly named
4. **Try** reloading the extension

---

**Happy productivity! 🚀** 