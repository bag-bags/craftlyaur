const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const USERS_FILE = path.join(__dirname, "users.json");

// Helper to hash password
function hashPassword(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, "sha512").toString("hex");
}

// Generate default admin account if users.json doesn't exist
if (!fs.existsSync(USERS_FILE)) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = hashPassword("admin123", salt);
  const defaultUsers = [
    {
      username: "admin",
      salt: salt,
      passwordHash: hash,
      role: "admin",
      createdAt: new Date().toISOString()
    }
  ];
  fs.writeFileSync(USERS_FILE, JSON.stringify(defaultUsers, null, 2), "utf8");
  console.log("Created backend/users.json with default admin user (username: admin, password: admin123)");
}
