import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { UserService } from '../services/user.service';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class SocketIdGuard implements CanActivate {

  constructor(private userService: UserService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.userService.currentUser$.pipe(
        map(user => Boolean(user?.socketId)),
        tap(result => {
          if (!result) {
            this.router.navigate([''], {
              replaceUrl: true
            });

            throw new Error('User not connected');
          }
        })
      );
  }
}
