// theme.js: shopper look for BODEGS pages.
// 1) makes sure theme.css (sans font, black text) is loaded, 2) shrinks the naira sign everywhere.
// Seller, admin and login pages keep their own look.
(function () {
  const page = location.pathname.split("/").pop() || "index.html";
  if (/^(seller|seller-login|admin|login|auth)/i.test(page)) return;

  if (!document.querySelector('link[href^="theme.css"]')) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "theme.css?v=20261031";
    document.head.appendChild(link);
  }

  const SKIP = { SCRIPT: 1, STYLE: 1, TEXTAREA: 1, INPUT: 1, OPTION: 1, TITLE: 1, NOSCRIPT: 1 };

  function wrap(root) {
    if (!root) return;
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (node.nodeValue.indexOf("₦") === -1) return NodeFilter.FILTER_REJECT;
        const p = node.parentNode;
        if (!p || SKIP[p.nodeName] || (p.classList && p.classList.contains("cur"))) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach(function (node) {
      const parts = node.nodeValue.split("₦");
      const frag = document.createDocumentFragment();
      parts.forEach(function (part, i) {
        if (i > 0) {
          const sign = document.createElement("span");
          sign.className = "cur";
          sign.textContent = "₦";
          frag.appendChild(sign);
        }
        if (part) frag.appendChild(document.createTextNode(part));
      });
      node.parentNode.replaceChild(frag, node);
    });
  }

  let timer = 0;
  function later() {
    clearTimeout(timer);
    timer = setTimeout(function () { wrap(document.body); }, 30);
  }

  function start() {
    wrap(document.body);
    new MutationObserver(later).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
