import {Component, inject} from '@angular/core';
import {NzTableModule} from "ng-zorro-antd/table";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {gql} from "apollo-angular";
import {RoomsGQL} from "../../services/api/generated.service";
import {AsyncPipe, DatePipe} from "@angular/common";
import {RouterLink} from "@angular/router";
import {NzEmptyComponent} from "ng-zorro-antd/empty";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {UserService} from "../../services/api/user.service";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";

@Component({
  selector: 'app-rooms',
  standalone: true,
  imports: [
    NzTableModule,
    NzSpinComponent,
    AsyncPipe,
    RouterLink,
    DatePipe,
    NzEmptyComponent,
    NzIconDirective,
    NzTooltipDirective
  ],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss'
})
export class RoomsComponent {
  private roomsGQL = inject(RoomsGQL);
  userService = inject(UserService);

  private roomsQuery = gql`
    query rooms {
      rooms {
        id
        name
        createdAt
        owner {
          id
          name
        }
        users {
          id
          name
        }
        currentGame {
          id
          name
        }
      }
    }
  `;

  rooms$ = this.roomsGQL.watch().valueChanges;
}
