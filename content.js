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
            console.log('Transcript:', transcript);
          } else {
            console.log('No transcript available');
          }
        });
      } else {
        console.log('No video ID found in URL');
      }
    }
  }
); 