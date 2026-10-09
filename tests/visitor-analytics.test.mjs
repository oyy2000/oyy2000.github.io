import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";

const source = readFileSync(new URL("../assets/js/visitor-analytics.js", import.meta.url), "utf8");
const frameSource = readFileSync(new URL("../assets/js/visitor-globe-frame.js", import.meta.url), "utf8");

function boot(options = {}) {
  const calls = [];
  const scripts = [];
  const frames = [];
  const handlers = {};
  const section = { hidden: false };
  const globeStatus = { textContent: "" };
  const globePreview = { hidden: true, querySelector: () => globeStatus };
  const location = new URL(options.url || "https://oyy2000.github.io/?utm_source=test");
  const globe = options.globe
    ? {
        dataset: { frameUrl: "/visitor-globe-frame/" },
        closest: () => section,
        querySelector: () => globePreview,
        appendChild: (frame) => frames.push(frame),
      }
    : null;
  const document = {
    currentScript: {
      dataset: {
        domains: "oyy2000.github.io",
        websiteId: "test-website",
        scriptUrl: "https://cloud.umami.is/script.js",
        cvPath: "/assets/pdf/Yang_Ouyang_CV.pdf",
        pageCvPath: "/assets/pdf/example_pdf.pdf",
        cvPage: "/cv/",
        ...options.config,
      },
    },
    head: { appendChild: (script) => scripts.push(script) },
    querySelector: () => globe,
    createElement: () => ({
      attributes: {},
      listeners: {},
      setAttribute(name, value) {
        this.attributes[name] = value;
      },
      addEventListener(name, listener) {
        this.listeners[name] = listener;
      },
    }),
    addEventListener: (name, listener) => (handlers[name] = listener),
  };
  const window = { location };
  const context = {
    document,
    window,
    navigator: options.navigator || {},
    localStorage: {
      getItem() {
        if (options.storageThrows) throw new Error("Storage blocked");
        return options.excluded ? "1" : null;
      },
    },
    URL,
  };
  runInNewContext(source, context);

  function load() {
    window.umami = { track: (name, data) => calls.push([name, JSON.parse(JSON.stringify(data))]) };
    scripts.find((script) => script.attributes["data-website-id"])?.listeners.load();
  }
  if (options.ready !== false) load();

  function click(href, settings = {}) {
    const link = {
      href: new URL(href, location).href,
      hasAttribute: (name) => name === "download" && Boolean(settings.download),
      closest: (selector) => {
        if (selector === "[data-umami-event]") return settings.nativeEvent ? link : null;
        return settings.widget ? link : null;
      },
    };
    handlers[settings.type || "click"]?.({
      type: settings.type || "click",
      button: settings.button || 0,
      target: { closest: () => link },
      preventDefault() {
        throw new Error("Analytics must never block navigation");
      },
    });
  }
  return { calls, scripts, frames, section, globe, globePreview, globeStatus, window, context, load, click };
}

test("loads Umami once and isolates the globe without allowing same-origin access", () => {
  const app = boot({ globe: true });
  assert.equal(app.scripts.length, 1);
  assert.equal(app.frames.length, 1);
  assert.equal(app.frames[0].src, "/visitor-globe-frame/");
  assert.equal(app.frames[0].attributes.sandbox, "allow-scripts allow-popups allow-popups-to-escape-sandbox");
  assert.equal(app.frames[0].attributes.referrerpolicy, "strict-origin");
  assert.equal(app.scripts[0].attributes["data-website-id"], "test-website");
  assert.equal(app.scripts[0].attributes["data-domains"], "oyy2000.github.io");
  assert.equal(app.scripts[0].attributes["data-do-not-track"], "true");
  assert.equal(app.globePreview.hidden, true);
  runInNewContext(source, app.context);
  assert.equal(app.scripts.length, 1);
  assert.equal(app.frames.length, 1);
});

test("classifies CV icons, the CV page, PDFs, arXiv PDFs, mail, downloads, and external links", () => {
  const app = boot();
  app.click("/assets/pdf/Yang_Ouyang_CV.pdf");
  app.click("/cv/");
  app.click("/cv");
  app.click("/assets/pdf/example_pdf.pdf");
  app.click("https://aclanthology.org/2025.naacl-long.623.pdf");
  app.click("https://arxiv.org/pdf/2404.02936");
  app.click("mailto:person@example.com?subject=private");
  app.click("/assets/code.zip", { download: true });
  app.click("https://github.com/oyy2000");
  assert.deepEqual(
    app.calls.map(([name]) => name),
    ["cv_click", "cv_click", "cv_click", "cv_click", "pdf_click", "pdf_click", "email_click", "download_click", "outbound_click"]
  );
});

