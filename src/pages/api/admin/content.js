import fs from "fs";
import path from "path";
import { authenticateRequest } from "@/lib/adminAuth";

const CONTENT_FILE = path.resolve(process.cwd(), "backend/content.json");

function getContent() {
  if (!fs.existsSync(CONTENT_FILE)) {
    // Return default if file not found
    return {
      header: {
        brandName: "MOROCCAN",
        brandSuffix: "CRAFTS",
        tagline: "Est. 2026",
        quoteText: "HANDMADE",
      },
      buttons: {
        buyNow: "Buy Now",
        description: "Description",
        gallery: "Gallery",
        contact: "Contact Us",
      },
      collections: [
        { name: "Footwear", brand: "Moroccan Footwear" },
        { name: "Bags & Backpacks", brand: "Moroccan Bags" },
        { name: "Baskets & Decor", brand: "Moroccan Home" },
        { name: "All Products", brand: "all" },
      ],
      footer: {
        copyright: "© 2026 Moroccan Crafts. All rights reserved.",
        links: [
          { label: "About", url: "#" },
          { label: "Shipping", url: "#" },
          { label: "Returns", url: "#" },
        ],
      },
      stripe: {
        enabled: false,
        currency: "usd",
      },
    };
  }
  return JSON.parse(fs.readFileSync(CONTENT_FILE, "utf8"));
}

function saveContent(content) {
  fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), "utf8");
}

export default async function handler(req, res) {
  // Public GET, Admin-only PUT
  const { method } = req;

  if (method === "GET") {
    return res.status(200).json(getContent());
  }

  if (method === "PUT") {
    const decoded = authenticateRequest(req);
    if (!decoded) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    try {
      const newContent = req.body;
      if (!newContent || typeof newContent !== "object") {
        return res.status(400).json({ error: "Invalid content body" });
      }

      saveContent(newContent);
      return res.status(200).json({ success: true, content: newContent });
    } catch (err) {
      console.error("Error saving content:", err);
      return res.status(500).json({ error: "Failed to save content" });
    }
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  return res.status(405).json({ error: `Method ${method} Not Allowed` });
}
