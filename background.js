const NET_ERROR_TO_STATUS = {
  "net::ERR_NAME_NOT_RESOLVED": 502,
  "net::ERR_CONNECTION_REFUSED": 521,
  "net::ERR_CONNECTION_TIMED_OUT": 522,
  "net::ERR_TIMED_OUT": 522,
};

const IGNORED_NET_ERRORS = new Set([
  "net::ERR_ABORTED",
  "net::ERR_BLOCKED_BY_CLIENT",
]);

function notifyTab(tabId, code) {
  if (tabId < 0) return;
  chrome.tabs.sendMessage(tabId, { type: "http-cat", code }).catch(() => {});
}

chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (details.statusCode >= 400) {
      notifyTab(details.tabId, details.statusCode);
    }
  },
  { urls: ["<all_urls>"] },
);

chrome.webRequest.onErrorOccurred.addListener(
  (details) => {
    if (IGNORED_NET_ERRORS.has(details.error)) return;
    const code = NET_ERROR_TO_STATUS[details.error] ?? 599;
    notifyTab(details.tabId, code);
  },
  { urls: ["<all_urls>"] },
);
