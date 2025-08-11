import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private tokenKey = 'jwt_token';
  private usernameKey = 'jwt_username';
  private username = '';
  private wpNonce: string | null = null;

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<void> {
    return this.http.post<any>(`${environment.apiUrl}/jwt-auth/v1/token`, { username, password }).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        localStorage.setItem(this.usernameKey, res.user_display_name || res.user_nicename || username);
        this.username = res.user_display_name || username;
      }),
      switchMap(() => this.syncWordPressSession()),
      switchMap(() => this.getStoreNonce()),
      tap(() => {
        console.log('✅ Login + session sync + WooCommerce nonce OK');
      }),
      map(() => { }) // restituisce void
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.usernameKey);
    localStorage.removeItem('wp_nonce');
    this.wpNonce = null;
    this.username = '';
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getUsername(): string {
    return localStorage.getItem(this.usernameKey) || 'utente';
  }

  getUserInfo(): { username: string, email?: string } | null {
    const token = this.getToken();
    if (!token) return null;

    try {
      const payloadBase64 = token.split('.')[1];
      const payloadJson = atob(payloadBase64);
      const payload = JSON.parse(payloadJson);

      return {
        username: payload?.user_login,
        email: payload?.user_email
      };
    } catch (err) {
      console.error('Errore nella decodifica JWT:', err);
      return null;
    }
  }

  setWpNonce(nonce: string): void {
    this.wpNonce = nonce;
    localStorage.setItem('wp_nonce', nonce);
  }

  getWpNonce(): string | null {
    if (this.wpNonce) return this.wpNonce;

    const storedNonce = localStorage.getItem('wp_nonce');
    this.wpNonce = storedNonce;
    return storedNonce;
  }

  getStoreNonce(): Observable<string> {
    return this.http.get<{ nonce: string }>('/wp-json/custom/v1/store-nonce', {
      withCredentials: true
    }).pipe(
      tap(res => this.setWpNonce(res.nonce)),
      map(res => res.nonce)
    );
  }

  syncWordPressSession(): Observable<any> {
    const jwt = this.getToken();
    if (!jwt) return of(null);

    return this.http.post<any>(
      '/wp-json/jwt-auth/v1/token/validate',
      {},
      {
        headers: new HttpHeaders({
          Authorization: `Bearer ${jwt}`
        }),
        withCredentials: true
      }
    ).pipe(
      switchMap((validation) => {
        const user_id = validation?.data?.user?.id ?? validation?.data?.id;
        if (!user_id) {
          throw new Error('User ID missing from validation response');
        }

        return this.http.post<any>(
          '/wp-json/custom/v1/auth-sync',
          { user_id },
          { withCredentials: true }
        );
      })
    );
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}
