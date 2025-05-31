document.addEventListener('DOMContentLoaded', function() {
  const nextTimestampButton = document.getElementById('nextTimestamp');
  const previousTimestampButton = document.getElementById('previousTimestamp');
  const batchTimestampButton = document.getElementById('batchTimestamp');
  const timestampCounter = document.getElementById('timestampCounter');

  // Initially disable the next button
  nextTimestampButton.disabled = true;
  previousTimestampButton.disabled = true;
  // Request transcript as soon as popup opens
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "getTranscript"});
  });

  nextTimestampButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "nextTimestamp"});
    });
  });

  previousTimestampButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "previousTimestamp"});
    });
  });

  batchTimestampButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "batchTimestamp"});
    });
  });

  // Listen for messages from content script
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "transcriptLoaded") {
      nextTimestampButton.disabled = false;
      previousTimestampButton.disabled = false;
    } else if (request.action === "timestampInfo") {
      // Update the counter display (adding 1 to currentIndex to make it 1-based)
      timestampCounter.textContent = `${request.currentIndex + 1} / ${request.totalCount}`;
    }
  });
}); 