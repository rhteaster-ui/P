import fs from 'fs-extra';

const apiKey = process.env.GEMINI_API_KEY;
// Endpoint sakti pilihan lu
const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

const dummyTask = "Buatin kode HTML buat tombol Login sederhana.";

const systemInstruction = `
Lu adalah Senior Code Auditor.
Tugas lu:
1. Buat kode untuk tugas berikut: "${dummyTask}"
2. Langsung kritik kode lu sendiri! Cari kelemahannya.
3. Buat SATU ATURAN KODING BARU berdasarkan kelemahan tadi.
4. Output lu HARUS HANYA berupa JSON valid:
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
    
    // Ambil teks hasil mikir Gemini
    let rawText = data.candidates[0].content.parts[0].text.trim();
    
    // Bersihin kalo AI-nya bandel ngasih markdown
    rawText = rawText.replace(/```json|```/g, "");

    const aiDecision = JSON.parse(rawText);
    console.log("✅ Evaluasi Selesai!", aiDecision);

    if (aiDecision.action === "write_file") {
      fs.outputFileSync(aiDecision.file_path, aiDecision.content);
      console.log(`🔥 GACOR! Aturan baru dicatat di ${aiDecision.file_path}`);
    }

  } catch (error) {
    console.error("❌ Waduh, Jalur API-nya macet Mat:", error.message);
  }
}

runTraining();
