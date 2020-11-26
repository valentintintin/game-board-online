import { Component } from '@angular/core';
import { CollectionService } from '../services/collection.service';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public collectionService: CollectionService, public userService: UserService) {
  }
}
