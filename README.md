A small Chrome extension that helps navigate YouTube videos using subtitle timestamps.  
It’s mainly useful for quickly jumping between spoken dialogue parts in a video.  

The extension is currently only available in **development mode**.

---

## Features

- Works only on YouTube.
- Uses the YouTube Transcript API to fetch subtitles.
- Adds three buttons for navigation:
  1. **Next Timestamp** – jumps to the next spoken line in the subtitles (ignores purely visual descriptions).  
  2. **Previous Timestamp** – goes back to the previous spoken line.  
  3. **Batch Timestamp** – skips forward until it finds at least a 10-second gap between one subtitle line and the next.

---

## How to Install (Development Mode)

1. Download or clone this repository:
   ```bash
   git clone https://github.com/yourusername/your-extension-repo.git
   ```
2. In Chrome, open:
   ```
   chrome://extensions/
   ```
3. Turn on **Developer mode** (top right).
4. Click **"Load unpacked"** and choose this project’s folder.
5. Open a YouTube video and use the buttons.

---

## Notes

- Works only on desktop YouTube.
- Videos must have a transcript available.
- Made for personal use, so it’s not on the Chrome Web Store.

---

## License

MIT License.
