const fs = require("fs");
const path = require("path");

const rootDir = path.resolve(__dirname, "..");
const srcNext = path.join(rootDir, "frontend", ".next");
const destNext = path.join(rootDir, ".next");
const srcPublic = path.join(rootDir, "frontend", "public");
const destPublic = path.join(rootDir, "public");

// Sync frontend/.next to root .next so Vercel finds routes-manifest.json
if (fs.existsSync(srcNext)) {
  fs.cpSync(srcNext, destNext, { recursive: true });
  console.log("✓ Synced frontend/.next -> .next (routes-manifest.json verified)");
}

// Sync frontend/public to root public
if (fs.existsSync(srcPublic)) {
  fs.cpSync(srcPublic, destPublic, { recursive: true });
  console.log("✓ Synced frontend/public -> public");
}
