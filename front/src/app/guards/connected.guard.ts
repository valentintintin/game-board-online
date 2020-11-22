import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { WebsocketService } from '../services/websocket.service';

@Injectable()
export class ConnectedGuard implements CanActivate {

  constructor(protected websocketService: WebsocketService, protected router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.websocketService.connected$.pipe(
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
