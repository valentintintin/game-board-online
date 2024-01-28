import {Component, inject} from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterLink, RouterOutlet} from '@angular/router';
import {NzContentComponent, NzFooterComponent, NzHeaderComponent, NzLayoutComponent} from "ng-zorro-antd/layout";
import {UserService} from "../services/api/user.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NzFooterComponent, NzContentComponent, NzHeaderComponent, NzLayoutComponent, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  readonly userService = inject(UserService);
}
