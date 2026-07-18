import formidable from "formidable";
import fs from "fs";
import path from "path";
import { authenticateRequest } from "@/lib/adminAuth";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const decoded = authenticateRequest(req);
  if (!decoded) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const uploadDir = path.join(process.cwd(), "public", "bags");

  // Ensure upload directory exists
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const form = formidable({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    filename: (name, ext, part, form) => {
      // Create a clean filename
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      const originalName = part.originalFilename || "upload";
      const cleanName = originalName.replace(/[^a-zA-Z0-9.]/g, "_");
      return `custom_${uniqueSuffix}_${cleanName}`;
    }
  });

  return new Promise((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        console.error("Formidable upload error:", err);
        res.status(500).json({ error: "Upload failed: " + err.message });
        return resolve();
      }

      // Check if file is uploaded
      const fileKey = Object.keys(files)[0];
      const file = files[fileKey];
      
      if (!file) {
        res.status(400).json({ error: "No file was uploaded" });
        return resolve();
      }

      // Support array of files or single file returned by formidable
      const uploadedFile = Array.isArray(file) ? file[0] : file;
      const fileName = path.basename(uploadedFile.filepath);

      return res.status(200).json({
        success: true,
        url: `/bags/${fileName}`,
      });
    });
  });
}
