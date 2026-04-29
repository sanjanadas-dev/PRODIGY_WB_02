/**
 * ShadoW API — Express + in-memory storage + JWT
 * Also exposes legacy paths: /login, /get-projects, /add-project, /delete-project
 */

require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const auth = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 3000;

// In-memory storage
let users = [];
let projects = [];
let nextUserId = 1;
let nextProjectId = 1;

auth.setUsers(users);

app.use(express.json());
/** Lets signup/login work if you open public/*.html via file:// while the API runs on localhost */
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
app.use(express.static("public"));

function signToken(user) {
  return jwt.sign(
    { sub: user.id.toString(), role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

/* ---------- Auth ---------- */

async function handleRegister(req, res) {
  try {
    const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
    if (!email || !password || !name) {
      return res.status(400).json({ message: "Email, password, and name are required" });
    }
    const exists = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ message: "Email already registered" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = {
      id: nextUserId++,
      email: email.toLowerCase(),
      passwordHash,
      name,
      role: "leader",
      jobRole: "",
    };
    users.push(user);
    const token = signToken(user);
    res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        jobRole: user.jobRole,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not register" });
  }
}

async function handleLogin(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }
    const user = users.find(u => u.email === email.toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = signToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        jobRole: user.jobRole,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not sign in" });
  }
}

app.post("/api/register", handleRegister);
app.post("/api/login", handleLogin);
app.post("/login", handleLogin);

app.get("/api/me", auth.requireAuth, auth.attachUser, (req, res) => {
  res.json({
    user: {
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      role: req.user.role,
      jobRole: req.user.jobRole,
    },
  });
});

/* ---------- Projects ---------- */

async function handleGetProjects(req, res) {
  try {
    let filteredProjects;
    if (req.user.role === "leader") {
      filteredProjects = projects.filter(p => p.leaderId == req.user.id);
    } else {
      filteredProjects = projects.filter(p => p.teamMemberIds.includes(req.user.id));
    }
    // Sort by updatedAt, assume updatedAt is Date
    filteredProjects.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
    res.json({ projects: filteredProjects });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not load projects" });
  }
}

async function handleAddProject(req, res) {
  try {
    const {
      projectName,
      projectCode,
      description,
      startDate,
      deadline,
      teamMemberIds,
      status,
    } = req.body;
    if (!projectName || !projectCode) {
      return res.status(400).json({ message: "Project name and code are required" });
    }
    const code = String(projectCode).trim();
    const members = Array.isArray(teamMemberIds) ? teamMemberIds : [];
    const allowed = users.filter(u => members.includes(u.id) && u.role === "member" && u.addedBy == req.user.id);
    const allowedIds = allowed.map(u => u.id);

    const project = {
      id: nextProjectId++,
      projectName: projectName.trim(),
      projectCode: code,
      description: description || "",
      startDate: startDate ? new Date(startDate) : undefined,
      deadline: deadline ? new Date(deadline) : undefined,
      status: ["Ongoing", "Pending", "Completed"].includes(status) ? status : "Pending",
      teamMemberIds: allowedIds,
      leaderId: req.user.id,
      updatedAt: new Date(),
    };
    projects.push(project);
    // For populated, just return the project, since no populate
    res.status(201).json({ project });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not create project" });
  }
}

async function handleUpdateProject(req, res) {
  try {
    const project = projects.find(p => p.id == req.params.id && p.leaderId == req.user.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    const {
      projectName,
      projectCode,
      description,
      startDate,
      deadline,
      teamMemberIds,
      status,
    } = req.body;

    if (projectName != null) project.projectName = String(projectName).trim();
    if (description != null) project.description = String(description);
    if (startDate !== undefined) project.startDate = startDate ? new Date(startDate) : null;
    if (deadline !== undefined) project.deadline = deadline ? new Date(deadline) : null;
    if (status && ["Ongoing", "Pending", "Completed"].includes(status)) {
      project.status = status;
    }
    if (projectCode != null && String(projectCode).trim() !== project.projectCode) {
      project.projectCode = String(projectCode).trim();
    }
    if (Array.isArray(teamMemberIds)) {
      const allowed = users.filter(u => teamMemberIds.includes(u.id) && u.role === "member" && u.addedBy == req.user.id);
      project.teamMemberIds = allowed.map(u => u.id);
    }

    project.updatedAt = new Date();
    res.json({ project });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not update project" });
  }
}

async function handleDeleteProject(req, res) {
  try {
    const index = projects.findIndex(p => p.id == req.params.id && p.leaderId == req.user.id);
    if (index === -1) {
      return res.status(404).json({ message: "Project not found" });
    }
    projects.splice(index, 1);
    res.json({ ok: true });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not delete project" });
  }
}

const authChain = [auth.requireAuth, auth.attachUser];
const leaderChain = [...authChain, auth.requireLeader];

app.get("/api/get-projects", authChain, handleGetProjects);
app.get("/get-projects", authChain, handleGetProjects);

app.post("/api/add-project", leaderChain, handleAddProject);
app.post("/add-project", leaderChain, handleAddProject);

app.put("/api/projects/:id", leaderChain, handleUpdateProject);

app.delete("/api/delete-project/:id", leaderChain, handleDeleteProject);
app.delete("/delete-project/:id", leaderChain, handleDeleteProject);

/* ---------- Team (leaders only) ---------- */

async function handleGetTeamMembers(req, res) {
  try {
    const members = users.filter(u => u.role === "member" && u.addedBy == req.user.id).map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      jobRole: u.jobRole,
      createdAt: u.createdAt,
    }));
    res.json({ members });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not load team" });
  }
}

