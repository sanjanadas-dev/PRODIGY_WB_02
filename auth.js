const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// In-memory users from server.js
let users = [];

function setUsers(userArray) {
  users = userArray;
}

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ message: "Not signed in" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ message: "Session expired or invalid" });
  }
}

async function attachUser(req, res, next) {
  try {
    const user = users.find(u => u.id == req.userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }
    const { passwordHash, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch (e) {
    return res.status(500).json({ message: "Server error" });
  }
}

function requireLeader(req, res, next) {
  if (req.user.role !== "leader") {
    return res.status(403).json({ message: "Team leader or admin access required" });
  }
  next();
}

module.exports = { requireAuth, attachUser, requireLeader, setUsers };
