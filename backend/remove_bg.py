import os
import json
import requests
from io import BytesIO
from PIL import Image

try:
    from rembg import remove
except ImportError:
    print("\n[!] Please install rembg first by running:")
    print("    pip install rembg pillow requests tqdm\n")
    exit(1)

try:
    from tqdm import tqdm
    HAS_TQDM = True
except ImportError:
    HAS_TQDM = False

# Path configuration
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
JSON_PATH = os.path.join(BASE_DIR, "bags.json")
OUTPUT_DIR = os.path.join(BASE_DIR, "..", "public", "bags")

def main():
    # Load JSON data
    if not os.path.exists(JSON_PATH):
        print(f"Error: JSON file not found at {JSON_PATH}")
        return

    with open(JSON_PATH, "r", encoding="utf-8") as f:
        data = json.load(f)

    # Ensure output directory exists
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    print(f"Loaded {len(data)} items from {JSON_PATH}")
    print("Starting background removal...")

    modified_count = 0
    iterator = enumerate(data)
    if HAS_TQDM:
        iterator = tqdm(iterator, total=len(data), desc="Processing images")

    for i, item in iterator:
        image_url = item.get("image_url", "")
        
        # Check if the image is remote (starts with http)
        if image_url.startswith("http"):
            # Generate a local name for the transparent image
            clean_title = "".join(c if c.isalnum() else "_" for c in item["title"][:20]).strip("_")
            filename = f"bag_{i}_{clean_title.lower()}.png"
            local_path = os.path.join(OUTPUT_DIR, filename)
            
            # Skip if already downloaded and processed
            if os.path.exists(local_path):
                # Update URL in JSON
                item["image_url"] = f"/bags/{filename}"
                continue

            try:
                # 1. Download image
                response = requests.get(image_url, timeout=15)
                if response.status_code != 200:
                    print(f"\n[!] Failed to download {image_url}")
                    continue
                
                # 2. Open image with PIL
                img = Image.open(BytesIO(response.content))
                
                # 3. Remove background locally (retains original resolution)
                output_img = remove(img)
                
                # 4. Save as transparent PNG
                output_img.save(local_path, "PNG")
                
                # 5. Update the path in the JSON to point to public assets
                item["image_url"] = f"/bags/{filename}"
                modified_count += 1
                
                if not HAS_TQDM:
                    print(f"Processed: {item['title'][:30]}... -> {filename}")

            except Exception as e:
                print(f"\n[!] Error processing item {i} ({item['title'][:30]}): {e}")

    # Save the updated JSON back
    if modified_count > 0 or any(not item.get("image_url", "").startswith("http") for item in data):
        with open(JSON_PATH, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        print(f"\n[+] Success! Updated {modified_count} image paths in bags.json.")
        print(f"[+] All transparent images are saved under: public/bags/")
    else:
        print("\n[-] No images were processed.")

if __name__ == "__main__":
    main()
