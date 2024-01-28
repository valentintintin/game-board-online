import {Component, inject, OnDestroy} from '@angular/core';
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent} from "ng-zorro-antd/form";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {Subscription} from "rxjs";
import {gql} from "apollo-angular";
import {CreateRoomGQL} from "../../../services/api/generated.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-room-form',
  standalone: true,
    imports: [
        NzButtonComponent,
        NzFormControlComponent,
        NzFormDirective,
        NzFormItemComponent,
        NzIconDirective,
        NzInputDirective,
        NzInputGroupComponent,
        NzSpinComponent,
        ReactiveFormsModule
    ],
  templateUrl: './room-form.component.html',
  styleUrl: './room-form.component.scss'
})
export class RoomFormComponent implements OnDestroy {
  private readonly subscription = new Subscription();

  private readonly router = inject(Router);
  private readonly createRoomGQL = inject(CreateRoomGQL);

  loading = false;
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
  });

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  create() {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    gql`
      mutation createRoom($name: String!) {
        createRoom(name: $name) {
          id
          name
        }
      }
    `;

    this.createRoomGQL.mutate({
      name: this.form.value.name ?? ''
    }, {
      refetchQueries: ['getRooms']
    }).subscribe({
      next: result => this.router.navigate(['/room', result.data?.createRoom?.id]),
      error: () => this.loading = false,
      complete: () => this.loading = false
    })
  }
}
