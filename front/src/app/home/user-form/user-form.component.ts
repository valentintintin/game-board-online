import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent, NzFormLabelComponent} from "ng-zorro-antd/form";
import {UserService} from "../../../services/api/user.service";
import {Subscription} from "rxjs";
import {CookieStorageService} from "../../../services/cookie-storage.service";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {Router} from "@angular/router";

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NzIconDirective,
    NzInputDirective,
    NzButtonComponent,
    NzFormItemComponent,
    NzFormLabelComponent,
    NzFormControlComponent,
    NzFormDirective,
    NzInputGroupComponent,
    NzSpinComponent
  ],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.scss'
})
export class UserFormComponent implements OnInit, OnDestroy {
  private router = inject(Router);
  private userService = inject(UserService);
  private cookieStorageService = inject(CookieStorageService);

  private readonly subscription = new Subscription();

  loading = true;
  form = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    color: new FormControl(this.generateRandomColor(), [Validators.required]),
  });

  ngOnInit(): void {
    if (this.cookieStorageService.token) {
      this.subscription.add(
          this.userService.me()
              .subscribe({
                next: value => {
                  if (value) {
                    this.form.setValue({
                      name: value.name,
                      color: value.color
                    });
                  }
                },
                complete: () => this.loading = false
              })
      );
    }
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  login() {
    if (this.form.invalid) {
      return;
    }

    this.loading = true;

    this.userService.login(this.form.value.name!, this.form.value.color!).subscribe({
      next: _ => this.router.navigate(['/rooms']),
      complete: () => this.loading = false
    })
  }

  generateRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';

    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
  }
}
