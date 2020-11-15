import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class NameGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.name$.pipe(
      map(name => !!name),
      tap(result => {
        if (!result) {
          this.router.navigate([''], {
            replaceUrl: true
          });
        }
      })
    );
  }
}
