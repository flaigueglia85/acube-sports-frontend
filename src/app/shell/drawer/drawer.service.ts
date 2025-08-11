// src/app/services/drawer.service.ts
import { Injectable, ComponentRef, ViewContainerRef, Type, Injector } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DRAWER_DATA, DrawerRef } from './drawer.token';


export interface DrawerConfig<T = any> {
  component: Type<any>;
  data?: T;
  width?: string;
  disableClose?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  private isOpenSubject = new BehaviorSubject<boolean>(false);
  private configSubject = new BehaviorSubject<DrawerConfig | null>(null);
  
  public isOpen$ = this.isOpenSubject.asObservable();
  public config$ = this.configSubject.asObservable();
  
  private viewContainerRef?: ViewContainerRef;
  private currentComponentRef?: ComponentRef<any>;
  private currentDrawerRef?: DrawerRef;

  setViewContainerRef(vcr: ViewContainerRef) {
    this.viewContainerRef = vcr;
  }

  open<T = any, R = any>(config: DrawerConfig<T>): Observable<R | undefined> {
    if (!this.viewContainerRef) {
      console.error('ViewContainerRef non impostato');
      return new Observable(observer => observer.complete());
    }

    // Chiudi il componente precedente se presente
    this.closeComponent();
    
    // Crea il DrawerRef
    this.currentDrawerRef = new DrawerRef<R>((result) => {
      this.close(result);
    });

    // Crea l'injector con i dati e il DrawerRef
    const injector = Injector.create({
      providers: [
        { provide: DRAWER_DATA, useValue: config.data },
        { provide: DrawerRef, useValue: this.currentDrawerRef }
      ]
    });
    
    // Crea il nuovo componente con l'injector personalizzato
    this.currentComponentRef = this.viewContainerRef.createComponent(
      config.component, 
      { injector }
    );

    this.configSubject.next(config);
    this.isOpenSubject.next(true);

    // Ritorna un Observable che si completa quando il drawer viene chiuso
    return new Observable<R | undefined>(observer => {
      const originalClose = this.currentDrawerRef!['_close'];
      this.currentDrawerRef!['_close'] = (result?: R) => {
        observer.next(result);
        observer.complete();
        originalClose(result);
      };
    });
  }

  close<T = any>(result?: T) {
    this.closeComponent();
    this.isOpenSubject.next(false);
    this.configSubject.next(null);
  }

  private closeComponent() {
    if (this.currentComponentRef) {
      this.currentComponentRef.destroy();
      this.currentComponentRef = undefined;
    }
    if (this.viewContainerRef) {
      this.viewContainerRef.clear();
    }
    this.currentDrawerRef = undefined;
  }
}