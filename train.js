import { GoogleGenAI } from '@google/genai';
import fs from 'fs-extra';

const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey });

// Kita kasih tugas pancingan buat ngetes kecerobohan AI
const dummyTask = "Buatin kode HTML buat tombol Login sederhana.";

// "Mantra" khusus mode Auditor
const systemInstruction = `
Lu adalah Senior Code Auditor.
Tugas lu:
1. Buat kode untuk tugas berikut: "${dummyTask}"
2. Langsung kritik kode lu sendiri! Cari kelemahannya (misal: kurang aman, gak aksesibel, atau desain jelek).
3. Buat SATU ATURAN KODING BARU berdasarkan kelemahan tadi biar lu gak ngulangin kesalahan yang sama.
4. Simpan aturan itu ke file panduan dengan format JSON berikut tanpa basa-basi:
{
  "action": "write_file",
  "file_path": "CLAUDE.md",
  "content": "Tulis aturan koding hasil evaluasi lu di sini..."
}
`;

async function runTraining() {
  console.log("🧘‍♂️ Ghost Dev lagi bertapa dan mengevaluasi diri...");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: "Mulai evaluasi diri lu sekarang.",
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.4, // Sedikit lebih kreatif biar jago nyari celah kodenya sendiri
      }
    });

    let rawText = response.text.trim();
    if (rawText.startsWith('```json')) rawText = rawText.slice(7, -3);
    else if (rawText.startsWith('```')) rawText = rawText.slice(3, -3);

    const aiDecision = JSON.parse(rawText.trim());
    console.log("✅ Evaluasi Selesai! Keputusan AI:", aiDecision);

    // EKSEKUSI PENULISAN BUKU HARIAN
    if (aiDecision.action === "write_file" && aiDecision.file_path === "CLAUDE.md") {
      fs.outputFileSync(aiDecision.file_path, aiDecision.content);
      console.log(`🔥 GACOR! AI lu barusan nulis aturan barunya sendiri di ${aiDecision.file_path}!`);
    }

  } catch (error) {
    console.error("❌ Waduh, gagal bertapa Mat:", error.message);
  }
}

runTraining(); 
