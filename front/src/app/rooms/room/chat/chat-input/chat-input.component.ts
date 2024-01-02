import {Component, inject, OnDestroy} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent} from "ng-zorro-antd/form";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {gql} from "apollo-angular";
import {SendMessageGQL} from "../../../../../services/api/generated.service";
import {ActivatedRoute} from "@angular/router";
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

  private query = gql`
    mutation sendMessage($roomId: UUID!, $message: String!) {
      sendChatMessage(roomId: $roomId, message: $message) {
        id
      }
    }
  `;

  private sendMessageQuery = inject(SendMessageGQL);
  private route = inject(ActivatedRoute);
  private readonly subscription = new Subscription();

  form = new FormGroup({
    message: new FormControl('', [Validators.required, Validators.minLength(2)]),
  });
  loading = false;

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  sendMessage() {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.subscription.add(
      this.sendMessageQuery.mutate({
        message: this.form.value.message ?? '',
        roomId: this.route.snapshot.paramMap.get('id')
      }, {
        refetchQueries: ['getMessages']
      }).subscribe({
        next: _ => this.form.reset(),
        complete: () => this.loading = false
      })
    );
  }
}
