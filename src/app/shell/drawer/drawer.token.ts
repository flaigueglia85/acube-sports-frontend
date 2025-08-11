// src/app/shell/drawer/drawer.tokens.ts
import { InjectionToken } from '@angular/core';

export const DRAWER_DATA = new InjectionToken<any>('DRAWER_DATA');

export class DrawerRef<T = any> {
  constructor(private _close: (result?: T) => void) {}
  close(result?: T) { this._close(result); }
}
