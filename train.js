import fs from 'fs-extra';

const apiKey = process.env.GEMINI_API_KEY;
// Pake endpoint Gemini 2.5 Flash andalan lu
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

const dummyTask = "Buatin kode HTML buat form Login sederhana.";

const systemInstruction = `
Lu adalah Senior Code Auditor.
Tugas lu:
1. Buat kode untuk tugas berikut: "${dummyTask}"
2. Langsung kritik kode lu sendiri! Cari kelemahan dari kode yang lu buat.
3. Buat SATU ATURAN KODING BARU berdasarkan kelemahan tadi untuk mencegah hal itu terulang.
4. Output lu HARUS HANYA berupa format JSON valid TANPA markdown, TANPA basa-basi:
{
  "action": "write_file",
  "file_path": "CLAUDE.md",
  "content": "Isi aturan koding baru lu di sini..."
}
`;

async function runTraining() {
  console.log("🧘‍♂️ Ghost Dev bertapa pake Jalur REST API...");

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: systemInstruction }] }],
        generationConfig: { temperature: 0.4 }
      })
    });

    const data = await response.json();
    
    // Cek kalau API Key limit atau error
    if (!data.candidates || data.candidates.length === 0) {
       console.error("❌ Gemini gak ngasih jawaban. Coba cek API Key lu.");
       return;
    }

    let rawText = data.candidates[0].content.parts[0].text.trim();
    
    // TRICK: Bersihin bungkusan markdown AI yang bikin error
    rawText = rawText.replace(/```json/g, "").replace(/```/g, "").trim();

    const aiDecision = JSON.parse(rawText);
    console.log("✅ Evaluasi Selesai!", aiDecision);

    if (aiDecision.action === "write_file") {
      // Tulis file secara paksa dan sinkron
      fs.writeFileSync('./CLAUDE.md', aiDecision.content);
      console.log(`🔥 GACOR! Aturan baru dicatat di ${aiDecision.file_path}`);
    }

  } catch (error) {
    console.error("❌ Waduh, macet Mat:", error.message);
  }
}

runTraining();
