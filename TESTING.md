# Testing Guide for Quizlet to Scholarsome Extension

## Prerequisites

Before testing, ensure you have:
1. Chrome, Edge, or Firefox browser
2. A Quizlet account (optional, but helpful for testing on real study sets)
3. Scholarsome API credentials (or a mock API endpoint for testing)

## Installation for Testing

### Chrome/Edge

1. Open Chrome/Edge and navigate to `chrome://extensions/` (or `edge://extensions/`)
2. Enable "Developer mode" toggle in the top right corner
3. Click "Load unpacked" button
4. Select the root directory of this extension
5. The extension should now be installed and visible in your extensions list

### Firefox

1. Open Firefox and navigate to `about:debugging#/runtime/this-firefox`
2. Click "Load Temporary Add-on"
3. Navigate to the extension directory and select `manifest.json`
4. The extension will be loaded (note: temporary add-ons are removed when Firefox closes)

## Testing Steps

### 1. Configuration Test

1. Click the extension icon in your browser toolbar
2. Click "Settings" link at the bottom of the popup
3. Enter test values:
   - Scholarsome URL: `https://scholarsome.com` (or your test instance)
   - API Key: Your test API key
4. Click "Save Settings"
5. Verify success message appears
6. Refresh the settings page to confirm values persisted

### 2. Non-Quizlet Page Test

1. Navigate to any non-Quizlet page (e.g., `https://google.com`)
2. Click the extension icon
3. Expected: Should see message "Please navigate to a Quizlet study set page."
4. Import button should be disabled

### 3. Quizlet Study Set Test

1. Navigate to a Quizlet study set page, for example:
   - `https://quizlet.com/123456789/example-set-flash-cards/`
   - Or any public Quizlet study set
2. Wait for the page to fully load
3. Click the extension icon
4. Expected behaviors:
   - Extension should automatically detect the page
   - Should extract and display the number of cards found
   - Should display the study set title (if available)
   - Import button should be enabled

### 4. Import Test

1. From a Quizlet study set page, click the extension icon
2. Verify card count is displayed
3. Click "Import to Scholarsome" button
4. Expected behaviors:
   - Button becomes disabled
   - Loading spinner appears
   - Status message shows "Importing to Scholarsome..."
   - After API response:
     - Success: Green success message with card count
     - Failure: Red error message with details

### 5. Error Handling Tests

**Test 5a: Missing API Key**
1. Go to Settings and clear the API key
2. Navigate to a Quizlet page
3. Click extension icon and try to import
4. Expected: Error message about missing API key

**Test 5b: Invalid API Response**
1. Set an invalid API endpoint in settings
2. Try to import a study set
3. Expected: Error message about API failure

**Test 5c: Empty Study Set**
1. Navigate to a Quizlet page with no visible terms
2. Click extension icon
3. Expected: Message indicating no terms found

## Manual Verification Checklist

- [ ] Extension loads without console errors
- [ ] All icons display correctly
- [ ] Settings page loads and saves correctly
- [ ] Content script detects Quizlet pages
- [ ] Data extraction works on Quizlet pages
- [ ] Popup shows correct status messages
- [ ] Import process completes successfully
- [ ] Error messages are clear and helpful
- [ ] All UI elements are properly styled
- [ ] Extension works in incognito/private mode

## Known Limitations

1. **Quizlet Page Structure**: Quizlet may update their page structure, which could break the content script's ability to extract data. The script includes multiple fallback selectors to handle different page structures.

2. **API Compatibility**: This extension assumes a specific Scholarsome API format. The actual API may differ and require adjustments.

3. **Browser Compatibility**: Primarily tested for Chrome/Edge. Firefox support is included but may have minor differences.

## Debugging Tips

### Console Logs

1. **Content Script Logs**:
   - Open DevTools on the Quizlet page
   - Go to Console tab
   - Look for messages from content.js

2. **Background Script Logs**:
   - Go to `chrome://extensions/`
   - Click "Service worker" or "background page" link
   - View logs in the opened DevTools

3. **Popup Script Logs**:
   - Right-click the extension icon
   - Select "Inspect popup"
   - View logs in the opened DevTools

### Common Issues

1. **"Cannot access contents of URL"**:
   - Ensure host_permissions in manifest.json include the necessary domains
   - Reload the extension after making changes

2. **No data extracted**:
   - Inspect the Quizlet page structure
   - Update selectors in content.js to match current structure
   - Use browser DevTools to identify correct element selectors

3. **API errors**:
   - Verify API endpoint is correct
   - Check API key has necessary permissions
   - Inspect network requests in DevTools

## Test Data Suggestions

For testing, you can use these public Quizlet study sets:
- Search for "Spanish vocabulary" on Quizlet
- Search for "Biology terms" on Quizlet
- Create your own test study set with known content

## Security Considerations

During testing, remember:
- Do not commit real API keys to version control
- Use test API keys when possible
- Be aware that extension permissions allow reading page content on Quizlet
- API keys are stored in browser's sync storage (encrypted by browser)
