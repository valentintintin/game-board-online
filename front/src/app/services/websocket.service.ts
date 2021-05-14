import { Injectable } from '@angular/core';
import { Image, ImageUtils } from '../../../../common/models/image';
import { Socket } from 'ngx-socket-io';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { WsEvent } from '../../../../common/models/wsEvent';
import { User } from '../../../../common/models/user';
import { ChatMessage } from '../../../../common/models/chatMessage';
import { Initial } from '../../../../common/models/initial';
import { Collection } from '../../../../common/models/storage';
import { Router } from '@angular/router';
import { Pos } from '../../../../common/models/pos';
import { Pointer } from '../../../../common/models/pointer';

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
        data: ImageUtils.getValueImage(image)
      };
      console.log(eventName, data);
      this.socket.emit('imageEvent', data);
    }, 10);
  }

  public sendUserEvent(user: User, event: 'set' | 'shouldPlay'): void {
    const data: WsEvent<User> = {
      name: event,
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

  public sendPointerEvent(x: number, y: number): void {
    const data: WsEvent<Pos> = {
      name: 'pointerEvent',
      data: {
        x: x,
        y: y
      } as Pos
    };
    console.log('pointerEvent', data);
    this.socket.emit('pointerEvent', data);
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

  public getPointerEvent(): Observable<Pointer> {
    return this.socket.fromEvent('pointerEvent').pipe(map((d: WsEvent<Pointer>) => d.data));
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
    return this.getInitialDatas().pipe(map((d: WsEvent<Initial>) => d.data.storage.collections));
  }

  public getCurrentCollectionId(): Observable<string> {
    return this.getInitialDatas().pipe(map((d: WsEvent<Initial>) => d.data.wsStorage.currentCollectionId));
  }

  public getInitialUsers(): Observable<User[]> {
    return this.getInitialDatas().pipe(map((d: WsEvent<Initial>) => d.data.wsStorage.users));
  }

  public getAllUsers(): Observable<User[]> {
    return this.socket.fromEvent('allUsers').pipe(map((d: WsEvent<User[]>) => d.data));
  }

  public getInitialDrawing(): Observable<Image[]> {
    return this.getInitialDatas().pipe(map((d: WsEvent<Initial>) => d.data.wsStorage.drawing));
  }

  public getInitialChatMessages(): Observable<ChatMessage[]> {
    return this.getInitialDatas().pipe( map((d: WsEvent<Initial>) => d.data.wsStorage.chatMessages));
  }
}
