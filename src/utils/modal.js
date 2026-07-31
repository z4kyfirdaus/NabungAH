import { ref } from 'vue'

export const modalState = ref({
  show: false,
  title: '',
  message: '',
  type: 'info', // 'info' | 'success' | 'warning' | 'error' | 'confirm' | 'prompt' | 'select'
  placeholder: '',
  inputValue: '',
  inputType: 'text',
  options: [], // [{ label, value }]
  selectedValue: null,
  confirmText: 'OK',
  cancelText: 'Batal',
  resolve: null
})

export function showAlert(message, title = 'Pemberitahuan', type = 'info') {
  return new Promise((resolve) => {
    modalState.value = {
      show: true,
      title,
      message,
      type,
      placeholder: '',
      inputValue: '',
      inputType: 'text',
      options: [],
      selectedValue: null,
      confirmText: 'OK',
      cancelText: '',
      resolve
    }
  })
}

export function showConfirm(message, title = 'Konfirmasi', confirmText = 'Ya, Lanjutkan', cancelText = 'Batal') {
  return new Promise((resolve) => {
    modalState.value = {
      show: true,
      title,
      message,
      type: 'confirm',
      placeholder: '',
      inputValue: '',
      inputType: 'text',
      options: [],
      selectedValue: null,
      confirmText,
      cancelText,
      resolve
    }
  })
}

export function showPrompt({ title = 'Input Data', message = '', placeholder = '', defaultValue = '', inputType = 'text', confirmText = 'Simpan', cancelText = 'Batal' }) {
  return new Promise((resolve) => {
    modalState.value = {
      show: true,
      title,
      message,
      type: 'prompt',
      placeholder,
      inputValue: defaultValue,
      inputType,
      options: [],
      selectedValue: null,
      confirmText,
      cancelText,
      resolve
    }
  })
}

export function showSelect({ title = 'Pilih Opsi', message = '', options = [], confirmText = 'Pilih', cancelText = 'Batal' }) {
  return new Promise((resolve) => {
    modalState.value = {
      show: true,
      title,
      message,
      type: 'select',
      placeholder: '',
      inputValue: '',
      inputType: 'text',
      options,
      selectedValue: options.length > 0 ? options[0].value : null,
      confirmText,
      cancelText,
      resolve
    }
  })
}

export function closeModal(result = null) {
  if (modalState.value.resolve) {
    modalState.value.resolve(result)
  }
  modalState.value.show = false
}
