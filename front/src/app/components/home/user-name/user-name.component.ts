import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LocalStorageService } from 'ngx-localstorage';

@Component({
  selector: 'app-user-name',
  templateUrl: './user-name.component.html',
  styleUrls: ['./user-name.component.scss']
})
export class UserNameComponent {

  form: FormGroup;
  @Output('newName') newName$ = new EventEmitter<string>();

  constructor(private userService: UserService, localStorageService: LocalStorageService) {
    this.form = new FormGroup({
      name: new FormControl(localStorageService.get('user.name'), [Validators.required, Validators.minLength(3)])
    });
  }

  public changeName(): void {
    if (this.form.valid) {
      this.userService.changeName(this.form.get('name').value);
      this.newName$.emit(this.form.get('name').value)
    }
  }
}
