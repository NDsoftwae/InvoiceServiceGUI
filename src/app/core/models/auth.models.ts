export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  token_type: string;
  expires_at_utc: string;
  username: string;
}

export interface AuthSession {
  token: string;
  username: string;
  expiresAtUtc: string;
}
