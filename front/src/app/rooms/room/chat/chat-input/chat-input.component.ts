import {Component, inject, Input, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent} from "ng-zorro-antd/form";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {gql} from "apollo-angular";
import {SendMessageGQL} from "../../../../../services/api/generated.service";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {Subscription} from "rxjs";
import {AsyncPipe} from "@angular/common";

@Component({
  selector: 'app-chat-input',
  standalone: true,
  imports: [
    FormsModule,
    NzButtonComponent,
    NzFormControlComponent,
    NzFormDirective,
    NzFormItemComponent,
    NzIconDirective,
    NzInputDirective,
    NzInputGroupComponent,
    ReactiveFormsModule,
    NzSpinComponent,
    AsyncPipe
  ],
  templateUrl: './chat-input.component.html',
  styleUrl: './chat-input.component.scss'
})
export class ChatInputComponent implements OnDestroy {

  private readonly subscription = new Subscription();

  private readonly sendMessageQuery = inject(SendMessageGQL);

  @Input({required: true}) roomId!: number | null;

  form = new FormGroup({
    message: new FormControl('', [Validators.required, Validators.minLength(2)]),
  });
  loading = false;

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  sendMessage() {
    gql`
    mutation sendMessage($roomId: Long!, $message: String!) {
      sendChatMessage(roomId: $roomId, message: $message) {
        id
      }
    }`;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.subscription.add(
      this.sendMessageQuery.mutate({
        message: this.form.value.message ?? '',
        roomId: this.roomId
      }, {
        refetchQueries: ['getMessages']
      }).subscribe({
        next: _ => this.form.reset(),
        error: () => this.loading = false,
        complete: () => this.loading = false
      })
    );
  }
}
