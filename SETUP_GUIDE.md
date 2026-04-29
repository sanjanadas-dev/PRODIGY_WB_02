# 🚀 ShadoW Complete Setup Guide

> **Permanent Solution**: Follow this guide ONE TIME to eliminate "Failed to fetch" errors forever.

## ✅ Part 1: Initial Setup (5 minutes)

### Step 1: Install Dependencies
Open a terminal/PowerShell in the project folder and run:
```bash
npm install
```

**Windows PowerShell:**
```powershell
npm install
```

**macOS/Linux Terminal:**
```bash
npm install
```

### Step 2: Create & Configure .env

If `.env` doesn't exist, run the interactive setup:
```bash
node setup.js
```

OR manually create `.env` with:
```
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/shadow_saas?retryWrites=true&w=majority
JWT_SECRET=supersecretkey12345678901234567890
```

### Step 3: Choose Your Database

#### 🌟 **Option A: MongoDB Atlas (Cloud) - RECOMMENDED**

1. Go to https://www.mongodb.com/cloud/atlas
2. Click **Sign Up** (or Sign In if you have account)
3. Create a free account with Google/GitHub
4. Click **Create deployment** → Choose **Free M0** tier
5. Set username and password (remember these!)
6. Click **Create cluster**
7. Go to **Clusters** → **Connect** → **Connect your application**
8. Copy the connection string
9. Edit `.env` and replace the MONGODB_URI:
   ```
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/shadow_saas?retryWrites=true&w=majority
   ```

**Example:**
```
MONGODB_URI=mongodb+srv://johndoe:mySecurePass123@cluster0.abc1234.mongodb.net/shadow_saas?retryWrites=true&w=majority
```

✅ **Done! Your database is ready.**

---

#### 💻 **Option B: Local MongoDB (For Development Only)**

1. **Install MongoDB Community Edition**
   - Windows: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
   - macOS: `brew tap mongodb/brew && brew install mongodb-community`
   - Linux: Follow official docs for your distro

2. **Start MongoDB**
   - **Windows:** Run `mongod` in a new terminal
   - **macOS:** `brew services start mongodb-community`
   - **Linux:** `sudo systemctl start mongod`

3. **Update .env**
   ```
   MONGODB_URI=mongodb://127.0.0.1:27017/shadow_saas
   ```

✅ **Done! Local MongoDB is ready.**

---

#### 🔌 **Option C: In-Memory Mode (Testing Only)**

Don't set MONGODB_URI in .env. App will use in-memory storage.
⚠️ **Warning:** Data resets when server restarts.

---

## ✅ Part 2: Start the Server (Every Time You Work)

### **Method 1: npm start (Easiest)**
```bash
npm start
```

The startup script will:
- ✅ Check .env file
- ✅ Verify environment variables
- ✅ Install dependencies if needed
- ✅ Start the server with helpful messages
- ✅ Show you where to access the app

**Output:**
```
╔════════════════════════════════════════════════════════╗
║         🚀 ShadoW Server Started Successfully           ║
╚════════════════════════════════════════════════════════╝

📌 Server running on: http://localhost:3000

📊 Access points:
   • Landing:  http://localhost:3000
   • Sign Up:  http://localhost:3000/signup.html
   • Login:    http://localhost:3000/login.html
   • Dashboard: http://localhost:3000/dashboard.html
```

### **Method 2: Click Startup Script (Windows)**
Double-click `START_SERVER.bat` in the project folder.

### **Method 3: Shell Script (macOS/Linux)**
```bash
chmod +x start-server.sh
./start-server.sh
```

---

## ✅ Part 3: Using the Application

### 1️⃣ **Access the App**
Open your browser to: **http://localhost:3000**

### 2️⃣ **Create an Account**
Click **"Sign up"** → Fill in details → Click **Sign up**

### 3️⃣ **Log In**
Click **"Log in"** → Enter email & password → Click **Sign in**

### 4️⃣ **Use Dashboard**
- Add projects
- Manage tasks
- Invite team members
- Track progress

---

## 🔧 Troubleshooting

### ❌ Error: "Failed to Fetch"

**Causes & Solutions:**

