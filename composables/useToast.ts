import { inject } from 'vue'

type ToastRef = {
  showToast: (message: string, type?: string, time?: number) => void
}

export function useToast() {
  const toast = inject<Ref<ToastRef | null>>('toast')

  const showToast = (message: string, type = 'success', time = 3000) => {
    toast?.value?.showToast(message, type, time)
  }

  return { showToast }
}
