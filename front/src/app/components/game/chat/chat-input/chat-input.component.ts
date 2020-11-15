import { Component } from '@angular/core';
import { ChatService } from '../../../../services/chat.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent {

  form: FormGroup;

  constructor(private chatService: ChatService) {
    this.form = new FormGroup({
      message: new FormControl(null, [Validators.required])
    });
  }

  public sendMessage(): void {
    if (this.form.valid) {
      this.chatService.sendMessage(this.form.get('message').value);
      this.form.reset();
    }
  }
}
