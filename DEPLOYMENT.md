# Panduan Deployment ke Vercel

Project ini sudah siap untuk dideploy ke Vercel!

## Prasyarat
- Akun GitHub (Repo: `justlyznn/ChatBot_DaxAssistant`)
- Akun Vercel (Login dengan GitHub)
- Gemini API Key

## Langkah-langkah

1. **Login ke Vercel Dashboard**
   - Buka [Vercel Dashboard](https://vercel.com/dashboard)
   - Login menggunakan akun GitHub Anda.

2. **Add New Project**
   - Klik tombol **"Add New..."** > **"Project"**
   - Di bagian "Import Git Repository", cari repository **`ChatBot_DaxAssistant`**
   - Klik **Compute** / **Import**

3. **Configure Project**
   Vercel akan otomatis mendeteksi settingan Vite.
   
   - **Framework Preset**: Vite (Biarkan default)
   - **Root Directory**: `./` (Biarkan default)
   - **Build & Output Settings**: (Biarkan default)

4. **Environment Variables (PENTING)**
   Anda HARUS menambahkan Environment Variable agar chatbot bisa berjalan:
   
   - Expand bagian **Environment Variables**
   - Key: `VITE_GEMINI_API_KEY`
   - Value: `[Masukkan API Key Gemini Anda di sini]`
     *(Sama seperti yang ada di file .env Anda)*
   - Klik **Add**

5. **Deploy**
   - Klik tombol **Deploy**
   - Tunggu proses build selesai (sekitar 1-2 menit)

6. **Selesai!**
   - Link aplikasi Anda akan muncul (contoh: `https://chatbot-daxassistant.vercel.app`)

---
**Catatan untuk Update:**
Setiap kali Anda melakukan `git push` ke GitHub, Vercel akan otomatis melakukan redeploy dengan perubahan terbaru.
