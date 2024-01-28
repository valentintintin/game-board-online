import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {UserService} from "./services/api/user.service";
import {catchError, map, of} from "rxjs";

export const connectedGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  return inject(UserService).me().pipe(
    catchError(() => of(null)),
    map(v => {
      if (!v) {
        return router.parseUrl('/');
      }

      return true;
    })
  );
};
