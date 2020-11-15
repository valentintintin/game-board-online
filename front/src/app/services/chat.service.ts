import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { ChatMessage } from '../../../../common/models/chatMessage';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private _messages = new BehaviorSubject<ChatMessage[]>([]);

  constructor(private websocketService: WebsocketService) {
    this.websocketService.getInitialChatMessages().subscribe(messages => {
      this._messages.next(messages);
    });

    this.websocketService.getChatEvent().subscribe(event => {
        this._messages.value.unshift(event.data);
        this._messages.next(this._messages.value);
    });
  }

  public sendMessage(message: string): void {
    this.websocketService.sendChatEvent(message);
  }

  public get messages$(): Observable<ChatMessage[]> {
    return this._messages.asObservable();
  }
}
