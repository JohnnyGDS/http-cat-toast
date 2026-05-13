# http-cat-toast

A Chrome extension that shows an [http.cat](https://http.cat) image as a toast in the bottom-right corner of the page whenever a network request in the current tab fails (HTTP status >= 400, or a connection-level error like DNS or refused).

Duplicate codes are deduped for 5 seconds, and each toast auto-dismisses after 5 seconds (or click to dismiss).

## Install (unpacked)

1. Clone or download this repo.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select this project's folder.
5. Reload any open tabs you want the extension to monitor.
