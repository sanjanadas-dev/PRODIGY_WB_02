# ShadoW - Project Dashboard

A modern team project management dashboard built with **Express.js**, **MongoDB**, and **JWT authentication**.

## 🚀 Quick Start

### 1. **Install Dependencies**
```bash
npm install
```

### 2. **Setup Environment Variables**

Edit `.env` file:
```
PORT=3000
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/shadow_saas?retryWrites=true&w=majority
JWT_SECRET=supersecretkey12345678901234567890
```

**MongoDB Options:**
- **Cloud (MongoDB Atlas)** - Recommended for production
  1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
  2. Create a free account
  3. Create a cluster
  4. Get connection string and paste in `.env`

- **Local MongoDB** - For development
  1. Install [MongoDB Community](https://docs.mongodb.com/manual/installation/)
  2. Start MongoDB: `mongod`
  3. Use: `MONGODB_URI=mongodb://127.0.0.1:27017/shadow_saas`

### 3. **Start the Server**

**Option A: Using startup script (Recommended)**
```bash
npm start
```

**Option B: Direct node command**
```bash
node server.js
```

### 4. **Access the Application**

- **Landing Page**: http://localhost:3000
- **Sign Up**: http://localhost:3000/signup.html
- **Login**: http://localhost:3000/login.html
- **Dashboard**: http://localhost:3000/dashboard.html (requires login)

---

## 🔧 Troubleshooting "Failed to Fetch" Error

### Problem: Server not running
```
❌ Error: Failed to fetch
```

**Solution:**
1. Open terminal in project folder
2. Run: `npm start`
3. Wait for: `✅ Server running on port 3000`
4. Refresh your browser

### Problem: MongoDB connection failed
```
❌ Error: MongoDB connection error
```

**Solution:**
1. If using **MongoDB Atlas**: Check your connection string in `.env`
   - Verify IP whitelist allows your IP
   - Verify username/password are correct
   
2. If using **Local MongoDB**: 
   - Ensure MongoDB is running: `mongod`
   - Check that `MONGODB_URI=mongodb://127.0.0.1:27017/shadow_saas`

### Problem: API calls from different port (Live Server, etc.)
If you're using VS Code Live Server or opening from `file://`:

The app automatically adds the meta tag:
```html
<meta name="shadow-api-base" content="http://localhost:3000" />
```

If Express runs on a **different port**, edit the meta tag:
```html
<meta name="shadow-api-base" content="http://localhost:YOUR_PORT" />
```

---

## 📋 API Endpoints

### Auth Endpoints
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out

### Projects (Requires JWT Token)
- `GET /api/projects` - List user projects
- `POST /api/projects` - Create project
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project

### Legacy Endpoints (Also supported)
- `POST /login` - Sign in
- `GET /get-projects` - List projects
- `POST /add-project` - Create project
- `DELETE /delete-project/:id` - Delete project

---

## 🏗️ Project Structure

```
.env                    # Environment variables
server.js              # Express server & API
start.js               # Startup helper script
package.json           # Dependencies

middleware/
  auth.js             # JWT authentication

models/
  User.js             # User model
  Project.js          # Project model

public/
  index.html          # Landing page
  login.html          # Login page
  signup.html         # Sign up page
  dashboard.html      # Dashboard (requires auth)
  style.css           # Global styles
  
  js/
    api.js            # API client helper
    auth-page.js      # Auth form logic
    dashboard.js      # Dashboard logic
```

---

## 🔐 Security Notes

- Tokens stored in `localStorage` with `shadow_token` key
- Tokens expire after 7 days
- Passwords hashed with bcryptjs
- CORS enabled for development
- JWT secret must be kept private in `.env`

---

## 🐛 Common Issues

| Issue | Solution |
|-------|----------|
| Port already in use | Change `PORT` in `.env` or kill process on port 3000 |
| MongoDB Atlas connection timeout | Add your IP to IP Whitelist in MongoDB Atlas |
| JWT errors after restart | Clear browser storage: `Dev Tools > Application > Clear Storage` |
| CORS errors | Server is running on different port - update meta tag or run on 3000 |

---

## 📝 Development

### Running in Development Mode
```bash
npm run dev
```

### Testing API with cURL
```bash
# Sign up
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@example.com","password":"pass123"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"pass123"}'
```

---

## 📞 Need Help?

1. **Check Console**: Press `F12` → Console tab for errors
2. **Check Network**: `F12` → Network → Look for failed requests
3. **Check Server**: Ensure `npm start` is running and shows `✅ ready`
4. **Check .env**: Verify all required variables are set

---

Made with ❤️ for team collaboration
