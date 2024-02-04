import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {NzPageHeaderComponent} from "ng-zorro-antd/page-header";
import {AsyncPipe, DatePipe, NgOptimizedImage} from "@angular/common";
import {gql} from "apollo-angular";
import {GetGamesGQL, GetRoomGQL, InitGameGQL, UpdateRoomGQL} from "../../../../services/api/generated.service";
import {ActivatedRoute, Router, RouterLink} from "@angular/router";
import {UsersListComponent} from "./users-list/users-list.component";
import {NzDividerComponent} from "ng-zorro-antd/divider";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {NzCardModule} from "ng-zorro-antd/card";
import {NzGridModule} from "ng-zorro-antd/grid";
import {Subscription} from "rxjs";
import {NzButtonComponent, NzButtonGroupComponent} from "ng-zorro-antd/button";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {GameCardComponent} from "./game-card/game-card.component";

@Component({
  selector: 'app-room-waiting',
  standalone: true,
  imports: [
    NzPageHeaderComponent,
    AsyncPipe,
    UsersListComponent,
    NzDividerComponent,
    NzSpinComponent,
    NzCardModule,
    NzGridModule,
    NzButtonComponent,
    NgOptimizedImage,
    NzButtonGroupComponent,
    NzDropDownModule,
    NzIconDirective,
    DatePipe,
    RouterLink,
    NzTooltipDirective,
    GameCardComponent,
  ],
  templateUrl: './room-waiting.component.html',
  styleUrl: './room-waiting.component.scss'
})
export class RoomWaitingComponent implements OnInit, OnDestroy {
  private roomGuery = gql`
    query getRoom($roomId: Long!) {
      room(roomId: $roomId) {
        id
        name
        users(order: {
          name: ASC
        }) {
          id
          name
          color
        }
        games(order: {
          createdAt: DESC,
          game: {
            name: ASC
          }
        }) {
          id
          createdAt
          isFinished
          game {
            id
          }
        }
        currentGame {
          id
          createdAt
          isFinished
          game {
            id
            name
            image
          }
        }
      }
    }
  `;

  private gamesQuery = gql`
    query getGames {
      games(order: {
        name: ASC
      }) {
        id
        name
        image
      }
    }
  `;

  private roomSubscription = gql`
    subscription updateRoom {
      roomAction {
        id
      }
    }
  `;

  private readonly subscription = new Subscription();

  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly getRoomGQL = inject(GetRoomGQL);
  private readonly getGameGQL = inject(GetGamesGQL);
  private readonly initGameGQL = inject(InitGameGQL);
  private readonly updateRoomGQL = inject(UpdateRoomGQL);

  roomId = parseInt(this.route.snapshot.parent?.paramMap.get('roomId') ?? '', 10);

  loading = false;

  roomRef = this.getRoomGQL.watch({
    roomId: this.roomId
  });
  room$ = this.roomRef.valueChanges;

  games$ = this.getGameGQL.fetch();

  ngOnInit() {
    this.subscription.add(
      this.updateRoomGQL.subscribe().subscribe(() => {
        void this.roomRef.refetch()
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initGame(gameId: number) {
    gql`
      mutation initGame($roomId: Long!, $gameId: Long!) {
        initializeGame(roomId: $roomId, gameId: $gameId) {
          id
        }
      }
    `;

    this.loading = true;

    this.subscription.add(
      this.initGameGQL.mutate({
        roomId: parseInt(this.route.snapshot.parent?.paramMap.get('roomId') ?? '', 10),
        gameId: gameId
      }, {
        refetchQueries: ['getMessages', 'getRoom']
      }).subscribe({
        next: result => this.router.navigate(['game', result.data?.initializeGame?.id], {
          relativeTo: this.route
        }),
        error: () => this.loading = false,
        complete: () => this.loading = false
      })
    );
  }
}
