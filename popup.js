document.addEventListener('DOMContentLoaded', function() {
  const nextTimestampButton = document.getElementById('nextTimestamp');

  // Initially disable the next button
  nextTimestampButton.disabled = true;

  // Request transcript as soon as popup opens
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {action: "getTranscript"});
  });

  nextTimestampButton.addEventListener('click', function() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, {action: "nextTimestamp"});
    });
  });

  // Listen for transcript loaded message
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "transcriptLoaded") {
      nextTimestampButton.disabled = false;
    }
  });
}); 