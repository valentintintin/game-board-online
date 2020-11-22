import { Injectable } from '@angular/core';
import { Image } from '../../../../common/models/image';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WsEvent } from '../../../../common/models/wsEvent';
import { User } from '../../../../common/models/user';
import { ChatMessage } from '../../../../common/models/chatMessage';
import { Initial } from '../../../../common/models/initial';
import { Collection } from '../../../../common/models/storage';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private _connected$ = new BehaviorSubject<boolean>(false);

  constructor(private socket: Socket, private router: Router) {
    this.socket.fromEvent('connect').subscribe(_ => {
      console.log('Connected');
      this._connected$.next(true);
      this.router.navigate(['game']);
    });

    this.socket.fromEvent('disconnect').subscribe(_ => {
      console.log('Disconnected');
      this._connected$.next(false);
      this.router.navigate(['status/network-error']);
    });
  }

  public get connected$(): Observable<boolean> {
    return this._connected$.asObservable();
  }

  public sendImageEvent(eventName: string, image: Image): void {
    setTimeout(() => {
      const data: WsEvent<Image> = {
        name: eventName,
        data: {
          guid: image.guid,
          groupId: image.groupId,
          imageUrl: image.imageUrl,
          x: image.x,
          y: image.y,
          width: image.width,
          height: image.height,
          rotation: image.rotation,
          deletable: image.deletable,
          movable: image.movable,
          rotatable: image.rotatable,
          imageBackUrl: image.imageBackUrl,
          showBack: image.showBack,
          shouldTurnOnce: image.shouldTurnOnce,
          hiddenFromOthers: image.hiddenFromOthers,
          changeIndex: image.changeIndex,
          lastUserId: image.lastUserId,
        } as Image
      };
      console.log(eventName, data, image);
      this.socket.emit('imageEvent', data);
    }, 10);
  }

  public sendUserEvent(user: User): void {
    const data: WsEvent<User> = {
      name: user ? 'set' : 'delete',
      data: user
    };
    console.log('userEvent', data);
    this.socket.emit('userEvent', data);
  }

  public sendChatEvent(message: string): void {
    const data: WsEvent<ChatMessage> = {
      name: 'add',
      data: {
        message: message
      } as ChatMessage
    };
    console.log('chatEvent', data);
    this.socket.emit('chatEvent', data);
  }

  public sendCollectionEvent(collection?: Collection) {
    const data: WsEvent<string> = {
      name: collection ? 'set' : 'delete',
      data: collection?.guid
    };
    console.log('collectionEvent', data);
    this.socket.emit('collectionEvent', data);
  }

  public getImageEvent(): Observable<WsEvent<Image>> {
    return this.socket.fromEvent('imageEvent');
  }

  public getUserEvent(): Observable<WsEvent<User>> {
    return this.socket.fromEvent('userEvent');
  }

  public getChatEvent(): Observable<WsEvent<ChatMessage>> {
    return this.socket.fromEvent('chatEvent');
  }

  public getInitialDatas(): Observable<WsEvent<Initial>> {
    return this.socket.fromEvent('allDatas');
  }

  public getInitialCollections(): Observable<Collection[]> {
    return this.getInitialDatas().pipe( map((d: WsEvent<Initial>) => d.data.storage.collections));
  }

  public getCurrentCollectionId(): Observable<string> {
    return this.getInitialDatas().pipe(map((d: WsEvent<Initial>) => d.data.wsStorage.currentCollectionId));
  }

  public getInitialUsers(): Observable<User[]> {
    return this.getInitialDatas().pipe(map((d: WsEvent<Initial>) => d.data.wsStorage.users));
  }

  public getInitialDrawing(): Observable<Image[]> {
    return this.getInitialDatas().pipe(map((d: WsEvent<Initial>) => d.data.wsStorage.drawing));
  }

  public getInitialChatMessages(): Observable<ChatMessage[]> {
    return this.getInitialDatas().pipe( map((d: WsEvent<Initial>) => d.data.wsStorage.chatMessages));
  }
}
