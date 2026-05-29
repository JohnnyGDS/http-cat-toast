# http-cat-toast

A Chrome extension that shows an [http.cat](https://http.cat) image as a toast in the bottom-right corner of the page whenever a network request in the current tab returns a redirect (3xx), error (4xx/5xx), or a connection-level error like DNS failure or refused connection.

Duplicate codes are deduped for 5 seconds, and each toast auto-dismisses after 5 seconds (or click to dismiss).

## Collection

Click the extension icon to open the HTTP Cat Collection — a gallery of every status code you've encountered across all tabs. Cards show the date you first collected each code. Codes are grouped by class (1xx–5xx); 2xx success and 1xx informational codes are tracked silently (no toast).

Progress is tracked across all collectable codes. Click any collected card to view the full image on http.cat.

## Install (unpacked)

1. Clone or download this repo.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode** (top-right toggle).
4. Click **Load unpacked** and select this project's folder.
5. Reload any open tabs you want the extension to monitor.
