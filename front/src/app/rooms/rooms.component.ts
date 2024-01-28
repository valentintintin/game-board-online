import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {NzTableModule} from "ng-zorro-antd/table";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {gql} from "apollo-angular";
import {AsyncPipe, DatePipe} from "@angular/common";
import {Router, RouterLink} from "@angular/router";
import {NzEmptyComponent} from "ng-zorro-antd/empty";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {UserService} from "../../services/api/user.service";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {RoomFormComponent} from "./room-form/room-form.component";
import {GetRoomsGQL, JoinRoomGQL, NewRoomGQL} from "../../services/api/generated.service";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {Subscription} from "rxjs";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzPageHeaderComponent} from "ng-zorro-antd/page-header";

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
    NzTooltipDirective,
    RoomFormComponent,
    NzDividerComponent,
    NzButtonComponent,
    NzPageHeaderComponent
  ],
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss'
})
export class RoomsComponent implements OnInit, OnDestroy {
  private readonly subscription = new Subscription();

  private readonly router = inject(Router);
  private readonly roomsGQL = inject(GetRoomsGQL);
  private readonly newRoomsGQL = inject(NewRoomGQL);
  private readonly joinRoomGQL = inject(JoinRoomGQL);

  private roomsQuery = gql`
    query getRooms {
      rooms {
        id
        name
        createdAt
        userConnectedIsInside
        owner {
          id
          name
          color
        }
      }
    }
  `;

  private roomsSubscription = gql`
    subscription newRoom {
      newRoom {
        id
      }
    }
  `;

  roomsRef = this.roomsGQL.watch();
  rooms$ = this.roomsRef.valueChanges;

  ngOnInit(): void {
    this.subscription.add(
      this.newRoomsGQL.subscribe().subscribe(() => {
        void this.roomsRef.refetch();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  join(roomId: number) {
    gql`
      mutation joinRoom($roomId: Long!) {
        joinRoom(roomId: $roomId) {
          id
        }
      }
    `;

    this.subscription.add(
      this.joinRoomGQL.mutate({
        roomId: roomId
      }).subscribe({
        next: () => this.router.navigate(['/room', roomId])
      })
    );
  }
}
