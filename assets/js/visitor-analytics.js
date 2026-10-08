/* Hosted analytics: browser/page data stays with the configured providers. */
(() => {
  "use strict";

  const config = document.currentScript?.dataset;
  if (!config || window.__visitorAnalyticsLoaded) return;
  window.__visitorAnalyticsLoaded = true;

  const globe = document.querySelector("[data-visitor-globe]");
  function showGlobePreview(message) {
    const preview = globe?.querySelector("[data-globe-preview]");
    if (!preview) return;
    preview.hidden = false;
    preview.querySelector("[data-globe-status]").textContent = message;
  }

  const domains = (config.domains || "")
    .split(",")
    .map((domain) => domain.trim())
    .filter(Boolean);
  let excluded = false;
  try {
    excluded = Boolean(localStorage.getItem("umami.disabled"));
  } catch {
    // Analytics still works when browser storage is unavailable.
  }
  const publishedHost = domains.includes(window.location.hostname);
  if (excluded || navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true || !publishedHost) {
    showGlobePreview(publishedHost ? "Preview · Tracking disabled" : "Local preview · Tracking disabled");
    return;
  }

  function appendScript(src, parent, attributes = {}) {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    for (const [name, value] of Object.entries(attributes)) script.setAttribute(name, value);
    parent.appendChild(script);
    return script;
  }

  if (globe) {
    const script = appendScript(globe.dataset.scriptUrl, globe, { id: "mmvst_globe" });
    script.addEventListener("error", () => {
      showGlobePreview("Preview · Visitor data unavailable");
    });
  }

  if (!config.websiteId || !config.scriptUrl) return;

  // Queue early clicks while the hosted tracker loads; never delay navigation.
  const queue = [];
  let ready = false;
  let failed = false;
  function track(name, data) {
    if (failed) return;
    if (!ready || typeof window.umami?.track !== "function") {
      if (queue.length < 20) queue.push([name, data]);
      return;
    }
    try {
      const result = window.umami.track(name, data);
      if (result && typeof result.catch === "function") result.catch(() => {});
    } catch {
      // A blocked tracker must not interfere with links or buttons.
    }
  }

  function normalizedPath(value) {
    return value.replace(/\/+$/, "") || "/";
  }
  const cvTargets = [config.cvPath, config.pageCvPath].filter(Boolean).map((value) => new URL(value, window.location.href));

  function handleClick(event) {
    if (event.type === "auxclick" && event.button !== 1) return;
    const link = event.target.closest?.("a[href]");
    if (!link || link.closest("[data-visitor-globe]")) return;
    // Leave explicitly instrumented elements to Umami's own listener.
    if (link.closest("[data-umami-event]")) return;

    let target;
    try {
      target = new URL(link.href, window.location.href);
    } catch {
      return;
    }
    const data = { path: window.location.pathname };
    if (target.protocol === "mailto:") {
      track("email_click", data);
      return;
    }
    if (!["http:", "https:"].includes(target.protocol)) return;
    if (target.origin === window.location.origin && target.pathname === window.location.pathname && target.hash && !link.hasAttribute("download")) {
      return;
    }

    // Exclude query strings, fragments, mail addresses, and link text from event data.
    data.target = target.origin === window.location.origin ? target.pathname : `${target.hostname}${target.pathname}`;
    const isCV = cvTargets.some((cv) => cv.origin === target.origin && cv.pathname === target.pathname);
    const isCVPage = target.origin === window.location.origin && normalizedPath(target.pathname) === normalizedPath(config.cvPage || "/cv/");
    if (isCV || isCVPage) {
      track("cv_click", data);
    } else if (/\.pdf$/i.test(target.pathname) || (/^(www\.)?arxiv\.org$/i.test(target.hostname) && target.pathname.startsWith("/pdf/"))) {
      track("pdf_click", data);
    } else if (link.hasAttribute("download")) {
      track("download_click", data);
    } else if (target.origin !== window.location.origin) {
      track("outbound_click", data);
    }
  }
  document.addEventListener("click", handleClick);
  document.addEventListener("auxclick", handleClick);

  const tracker = appendScript(config.scriptUrl, document.head, {
    "data-website-id": config.websiteId,
    "data-domains": domains.join(","),
    "data-do-not-track": "true",
    "data-exclude-hash": "true",
  });
  tracker.addEventListener("load", () => {
    ready = true;
    for (const [name, data] of queue.splice(0)) track(name, data);
  });
  tracker.addEventListener("error", () => {
    failed = true;
    queue.length = 0;
  });
})();
