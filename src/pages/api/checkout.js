import Stripe from "stripe";
import fs from "fs";
import path from "path";

const CONTENT_FILE = path.resolve(process.cwd(), "backend/content.json");

function getStripeConfig() {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const content = JSON.parse(fs.readFileSync(CONTENT_FILE, "utf8"));
      return content.stripe || { enabled: false, currency: "usd" };
    }
  } catch (e) {
    console.error("Error reading stripe configuration:", e);
  }
  return { enabled: false, currency: "usd" };
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ error: "Method not allowed" });
  }

  const stripeConfig = getStripeConfig();
  // If CMS Stripe integration is disabled globally, return 400
  if (stripeConfig.enabled === false) {
    return res.status(400).json({ error: "Checkout is currently disabled." });
  }

  const apiKey = process.env.STRIPE_SECRET_KEY;
  if (!apiKey) {
    console.error("Missing STRIPE_SECRET_KEY environment variable");
    return res.status(500).json({ error: "Payment gateway is not configured." });
  }

  try {
    const { title, price, image } = req.body;

    if (!title || !price) {
      return res.status(400).json({ error: "Title and price are required." });
    }

    // Convert price string (e.g. "$86" or "86") to cents
    let numericPrice = parseFloat(price.replace(/[^0-9.]/g, ""));
    if (isNaN(numericPrice)) {
      return res.status(400).json({ error: "Invalid price format." });
    }
    const amountInCents = Math.round(numericPrice * 100);

    const stripeInstance = new Stripe(apiKey, {
      apiVersion: "2023-10-16",
    });

    const protocol = req.headers["x-forwarded-proto"] || "http";
    const host = req.headers.host;
    const origin = `${protocol}://${host}`;

    // Construct image URL (Stripe Checkout requires absolute URLs)
    const lineItemImages = [];
    if (image) {
      if (image.startsWith("http")) {
        lineItemImages.push(image);
      } else {
        lineItemImages.push(`${origin}${image}`);
      }
    }

    const session = await stripeInstance.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: stripeConfig.currency || "usd",
            product_data: {
              name: title,
              images: lineItemImages,
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cancel`,
    });

    return res.status(200).json({ success: true, url: session.url });
  } catch (error) {
    console.error("Stripe Checkout Error:", error);
    return res.status(500).json({ error: error.message || "Failed to create checkout session." });
  }
}
