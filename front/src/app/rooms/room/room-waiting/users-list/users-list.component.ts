import {Component, inject, Input, OnDestroy} from '@angular/core';
import {AsyncPipe} from "@angular/common";
import {NzListModule} from "ng-zorro-antd/list";
import {LeaveRoomGQL, User} from "../../../../../services/api/generated.service";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {Subscription} from "rxjs";
import {gql} from "apollo-angular";
import {Router} from "@angular/router";
import {UserService} from "../../../../../services/api/user.service";

@Component({
  selector: 'app-users-list',
  standalone: true,
  imports: [
    AsyncPipe,
    NzListModule,
    NzButtonComponent,
  ],
  templateUrl: './users-list.component.html',
  styleUrl: './users-list.component.scss'
})
export class UsersListComponent implements OnDestroy {
  @Input({required: true}) users: User[] | any[] = [];
  @Input({required: true}) roomId!: number;
  @Input() isOwner?: boolean | undefined = false;

  private readonly router = inject(Router);
  private readonly userService = inject(UserService);
  private readonly leaveGQL = inject(LeaveRoomGQL);

  private readonly subscriptions = new Subscription();

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  leave(user: User) {
    gql`
      mutation leaveRoom($roomId: Long!, $userId: Long!) {
        leaveRoom(roomId: $roomId, userId: $userId) {
          id
        }
      }
    `;

    this.subscriptions.add(
      this.leaveGQL.mutate({
        roomId: this.roomId,
        userId: user.id
      }, {
        refetchQueries: ['getRoom']
      }).subscribe(() => {
        if (this.userService.userConnected$()?.id === user.id) {
          void this.router.navigate(['/rooms']);
        }
      })
    );
  }
}
