import { GoogleGenAI } from '@google/genai'
import { getData } from '../data/storage'

// Ambil API Key dari .env
const apiKey = import.meta.env.VITE_GEMINI_API_KEY
const ai = new GoogleGenAI({ apiKey })

export async function askGeminiSavings(userQuestion, imageObj = null) {
  try {
    // Ambil data tabungan & transaksi user
    const userData = getData() || {}
    
    // Rangkum data user untuk konteks AI
    const contextData = {
      nama: userData.profile?.nama || 'Pengguna',
      totalTarget: userData.targets?.length || 0,
      targets: userData.targets?.map(t => ({
        nama: t.nama || t.title,
        targetAmount: t.targetNominal || t.target,
        currentAmount: t.terkumpul || t.current || 0
      })) || [],
      totalTransaksi: userData.transaksi?.length || 0
    }

    const promptText = `
Kamu adalah "NabungAH AI", seorang asisten/penasihat keuangan pribadi yang ramah, solutif, dan ahli dalam strategi menabung.

Konteks Pengguna Saat Ini:
- Nama: ${contextData.nama}
- Daftar Target Tabungan: ${JSON.stringify(contextData.targets)}

Pertanyaan/Permintaan Pengguna: "${userQuestion}"

Aturan Jawaban:
1. Jika pengguna melampirkan gambar barang/produk:
   - Analisis nama barang/produk dalam gambar.
   - Perkirakan kisaran harga pasarnya di Indonesia secara realistis (berikan estimasi nominal angka Rp).
   - Berikan rekomendasi/simulasi strategi menabung (misal: berapa per hari / minggu / bulan untuk mencapai target tersebut).
2. Jawab dengan bahasa Indonesia yang santai, menyemangati, mudah dipahami, dan ringkas.
3. Gunakan format poin (bullet points) agar rapi.
`

    // Susun payload request
    const contents = [promptText];

    // Jika ada gambar yang diunggah, sertakan sebagai inlineData
    if (imageObj && imageObj.base64 && imageObj.mimeType) {
      contents.push({
        inlineData: {
          data: imageObj.base64,
          mimeType: imageObj.mimeType
        }
      });
    }

    // Panggil model Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
    })

    return response.text
  } catch (error) {
    console.error('Gemini Error:', error)

    // Deteksi jika server sibuk / error 503 / high demand
    const errorString = JSON.stringify(error) + ' ' + (error.message || '')
    if (
      errorString.includes('503') || 
      errorString.includes('high demand') || 
      errorString.includes('UNAVAILABLE')
    ) {
      return '⚠️ Server AI saat ini sedang penuh karena banyaknya permintaan. Silakan coba kirim ulang pesanmu beberapa saat lagi, ya!'
    }

    // Pesan error umum lainnya
    return `Maaf, terjadi kendala koneksi: ${error.message || 'Gagal terhubung ke server.'}`
  }
}
