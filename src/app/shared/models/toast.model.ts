// toast.model.ts
export type ToastType = 'info'|'success'|'warning';
export type ToastPos  = 'top-right'|'top-center'|'top-left'|'bottom-right'|'bottom-center'|'bottom-left';
export type ToastAnim = 'slide'|'fade'|'rubber';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  pos: ToastPos;
  anim: ToastAnim;
  timeout: number; // ms
}
