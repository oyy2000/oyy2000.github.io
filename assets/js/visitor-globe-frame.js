/* MapMyVisitors runs only inside the sandbox created after the parent's privacy checks. */
(() => {
  "use strict";

  const config = document.currentScript?.dataset;
  if (!config || window.parent === window || navigator.doNotTrack === "1" || navigator.globalPrivacyControl === true) return;
  const domains = (config.domains || "").split(",").map((domain) => domain.trim());
  let referrer;
  try {
    referrer = new URL(document.referrer);
  } catch {
    return;
  }
  if (!domains.includes(window.location.hostname) || !domains.includes(referrer.hostname)) return;

  const preview = document.querySelector("[data-globe-preview]");
  const observer = new MutationObserver(() => {
    const link = document.querySelector("#mmvst_a");
    if (!link) return;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    preview.hidden = true;
    observer.disconnect();
  });
  observer.observe(document.body, { childList: true, subtree: true });
  const script = document.createElement("script");
  script.id = "mmvst_globe";
  script.src = config.scriptUrl;
  script.addEventListener("error", () => {
    observer.disconnect();
    preview.hidden = false;
  });
  document.body.appendChild(script);
})();
