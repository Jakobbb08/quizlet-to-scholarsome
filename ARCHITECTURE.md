# Architecture Overview

## Component Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     Browser Extension                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐         ┌──────────────┐                  │
│  │              │         │              │                  │
│  │   Popup UI   │◄────────┤   Options    │                  │
│  │  (popup.*)   │         │  (options.*) │                  │
│  │              │         │              │                  │
│  └──────┬───────┘         └──────┬───────┘                  │
│         │                        │                           │
│         │ Messages               │ Storage API               │
│         ▼                        ▼                           │
│  ┌──────────────────────────────────────┐                   │
│  │                                      │                   │
│  │    Background Service Worker        │                   │
│  │        (background.js)               │                   │
│  │                                      │                   │
│  └──────────┬───────────────────────────┘                   │
│             │                           ▲                    │
│             │ Messages                  │ Messages           │
│             ▼                           │                    │
│  ┌──────────────────────────────────────┴──┐                │
│  │                                          │                │
│  │       Content Script                     │                │
│  │        (content.js)                      │                │
│  │                                          │                │
│  └──────────────────────────────────────────┘                │
│             │                                                 │
└─────────────┼─────────────────────────────────────────────────┘
              │ DOM Access
              ▼
   ┌──────────────────────┐
   │                      │
   │   Quizlet.com Page   │
   │                      │
   └──────────────────────┘

              │ HTTP POST
              ▼
   ┌──────────────────────┐
   │                      │
   │   Scholarsome API    │
   │                      │
   └──────────────────────┘
```

## Data Flow

### Import Flow

```
1. User visits Quizlet study set page
   └─> Content script detects page type
   
2. User clicks extension icon
   └─> Popup opens and sends extractData message
   
3. Content script receives message
   └─> Extracts study set data from DOM
   └─> Returns data to popup
   
4. Popup displays card count and title
   
5. User clicks "Import to Scholarsome"
   └─> Popup sends importToScholarsome message to background
   
6. Background script receives message
   └─> Fetches API settings from storage
   └─> Makes HTTP POST to Scholarsome API
   └─> Returns result to popup
   
7. Popup displays success or error message
```

### Configuration Flow

```
1. User clicks "Settings" in popup
   └─> Options page opens in new tab
   
2. Options page loads
   └─> Fetches saved settings from storage
   └─> Displays current values
   
3. User updates settings and clicks "Save"
   └─> Options page saves to storage
   └─> Displays confirmation message
   
4. Settings are now available to background script
```

## Key Technologies

- **Manifest V3**: Modern Chrome extension format
- **Service Worker**: Background script that handles API calls
- **Content Scripts**: Injected into Quizlet pages for DOM access
- **Chrome Storage API**: Persistent storage for settings
- **Chrome Messaging API**: Communication between components

## Permissions

| Permission | Purpose |
|------------|---------|
| `activeTab` | Access to current tab for content script |
| `storage` | Store user settings (API key, URL) |
| `host_permissions: quizlet.com` | Inject content script on Quizlet |
| `host_permissions: scholarsome.com` | Make API calls to Scholarsome |

## File Responsibilities

| File | Responsibility |
|------|---------------|
| `manifest.json` | Extension configuration and metadata |
| `content.js` | Extract data from Quizlet pages |
| `background.js` | Handle API communication |
| `popup.html/js` | User interface for importing |
| `options.html/js` | User interface for configuration |
| `icons/*` | Extension branding |

## Security Features

1. **Isolated Contexts**: Content script runs in isolated world from page scripts
2. **Secure Storage**: API keys stored in browser's encrypted storage
3. **HTTPS Only**: API calls use HTTPS (enforced by browsers for extensions)
4. **Limited Permissions**: Only requests necessary permissions
5. **No External Resources**: All code bundled, no CDN dependencies

## Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 88+ | ✅ Full | Primary target |
| Edge 88+ | ✅ Full | Chromium-based |
| Firefox 109+ | ✅ Full | MV3 support added |
| Safari 15.4+ | ⚠️ Partial | Some API differences |
| Opera 74+ | ✅ Full | Chromium-based |
