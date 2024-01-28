import {Component, inject} from '@angular/core';
import {ChatInputComponent} from "./chat-input/chat-input.component";
import {NzListComponent, NzListItemComponent} from "ng-zorro-antd/list";
import {gql} from "apollo-angular";
import {GetMessagesGQL} from "../../../../services/api/generated.service";
import {ActivatedRoute} from "@angular/router";
import {AsyncPipe, DatePipe, JsonPipe} from "@angular/common";
import {map} from "rxjs";

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    ChatInputComponent,
    NzListComponent,
    NzListItemComponent,
    AsyncPipe,
    DatePipe,
    JsonPipe
  ],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss'
})
export class ChatComponent {
  private query = gql`
    query getMessages($roomId: Long!) {
        room(roomId: $roomId) {
          id
          chatMessages(order: { createdAt: DESC }) {
            id
            createdAt
            name
            user {
              id
              name
              color
            }
          }
        }
    }
  `;

  private readonly getMessagesGQL = inject(GetMessagesGQL);
  private readonly route = inject(ActivatedRoute);

  roomId = parseInt(this.route.snapshot.paramMap.get('roomId') ?? '', 10);

  messages$ = this.getMessagesGQL.watch({
    roomId: this.roomId,
  }).valueChanges.pipe(
    map(result => result.data.room?.chatMessages ?? []),
  );
}
