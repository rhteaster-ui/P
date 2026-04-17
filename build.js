import fs from 'fs-extra';

const apiKey = process.env.GEMINI_API_KEY;
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

// 1. BACA ATURAN DARI CLAUDE.MD
let aturanClaude = "";
if (fs.existsSync('./CLAUDE.md')) {
  aturanClaude = fs.readFileSync('./CLAUDE.md', 'utf-8');
  console.log("📖 Ghost Dev baca aturan CLAUDE.md...");
}

// 2. SURAT PERINTAH KERJA (DATA PORTOFOLIO LU)
const tugasPortofolio = `
Buatkan satu file HTML (index.html) lengkap dengan CSS internal (Tailwind CSS via CDN) untuk website portfolio developer.
Data Developer:
- Nama: R_hmt ofc
- Foto Profil: https://res.cloudinary.com/dwiozm4vz/image/upload/v1776154213/fw9vd0pd2wuwl4fosqsz.png (JANGAN buat fotonya jadi bulat/circle).
- Deskripsi: Pengembang web mandiri (self-taught) fokus pada web app, PWA, dan web ringan untuk low-end device, dikembangkan full via device mobile. Telah menyelesaikan 50+ proyek.
- Tech Stack: HTML, CSS, JavaScript, UI/UX Design, React, Vue, Tailwind, FastAPI, TypeScript, Upstash Redis.
- Kontak: WhatsApp Channel (✧･ﾟ: [𝙍]𝙝𝙢𝙏 | 𝘾𝙤𝙙𝙚⚙️𝘼𝙄 𝙡 :･ﾟ✧), Instagram (rahmt_nhw), TikTok (r_hmtofc), GitHub (rahmat-369).

Arah Desain & UI/UX (SANGAT PENTING):
1. Tema: Monochrome (hitam pekat, abu gelap) dengan SATU warna aksen biru dingin (#3B82F6).
2. Mood: Dingin, tenang, elegan, premium, minimalis ala produk teknologi kelas atas (SaaS/Apple).
3. Background: Gradient berlapis (deep, semi 3D) kombinasi hitam pekat, biru gelap, ungu lembut. Tambahkan radial gradient/blur untuk efek glow.
4. Elemen UI: Glassmorphism! Gunakan card semi-transparan dengan backdrop-blur, border tipis opacity rendah, dan shadow lembut.
5. Typography: Font modern & clean (seperti Inter). Banyak whitespace, grid layout rapi.
6. Icon: DILARANG KERAS menggunakan emoji sebagai icon. Gunakan library icon modern (seperti Lucide, FontAwesome, atau SVG minimalis).
7. Animasi: Halus, pelan (fade + gerak ke atas tipis). Hover effect dengan glow biru tipis. Tambahkan animasi 3D icon jika memungkinkan pakai CSS.

Struktur Web: Hero Section -> About -> Projects -> Tech Stack -> Contact.
Teks dari deskripsi boleh dimodifikasi agar lebih menjual tapi jangan ubah esensinya.

PATUHI ATURAN INI JUGA: ${aturanClaude}
`;

const systemInstruction = `
Lu adalah Ghost Dev, Senior Frontend Engineer.
Tugas lu HANYA mengembalikan output berupa JSON valid berisi kode HTML. 
Pastikan semua kode CSS Tailwind dan custom CSS untuk glassmorphism/animasi ada di dalam satu file.
Format output WAJIB seperti ini tanpa markdown \`\`\`json:
{
  "action": "write_file",
  "file_path": "index.html",
  "content": "<!DOCTYPE html><html>...seluruh kode lu...</html>"
}
`;

async function bangunWeb() {
  console.log("👷‍♂️ Ghost Dev lagi ngebangun portofolio premium R_hmt ofc...");

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: tugasPortofolio }] }],
        systemInstruction: { parts: [{ text: systemInstruction }] },
        generationConfig: { temperature: 0.5 } // Setengah kreatif, setengah disiplin
      })
    });

    const data = await response.json();
    let rawText = data.candidates[0].content.parts[0].text.trim();
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").replace(/```html/g, "").trim();

    const aiDecision = JSON.parse(rawText);
    
    if (aiDecision.action === "write_file") {
      fs.writeFileSync('./index.html', aiDecision.content);
      console.log(`🔥 GACOR PARAH! File ${aiDecision.file_path} berhasil dibangun!`);
    }

  } catch (error) {
    console.error("❌ Waduh, Ghost Dev ngambek Mat:", error.message);
  }
}

bangunWeb();
