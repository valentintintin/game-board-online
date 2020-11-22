import { Component, OnInit } from '@angular/core';
import { ChatService } from '../../../services/chat.service';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  constructor(public chatService: ChatService, public userService: UserService) { }

  ngOnInit(): void {
  }

}
