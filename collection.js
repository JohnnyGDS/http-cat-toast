const CATALOGUE = [
  {
    group: "4xx Client Errors",
    codes: [
      400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413,
      414, 415, 416, 417, 418, 420, 421, 422, 423, 424, 425, 426, 428, 429,
      431, 444, 450, 451, 497, 498, 499,
    ],
  },
  {
    group: "5xx Server Errors",
    codes: [
      500, 501, 502, 503, 504, 505, 506, 507, 508, 509, 510, 511, 521, 522,
      523, 525, 599,
    ],
  },
];

const TOTAL_CODES = CATALOGUE.reduce((n, g) => n + g.codes.length, 0);

function makeSeenCard(code) {
  const card = document.createElement("div");
  card.className = "card card--seen";

  const img = document.createElement("img");
  img.src = `https://http.cat/${code}`;
  img.alt = `HTTP ${code}`;
  img.loading = "lazy";

  const label = document.createElement("span");
  label.className = "card__label";
  label.textContent = code;

  card.append(img, label);
  return card;
}

function makeUnseenCard(code) {
  const card = document.createElement("div");
  card.className = "card card--unseen";

  const mystery = document.createElement("span");
  mystery.className = "card__mystery";
  mystery.textContent = "?";

  const label = document.createElement("span");
  label.className = "card__label";
  label.textContent = code;

  card.append(mystery, label);
  return card;
}

function renderPage(seen) {
  const totalSeen = seen.size;
  const pct = TOTAL_CODES > 0 ? (totalSeen / TOTAL_CODES) * 100 : 0;

  document.getElementById("progress-bar-fill").style.width = `${pct}%`;
  document.getElementById("progress-label").textContent =
    `${totalSeen} / ${TOTAL_CODES} collected`;

  const app = document.getElementById("app");
  app.innerHTML = "";

  for (const { group, codes } of CATALOGUE) {
    const groupSeen = codes.filter((c) => seen.has(c)).length;

    const section = document.createElement("section");

    const header = document.createElement("div");
    header.className = "group-header";

    const h2 = document.createElement("h2");
    h2.textContent = group;

    const count = document.createElement("span");
    count.className = "group-count";
    count.textContent = `${groupSeen} / ${codes.length} collected`;

    header.append(h2, count);

    const grid = document.createElement("div");
    grid.className = "grid";

    for (const code of codes) {
      grid.appendChild(seen.has(code) ? makeSeenCard(code) : makeUnseenCard(code));
    }

    section.append(header, grid);
    app.appendChild(section);
  }
}

chrome.storage.local.get({ seenCodes: [] }, ({ seenCodes }) => {
  renderPage(new Set(seenCodes));
});

chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "local" && changes.seenCodes) {
    renderPage(new Set(changes.seenCodes.newValue ?? []));
  }
});
