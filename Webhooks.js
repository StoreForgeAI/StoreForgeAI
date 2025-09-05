// server.js
import express from "express";
import getRawBody from "raw-body";
import crypto from "crypto";

const app = express();
const PORT = process.env.PORT || 3000;

// --- Keep raw body for HMAC verification ---
app.use((req, res, next) => {
  if (req.method === "POST" && req.url.startsWith("/webhooks/")) {
    getRawBody(req)
      .then((buf) => {
        req.rawBody = buf;
        try {
          req.body = JSON.parse(buf.toString("utf8"));
        } catch {
          req.body = {}; // some webhooks may be empty JSON
        }
        next();
      })
      .catch(next);
  } else {
    next();
  }
});

// --- HMAC verification middleware ---
function verifyShopifyWebhook(req, res, next) {
  const secret = process.env.SHOPIFY_API_SECRET; // APP CLIENT SECRET
  const hmacHeader = req.get("X-Shopify-Hmac-Sha256");
  if (!secret || !hmacHeader || !req.rawBody) return res.sendStatus(401);

  const digest = crypto
    .createHmac("sha256", secret)
    .update(req.rawBody, "utf8")
    .digest("base64");

  if (crypto.timingSafeEqual(Buffer.from(digest), Buffer.from(hmacHeader))) {
    return next();
  }
  return res.sendStatus(401);
}

// --- Helpers you implement (DB lookups/deletions/etc.) ---
async function provideCustomerData(payload) {
  // payload.customer.id, payload.customer.email, etc.
  // Gather & send data to the store owner off-channel (email/portal),
  // and/or log that you fulfilled the request.
}

async function eraseCustomerData(payload) {
  // Delete/anonymize any PII for the customer across your DB.
}

async function eraseShopData(payload) {
  // Delete/anonymize any shop-scoped data your app stored for this shop domain.
}

// --- Endpoints ---
app.post("/webhooks/customers/data_request", verifyShopifyWebhook, async (req, res) => {
  const shop = req.get("X-Shopify-Shop-Domain");
  const topic = req.get("X-Shopify-Topic"); // "customers/data_request"
  try {
    await provideCustomerData(req.body);
    // Always respond quickly; do heavy work async.
    res.sendStatus(200);
  } catch (e) {
    console.error("data_request failed", shop, topic, e);
    res.sendStatus(500);
  }
});

app.post("/webhooks/customers/redact", verifyShopifyWebhook, async (req, res) => {
  const shop = req.get("X-Shopify-Shop-Domain");
  const topic = req.get("X-Shopify-Topic"); // "customers/redact"
  try {
    await eraseCustomerData(req.body);
    res.sendStatus(200);
  } catch (e) {
    console.error("customers/redact failed", shop, topic, e);
    res.sendStatus(500);
  }
});

app.post("/webhooks/shop/redact", verifyShopifyWebhook, async (req, res) => {
  const shop = req.get("X-Shopify-Shop-Domain");
  const topic = req.get("X-Shopify-Topic"); // "shop/redact"
  try {
    await eraseShopData(req.body);
    res.sendStatus(200);
  } catch (e) {
    console.error("shop/redact failed", shop, topic, e);
    res.sendStatus(500);
  }
});

app.get("/", (_req, res) => res.send("OK"));
app.listen(PORT, () => console.log(`GDPR webhooks listening on :${PORT}`));
