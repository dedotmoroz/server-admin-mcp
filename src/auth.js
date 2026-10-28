import crypto from "node:crypto";
import { scryptSync, timingSafeEqual } from "node:crypto";

const clients = new Map();
const codes = new Map();
const tokens = new Map();
const attempts = new Map();
const url = process.env.MCP_PUBLIC_URL?.replace(/\/$/, "");
const passwordHash = process.env.MCP_ADMIN_PASSWORD_HASH;
const enabled = process.env.MCP_AUTH_MODE === "oauth";
if (enabled && (!url?.startsWith("https://") || !passwordHash || !/^[a-f0-9]{32}:[a-f0-9]{128}$/i.test(passwordHash))) {
  throw new Error("OAuth requires HTTPS MCP_PUBLIC_URL and MCP_ADMIN_PASSWORD_HASH (salt:hex scrypt)");
}
const random = () => crypto.randomBytes(32).toString("base64url");
const sha256 = (value) => crypto.createHash("sha256").update(value).digest("base64url");
const validRedirect = (value) => {
  try {
    const u = new URL(value);
    return !u.username && !u.password && !u.hash && (
      u.protocol === "https:" || (u.protocol === "http:" && ["127.0.0.1", "localhost", "[::1]"].includes(u.hostname))
    );
  } catch { return false; }
};
const same = (a, b) => {
  const x = Buffer.from(a), y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
};
const checkPassword = (value) => {
  const [salt, expected] = passwordHash.split(":");
  return same(scryptSync(value, Buffer.from(salt, "hex"), 64), Buffer.from(expected, "hex"));
};
const cleanup = () => {
  const now = Date.now();
  for (const [k, v] of codes) if (v.expires < now) codes.delete(k);
  for (const [k, v] of tokens) if (v.expires < now) tokens.delete(k);
};
const escape = (s) => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));

export function installAuth(app) {
  if (!enabled) return (req, res, next) => next();
  app.get("/.well-known/oauth-protected-resource", (req, res) => res.json({
    resource: url + "/mcp", authorization_servers: [url],
    bearer_methods_supported: ["header"]
  }));
  app.get("/.well-known/oauth-protected-resource/mcp", (req, res) => res.json({
    resource: url + "/mcp", authorization_servers: [url], bearer_methods_supported: ["header"]
  }));
  app.get("/.well-known/oauth-authorization-server", (req, res) => res.json({
    issuer: url, authorization_endpoint: url + "/authorize",
    token_endpoint: url + "/token", registration_endpoint: url + "/register",
    response_types_supported: ["code"], grant_types_supported: ["authorization_code"],
    code_challenge_methods_supported: ["S256"],
    token_endpoint_auth_methods_supported: ["none"]
  }));
  app.post("/register", (req, res) => {
    const { redirect_uris, token_endpoint_auth_method = "none" } = req.body ?? {};
    if (!Array.isArray(redirect_uris) || redirect_uris.length < 1 || redirect_uris.length > 10 ||
      redirect_uris.some(x => typeof x !== "string" || !validRedirect(x)) ||
      token_endpoint_auth_method !== "none") return res.status(400).json({ error: "invalid_client_metadata" });
    const client_id = random();
    clients.set(client_id, { redirect_uris });
    res.status(201).json({ client_id, redirect_uris, token_endpoint_auth_method: "none",
      grant_types: ["authorization_code"], response_types: ["code"] });
  });
  function validateAuthorization(q) {
    const client = clients.get(q.client_id);
    if (!client || !client.redirect_uris.includes(q.redirect_uri) || q.response_type !== "code" ||
      typeof q.code_challenge !== "string" || !/^[A-Za-z0-9_-]{43}$/.test(q.code_challenge) ||
      q.code_challenge_method !== "S256" || q.resource !== url + "/mcp") return false;
    return true;
  }
  app.get("/authorize", (req, res) => {
    if (!validateAuthorization(req.query)) return res.status(400).send("Invalid OAuth request");
    const nonce = random();
    codes.set("login:" + nonce, { query: { ...req.query }, expires: Date.now() + 300000 });
    res.set("Cache-Control", "no-store").type("html").send(
      '<!doctype html><html><head><meta charset="utf-8"><title>Server Admin MCP</title></head><body>' +
      '<h2>Authorize Server Admin MCP</h2><p>This client will be able to execute commands on this server.</p>' +
      '<form method="post" action="/authorize"><input type="hidden" name="nonce" value="' + escape(nonce) + '">' +
      '<label>Admin password <input type="password" name="password" required autocomplete="current-password"></label>' +
      '<button type="submit">Authorize</button></form></body></html>'
    );
  });
  app.post("/authorize", (req, res) => {
    const key = "login:" + req.body?.nonce;
    const entry = codes.get(key);
    codes.delete(key);
    const ip = req.ip;
    const state = attempts.get(ip) ?? { count: 0, until: 0 };
    if (state.until > Date.now()) return res.status(429).send("Too many attempts");
    if (!entry || entry.expires < Date.now() || !validateAuthorization(entry.query))
      return res.status(400).send("Invalid or expired authorization");
    if (typeof req.body.password !== "string" || !checkPassword(req.body.password)) {
      state.count += 1;
      if (state.count >= 5) { state.until = Date.now() + 15 * 60_000; state.count = 0; }
      attempts.set(ip, state);
      return res.status(401).send("Invalid password");
    }
    attempts.delete(ip);
    const q = entry.query;
    const code = random();
    codes.set(code, { client_id: q.client_id, redirect_uri: q.redirect_uri,
      challenge: q.code_challenge, expires: Date.now() + 300000 });
    const redirect = new URL(q.redirect_uri);
    redirect.searchParams.set("code", code);
    if (typeof q.state === "string") redirect.searchParams.set("state", q.state);
    res.redirect(302, redirect.toString());
  });
  app.post("/token", (req, res) => {
    cleanup();
    const { grant_type, client_id, code, redirect_uri, code_verifier, resource } = req.body ?? {};
    const entry = codes.get(code);
    if (typeof code === "string") codes.delete(code);
    if (grant_type !== "authorization_code" || !entry || entry.expires < Date.now() ||
      entry.client_id !== client_id || entry.redirect_uri !== redirect_uri ||
      resource !== url + "/mcp" || typeof code_verifier !== "string" ||
      !/^[A-Za-z0-9._~-]{43,128}$/.test(code_verifier) || !same(sha256(code_verifier), entry.challenge))
      return res.status(400).json({ error: "invalid_grant" });
    const access_token = random();
    tokens.set(access_token, { expires: Date.now() + 3600_000, client_id });
    res.set("Cache-Control", "no-store").json({ access_token, token_type: "Bearer", expires_in: 3600 });
  });
  return (req, res, next) => {
    cleanup();
    const header = req.get("authorization") ?? "";
    const match = /^Bearer (\S+)$/i.exec(header);
    const token = match && tokens.get(match[1]);
    if (!token || token.expires < Date.now()) {
      res.set("WWW-Authenticate", 'Bearer realm="MCP", resource_metadata="' + url +
        '/.well-known/oauth-protected-resource", error="invalid_token"');
      return res.status(401).json({ error: "unauthorized" });
    }
    next();
  };
}

export const oauthEnabled = enabled;
