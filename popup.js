// Alert button click handler
document.getElementById('alertButton').addEventListener('click', function() {
  // Query the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    
    // Check if we're on YouTube
    if (currentTab.url.includes('youtube.com')) {
      // Send message to content script
      chrome.tabs.sendMessage(currentTab.id, {action: "showAlert"});
    } else {
      alert('This extension only works on YouTube!');
    }
  });
});

// Transcript button click handler
document.getElementById('transcriptButton').addEventListener('click', function() {
  // Query the active tab
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    const currentTab = tabs[0];
    
    // Check if we're on YouTube
    if (currentTab.url.includes('youtube.com')) {
      // Send message to content script
      chrome.tabs.sendMessage(currentTab.id, {action: "getTranscript"});
    } else {
      alert('This extension only works on YouTube!');
    }
  });
}); 