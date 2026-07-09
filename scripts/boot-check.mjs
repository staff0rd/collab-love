#!/usr/bin/env node
import { execFileSync } from "node:child_process";
import { createReadStream, existsSync } from "node:fs";
import { mkdtemp, rm } from "node:fs/promises";
import http from "node:http";
import { tmpdir } from "node:os";
import path from "node:path";

import puppeteer from "puppeteer";

const MOUNT_TIMEOUT_MS = 20_000;

const CONTENT_TYPE_BY_EXTENSION = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
};

function contentTypeFor(filePath) {
  return CONTENT_TYPE_BY_EXTENSION[path.extname(filePath)] ?? "application/octet-stream";
}

function parseArgs(argv) {
  const flagIndex = argv.indexOf("--dist");
  return { distArg: flagIndex !== -1 ? argv[flagIndex + 1] : null };
}

async function buildToTempDir() {
  const dir = await mkdtemp(path.join(tmpdir(), "boot-check-"));
  execFileSync("npx", ["vite", "build", "--logLevel", "error", "--outDir", dir], {
    stdio: "inherit",
  });
  return { dir, cleanup: () => rm(dir, { recursive: true, force: true }) };
}

function serveStatic(root) {
  const indexHtml = path.join(root, "index.html");
  const server = http.createServer((req, res) => {
    const requestedPath = decodeURIComponent((req.url ?? "/").split("?")[0]);
    const filePath = path.join(root, requestedPath === "/" ? "/index.html" : requestedPath);
    const withinRoot = filePath.startsWith(root);
    const streamOrFallback = withinRoot ? filePath : indexHtml;

    createReadStream(streamOrFallback)
      .on("open", () => res.setHeader("Content-Type", contentTypeFor(streamOrFallback)))
      .on("error", () => {
        createReadStream(indexHtml)
          .on("open", () => res.setHeader("Content-Type", contentTypeFor(indexHtml)))
          .on("error", () => res.writeHead(404).end("not found"))
          .pipe(res);
      })
      .pipe(res);
  });

  return new Promise((resolve) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = server.address();
      resolve({
        url: `http://127.0.0.1:${port}/`,
        close: () => new Promise((done) => server.close(done)),
      });
    });
  });
}

function hasRenderedIntoRoot() {
  return (document.getElementById("root")?.childElementCount ?? 0) > 0;
}

async function main() {
  const { distArg } = parseArgs(process.argv.slice(2));

  let distDir;
  let cleanupBuild = async () => {};
  if (distArg) {
    distDir = path.resolve(distArg);
    if (!existsSync(path.join(distDir, "index.html"))) {
      throw new Error(`--dist ${distDir} has no index.html; build the web app first.`);
    }
  } else {
    const built = await buildToTempDir();
    distDir = built.dir;
    cleanupBuild = built.cleanup;
  }

  const site = await serveStatic(distDir);
  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const bootErrors = [];
  try {
    const page = await browser.newPage();
    page.on("pageerror", (err) => bootErrors.push(err.message));

    await page.goto(site.url, { waitUntil: "domcontentloaded", timeout: MOUNT_TIMEOUT_MS });
    await page.waitForFunction(hasRenderedIntoRoot, { timeout: MOUNT_TIMEOUT_MS });

    if (bootErrors.length > 0) {
      throw new Error(`app mounted but threw during boot:\n  ${bootErrors.join("\n  ")}`);
    }
    console.log("boot-check: app mounted into #root with no boot errors");
  } catch (err) {
    const detail =
      bootErrors.length > 0 ? `\ncaptured page errors:\n  ${bootErrors.join("\n  ")}` : "";
    console.error(`boot-check FAILED: the app did not boot into #root.\n${err.message}${detail}`);
    process.exitCode = 1;
  } finally {
    await browser.close();
    await site.close();
    await cleanupBuild();
  }
}

main().catch((err) => {
  console.error(`boot-check crashed: ${err.stack ?? err}`);
  process.exit(1);
});
