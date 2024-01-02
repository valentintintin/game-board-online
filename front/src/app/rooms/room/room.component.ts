import { Component } from '@angular/core';
import {RouterOutlet} from "@angular/router";
import {ChatComponent} from "./chat/chat.component";
import {NzContentComponent, NzLayoutComponent, NzSiderComponent} from "ng-zorro-antd/layout";

@Component({
  selector: 'app-room',
  standalone: true,
  imports: [
    RouterOutlet,
    ChatComponent,
    NzLayoutComponent,
    NzContentComponent,
    NzSiderComponent
  ],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent {

}
