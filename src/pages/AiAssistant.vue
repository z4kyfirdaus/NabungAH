<template>
  <div class="ai-page">
    <div class="content-wrapper">
      
      <!-- HEADER -->
      <div class="header">
        <div class="header-title-wrapper">
          <div class="header-icon-box">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2a8 8 0 0 0-8 8c0 5.25 7 13 8 13s8-7.75 8-13a8 8 0 0 0-8-8z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
          </div>
          <div>
            <h1>NabungAH AI</h1>
            <p class="subtitle">Asisten Cerdas Keuangan & Tabunganmu</p>
          </div>
        </div>
      </div>

      <!-- QUICK SUGGESTIONS -->
      <div class="quick-prompts">
        <p class="section-label">Pilih topik cepat:</p>
        <div class="prompt-chips">
          <button 
            v-for="(item, index) in quickPrompts" 
            :key="index"
            class="chip-btn"
            @click="sendQuickPrompt(item)"
          >
            {{ item }}
          </button>
        </div>
      </div>

      <!-- CHAT / MESSAGES LIST -->
      <div class="chat-container">
        <div 
          v-for="(msg, index) in messages" 
          :key="index" 
          :class="['message-bubble', msg.role]"
        >
          <div class="badge-role" v-if="msg.role === 'ai'">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
            </svg>
            NabungAH AI
          </div>

          <!-- DOKUMEN / GAMBAR USER DALAM CHAT -->
          <div v-if="msg.imagePreview" class="chat-image-box">
            <img :src="msg.imagePreview" alt="Gambar Barang" />
          </div>

          <div class="markdown-body" v-html="formatText(msg.text)"></div>
        </div>

        <!-- LOADING STATE -->
        <div v-if="loading" class="message-bubble ai loading-bubble">
          <div class="spinner"></div>
          <p>NabungAH AI sedang menganalisis & menyusun saran...</p>
        </div>
      </div>

      <!-- INPUT FORM AREA -->
      <div class="input-container-wrapper">
        
        <!-- PREVIEW GAMBAR SEBELUM DIKIRIM -->
        <div v-if="selectedImage" class="image-preview-bar">
          <img :src="selectedImage.previewUrl" alt="Preview" />
          <div class="preview-info">
            <span>Foto terlampir</span>
            <button type="button" class="btn-remove-img" @click="removeImage">✕</button>
          </div>
        </div>

        <form @submit.prevent="handleAsk" class="input-card">
          <!-- HIDDEN FILE INPUT -->
          <input 
            type="file" 
            ref="fileInput" 
            accept="image/*" 
            style="display: none;" 
            @change="handleFileChange" 
          />

          <!-- TOMBOL UPLOAD GAMBAR -->
          <button 
            type="button" 
            class="btn-attach" 
            @click="triggerFileInput"
            :disabled="loading"
            title="Upload Foto Barang"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
          </button>

          <!-- INPUT TEXT -->
          <input 
            v-model="userQuery"
            type="text" 
            placeholder="Tanyakan atau upload foto barang..."
            :disabled="loading"
          />

          <!-- TOMBOL KIRIM -->
          <button type="submit" class="btn-send" :disabled="loading || (!userQuery.trim() && !selectedImage)">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { askGeminiSavings } from '../services/gemini';
import { loadChatFromFirestore, saveMessageToFirestore } from '../services/chatFirestore';

const userQuery = ref('');
const messages = ref([]);
const loading = ref(false);
const fileInput = ref(null);
const selectedImage = ref(null); // Menyimpan { base64, mimeType, previewUrl }

const quickPrompts = [
  'Bagaimana cara mencapai targetku lebih cepat?',
  'Beri tips hemat untuk mahasiswa / pekerja harian',
  'Buatkan alokasi gaji ideal (metode 50/30/20)',
  'Trik menahan rasa ingin beli barang impulsif'
];

onMounted(async () => {
  loading.value = true;
  try {
    const history = await loadChatFromFirestore();
    if (Array.isArray(history) && history.length > 0) {
      messages.value = history;
    } else {
      const welcomeMsg = 'Halo 👋 Ada yang bisa saya bantu tentang strategi menabungmu hari ini? Kamu juga bisa kirim foto barang yang ingin kamu beli!';
      messages.value = [{ role: 'ai', text: welcomeMsg }];
      await saveMessageToFirestore('ai', welcomeMsg);
    }
  } catch (error) {
    console.error('Gagal memuat chat dari Firestore:', error);
    if (messages.value.length === 0) {
      messages.value = [{ role: 'ai', text: 'Halo 👋 Ada yang bisa saya bantu tentang strategi menabungmu hari ini?' }];
    }
  } finally {
    loading.value = false;
  }
});

const triggerFileInput = () => {
  fileInput.value.click();
};

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    const dataUrl = reader.result;
    const base64Data = dataUrl.split(',')[1];
    
    selectedImage.value = {
      base64: base64Data,
      mimeType: file.type,
      previewUrl: dataUrl
    };
  };
  reader.readAsDataURL(file);
};

