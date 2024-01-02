import { CanActivateFn } from '@angular/router';
import {inject} from "@angular/core";
import {UserService} from "./services/api/user.service";
import {map} from "rxjs";

export const connectedGuard: CanActivateFn = (route, state) => {
  return inject(UserService).me().pipe(map(v => !!v));
};
