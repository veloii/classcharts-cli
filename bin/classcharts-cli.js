#!/usr/bin/env node
import { spawn } from "child_process";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

// Hacky way to get __dirname in ES modules: https://stackoverflow.com/a/50052194
const __dirname = dirname(fileURLToPath(import.meta.url));

// Logic from https://github.com/cloudflare/workers-sdk/blob/main/packages/wrangler/bin/wrangler.js
spawn(
  process.execPath,
  [
    join(
      join(__dirname, "..", "dist", "index.js"),
    ),
    ...process.argv.slice(2),
  ],
  {
    stdio: "inherit",
  },
);
