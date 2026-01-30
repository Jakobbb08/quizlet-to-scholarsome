# Quizlet to Scholarsome

A browser extension that allows you to import Quizlet study sets directly into Scholarsome with just one click.

## Features

- 🚀 One-click import of Quizlet study sets to Scholarsome
- 📝 Automatically extracts terms and definitions from Quizlet pages
- 🔒 Secure API key storage
- ⚙️ Configurable Scholarsome instance URL
- ✨ Simple and intuitive user interface

## Installation

### Chrome/Edge (Manual Installation)

1. Download or clone this repository
2. Open Chrome/Edge and navigate to `chrome://extensions/` (or `edge://extensions/`)
3. Enable "Developer mode" in the top right corner
4. Click "Load unpacked"
5. Select the directory containing the extension files
6. The extension icon should now appear in your browser toolbar

### Firefox (Manual Installation)

1. Download or clone this repository
2. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
3. Click "Load Temporary Add-on"
4. Select the `manifest.json` file from the extension directory
5. The extension will be loaded temporarily (until you close Firefox)

## Configuration

Before using the extension, you need to configure your Scholarsome API settings:

1. Click the extension icon in your browser toolbar
2. Click "Settings" at the bottom of the popup
3. Enter your Scholarsome URL (e.g., `https://scholarsome.com`)
4. Enter your Scholarsome API key
5. Click "Save Settings"

## Usage

1. Navigate to any Quizlet study set page (e.g., `https://quizlet.com/123456789/your-study-set`)
2. Click the extension icon in your browser toolbar
3. The extension will automatically detect and extract the study set data
4. Review the number of cards found
5. Click "Import to Scholarsome" to import the set
6. Wait for the confirmation message

## How It Works

The extension consists of three main components:

- **Content Script** (`content.js`): Runs on Quizlet pages and extracts study set data (title, terms, definitions)
- **Background Script** (`background.js`): Handles communication with the Scholarsome API
- **Popup Interface** (`popup.html`, `popup.js`): Provides the user interface for initiating imports

## Troubleshooting

### "No terms found on this page"

- Make sure you're on a Quizlet study set page (URL should contain `/set/` or a set ID)
- Try refreshing the page and waiting for it to fully load
- Quizlet may have updated their page structure; please report this as an issue

### "Scholarsome API key not configured"

- Make sure you've set up your API key in the extension settings
- Verify that your API key is correct and has the necessary permissions

### Import fails with API error

- Check that your Scholarsome URL is correct
- Verify your API key has permission to create study sets
- Check your internet connection

## Development

### File Structure

```
quizlet-to-scholarsome/
├── manifest.json       # Extension configuration
├── content.js          # Content script for Quizlet pages
├── background.js       # Background service worker
├── popup.html          # Popup UI
├── popup.js            # Popup logic
├── options.html        # Settings page
├── options.js          # Settings logic
├── icons/              # Extension icons
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md           # This file
```

### Making Changes

1. Make your changes to the relevant files
2. Go to `chrome://extensions/` (or equivalent)
3. Click the refresh icon on the extension card
4. Test your changes

## Privacy

This extension:
- Only runs on Quizlet.com pages
- Only accesses the current page's DOM to extract study set data
- Stores your API key in browser's sync storage (encrypted by the browser)
- Only sends data to your configured Scholarsome instance
- Does not collect or transmit any data to third parties

**Security Note**: The API key is stored in the browser's sync storage. While browsers provide encryption for this storage, you should:
- Use API keys with limited permissions (only what's needed for importing)
- Regularly rotate your API keys
- Never share your extension profile or sync data with untrusted parties
- Consider using `chrome.storage.local` instead of sync storage if you don't need the settings to sync across devices (this can be changed in the code)

## License

See the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

## Support

If you encounter any issues or have questions, please open an issue on the GitHub repository.
