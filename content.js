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

// Function to seek to next timestamp
function seekToNextTimestamp() {
  if (currentIndex < times.length - 1) {
    currentIndex++;
    const video = document.querySelector('video');
    if (video) {
      video.currentTime = times[currentIndex];
    }
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
        console.log('Fetching transcript for video:', videoId);
        fetchTranscript(videoId).then(transcript => {
          if (transcript) {
            times = transcript
            .filter(t => t.text !== '' && !t.text.startsWith('[') && !t.text.endsWith(']'))
            .map(t => Math.floor(t.offset));
            currentIndex = 0; // Reset index when new transcript is loaded
            console.log('transcript:', transcript);
            console.log('times:', times);
            // Send times array back to popup
            chrome.runtime.sendMessage({
              action: "transcriptLoaded",
              times: times
            });
          } else {
            console.log('No transcript available');
          }
        });
      } else {
        console.log('No video ID found in URL');
      }
    } else if (request.action === "nextTimestamp") {
      seekToNextTimestamp();
    }
  }
); 