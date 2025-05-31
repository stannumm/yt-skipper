import { YoutubeTranscript } from 'youtube-transcript';

// Function to extract video ID from YouTube URL
function getYoutubeVideoId(url) {
  const urlParams = new URLSearchParams(new URL(url).search);
  return urlParams.get('v');
}

// Function to fetch transcript
async function fetchTranscript(videoId) {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId);
    return transcript;
  } catch (error) {
    console.error('Error fetching transcript:', error);
    return null;
  }
}

// Store current index and times array globally
let currentIndex = 0;
let times = [];
let batchTimes = [];

// Function to find the closest timestamp index
function findClosestTimestampIndex(times, currentTime) {
  if (times.length === 0) return 0;
  
  // Find the first timestamp that's greater than current time
  const nextIndex = times.findIndex(time => time > currentTime);
  
  // If no future timestamp found, return the last index
  if (nextIndex === -1) return times.length - 1;
  
  // Return the previous index (or 0 if it's the first timestamp)
  return Math.max(0, nextIndex - 1);
}

// Function to send timestamp info to popup
function sendTimestampInfo() {
  chrome.runtime.sendMessage({
    action: "timestampInfo",
    currentIndex: currentIndex,
    totalCount: times.length
  });
}

// Function to seek to next timestamp
function seekToNextTimestamp() {
  if (currentIndex < times.length - 1) {
    currentIndex++;
    const video = document.querySelector('video');
    if (video) {
      video.currentTime = times[currentIndex];
      sendTimestampInfo();
    }
  }
}

function seekToPreviousTimestamp() {
  if (currentIndex > 0) {
    currentIndex--;
    const video = document.querySelector('video');
    if (video) {
      video.currentTime = times[currentIndex];
      sendTimestampInfo();
    }
  }
}

function seekToBatchTimestamp() {
  const video = document.querySelector('video');
  if (video) {
  let newIndex = findClosestTimestampIndex(batchTimes, video.currentTime);
  if (newIndex < batchTimes.length - 1) {
      newIndex++;
      video.currentTime = batchTimes[newIndex];
      currentIndex = times.findIndex(time => time === batchTimes[newIndex]);
      sendTimestampInfo();
    }
  }
}


// Function to setup video time tracking
function setupVideoTimeTracking() {
  const video = document.querySelector('video');
  if (video) {
    video.addEventListener('timeupdate', () => {
      const newIndex = findClosestTimestampIndex(times, video.currentTime);
      if (newIndex !== currentIndex) {
        currentIndex = newIndex;
        sendTimestampInfo();
      }
    });
  }
}

// Function to process and store transcript
function processAndStoreTranscript(transcript, videoId) {
  if (transcript) {
    times = transcript
      .filter(t => t.text !== '' && !t.text.startsWith('[') && !t.text.endsWith(']'))
      .map(t => Math.floor(t.offset));

    batchTimes = times.filter((time, index, arr) => {
      if (index === 0) return false; // skip first element
      return time - arr[index - 1] > 10;
    });
    
    // Store in Chrome storage
    chrome.storage.local.set({
      [videoId]: {
        times: times,
        batchTimes: batchTimes,
        timestamp: Date.now()
      }
    });

    // Setup video time tracking
    setupVideoTimeTracking();
    
    // Send times array and initial timestamp info back to popup
    chrome.runtime.sendMessage({
      action: "transcriptLoaded",
      times: times
    });
    sendTimestampInfo();
  }
}

// Listen for messages from the popup
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action === "showAlert") {
      alert("Hello! You're on YouTube: " + document.title);
    } else if (request.action === "getTranscript") {
      const videoId = getYoutubeVideoId(window.location.href);
      if (videoId) {
        // First check if we have cached data
        chrome.storage.local.get([videoId], function(result) {
          if (result[videoId]) {
            // Use cached data
            console.log('Using cached data');
            times = result[videoId].times;
            setupVideoTimeTracking();
            chrome.runtime.sendMessage({
              action: "transcriptLoaded",
              times: times
            });
          } else {
            // Fetch new transcript if not cached
            console.log('Fetching transcript for video:', videoId);
            fetchTranscript(videoId).then(transcript => {
              processAndStoreTranscript(transcript, videoId);
            });
          }
        });
      } else {
        console.log('No video ID found in URL');
      }
    } else if (request.action === "nextTimestamp") {
      seekToNextTimestamp();
    } else if (request.action === "previousTimestamp") {
      seekToPreviousTimestamp();
    } else if (request.action === "batchTimestamp") {
      seekToBatchTimestamp();
    }
  }
); 