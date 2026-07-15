const fs = require("fs");
const path = require("path");

async function run() {
  let removeBackground;
  try {
    const module = require("@imgly/background-removal-node");
    removeBackground = module.removeBackground;
  } catch (err) {
    console.error("\n[!] Please install the required package first by running:");
    console.error("    npm install @imgly/background-removal-node\n");
    process.exit(1);
  }

  const JSON_PATH = path.join(__dirname, "bags.json");
  const OUTPUT_DIR = path.join(__dirname, "..", "public", "bags");

  if (!fs.existsSync(JSON_PATH)) {
    console.error(`Error: JSON file not found at ${JSON_PATH}`);
    return;
  }

  // Load JSON
  const data = JSON.parse(fs.readFileSync(JSON_PATH, "utf8"));
  console.log(`Loaded ${data.length} items from bags.json`);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  let modifiedCount = 0;

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    const imageUrl = item.image_url || "";

    if (imageUrl.startsWith("http")) {
      const cleanTitle = item.title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "_")
        .substring(0, 20)
        .replace(/^_+|_+$/g, "");
      
      const filename = `bag_${i}_${cleanTitle}.png`;
      const localPath = path.join(OUTPUT_DIR, filename);

      if (fs.existsSync(localPath)) {
        // Skip if already processed, but update path in JSON
        item.image_url = `/bags/${filename}`;
        continue;
      }

      console.log(`[${i + 1}/${data.length}] Removing background: "${item.title.substring(0, 30)}..."`);
      try {
        // 1. Remove background (accepts URL directly)
        const blob = await removeBackground(imageUrl);

        // 2. Convert Blob to Buffer
        const buffer = Buffer.from(await blob.arrayBuffer());

        // 3. Save to disk
        fs.writeFileSync(localPath, buffer);

        // 4. Update JSON path
        item.image_url = `/bags/${filename}`;
        modifiedCount++;
      } catch (error) {
        console.error(`[!] Error processing item ${i} (${item.title.substring(0, 20)}):`, error.message);
      }
    }
  }

  // Save the JSON back
  if (modifiedCount > 0 || data.some(item => !item.image_url.startsWith("http"))) {
    fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), "utf8");
    console.log(`\n[+] Success! Updated ${modifiedCount} image paths in bags.json.`);
    console.log(`[+] All transparent images are saved under: public/bags/`);
  } else {
    console.log("\n[-] No images were processed.");
  }
}

run().catch(console.error);
