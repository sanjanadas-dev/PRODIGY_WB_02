#!/usr/bin/env node
/**
 * ShadoW Startup Script
 * Automatically starts the Express server and provides helpful diagnostics
 */

const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

console.log("🚀 ShadoW Server Startup Helper\n");

// Check if .env exists
const envPath = path.join(__dirname, ".env");
if (!fs.existsSync(envPath)) {
  console.error(
    "❌ .env file not found!\nCreate a .env file with the following:\n"
  );
  console.log(`PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/shadow_saas?retryWrites=true&w=majority
JWT_SECRET=supersecretkey12345678901234567890`);
  console.log("\n📖 For detailed setup, run: node setup.js\n");
  process.exit(1);
}

// Load .env
require("dotenv").config();

console.log("✅ .env file loaded");
console.log(`📌 PORT: ${process.env.PORT || 3000}`);
console.log(
  `📌 MongoDB: ${process.env.MONGODB_URI ? "Configured" : "⚠️  In-memory mode"}`
);
console.log(
  `📌 JWT Secret: ${process.env.JWT_SECRET ? "✓ Set" : "⚠️  NOT SET"}\n`
);

// Check if node_modules exists
if (!fs.existsSync(path.join(__dirname, "node_modules"))) {
  console.log("📦 Installing dependencies...");
  const npm = spawn("npm", ["install"], { stdio: "inherit" });
  npm.on("exit", (code) => {
    if (code === 0) {
      startServer();
    } else {
      console.error("❌ npm install failed");
      process.exit(1);
    }
  });
} else {
  startServer();
}

function startServer() {
  console.log("▶️  Starting Express server...\n");
  const server = spawn("node", ["server.js"], { stdio: "inherit" });

  server.on("error", (err) => {
    console.error("❌ Failed to start server:", err);
    process.exit(1);
  });

  server.on("exit", (code) => {
    console.log(`\n🛑 Server stopped (exit code: ${code})`);
    process.exit(code);
  });

  // Handle Ctrl+C
  process.on("SIGINT", () => {
    console.log("\n🛑 Shutting down...");
    server.kill();
    process.exit(0);
  });
}
