import {Component, inject} from '@angular/core';
import {ActivatedRoute, RouterLink, RouterOutlet} from "@angular/router";
import {ChatComponent} from "./chat/chat.component";
import {NzContentComponent, NzLayoutComponent, NzSiderComponent} from "ng-zorro-antd/layout";
import {NzIconDirective} from "ng-zorro-antd/icon";

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [
    RouterOutlet,
    ChatComponent,
    NzLayoutComponent,
    NzContentComponent,
    NzSiderComponent,
    RouterLink,
    NzIconDirective
  ],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent {
  private readonly route = inject(ActivatedRoute);

  roomId = this.route.snapshot.paramMap.get('roomId');
  isChatCollapsed = false;
}
