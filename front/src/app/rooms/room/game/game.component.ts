import {Component, ElementRef, inject, OnDestroy, OnInit, signal, ViewChild} from '@angular/core';
import {gql} from "apollo-angular";
import {
  DeleteEntityGQL, DeleteNotTouchedInGroupGQL,
  EntityPlayed,
  FlipEntityGQL,
  GameActionGQL,
  GamePlayed,
  GetGamePlayedGQL,
  GiveEntityGQL,
  MoveEntityGQL, RandomizeEntitiesGQL,
  RotateEntityGQL
} from "../../../../services/api/generated.service";
import {ActivatedRoute, Router} from "@angular/router";
import {AsyncPipe, NgOptimizedImage} from "@angular/common";
import {NzPageHeaderModule} from "ng-zorro-antd/page-header";
import {GameEntityComponent} from "./game-entity/game-entity.component";
import {CdkDrag, CdkDragEnd, CdkDropList} from "@angular/cdk/drag-drop";
import {Subscription} from "rxjs";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {NzSegmentedModule, NzSegmentedOption} from "ng-zorro-antd/segmented";
import {FormsModule} from "@angular/forms";
import {NzMessageService} from "ng-zorro-antd/message";
import {UserService} from "../../../../services/api/user.service";
import {NzSpaceModule} from "ng-zorro-antd/space";
import {NzButtonModule} from "ng-zorro-antd/button";
import {NzDropDownModule} from "ng-zorro-antd/dropdown";
import {NzEmptyComponent} from "ng-zorro-antd/empty";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    AsyncPipe,
    NzPageHeaderModule,
    GameEntityComponent,
    CdkDrag,
    CdkDropList,
    NzSpinComponent,
    NzSegmentedModule,
    FormsModule,
    NgOptimizedImage,
    NzSpaceModule,
    NzButtonModule,
    NzDropDownModule,
    NzEmptyComponent,
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent implements OnInit, OnDestroy {
  private readonly subscriptions = new Subscription();
  private readonly messageService = inject(NzMessageService);
  private readonly router = inject(Router);

  private readonly flipGQL = inject(FlipEntityGQL);
  private readonly rotateGQL = inject(RotateEntityGQL);
  private readonly deleteGQL = inject(DeleteEntityGQL);
  private readonly giveGQL = inject(GiveEntityGQL);
  private readonly deleteNotTouchedInGroupGQL = inject(DeleteNotTouchedInGroupGQL);
  private readonly randomizeEntitiesGQL = inject(RandomizeEntitiesGQL);

  private query = gql`
    query getGamePlayed($gamePlayedId: Long!) {
      gamePlayed(gamePlayedId: $gamePlayedId) {
        id
        players {
          id
          user {
            id
            name
            color
          }
        }
        game {
          id
          name
        }
        room {
          id
          name
        }
        entitiesGroups {
          id
          name
          randomize
          canRemoveNotUsed
        }
        entities {
          id
          image
          imageBack
          width
          height
          order
          name
          canFlip
          canMove
          canRotate
          canBeDeleted
          isMine
          x
          y
          rotation
          container
          showBack
          deleted
          onlyForOwner
          owner {
            id
            user {
              id
              name
              color
            }
          }
        }
      }
    }
  `;

  private querySubscription = gql`
    subscription gameAction {
      gameAction {
        id
        name
        canFlip
        canMove
        canRotate
        canBeDeleted
        isMine
        x
        y
        rotation
        container
        showBack
        deleted
        order
        onlyForOwner
        owner {
          id
          user {
            id
            name
            color
          }
        }
      }
    }
  `;

  private readonly route = inject(ActivatedRoute);
  private readonly userService = inject(UserService);
  private readonly gamePlayedGQL = inject(GetGamePlayedGQL);
  private readonly moveGQL = inject(MoveEntityGQL);
  private readonly gameActionGQL = inject(GameActionGQL);

  @ViewChild('main', { read: ElementRef }) mainContainer?: ElementRef;
  @ViewChild('playerHand', { read: ElementRef }) playerHandContainer?: ElementRef;

  game$ = signal<GamePlayed | undefined>(undefined);

  loading = true;
  options: NzSegmentedOption[] = [];
  optionSelected = 0;

  ngOnInit() {
    this.subscriptions.add(
      this.gamePlayedGQL.watch({
        gamePlayedId: parseInt(this.route.snapshot.paramMap.get('gameId') ?? '', 10)
      }).valueChanges.subscribe(g => {
        this.loading = false;
        this.game$.set(g.data.gamePlayed as GamePlayed);

        if (!this.options.length) {
          this.options = this.game$()!.players.map((p, i) => {
            if (p.user.id === this.userService.userConnected$()?.id) {
              this.optionSelected = i;
            }

            return {
              label: `Main de ${p.user.name ?? ''}`,
              value: `player-${p.id}`
            } as NzSegmentedOption
          });
        }
      })
    );

    this.subscriptions.add(
      this.gameActionGQL.subscribe().subscribe({
        next: a => {
          console.log(a);
        },
        error: a => {
          this.messageService.error(JSON.stringify(a), {
            nzDuration: 30_000
          });
          console.error(a);
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  move(entity: EntityPlayed | any, $event: CdkDragEnd) {
    gql`
      mutation moveEntity($entityPlayedId: Long!, $x: Int!, $y: Int!, $container: String) {
        gameMoveEntity(entityPlayedId: $entityPlayedId, x: $x, y: $y, container: $container) {
          id
          container
          x
          y
          isMine
          owner {
            id
            user {
              id
            }
          }
        }
      }
    `;

    this.subscriptions.add(
      this.moveGQL.mutate({
        entityPlayedId: entity.id,
        x: entity.x + $event.distance.x,
        y: entity.y + $event.distance.y,
        container: this.getContainerForEntity(entity)
      }).subscribe()
    );
  }
  flip(entity: EntityPlayed, showBack: boolean, onlyForOwner?: boolean) {
    if (!entity.canFlip) {
      this.messageService.warning('Il n\'est pas possible de retourner cet element')
      return;
    }

    gql`
      mutation flipEntity($entityPlayedId: Long!, $showBack: Boolean!, $onlyForOwner: Boolean) {
        gameFlipEntity(entityPlayedId: $entityPlayedId, showBack: $showBack, onlyForOwner: $onlyForOwner) {
          id
          name
          showBack
          canFlip
          onlyForOwner
          container
          isMine
          owner {
            id
            user {
              id
            }
          }
        }
      }
    `;

    this.subscriptions.add(
      this.flipGQL.mutate({
        entityPlayedId: entity.id,
        onlyForOwner,
        showBack
      }).subscribe(result => {
        this.messageService.success(`${entity.name} retourné`)
      })
    );
  }

  rotate(entity: EntityPlayed, angle: number) {
    if (!entity.entity.canRotate) {
      this.messageService.warning('Il n\'est pas possible de tourner cet element')
      return;
    }

    gql`
      mutation rotateEntity($entityPlayedId: Long!, $rotation: Int!) {
        gameRotateEntity(entityPlayedId: $entityPlayedId, rotation: $rotation) {
          id
          rotation
          isMine
          owner {
            id
            user {
              id
            }
          }
        }
      }
    `;

    this.subscriptions.add(
      this.rotateGQL.mutate({
        entityPlayedId: entity.id,
        rotation: entity.rotation + angle
      }).subscribe(result => {
        this.messageService.success(`${entity.name} tourné`)
      })
    );
  }

  delete(entity: EntityPlayed, ) {
    if (!entity.entity.canBeDeleted) {
      this.messageService.warning('Il n\'est pas possible de supprimer cet element')
      return;
    }

    gql`
      mutation deleteEntity($entityPlayedId: Long!) {
        gameDeleteEntity(entityPlayedId: $entityPlayedId) {
          id
          deleted
          isMine
          owner {
            id
            user {
              id
            }
          }
        }
      }
    `;

    this.subscriptions.add(
      this.deleteGQL.mutate({
        entityPlayedId: entity.id,
      }).subscribe(result => {
        this.messageService.success(`${entity.name} supprimé`)
      })
    );
  }

  give(entity: EntityPlayed, newPlayerId: number) {
    if (!entity.onlyForOwner) {
      this.messageService.warning('Il n\'est pas possible de donner cet element')
      return;
    }

    gql`
      mutation giveEntity($entityPlayedId: Long!, $newPlayerId: Long!, $container: String) {
        gameGiveEntity(entityPlayedId: $entityPlayedId, newPlayerId: $newPlayerId, container: $container) {
          id
          isMine
          owner {
            id
            user {
              id
            }
          }
        }
      }
    `;

    let container = entity.container;

    if (container?.includes('player') || entity.y < 0) {
      container = `player-${newPlayerId}`;
    }

    this.subscriptions.add(
      this.giveGQL.mutate({
        entityPlayedId: entity.id,
        newPlayerId,
        container: container
      }).subscribe(result => {
        this.messageService.success(`${entity.name} donné`)
      })
    );
  }

  private getContainerForEntity(entity: EntityPlayed): string | undefined {
    const element = document.getElementById(`entity-${entity.id}`);

    if (!element) {
      throw new Error(`Element introuvable : entity-${entity.id}`);
    }

    const entityPosition = element.getBoundingClientRect();
    let containersPosition = [
      {
        id: 'main',
        position: this.mainContainer?.nativeElement.getBoundingClientRect()
      },
      {
        id: this.options[this.optionSelected].value as string,
        position: this.playerHandContainer?.nativeElement.getBoundingClientRect()
      }
    ];

    // for (let player of this.game$()?.players ?? []) {
    //   const id = `player-${player.id}`;
    //   containersPosition.push({
    //     position: document.getElementById(id)?.getBoundingClientRect(),
    //     id
    //   });
    // }

    const inside = containersPosition.filter(p => p.position)
      .filter(p =>
        entityPosition.top >= p.position.top &&
        entityPosition.bottom <= p.position.bottom &&
        entityPosition.left >= p.position.left &&
        entityPosition.right <= p.position.right);

    return inside.length ? inside[0].id : undefined;
  }

  goBack() {
    void this.router.navigate(['/room', this.route.parent?.snapshot.paramMap.get('roomId')]);
  }

  deleteNotTouchedInGroup(id: number) {
    gql`
      mutation deleteNotTouchedInGroup($gamePlayedId: Long!, $entityGroupId: Long!) {
        deleteEntitiesNotTouched(gamePlayedId: $gamePlayedId, entityGroupId: $entityGroupId) {
          id
          deleted
        }
      }
    `;

    this.subscriptions.add(
      this.deleteNotTouchedInGroupGQL.mutate({
        gamePlayedId: this.game$()?.id,
        entityGroupId: id
      }).subscribe(() => {
        this.messageService.success(`Elements supprimés`)
      })
    );
  }

  randomizeGroup(id: number, onlyTouched: boolean, restoreDeleted: boolean) {
    gql`
      mutation randomizeEntities($gamePlayedId: Long!, $entityGroupId: Long!, $onlyTouched: Boolean!, $restoreDeleted: Boolean!) {
        randomizeEntities(gamePlayedId: $gamePlayedId, entityGroupId: $entityGroupId, onlyTouched: $onlyTouched, restoreDeleted: $restoreDeleted) {
          id
          x
          y
          container
          order
          rotation
          showBack
          canFlip
          onlyForOwner
          deleted
          owner {
            id
            user {
              id
            }
          }
        }
      }
    `;

    this.subscriptions.add(
      this.randomizeEntitiesGQL.mutate({
        gamePlayedId: this.game$()?.id,
        entityGroupId: id,
        onlyTouched,
        restoreDeleted
      }).subscribe(() => {
        this.messageService.success(`Elements mélangés`)
      })
    );
  }
}
