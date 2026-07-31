<template>
  <transition name="modal-fade">
    <div v-if="modalState.show" class="modal-backdrop" :class="{ dark: isDarkMode }" @click="handleBackdropClick">
      <div class="modal-card" @click.stop>
        
        <!-- ICON BADGE -->
        <div :class="['modal-icon-badge', modalState.type]">
          <!-- SUCCESS ICON -->
          <svg v-if="modalState.type === 'success'" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>

          <!-- ERROR ICON -->
          <svg v-else-if="modalState.type === 'error'" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>

          <!-- WARNING / CONFIRM ICON -->
          <svg v-else-if="modalState.type === 'warning' || modalState.type === 'confirm'" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>

          <!-- PROMPT ICON -->
          <svg v-else-if="modalState.type === 'prompt'" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>

          <!-- SELECT ICON -->
          <svg v-else-if="modalState.type === 'select'" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="5" width="20" height="14" rx="2"/>
            <line x1="2" y1="10" x2="22" y2="10"/>
          </svg>

          <!-- INFO ICON -->
          <svg v-else width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        </div>

        <!-- TITLE & MESSAGE -->
        <h3 class="modal-title">{{ modalState.title }}</h3>
        <p v-if="modalState.message" class="modal-message">{{ modalState.message }}</p>

        <!-- INPUT FIELD FOR PROMPT TYPE -->
        <div v-if="modalState.type === 'prompt'" class="modal-input-wrapper">
          <input 
            v-model="modalState.inputValue"
            :type="modalState.inputType" 
            :placeholder="modalState.placeholder"
            class="modal-input"
            @keyup.enter="handleConfirm"
            ref="inputRef"
            autofocus
          />
        </div>

        <!-- OPTIONS LIST FOR SELECT TYPE -->
        <div v-if="modalState.type === 'select'" class="modal-select-wrapper">
          <div 
            v-for="(opt, idx) in modalState.options" 
            :key="idx"
            :class="['modal-select-item', { active: modalState.selectedValue === opt.value }]"
            @click="modalState.selectedValue = opt.value"
          >
            <div class="radio-circle">
              <div v-if="modalState.selectedValue === opt.value" class="radio-inner"></div>
            </div>
            <span class="select-label">{{ opt.label }}</span>
          </div>
        </div>

        <!-- BUTTON ACTIONS -->
        <div class="modal-actions">
          <button 
            v-if="modalState.cancelText" 
            type="button" 
            class="btn-modal btn-secondary"
            @click="handleCancel"
          >
            {{ modalState.cancelText }}
          </button>
          
          <button 
            type="button" 
            :class="['btn-modal', 'btn-primary', modalState.type]"
            @click="handleConfirm"
          >
            {{ modalState.confirmText }}
          </button>
        </div>

      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue'
import { modalState, closeModal } from '../utils/modal'
import { useTheme } from '../utils/theme'

const { isDarkMode } = useTheme()
const inputRef = ref(null)

watch(() => modalState.value.show, (newVal) => {
  if (newVal && modalState.value.type === 'prompt') {
    nextTick(() => {
      if (inputRef.value) inputRef.value.focus()
    })
  }
})

const handleBackdropClick = () => {
  if (modalState.value.cancelText) {
    handleCancel()
  } else {
    handleConfirm()
  }
}

const handleCancel = () => {
  closeModal(null)
}

const handleConfirm = () => {
  if (modalState.value.type === 'prompt') {
    closeModal(modalState.value.inputValue)
  } else if (modalState.value.type === 'select') {
    closeModal(modalState.value.selectedValue)
  } else if (modalState.value.type === 'confirm') {
    closeModal(true)
  } else {
    closeModal(true)
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.65);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 99999;
  padding: 20px;
  box-sizing: border-box;
}

.modal-card {
  background: #ffffff;
  width: 100%;
  max-width: 380px;
  border-radius: 24px;
  padding: 28px 24px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  align-items: center;
  animation: popIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  box-sizing: border-box;
}

@keyframes popIn {
  0% { transform: scale(0.9) translateY(12px); opacity: 0; }
  100% { transform: scale(1) translateY(0); opacity: 1; }
}

