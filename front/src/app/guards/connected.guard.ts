import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Observable, of} from 'rxjs';
import {tap} from 'rxjs/operators';

@Injectable()
export class ConnectedGuard implements CanActivate {

  constructor(protected router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return of(true).pipe(
      tap(result => {
        if (!result) {
          this.router.navigate(['status/network-error'], {
            replaceUrl: true
          });

          throw new Error('Network error');
        }
      })
    );
  }
}
