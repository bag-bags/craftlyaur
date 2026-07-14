export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(455).json({ error: "Method Not Allowed" });
  }

  const { name, email, message } = req.body;

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ error: "Name, email, and message are required." });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.error("Missing environment variables: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID");
    return res.status(500).json({
      error: "Server configuration error. Please setup Telegram environment variables.",
    });
  }

  // Format message for Telegram
  const formattedText = `*📩 New Message from Moroccan Crafts Finder*
  
👤 *Name:* ${name.replace(/[_*`[\]()]/g, "")}
✉️ *Email:* ${email.replace(/[_*`[\]()]/g, "")}

💬 *Message:*
${message.replace(/[_*`[\]()]/g, "")}`;

  try {
    const telegramUrl = `https://api.telegram.org/bot${token}/sendMessage`;
    const response = await fetch(telegramUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: formattedText,
        parse_mode: "Markdown",
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error("Telegram API Error:", data);
      return res.status(500).json({ error: "Failed to send message to Telegram." });
    }

    return res.status(200).json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Error sending message to Telegram:", error);
    return res.status(500).json({ error: "Internal Server Error." });
  }
}
