import { authenticateRequest } from "@/lib/adminAuth";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const decoded = authenticateRequest(req);
  if (!decoded) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return res.status(200).json({
    success: true,
    user: {
      username: decoded.username,
      role: decoded.role,
    },
  });
}
