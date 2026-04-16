import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, map, of, tap } from 'rxjs';
import { API_BASE_URL } from '../config/api.config';
import { AuthSession, LoginRequest, LoginResponse } from '../models/auth.models';

const STORAGE_KEY = 'check-ui.auth.session';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly sessionState = signal<AuthSession | null>(this.readSession());

  readonly session = computed(() => this.sessionState());
  readonly isAuthenticated = computed(() => {
    const session = this.sessionState();
    return !!session?.token && new Date(session.expiresAtUtc).getTime() > Date.now();
  });
  readonly username = computed(() => this.sessionState()?.username ?? 'Operator');

  login(credentials: LoginRequest) {
    return this.http.post<LoginResponse>(`${API_BASE_URL}/auth/login`, credentials).pipe(
      tap((response) => {
        this.setSession({
          token: response.token,
          username: response.username,
          expiresAtUtc: response.expires_at_utc
        });
      })
    );
  }

  logout() {
    const session = this.sessionState();
    const logoutRequest = session ? this.http.post<void>(`${API_BASE_URL}/auth/logout`, {}) : of(void 0);

    return logoutRequest.pipe(
      catchError(() => of(void 0)),
      tap(() => {
        this.clearSession();
        void this.router.navigate(['/login']);
      }),
      map(() => void 0)
    );
  }

  getToken(): string | null {
    return this.isAuthenticated() ? this.sessionState()?.token ?? null : null;
  }

  restore(): void {
    if (!this.isAuthenticated()) {
      this.clearSession();
    }
  }

  private setSession(session: AuthSession): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    this.sessionState.set(session);
  }

  private clearSession(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.sessionState.set(null);
  }

  private readSession(): AuthSession | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }

    try {
      return JSON.parse(raw) as AuthSession;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
}
