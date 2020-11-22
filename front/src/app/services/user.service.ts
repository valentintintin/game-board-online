import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Utils } from '../../../../common/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../../../common/models/user';
import { LocalStorageService } from 'ngx-localstorage';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _currentUser$ = new BehaviorSubject<User>(null);
  private _users = new BehaviorSubject<User[]>([]);

  constructor(private websocketService: WebsocketService, private localStorageService: LocalStorageService, private router: Router) {
    if (!this.userId) {
      this.localStorageService.set('user.id', Utils.uuidv4());
    }

    this.websocketService.getInitialUsers().subscribe(users => {
      console.log('initialUsers', users);
      this._users.next(users);
    });

    this.websocketService.getUserEvent().subscribe(event => {
      console.log('userEvent', event);

      if (event.name === 'delete') {
        try {
          Utils.removeById(this._users.value, event.data.guid);
        } catch (e) {
          console.error(e);
        }
        this._users.next(this._users.value);
      } else {
        Utils.replaceOrAddById(this._users.value, event.data);
        this._users.next(this._users.value);
        if (event.name === 'me') {
          this._currentUser$.next(event.data);
          this.router.navigate(['game']);
        }
      }
    });

    this.websocketService.connected$.subscribe(state => {
      if (!state) {
        this._users.next([]);
      } else if (this._currentUser$.value) {
        this.websocketService.sendUserEvent(this._currentUser$.value);
      }
    });

    if (!environment.production) {
      this.changeName(this.localStorageService.get('user.name'));
    }
  }

  public get userId(): string {
    return this.localStorageService.get('user.id');
  }

  public changeName(name: string): void {
    this.localStorageService.set('user.name', name);
    this.websocketService.sendUserEvent({
      guid: this.userId,
      name: name
    });
  }

  public isMe(userId?: string): boolean {
    return userId === this.userId;
  }

  public get currentUser$(): Observable<User> {
    return this._currentUser$.asObservable();
  }

  public get users$(): Observable<User[]> {
    return this._users.asObservable();
  }
}