test("custom click data omits URL queries, fragments, and email addresses", () => {
  const app = boot();
  app.click("https://example.com/paper.pdf?token=secret#private");
  app.click("mailto:private@example.com?body=confidential");
  assert.deepEqual(app.calls, [
    ["pdf_click", { path: "/", target: "example.com/paper.pdf" }],
    ["email_click", { path: "/" }],
  ]);
});

test("ignores anchors, native Umami events, ordinary internal links, and widget links", () => {
  const app = boot();
  app.click("/#publications");
  app.click("/publications/");
  app.click("javascript:void(0)");
  app.click("https://example.com", { nativeEvent: true });
  app.click("https://mapmyvisitors.com", { widget: true });
  app.click("https://example.com", { type: "auxclick", button: 2 });
  assert.deepEqual(app.calls, []);
  app.click("https://example.com", { type: "auxclick", button: 1 });
  assert.equal(app.calls.length, 1);
});

test("buffers early clicks until the tracker loads", () => {
  const app = boot({ ready: false });
  app.click("/cv/");
  assert.equal(app.calls.length, 0);
  app.load();
  assert.deepEqual(app.calls, [["cv_click", { path: "/", target: "/cv/" }]]);
});

test("blocked or rejected trackers do not interfere with clicks", () => {
  const app = boot({ ready: false });
  app.click("/cv/");
  app.scripts[0].listeners.error();
  app.load();
  app.click("/cv/");
  assert.deepEqual(app.calls, []);
  const failing = boot();
  failing.window.umami.track = () => {
    throw new Error("Blocked");
  };
  assert.doesNotThrow(() => failing.click("/cv/"));
  failing.window.umami.track = () => Promise.reject(new Error("Network failure"));
  assert.doesNotThrow(() => failing.click("/cv/"));
});

test("shows a nontracking globe preview for localhost, own browser, Do Not Track, and Global Privacy Control", () => {
  for (const options of [
    { url: "http://localhost:8080/" },
    { url: "http://127.0.0.1:8080/" },
    { url: "https://preview.example.com/" },
    { excluded: true },
    { navigator: { doNotTrack: "1" } },
    { navigator: { globalPrivacyControl: true } },
  ]) {
    const app = boot({ ...options, globe: true });
    assert.equal(app.scripts.length, 0);
    assert.equal(app.frames.length, 0);
    assert.equal(app.section.hidden, false);
    assert.equal(app.globePreview.hidden, false);
    assert.match(app.globeStatus.textContent, /Tracking disabled/);
    if (options.url) assert.match(app.globeStatus.textContent, /Local preview/);
    app.click("/cv/");
    assert.deepEqual(app.calls, []);
  }
});

test("storage restrictions do not break tracking and either provider can work independently", () => {
  assert.equal(boot({ storageThrows: true }).scripts.length, 1);
  assert.equal(boot({ config: { websiteId: "" } }).scripts.length, 0);
  const globeOnly = boot({ globe: true, config: { websiteId: "" } });
  assert.equal(globeOnly.scripts.length, 0);
  assert.equal(globeOnly.frames.length, 1);
});

test("supports a project-site baseurl and an external configured CV", () => {
  const app = boot({
    config: { cvPath: "https://files.example.com/resume.pdf", cvPage: "/portfolio/cv/", pageCvPath: "" },
  });
  app.click("https://files.example.com/resume.pdf");
  app.click("/portfolio/cv/");
  assert.deepEqual(
    app.calls.map(([name]) => name),
    ["cv_click", "cv_click"]
  );
});

test("the frame does not track direct visits, foreign embeds, local previews, or privacy opt-outs", () => {
  for (const options of [
    { direct: true },
    { referrer: "https://unrelated.example/" },
    { referrer: "" },
    { hostname: "localhost" },
    { navigator: { doNotTrack: "1" } },
    { navigator: { globalPrivacyControl: true } },
  ]) {
    const window = { parent: {}, location: { hostname: options.hostname || "oyy2000.github.io" } };
    if (options.direct) window.parent = window;
    assert.doesNotThrow(() =>
      runInNewContext(frameSource, {
        window,
        navigator: options.navigator || {},
        URL,
        document: {
          currentScript: { dataset: { domains: "oyy2000.github.io", scriptUrl: "https://mapmyvisitors.com/globe.js?d=TEST" } },
          referrer: options.referrer ?? "https://oyy2000.github.io/",
          querySelector() {
            throw new Error("Excluded frame must not initialize the provider");
          },
        },
      })
    );
  }
});
