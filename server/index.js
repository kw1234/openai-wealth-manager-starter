const express = require("express");
const session = require("express-session");
const { Configuration, OpenAIApi } = require("openai");
const plaid = require("plaid");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(session({ secret: "secret", resave: false, saveUninitialized: true }));

const openai = new OpenAIApi(new Configuration({ apiKey: process.env.OPENAI_API_KEY }));

const plaidClient = new plaid.PlaidApi(new plaid.Configuration({
  basePath: plaid.PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      "PLAID-CLIENT-ID": process.env.PLAID_CLIENT_ID,
      "PLAID-SECRET": process.env.PLAID_SECRET
    }
  }
}));

app.get("/api/connect/plaid", async (req, res) => {
  const tokenResponse = await plaidClient.linkTokenCreate({
    user: { client_user_id: "1234" },
    client_name: "Wealth Manager",
    products: ["transactions", "investments"],
    country_codes: ["US"],
    language: "en",
    redirect_uri: "http://localhost:3000/plaid-redirect"
  });
  res.json({ url: `https://sandbox.plaid.com/link?token=${tokenResponse.data.link_token}` });
});

app.post("/api/connect/exchange", async (req, res) => {
  const { public_token } = req.body;
  try {
    const tokenResponse = await plaidClient.itemPublicTokenExchange({ public_token });
    const access_token = tokenResponse.data.access_token;
    req.session.access_token = access_token;
    res.json({ status: "ok" });
  } catch (err) {
    res.status(500).json({ error: "Token exchange failed" });
  }
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;
  const response = await openai.createChatCompletion({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a helpful wealth manager assistant." },
      { role: "user", content: message }
    ]
  });
  res.json({ role: "assistant", content: response.data.choices[0].message.content });
});

app.listen(4000, () => console.log("Server running on http://localhost:4000"));
