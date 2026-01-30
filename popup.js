// Popup script for Quizlet to Scholarsome extension

document.addEventListener('DOMContentLoaded', async () => {
  const importBtn = document.getElementById('importBtn');
  const statusDiv = document.getElementById('status');
  const cardCountDiv = document.getElementById('cardCount');
  const loader = document.getElementById('loader');

  let currentData = null;

  // Function to show status messages
  function showStatus(message, type = 'info') {
    statusDiv.textContent = message;
    statusDiv.className = `status ${type}`;
  }

  // Function to hide status
  function hideStatus() {
    statusDiv.className = 'status';
  }

  // Check if we're on a Quizlet page
  async function checkQuizletPage() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    if (!tab.url || !tab.url.includes('quizlet.com')) {
      showStatus('Please navigate to a Quizlet study set page.', 'info');
      importBtn.disabled = true;
      return false;
    }

    return true;
  }

  // Extract data from the current Quizlet page
  async function extractData() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    try {
      const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractData' });
      
      if (response.success && response.data) {
        currentData = response.data;
        
        if (currentData.terms.length === 0) {
          showStatus('No terms found on this page. Make sure you\'re on a Quizlet set page.', 'error');
          importBtn.disabled = true;
          return false;
        }

        cardCountDiv.textContent = `Found: ${currentData.terms.length} cards`;
        if (currentData.title) {
          cardCountDiv.textContent += ` in "${currentData.title}"`;
        }
        
        importBtn.disabled = false;
        hideStatus();
        return true;
      }
    } catch (error) {
      showStatus('Error extracting data. Please refresh the page and try again.', 'error');
      importBtn.disabled = true;
      return false;
    }
  }

  // Import data to Scholarsome
  async function importToScholarsome() {
    if (!currentData) {
      showStatus('No data to import.', 'error');
      return;
    }

    importBtn.disabled = true;
    loader.classList.add('active');
    showStatus('Importing to Scholarsome...', 'info');

    try {
      const response = await chrome.runtime.sendMessage({
        action: 'importToScholarsome',
        data: currentData
      });

      loader.classList.remove('active');

      if (response.success) {
        showStatus(`Successfully imported ${currentData.terms.length} cards to Scholarsome!`, 'success');
      } else {
        showStatus(`Error: ${response.error}`, 'error');
        importBtn.disabled = false;
      }
    } catch (error) {
      loader.classList.remove('active');
      showStatus(`Error: ${error.message}`, 'error');
      importBtn.disabled = false;
    }
  }

  // Initialize
  const isQuizletPage = await checkQuizletPage();
  if (isQuizletPage) {
    await extractData();
  }

  // Event listeners
  importBtn.addEventListener('click', importToScholarsome);
});
