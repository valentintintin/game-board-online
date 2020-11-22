import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { CollectionService } from '../services/collection.service';

@Injectable()
export class HasCollectionGuard implements CanActivate {

  constructor(private collectionService: CollectionService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return this.collectionService.currentCollection$.pipe(
      map(collection => Boolean(collection)),
      tap(result => {
        if (!result) {
          this.router.navigate(['status/game-pause'], {
            replaceUrl: true
          });
        }
      })
    );
  }
}
