import { getUsers, saveUsers, hashPassword, generateSalt, authenticateRequest } from "@/lib/adminAuth";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Verify requester is logged in and is admin
  const decoded = authenticateRequest(req);
  if (!decoded || decoded.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Only admins can register new users" });
  }

  try {
    const { username, password, role = "admin" } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    if (username.length < 3 || password.length < 6) {
      return res.status(400).json({
        error: "Username must be at least 3 characters and password at least 6 characters",
      });
    }

    const users = getUsers();
    const existingUser = users.find(
      (u) => u.username.toLowerCase() === username.toLowerCase()
    );

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const salt = generateSalt();
    const hash = hashPassword(password, salt);

    const newUser = {
      username,
      salt,
      passwordHash: hash,
      role,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    saveUsers(users);

    return res.status(201).json({
      success: true,
      user: {
        username: newUser.username,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Register API Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
