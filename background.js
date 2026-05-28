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

const COLLECTABLE_CODES = new Set([
  400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414,
  415, 416, 417, 418, 420, 421, 422, 423, 424, 425, 426, 428, 429, 431, 444,
  450, 451, 497, 498, 499,
  500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 521, 522, 523,
  525, 599,
]);

function recordCode(code) {
  if (!COLLECTABLE_CODES.has(code)) return;
  chrome.storage.local.get({ seenCodes: [] }, (data) => {
    const seen = new Set(data.seenCodes);
    if (seen.has(code)) return;
    seen.add(code);
    chrome.storage.local.set({ seenCodes: [...seen] });
  });
}

function notifyTab(tabId, code) {
  if (tabId < 0) return;
  chrome.tabs.sendMessage(tabId, { type: "http-cat", code }).catch(() => {});
}

chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (details.statusCode >= 400) {
      recordCode(details.statusCode);
      notifyTab(details.tabId, details.statusCode);
    }
  },
  { urls: ["<all_urls>"] },
);

chrome.webRequest.onErrorOccurred.addListener(
  (details) => {
    if (IGNORED_NET_ERRORS.has(details.error)) return;
    const code = NET_ERROR_TO_STATUS[details.error] ?? 599;
    recordCode(code);
    notifyTab(details.tabId, code);
  },
  { urls: ["<all_urls>"] },
);

chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({ url: chrome.runtime.getURL("collection.html") });
});
