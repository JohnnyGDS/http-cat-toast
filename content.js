const DEDUPE_MS = 5000;
const TOAST_TTL_MS = 5000;

const lastShown = new Map();
let shadowRoot = null;

function ensureShadowRoot() {
  if (shadowRoot) return shadowRoot;
  if (!document.body) return null;

  const host = document.createElement("div");
  host.id = "http-cat-toast-host";
  host.setAttribute("popover", "manual");
  host.style.all = "initial";
  host.style.position = "fixed";
  host.style.inset = "auto 0 0 auto";
  host.style.margin = "0";
  host.style.padding = "0";
  host.style.border = "0";
  host.style.background = "transparent";
  host.style.overflow = "visible";
  host.style.width = "auto";
  host.style.height = "auto";
  host.style.zIndex = "2147483647";
  host.style.pointerEvents = "none";
  document.body.appendChild(host);

  if (typeof host.showPopover === "function") {
    try {
      host.showPopover();
    } catch (_) {
      /* not supported on this page */
    }
  }

  shadowRoot = host.attachShadow({ mode: "open" });

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = chrome.runtime.getURL("toast.css");
  shadowRoot.appendChild(link);

  const stack = document.createElement("div");
  stack.className = "stack";
  shadowRoot.appendChild(stack);

  return shadowRoot;
}

function showToast(code) {
  const root = ensureShadowRoot();
  if (!root) return;

  const stack = root.querySelector(".stack");
  const toast = document.createElement("div");
  toast.className = "toast";

  const img = document.createElement("img");
  img.src = `https://http.cat/${code}`;
  img.alt = `HTTP ${code}`;

  toast.appendChild(img);
  stack.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add("visible"));

  let removed = false;
  const remove = () => {
    if (removed) return;
    removed = true;
    toast.classList.remove("visible");
    setTimeout(() => toast.remove(), 200);
  };

  toast.addEventListener("click", remove);
  setTimeout(remove, TOAST_TTL_MS);
}

function handleMessage(msg) {
  if (!msg || msg.type !== "http-cat") return;
  const code = msg.code;
  const now = Date.now();
  if (now - (lastShown.get(code) ?? 0) < DEDUPE_MS) return;
  lastShown.set(code, now);

  if (document.body) {
    showToast(code);
  } else {
    document.addEventListener("DOMContentLoaded", () => showToast(code), {
      once: true,
    });
  }
}

chrome.runtime.onMessage.addListener(handleMessage);
