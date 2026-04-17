Berikut adalah kode HTML untuk form login sederhana:

html
<form action="/login" method="post">
    <label for="username">Username:</label>
    <input type="text" id="username" name="username" required><br><br>

    <label for="password">Password:</label>
    <input type="password" id="password" name="password" required><br><br>

    <button type="submit">Login</button>
</form>


**Kritik Kode Sendiri:**
Kelemahan utama dari kode di atas adalah penggunaan tag `<br><br>` untuk membuat spasi dan baris baru antara elemen-elemen form. Ini adalah praktik yang buruk karena:
1.  **Pelanggaran Pemisahan Kekhawatiran (Separation of Concerns):** `<br>` adalah elemen struktural, namun di sini digunakan untuk tujuan presentasi (layout/spasi). Layout dan styling seharusnya ditangani oleh CSS.
2.  **Kurangnya Semantik:** Penggunaan `<br>` tidak memberikan makna semantik tentang bagaimana elemen-elemen form saling berhubungan atau dikelompokkan secara logis.
3.  **Sulit untuk Dikembangkan dan Dipelihara:** Jika layout perlu diubah (misalnya, menjadi dua kolom atau responsif), mengandalkan `<br>` akan sangat menyulitkan dan memerlukan perubahan HTML yang ekstensif, bukan hanya CSS.
4.  **Aksesibilitas:** Meskipun label sudah ada, penggunaan `<br>` untuk layout bisa membuat struktur dokumen kurang jelas bagi assistive technologies dibandingkan dengan penggunaan elemen pengelompokan yang tepat.

**Aturan Koding Baru:**
HTML forms MUST use semantic grouping elements (e.g., `div`, `fieldset`) and CSS for layout and spacing, instead of relying on `<br>` tags. Each form control and its label should ideally be wrapped within a container (e.g., `div.form-group`) to facilitate consistent styling, better structure, and improved accessibility.