async function handleAddTeamMember(req, res) {
  try {
    const { email, password, name, jobRole } = req.body;
    if (!email || !password || !name || !jobRole) {
      return res.status(400).json({ message: "Email, password, name, and role are required" });
    }
    if (!["developer", "designer", "tester"].includes(jobRole)) {
      return res.status(400).json({ message: "Role must be developer, designer, or tester" });
    }
    const exists = users.find(u => u.email === email.toLowerCase());
    if (exists) {
      return res.status(400).json({ message: "Email already in use" });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const member = {
      id: nextUserId++,
      email: email.toLowerCase(),
      passwordHash,
      name,
      role: "member",
      jobRole,
      addedBy: req.user.id,
      createdAt: new Date(),
    };
    users.push(member);
    res.status(201).json({
      member: {
        id: member.id,
        email: member.email,
        name: member.name,
        jobRole: member.jobRole,
        createdAt: member.createdAt,
      },
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Could not add team member" });
  }
}

app.get("/api/team-members", leaderChain, handleGetTeamMembers);
app.post("/api/add-team-member", leaderChain, handleAddTeamMember);

/* ---------- Health Check ---------- */

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    server: "ShadoW",
    port: PORT,
    timestamp: new Date().toISOString(),
    hint: "API is running. Open http://localhost:" + PORT + " in your browser.",
  });
});

/* ---------- Start ---------- */

app.listen(PORT, () => {
  console.log(
    "\n" +
      "╔════════════════════════════════════════════════════════╗\n" +
      "║         🚀 ShadoW Server Started Successfully           ║\n" +
      "╚════════════════════════════════════════════════════════╝\n" +
      `\n📌 Server running on: http://localhost:${PORT}\n` +
      `\n📊 Access points:\n` +
      `   • Landing:  http://localhost:${PORT}\n` +
      `   • Sign Up:  http://localhost:${PORT}/signup.html\n` +
      `   • Login:    http://localhost:${PORT}/login.html\n` +
      `   • Dashboard: http://localhost:${PORT}/dashboard.html\n` +
      `\n✅ Environment:\n` +
      `   • JWT Secret: ${process.env.JWT_SECRET ? "✓ Set" : "❌ NOT SET"}\n` +
      `   • MongoDB: ${process.env.MONGODB_URI ? "✓ Configured" : "⚠️  In-memory mode"}\n` +
      `\n💡 Tip: Open browser DevTools (F12) → Network tab to monitor API calls\n` +
      `   Press Ctrl+C to stop the server\n` +
      "\n"
  );
});
