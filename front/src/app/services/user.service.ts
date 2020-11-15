import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Utils } from '../../../../common/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../../../common/models/user';
import { LocalStorageService } from 'ngx-localstorage';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _name$ = new BehaviorSubject<string>(null);
  private _users = new BehaviorSubject<User[]>([]);

  constructor(private websocketService: WebsocketService, private localStorageService: LocalStorageService) {
    this._name$.subscribe(name => {
      if (name) {
        this.localStorageService.set('user.name', name);
        this.websocketService.sendUserEvent('add', name);
      }
    });

    this.websocketService.getInitialUsers().subscribe(users => {
      this._users.next(users);
      if (this._name$.value) {
        this.websocketService.sendUserEvent('set', this._name$.value);
      }
    });

    this.websocketService.getUserEvent().subscribe(event => {
      if (event.name === 'delete') {
        Utils.removeById(this._users.value, event.data.guid);
        this._users.next(this._users.value);
      } else {
        Utils.replaceOrAddById(this._users.value, event.data);
        this._users.next(this._users.value);
      }
    });
  }

  public changeName(name: string): void {
    this._name$.next(name);
  }

  public get name$(): Observable<string> {
    return this._name$.asObservable();
  }

  public get users$(): Observable<User[]> {
    return this._users.asObservable();
  }
}
