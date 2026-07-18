import fs from "fs";
import path from "path";
import { authenticateRequest } from "@/lib/adminAuth";

const PRODUCTS_FILE = path.resolve(process.cwd(), "backend/bags.json");

function getProducts() {
  if (!fs.existsSync(PRODUCTS_FILE)) return [];
  return JSON.parse(fs.readFileSync(PRODUCTS_FILE, "utf8"));
}

function saveProducts(products) {
  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), "utf8");
}

export default async function handler(req, res) {
  const decoded = authenticateRequest(req);
  if (!decoded) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const { method } = req;
  const products = getProducts();

  switch (method) {
    case "GET":
      return res.status(200).json(products);

    case "POST":
      try {
        const product = req.body;
        if (!product.title || !product.price || !product.image_url) {
          return res.status(400).json({ error: "Title, price, and image_url are required" });
        }

        // Clean values
        const newProduct = {
          title: product.title.trim(),
          price: product.price.trim().startsWith("$") ? product.price.trim() : `$${product.price.trim()}`,
          image_url: product.image_url.trim(),
          product_url: product.product_url ? product.product_url.trim() : "https://www.faire.com",
          brand: product.brand || "Moroccan Footwear",
          primary_color: product.primary_color || "other",
          primary_color_hex: product.primary_color_hex || "#888888",
          description: product.description ? product.description.trim() : "",
          gallery: Array.isArray(product.gallery) ? product.gallery : [],
        };

        // Add to products array
        products.push(newProduct);
        saveProducts(products);

        return res.status(201).json({ success: true, product: newProduct });
      } catch (err) {
        console.error("Error creating product:", err);
        return res.status(500).json({ error: "Failed to create product" });
      }

    case "PUT":
      try {
        const { index, product } = req.body;
        if (index === undefined || index < 0 || index >= products.length) {
          return res.status(400).json({ error: "Invalid product index" });
        }
        if (!product.title || !product.price || !product.image_url) {
          return res.status(400).json({ error: "Title, price, and image_url are required" });
        }

        const updatedProduct = {
          ...products[index],
          title: product.title.trim(),
          price: product.price.trim().startsWith("$") ? product.price.trim() : `$${product.price.trim()}`,
          image_url: product.image_url.trim(),
          product_url: product.product_url ? product.product_url.trim() : products[index].product_url,
          brand: product.brand || products[index].brand,
          primary_color: product.primary_color || products[index].primary_color,
          primary_color_hex: product.primary_color_hex || products[index].primary_color_hex,
          description: product.description ? product.description.trim() : "",
          gallery: Array.isArray(product.gallery) ? product.gallery : [],
        };

        products[index] = updatedProduct;
        saveProducts(products);

        return res.status(200).json({ success: true, product: updatedProduct });
      } catch (err) {
        console.error("Error updating product:", err);
        return res.status(500).json({ error: "Failed to update product" });
      }

    case "DELETE":
      try {
        const { index } = req.query;
        const idx = parseInt(index, 10);
        if (isNaN(idx) || idx < 0 || idx >= products.length) {
          return res.status(400).json({ error: "Invalid product index" });
        }

        const deleted = products.splice(idx, 1);
        saveProducts(products);

        return res.status(200).json({ success: true, deleted: deleted[0] });
      } catch (err) {
        console.error("Error deleting product:", err);
        return res.status(500).json({ error: "Failed to delete product" });
      }

    default:
      res.setHeader("Allow", ["GET", "POST", "PUT", "DELETE"]);
      return res.status(405).json({ error: `Method ${method} Not Allowed` });
  }
}