| Issue | Solution |
|-------|----------|
| Server not running | Run `npm start` in terminal |
| Port 3000 already used | Kill process: `lsof -ti:3000 \| xargs kill` (macOS/Linux) or change PORT in .env |
| CORS errors | Ensure server is on port 3000 or update meta tag in page |
| MongoDB connection error | Check MONGODB_URI in .env has correct username/password |

---

### ❌ Error: "MONGODB_URI not found"

**Solution:** Add MONGODB_URI to .env
```
MONGODB_URI=your_connection_string_here
```

---

### ❌ Error: "JWT_SECRET not defined"

**Solution:** Add JWT_SECRET to .env
```
JWT_SECRET=any_long_random_string_here_min_32_chars
```

---

### ❌ Error: "npm install fails"

**Solutions:**
1. Delete `node_modules` folder and `package-lock.json`
2. Run: `npm install` again
3. If still fails, try: `npm install --no-optional`

---

### ✅ Verify Server is Running

Open this URL in browser:
```
http://localhost:3000/api/health
```

Should show:
```json
{
  "status": "ok",
  "server": "ShadoW",
  "port": 3000,
  "timestamp": "2024-01-15T10:30:45.123Z",
  "hint": "API is running..."
}
```

---

## 📋 Quick Reference Commands

```bash
# Start server
npm start

# Install dependencies
npm install

# Run interactive setup
node setup.js

# Check if server is running
curl http://localhost:3000/api/health

# Stop server
Ctrl+C
```

---

## 🏗️ File Structure

```
.env                    # Your configuration (keep secret!)
.env.example           # Template (safe to share)
server.js              # Express server & API
start.js               # Startup helper
setup.js               # Interactive setup
package.json           # Dependencies
README.md              # Basic documentation
SETUP_GUIDE.md         # This file (detailed guide)

public/                # Frontend files
  index.html
  login.html
  signup.html
  dashboard.html
  server-status.html   # Error/status page
  js/
    api.js             # API client helper
    auth-page.js       # Auth logic
    dashboard.js       # Dashboard logic
  
middleware/            # Server middleware
  auth.js              # JWT authentication
```

---

## 🔐 Security Checklist

- [ ] .env file created ✓
- [ ] PORT set in .env ✓
- [ ] JWT_SECRET set (long random string) ✓
- [ ] MONGODB_URI configured ✓
- [ ] Never commit .env to git (add to .gitignore) ✓
- [ ] MongoDB Atlas IP whitelist includes your IP ✓
- [ ] DB passwords are strong ✓

---

## 🚀 Production Deployment

When ready to deploy to production:

1. Use MongoDB Atlas (cloud) instead of local
2. Set stronger JWT_SECRET
3. Use environment-specific .env files
4. Set NODE_ENV=production
5. Use a reverse proxy (nginx)
6. Enable HTTPS
7. Configure proper CORS
8. Set database backups

---

## 💡 Pro Tips

### Auto-Reload on File Changes
Install and use nodemon:
```bash
npm install -D nodemon
# Then in package.json, change:
"dev": "nodemon server.js"
```

### Clear All User Data
1. Stop the server (Ctrl+C)
2. If using MongoDB Atlas: drop the database in Atlas console
3. Restart server

### Check API Endpoints
Open DevTools (F12) → Network tab → Perform actions → Watch API calls

### Test API with cURL
```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"test123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@test.com","password":"test123"}'
```

---

## ❓ Still Having Issues?

1. **Check Console:** Press F12 in browser → Console tab
2. **Check Server Logs:** Look at terminal where you ran `npm start`
3. **Check Network:** F12 → Network tab → Reload page → Look for failed requests
4. **Check .env:** Verify PORT, MONGODB_URI, JWT_SECRET are set
5. **Check MongoDB:** If using Atlas, verify connection string is correct

---

## 📞 Getting Help

- **Server won't start?** Check .env and terminal output
- **Database error?** Check MONGODB_URI syntax and credentials  
- **API calls failing?** Check Network tab in DevTools (F12)
- **Token issues?** Clear localStorage: `localStorage.clear()`
- **Need to debug?** Add `console.log()` in server.js and public/js files

---

## ✨ You're All Set!

Your ShadoW dashboard is ready to use. This setup should work for months without issues.

**Next time you work:**
1. Open terminal in project folder
2. Run: `npm start`
3. Open: http://localhost:3000
4. Done! ✅

---

Made with ❤️ for seamless team collaboration
