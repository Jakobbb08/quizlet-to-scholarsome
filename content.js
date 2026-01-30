// Content script for Quizlet pages
// Extracts study set data and sends it to the background script

(function() {
  'use strict';

  // Function to extract study set data from Quizlet page
  function extractQuizletData() {
    const data = {
      url: window.location.href,
      title: '',
      terms: []
    };

    // Try to extract the set title
    const titleElement = document.querySelector('h1[class*="SetPage"]') || 
                        document.querySelector('h1.UIHeading') ||
                        document.querySelector('[data-testid="set-title"]') ||
                        document.querySelector('h1');
    
    if (titleElement) {
      data.title = titleElement.textContent.trim();
    }

    // Try to extract terms and definitions
    // Modern Quizlet uses various class names and structures
    const termCards = document.querySelectorAll('[class*="SetPageTerm"]') ||
                     document.querySelectorAll('.SetPageTerm-content') ||
                     document.querySelectorAll('[data-testid="term-card"]');

    if (termCards.length > 0) {
      termCards.forEach(card => {
        const termElement = card.querySelector('[class*="term"]') ||
                          card.querySelector('.TermText') ||
                          card.querySelector('[data-testid="term-text"]');
        
        const definitionElement = card.querySelector('[class*="definition"]') ||
                                 card.querySelector('.DefinitionText') ||
                                 card.querySelector('[data-testid="definition-text"]');

        if (termElement && definitionElement) {
          data.terms.push({
            term: termElement.textContent.trim(),
            definition: definitionElement.textContent.trim()
          });
        }
      });
    } else {
      // Alternative approach: try to find any structure with term/definition pairs
      const allCards = document.querySelectorAll('[class*="card"]');
      allCards.forEach(card => {
        const texts = card.querySelectorAll('[class*="TermText"], [class*="DefinitionText"]');
        if (texts.length >= 2) {
          data.terms.push({
            term: texts[0].textContent.trim(),
            definition: texts[1].textContent.trim()
          });
        }
      });
    }

    return data;
  }

  // Listen for messages from popup or background script
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractData') {
      const data = extractQuizletData();
      sendResponse({ success: true, data: data });
    }
    return true; // Required for async response
  });

  // Auto-detection: check if we're on a Quizlet set page
  function isQuizletSetPage() {
    return window.location.href.includes('quizlet.com') && 
           (window.location.pathname.includes('/set/') || 
            window.location.pathname.match(/\/\d+\//));
  }

  // Store the current page type
  if (isQuizletSetPage()) {
    chrome.storage.local.set({ isQuizletSetPage: true });
  }
})();
