import { Component, OnInit } from '@angular/core';
import { CollectionService } from '../services/collection.service';
import { UserService } from '../services/user.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(public collectionService: CollectionService, public userService: UserService) {
  }

  ngOnInit(): void {
    if (environment.production) {
      document.addEventListener("contextmenu", function (e) {
        e.preventDefault();
      }, false);
    }
  }
}
