// Options page script for Quizlet to Scholarsome extension

document.addEventListener('DOMContentLoaded', async () => {
  const form = document.getElementById('settingsForm');
  const statusDiv = document.getElementById('status');
  const urlInput = document.getElementById('scholarsome_url');
  const apiKeyInput = document.getElementById('scholarsome_api_key');

  // Function to show status messages
  function showStatus(message, type = 'success') {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
    
    // Auto-hide success messages after 3 seconds
    if (type === 'success') {
      setTimeout(() => {
        statusDiv.className = 'status';
      }, 3000);
    }
  }

  // Load saved settings
  const settings = await chrome.storage.sync.get(['scholarsome_url', 'scholarsome_api_key']);
  
  if (settings.scholarsome_url) {
    urlInput.value = settings.scholarsome_url;
  }
  
  if (settings.scholarsome_api_key) {
    apiKeyInput.value = settings.scholarsome_api_key;
  }

  // Save settings
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const scholarsome_url = urlInput.value.trim();
    const scholarsome_api_key = apiKeyInput.value.trim();

    if (!scholarsome_url || !scholarsome_api_key) {
      showStatus('Please fill in all fields.', 'error');
      return;
    }

    try {
      await chrome.storage.sync.set({
        scholarsome_url: scholarsome_url,
        scholarsome_api_key: scholarsome_api_key
      });

      showStatus('Settings saved successfully!', 'success');
    } catch (error) {
      showStatus(`Error saving settings: ${error.message}`, 'error');
    }
  });
});
