require("dotenv").config();
const { Telegraf } = require("telegraf");
const axios = require("axios");

const bot = new Telegraf(process.env.BOT_TOKEN);
const API_URL = process.env.API_URL;

// 📜 Command /start
bot.start((ctx) => {
  const message = `<b>💠 Nezuko License Bot</b>
━━━━━━━━━━━━━━━
Selamat datang, ${ctx.from.first_name}!

Ketik /menu untuk melihat daftar perintah yang tersedia. 📑✨
━━━━━━━━━━━━━━━`;

  ctx.reply(message, { parse_mode: "HTML" });
});

// 📜 Command /menu
bot.command("menu", (ctx) => {
  const menu = `<b>📑 Nezuko License Bot Menu</b>
━━━━━━━━━━━━━━━
• /addtoken <code>TOKEN</code> — Tambah token baru
• /deltoken <code>TOKEN</code> — Hapus token dari database
• /cektoken <code>TOKEN</code> — Cek apakah token terdaftar
• /listtoken — Tampilkan semua token di database
• /setstatus <code>TOKEN</code> <code>valid|invalid</code> — Ubah status token
━━━━━━━━━━━━━━━`;

  ctx.reply(menu, { parse_mode: "HTML" });
});

// 📜 Command Add Token
bot.command("addtoken", async (ctx) => {
  const token = ctx.message.text.split(" ")[1];
  if (!token) return ctx.reply("❌ Token kosong.");
  try {
    const res = await axios.post(`${API_URL}/tokens`, { token });
    ctx.reply(res.data.message);
  } catch (e) {
    ctx.reply(e.response?.data?.message || "❌ Gagal tambah token.");
  }
});

// 📜 Command Delete Token
bot.command("deltoken", async (ctx) => {
  const token = ctx.message.text.split(" ")[1];
  if (!token) return ctx.reply("❌ Token kosong.");
  try {
    const res = await axios.delete(`${API_URL}/tokens`, { data: { token } });
    ctx.reply(res.data.message);
  } catch (e) {
    ctx.reply(e.response?.data?.message || "❌ Gagal hapus token.");
  }
});

// 📜 Command Cek Token
bot.command("cektoken", async (ctx) => {
  const token = ctx.message.text.split(" ")[1];
  if (!token) return ctx.reply("❌ Token kosong.");
  try {
    const res = await axios.get(`${API_URL}/tokens`);
    const tokens = res.data.tokens;
    if (tokens.find(t => t.token === token)) {
      ctx.reply(`✅ Token ${token} ditemukan di database.`);
    } else {
      ctx.reply(`❌ Token ${token} tidak ditemukan.`);
    }
  } catch (e) {
    ctx.reply("❌ Gagal cek token.");
  }
});

// 📜 Command List Token
bot.command("listtoken", async (ctx) => {
  try {
    const res = await axios.get(`${API_URL}/tokens`);
    const tokens = res.data.tokens;
    if (tokens.length === 0) return ctx.reply("❌ Belum ada token di database.");

    let list = `📜 <b>Daftar Token:</b>\n━━━━━━━━━━━━━━━\n`;
    tokens.forEach((t, i) => {
      list += `• <code>${t.token}</code> — <b>${t.status}</b>\n`;
    });
    ctx.reply(list, { parse_mode: "HTML" });
  } catch (e) {
    ctx.reply("❌ Gagal ambil daftar token.");
  }
});

// 📜 Command Set Status
bot.command("setstatus", async (ctx) => {
  const args = ctx.message.text.split(" ");
  if (args.length < 3) return ctx.reply("❌ Format salah.\nContoh: /setstatus ABC123 valid");

  const token = args[1];
  const status = args[2].toLowerCase();

  if (status !== "valid" && status !== "invalid") {
    return ctx.reply("❌ Status cuma bisa 'valid' atau 'invalid'");
  }

  try {
    const res = await axios.put(`${API_URL}/tokenstatus`, { token, status });
    ctx.reply(res.data.message);
  } catch (e) {
    ctx.reply(e.response?.data?.message || "❌ Gagal ubah status token.");
  }
});

// ✅ Launch bot
bot.launch();
console.log("♡ Nezuko License Bot aktif! ♡");
console.log("📜 Ketik /start atau /menu di bot Telegram untuk buka daftar menu.");