# YouTube Transcript Extension

A Chrome extension that shows alerts and fetches transcripts on YouTube pages.

## Installation Instructions

1. Install dependencies:
```bash
npm install
```

2. Build the extension:
```bash
npm run build
```

3. Open Chrome and go to `chrome://extensions/`
4. Enable "Developer mode" in the top right corner
5. Click "Load unpacked" and select this directory

## Usage
1. Navigate to any YouTube video page
2. Click the extension icon
3. Click the "Get Transcript" button
4. Open Chrome DevTools (F12) to see the transcript in the console

## Development
- Use `npm run watch` to automatically rebuild when files change
- The extension uses the `youtube-transcript` npm package to fetch transcripts
- Content script is bundled using webpack

## Files
- `manifest.json`: Extension configuration
- `popup.html`: The popup UI
- `popup.js`: The JavaScript that handles the click events
- `content.js`: Content script that runs on YouTube pages
- `webpack.config.js`: Webpack configuration for bundling
- Icons in the images directory 