.modal-icon-badge {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  flex-shrink: 0;
}

.modal-icon-badge.success { background: #ecfdf5; color: #10b981; }
.modal-icon-badge.error { background: #fef2f2; color: #ef4444; }
.modal-icon-badge.warning, .modal-icon-badge.confirm { background: #fffbeb; color: #f59e0b; }
.modal-icon-badge.prompt, .modal-icon-badge.select { background: #eff6ff; color: #0061ff; }
.modal-icon-badge.info { background: #eff6ff; color: #3b82f6; }

.modal-title {
  margin: 0 0 8px 0;
  font-size: 19px;
  font-weight: 800;
  color: #0f172a;
}

.modal-message {
  margin: 0 0 20px 0;
  font-size: 14px;
  line-height: 1.5;
  color: #64748b;
  word-break: break-word;
}

/* INPUT PROMPT */
.modal-input-wrapper {
  width: 100%;
  margin-bottom: 20px;
}

.modal-input {
  width: 100%;
  padding: 14px 16px;
  border-radius: 14px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  font-size: 15px;
  color: #0f172a;
  font-family: inherit;
  box-sizing: border-box;
  outline: none;
  transition: border-color 0.2s;
}

.modal-input:focus {
  border-color: #0061ff;
  background: #ffffff;
}

/* SELECT OPTIONS */
.modal-select-wrapper {
  width: 100%;
  max-height: 220px;
  overflow-y: auto;
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.modal-select-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 14px;
  border: 1.5px solid #e2e8f0;
  background: #f8fafc;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s;
}

.modal-select-item:hover, .modal-select-item.active {
  border-color: #0061ff;
  background: #eff6ff;
}

.radio-circle {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.modal-select-item.active .radio-circle {
  border-color: #0061ff;
}

.radio-inner {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #0061ff;
}

.select-label {
  font-size: 14px;
  font-weight: 700;
  color: #1e293b;
  word-break: break-word;
}

/* BUTTON ACTIONS */
.modal-actions {
  display: flex;
  gap: 10px;
  width: 100%;
}

.btn-modal {
  flex: 1;
  padding: 13px 16px;
  border-radius: 14px;
  font-size: 14px;
  font-weight: 700;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: inherit;
}

.btn-secondary {
  background: #f1f5f9;
  color: #64748b;
}

.btn-secondary:hover { background: #e2e8f0; }

.btn-primary { background: #10b981; color: #ffffff; box-shadow: 0 4px 12px rgba(16, 185, 129, 0.25); }
.btn-primary.error { background: #ef4444; box-shadow: 0 4px 12px rgba(239, 68, 68, 0.25); }
.btn-primary.warning, .btn-primary.confirm { background: #0061ff; box-shadow: 0 4px 12px rgba(0, 97, 255, 0.25); }
.btn-primary.prompt, .btn-primary.select { background: #0061ff; box-shadow: 0 4px 12px rgba(0, 97, 255, 0.25); }
.btn-primary.info { background: #3b82f6; box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25); }

.btn-modal:active { transform: scale(0.97); }

.modal-fade-enter-active, .modal-fade-leave-active { transition: opacity 0.25s ease; }
.modal-fade-enter-from, .modal-fade-leave-to { opacity: 0; }

/* ============ DARK MODE ============ */
.modal-backdrop.dark .modal-card {
  background: #121212;
  color: #f8fafc;
  border: 1px solid #27272a;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.8);
}

.modal-backdrop.dark .modal-title { color: #f8fafc; }
.modal-backdrop.dark .modal-message { color: #a1a1aa; }

.modal-backdrop.dark .modal-input {
  background: #18181b;
  border-color: #27272a;
  color: #ffffff;
}

.modal-backdrop.dark .modal-select-item {
  background: #18181b;
  border-color: #27272a;
}

.modal-backdrop.dark .modal-select-item.active {
  background: #182235;
  border-color: #0061ff;
}

.modal-backdrop.dark .select-label { color: #f8fafc; }

.modal-backdrop.dark .btn-secondary {
  background: #27272a;
  color: #d4d4d8;
}
</style>
