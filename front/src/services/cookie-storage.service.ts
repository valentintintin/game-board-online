import {inject, Injectable} from '@angular/core';
import {CookieService} from "ngx-cookie-service";

@Injectable({
  providedIn: 'root'
})
export class CookieStorageService {
  private cookieService = inject(CookieService);

  private readonly cookieNameToken: string = 'token';

  deleteAll(): void {
    this.deleteToken();
  }

  deleteToken(): void {
    this.cookieService.delete(this.cookieNameToken, '/');
  }

  set token(token: string | undefined) {
    if (token) {
      this.cookieService.set(this.cookieNameToken, token, 365, '/');
    } else {
      this.deleteToken();
    }
  }

  get token(): string | undefined {
    return this.cookieService.get(this.cookieNameToken);
  }
}
