import { ToastContainer } from '@/components/ui/toast'

// Test the ToastContainer import
console.log('ToastContainer imported:', ToastContainer)

export default function TestToast() {
  return (
    <div>
      <ToastContainer toasts={[]} onRemove={() => {}} />
    </div>
  )
}
