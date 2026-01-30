// Background service worker for Quizlet to Scholarsome extension
// Handles communication between content script and Scholarsome API

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'importToScholarsome') {
    importToScholarsome(request.data)
      .then(result => sendResponse({ success: true, result: result }))
      .catch(error => sendResponse({ success: false, error: error.message }));
    return true; // Required for async response
  }
});

// Function to import data to Scholarsome
async function importToScholarsome(data) {
  // Get Scholarsome API settings from storage
  const settings = await chrome.storage.sync.get(['scholarsome_url', 'scholarsome_api_key']);
  
  const scholarsome_url = settings.scholarsome_url || 'https://scholarsome.com';
  const api_key = settings.scholarsome_api_key;

  if (!api_key) {
    throw new Error('Scholarsome API key not configured. Please set it in the extension options.');
  }

  // Prepare the data for Scholarsome API
  const payload = {
    title: data.title,
    cards: data.terms.map(term => ({
      front: term.term,
      back: term.definition
    })),
    source: 'quizlet',
    source_url: data.url
  };

  // Make API request to Scholarsome
  const response = await fetch(`${scholarsome_url}/api/import`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${api_key}`
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Scholarsome API error: ${response.status} - ${errorText}`);
  }

  const result = await response.json();
  return result;
}

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // Set default values
    chrome.storage.sync.set({
      scholarsome_url: 'https://scholarsome.com'
    });
  }
});
