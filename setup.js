#!/usr/bin/env node
/**
 * ShadoW - Quick Setup Guide
 * This file helps you get MongoDB and the server running
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const envPath = path.join(__dirname, ".env");

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║          ShadoW - Interactive Setup Guide                    ║
╚═══════════════════════════════════════════════════════════════╝

Welcome! This guide will help you set up ShadoW in 2 minutes.

`);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function main() {
  // Check .env
  if (!fs.existsSync(envPath)) {
    console.log("📝 Creating .env file...");
    const defaultEnv = `PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/shadow_saas?retryWrites=true&w=majority
JWT_SECRET=supersecretkey12345678901234567890
`;
    fs.writeFileSync(envPath, defaultEnv);
    console.log("✅ .env file created (use defaults for now)\n");
  }

  console.log("🚀 Setup Options:\n");
  const choice = await question("1. Local MongoDB (installed)\n2. MongoDB Atlas (cloud)\n3. Skip MongoDB setup\n\nChoice (1-3): ");

  if (choice === "1") {
    console.log(
      `
📌 Local MongoDB Setup:
1. Install MongoDB Community: https://docs.mongodb.com/manual/installation/
2. Start MongoDB service:
   - Windows: mongod (in a new terminal)
   - macOS: brew services start mongodb-community
   - Linux: sudo systemctl start mongod
3. Update .env: MONGODB_URI=mongodb://127.0.0.1:27017/shadow_saas
4. Done! ✅
`
    );
  } else if (choice === "2") {
    console.log(
      `
📌 MongoDB Atlas Setup (Recommended):
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for a free account
3. Create a cluster (choose Free tier)
4. Click "Connect" → "Connect Your App"
5. Copy the connection string
6. Update .env MONGODB_URI with your connection string
7. Done! ✅

Example: mongodb+srv://myusername:mypassword@cluster0.xxxxx.mongodb.net/shadow_saas
`
    );
  } else {
    console.log(
      `
📌 In-Memory Mode:
Your app will work without MongoDB, but data will reset when server restarts.
Keep MONGODB_URI commented out in .env.
`
    );
  }

  console.log(
    `
╔═══════════════════════════════════════════════════════════════╗
║                      Next Steps                               ║
╚═══════════════════════════════════════════════════════════════╝

1️⃣  Update .env with your database connection
2️⃣  Run: npm install
3️⃣  Run: npm start
4️⃣  Open: http://localhost:3000

📖 Full guide: README.md
`
  );

  rl.close();
}

main().catch(console.error);
