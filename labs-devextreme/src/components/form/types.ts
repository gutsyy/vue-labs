export type FormContainerProps = {
  cols?: '2' | '4' | '6' | '12'
  showCancelButton?: boolean
  showConfirmButton?: boolean
  onConfirm?: () => void
  onCancel?: () => void
}
