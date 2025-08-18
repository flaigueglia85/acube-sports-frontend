// toast.service.ts
import { Injectable, inject } from '@angular/core';
import { Toast } from '@shared/models/toast.model';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ToastService {
  private _toasts$ = new BehaviorSubject<Toast[]>([]);
  toasts$ = this._toasts$.asObservable();

  show(message: string, opts: Partial<Toast> = {}) {
    const t: Toast = {
      id: crypto.randomUUID(),
      message,
      type: opts.type ?? 'info',
      pos: opts.pos ?? 'bottom-center',
      anim: opts.anim ?? 'slide',
      timeout: opts.timeout ?? 3000,
    };
    this._toasts$.next([t, ...this._toasts$.value]);
    if (t.timeout > 0) setTimeout(() => this.dismiss(t.id), t.timeout);
    return t.id;
  }

  info(msg: string, opts: Partial<Toast> = {})   { return this.show(msg, { ...opts, type: 'info'    }); }
  success(msg: string, opts: Partial<Toast> = {}){ return this.show(msg, { ...opts, type: 'success' }); }
  warning(msg: string, opts: Partial<Toast> = {}){ return this.show(msg, { ...opts, type: 'warning' }); }

  dismiss(id: string) {
    this._toasts$.next(this._toasts$.value.filter(t => t.id !== id));
  }

  clear() { this._toasts$.next([]); }
}
