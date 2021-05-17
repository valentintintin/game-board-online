import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Utils } from '../../../../common/utils';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../../../../common/models/user';
import { LocalStorageService } from 'ngx-localstorage';
import { environment } from '../../environments/environment';
import { Router } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _currentUser$ = new BehaviorSubject<User>(null);
  private _users = new BehaviorSubject<User[]>([]);

  constructor(private websocketService: WebsocketService, private localStorageService: LocalStorageService,
              private router: Router, private notification: NzNotificationService) {
    if (!this.userId) {
      this.localStorageService.set('user.id', Utils.uuidv4());
    }

    this.websocketService.getInitialUsers().subscribe(users => {
      console.log('initialUsers', users);
      this._users.next(users);
    });

    this.websocketService.getAllUsers().subscribe(users => {
      console.log('allUsers', users);
      this._users.next(users);
    });

    this.websocketService.getUserEvent().subscribe(event => {
      console.log('userEvent', event);

      switch (event.name) {
        case 'delete':
          try {
            Utils.removeById(this._users.value, event.data.guid);
          } catch (e) {
            console.error(e);
          }
          this._users.next(this._users.value);
          break;
        case 'set':
          Utils.replaceOrAddById(this._users.value, event.data);
          this._users.next(this._users.value);
          break;
        case 'me':
          Utils.replaceOrAddById(this._users.value, event.data);

          this._users.next(this._users.value);
          this._currentUser$.next(event.data);

          this.router.navigate(['game']);

          if (event.data.shouldPlay) {
            this.notification.info('Attention !', 'C\'est à toi de jouer !', {
              nzDuration: 3000,
              nzPauseOnHover: false
            });
          }

          break;
      }
    });

    this.websocketService.connected$.subscribe(state => {
      if (!state) {
        this._users.next([]);
      } else if (this._currentUser$.value) {
        this.websocketService.sendUserEvent(this._currentUser$.value, 'set');
      }
    });

    if (!environment.production) {
      this.changeNameAndColor(this.localStorageService.get('user.name'), this.localStorageService.get('user.color'));
    }
  }

  public get userId(): string {
    return this.localStorageService.get('user.id');
  }

  public changeNameAndColor(name: string, color: string): void {
    this.localStorageService.set('user.name', name);
    this.localStorageService.set('user.color', color);
    this.websocketService.sendUserEvent({
      guid: this.userId,
      name: name,
      color: color
    }, 'set');
  }

  public setPlayerShouldPlay(user: User): void {
    this.websocketService.sendUserEvent(user, 'shouldPlay');
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

  public getUserById(id: string): User {
    return Utils.getById(this._users.value, id);
  }
}
