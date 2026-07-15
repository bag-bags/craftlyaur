/**
 * enrich_bags.js
 * One-time script to enrich bags.json with description + gallery images
 * extracted from faire-products0.xlsx
 */
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const BAGS_JSON_PATH = path.join(__dirname, "bags.json");
const XLSX_PATH = path.join(__dirname, "faire-products0.xlsx");

function main() {
  // 1. Load bags.json
  const bags = JSON.parse(fs.readFileSync(BAGS_JSON_PATH, "utf8"));
  console.log(`Loaded ${bags.length} items from bags.json`);

  // 2. Load XLSX
  const wb = XLSX.readFile(XLSX_PATH);
  const ws = wb.Sheets["Products"];
  const rows = XLSX.utils.sheet_to_json(ws, { header: 1 });
  console.log(`Loaded ${rows.length} rows from XLSX Products sheet`);

  // 3. Build a map: product_name -> { description, galleryImages[], productToken }
  const xlsxMap = {};
  for (let i = 3; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[0]) continue;

    const name = row[0].trim();
    if (!xlsxMap[name]) {
      xlsxMap[name] = {
        description: (row[5] || "").trim(),
        productToken: (row[3] || "").toString().trim(),
        galleryImages: new Set(),
      };
    }
    // Column 41 = option_image (variant images)
    const optionImage = row[41];
    if (optionImage && optionImage.toString().trim()) {
      xlsxMap[name].galleryImages.add(optionImage.toString().trim());
    }
  }

  // 4. Enrich each bag entry
  let enriched = 0;
  let noMatch = 0;

  for (const bag of bags) {
    const title = bag.title.trim();
    const xlsxData = xlsxMap[title];

    if (xlsxData) {
      bag.description = xlsxData.description;
      // Build proper faire.com product URL from token
      if (xlsxData.productToken) {
        bag.product_url = `https://www.faire.com/product/${xlsxData.productToken}`;
      }
      // Gallery = all option images EXCEPT the main image_url (avoid duplicates)
      const mainUrl = bag.image_url;
      const galleryUrls = [...xlsxData.galleryImages].filter(
        (url) => url !== mainUrl
      );
      bag.gallery = galleryUrls;
      enriched++;
    } else {
      bag.description = "";
      bag.gallery = [];
      noMatch++;
    }
  }

  // 5. Save enriched bags.json
  fs.writeFileSync(BAGS_JSON_PATH, JSON.stringify(bags, null, 2), "utf8");

  console.log(`\nDone!`);
  console.log(`  Enriched: ${enriched} items`);
  console.log(`  No XLSX match: ${noMatch} items`);
  console.log(
    `  With description: ${bags.filter((b) => b.description).length}`
  );
  console.log(
    `  With gallery images: ${bags.filter((b) => b.gallery.length > 0).length}`
  );
  console.log(
    `  With product URLs: ${bags.filter((b) => b.product_url.includes("/product/p_")).length}`
  );
}

main();