const removeImage = () => {
  selectedImage.value = null;
  if (fileInput.value) fileInput.value.value = '';
};

const formatText = (text) => {
  if (!text) return '';
  return text
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\* (.*?)(<br>|$)/g, '• $1<br>');
};

const handleAsk = async () => {
  if ((!userQuery.value.trim() && !selectedImage.value) || loading.value) return;

  const promptText = userQuery.value.trim() || 'Kira-kira saya ingin nabung ini berapa?';
  const imageToUpload = selectedImage.value;

  userQuery.value = '';
  selectedImage.value = null;
  if (fileInput.value) fileInput.value.value = '';

  // 1. Tampilkan pesan user ke UI
  const userMsg = {
    role: 'user',
    text: promptText,
    imagePreview: imageToUpload ? imageToUpload.previewUrl : null
  };
  messages.value.push(userMsg);

  try {
    await saveMessageToFirestore('user', promptText);
  } catch (e) {
    console.warn('Gagal simpan ke Firestore:', e);
  }

  loading.value = true;

  try {
    // 2. Minta respon dari Gemini dengan membawa gambar
    const reply = await askGeminiSavings(promptText, imageToUpload);

    // 3. Tampilkan balasan AI
    messages.value.push({ role: 'ai', text: reply });
    try {
      await saveMessageToFirestore('ai', reply);
    } catch (e) {
      console.warn('Gagal simpan ke Firestore:', e);
    }
  } catch (error) {
    console.error('Error:', error);
    messages.value.push({
      role: 'ai',
      text: `⚠️ Terjadi kesalahan: ${error.message || 'Gagal memproses gambar.'}`
    });
  } finally {
    loading.value = false;
  }
};

const sendQuickPrompt = (promptText) => {
  userQuery.value = promptText;
  handleAsk();
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap');

.ai-page {
  font-family: 'Nunito', sans-serif;
  min-height: 100vh;
}

.content-wrapper {
  max-width: 480px;
  margin: 0 auto;
  padding: 24px 20px 140px 20px;
}

.header-title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.header-icon-box {
  width: 44px;
  height: 44px;
  background: #ecfdf5;
  border-radius: 14px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.header h1 {
  font-size: 24px;
  font-weight: 800;
  margin: 0;
  color: #1e293b;
}

.subtitle {
  margin: 2px 0 0 0;
  font-size: 13px;
  color: #64748b;
}

.section-label {
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  margin-bottom: 10px;
}

.prompt-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.chip-btn {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 20px;
  padding: 8px 14px;
  font-size: 12px;
  font-weight: 600;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.02);
}

.chip-btn:active {
  background: #ecfdf5;
  border-color: #10b981;
  color: #10b981;
}

/* CHAT CONTAINER STYLES */
.chat-container {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 20px;
}

.message-bubble {
  padding: 14px 18px;
  border-radius: 18px;
  font-size: 14px;
  line-height: 1.6;
  max-width: 85%;
}

.message-bubble.user {
  align-self: flex-end;
  background: #10b981;
  color: #ffffff;
  border-bottom-right-radius: 4px;
}

.message-bubble.ai {
  align-self: flex-start;
  background: #ffffff;
  color: #334155;
  border: 1px solid #f1f5f9;
  border-bottom-left-radius: 4px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.04);
}

.chat-image-box {
  margin-bottom: 10px;
}

.chat-image-box img {
  max-width: 100%;
  max-height: 200px;
  border-radius: 12px;
  object-fit: cover;
}

.badge-role {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #ecfdf5;
  color: #059669;
  padding: 2px 8px;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 700;
  margin-bottom: 8px;
}

.loading-bubble {
  text-align: center;
  font-size: 12px;
  color: #64748b;
  padding: 16px;
}

.spinner {
  width: 22px;
  height: 22px;
  border: 3px solid #e2e8f0;
  border-top-color: #10b981;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto 8px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.markdown-body {
  text-align: left;
}

/* INPUT FORM AREA */
.input-container-wrapper {
  position: fixed;
  bottom: 60px;
  left: 0;
  right: 0;
  max-width: 480px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
}

.image-preview-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #ffffff;
  padding: 8px 12px;
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
  border: 1.5px solid #e2e8f0;
  border-bottom: none;
}

.image-preview-bar img {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  object-fit: cover;
}

.preview-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
}

.btn-remove-img {
  background: #f1f5f9;
  border: none;
  color: #ef4444;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  font-weight: bold;
}

.input-card {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ffffff;
  padding: 8px 8px 8px 12px;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  border: 1.5px solid #e2e8f0;
}

.btn-attach {
  background: transparent;
  border: none;
  color: #64748b;
  padding: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.btn-attach:hover {
  background: #f1f5f9;
  color: #10b981;
}

.input-card input[type="text"] {
  flex: 1;
  border: none;
  outline: none;
  font-size: 14px;
  font-family: inherit;
}

.btn-send {
  background: #10b981;
  color: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
}

.btn-send:disabled {
  background: #cbd5e1;
  cursor: not-allowed;
}
</style>
