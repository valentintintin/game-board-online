import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { Collection } from '../../../../common/models/storage';
import { Utils } from '../../../../common/utils';

@Injectable({
  providedIn: 'root'
})
export class CollectionService {

  private _currentCollection$ = new BehaviorSubject<Collection>(null);
  private _collections$ = new BehaviorSubject<Collection[]>([]);

  constructor(private websocketService: WebsocketService) {
    this.websocketService.getInitialCollections().subscribe(collections => {
      console.log('allCollections', collections);
      this._collections$.next(collections);
    });

    this.websocketService.getCurrentCollectionId().subscribe(collection => {
      console.log('currentCollection', collection);
      if (collection) {
        this._currentCollection$.next(Utils.getById(this._collections$.value, collection));
      } else {
        this._currentCollection$.next(null);
      }
    });
  }

  public changeCurrentCollection(collection?: Collection): void {
    this.websocketService.sendCollectionEvent(collection);
  }

  public get collections$(): Observable<Collection[]> {
    return this._collections$.asObservable();
  }

  public get currentCollection$(): Observable<Collection> {
    return this._currentCollection$.asObservable();
  }
}
