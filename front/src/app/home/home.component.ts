import {Component} from '@angular/core';
import {NzSpaceComponent, NzSpaceItemDirective} from "ng-zorro-antd/space";
import {UserFormComponent} from "./user-form/user-form.component";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    NzSpaceComponent,
    NzSpaceItemDirective,
    UserFormComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent  {
}
