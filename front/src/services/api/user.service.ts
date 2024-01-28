import {inject, Injectable, signal} from '@angular/core';
import {map, tap} from "rxjs";
import {gql} from "apollo-angular";
import {LoginGQL, MeGQL, User} from "./generated.service";
import {CookieStorageService} from "../cookie-storage.service";
import {toObservable} from "@angular/core/rxjs-interop";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private readonly cookieStorageService = inject(CookieStorageService);
  private readonly loginGQL = inject(LoginGQL);
  private readonly meGQL = inject(MeGQL);

  userConnected$ = signal<User | undefined>(undefined);

  login(name: string, color: string) {
    gql`
      mutation login($name: String!, $color: String!) {
        login(name: $name, color: $color) {
          id
          name
          color
          token
        }
      }
    `

    return this.loginGQL
      .mutate({ name, color })
      .pipe(
        map(result => result.data?.login),
        tap(value => {
          if (value) {
            this.cookieStorageService.token = value.token!;
            this.userConnected$.set(value as User);
          }
        })
      );
  }

  me() {
    gql`
      query me {
        me {
          id
          name
          color
        }
      }
    `;

    if (!this.cookieStorageService.token) {
      throw new Error('No token');
    }

    return this.meGQL.fetch()
      .pipe(
        map(result => result.data.me),
        tap(value => {
          if (value) {
            this.userConnected$.set(value as User);
          }
        })
      );
  }
}
