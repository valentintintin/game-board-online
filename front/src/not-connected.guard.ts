import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {UserService} from "./services/api/user.service";
import {map} from "rxjs";

export const notConnectedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  try {
    return inject(UserService).me().pipe(
      map(v => {
        if (!!v) {
          return router.parseUrl('/rooms');
        }

        return true;
      })
    );
  } catch {
    return true;
  }
};
