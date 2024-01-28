import {Component, inject, OnDestroy, OnInit, signal} from '@angular/core';
import {Subscription} from "rxjs";
import {gql} from "apollo-angular";
import {ActivatedRoute, RouterOutlet} from "@angular/router";
import {Entity, Game, GetGameGQL} from "../../services/api/generated.service";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {NzPageHeaderComponent} from "ng-zorro-antd/page-header";
import {CdkDrag, CdkDragEnd} from "@angular/cdk/drag-drop";
import {GameSettingEntityComponent} from "./game-setting-entity/game-setting-entity.component";
import {ChatComponent} from "../rooms/room/chat/chat.component";
import {NzContentComponent, NzLayoutComponent, NzSiderComponent} from "ng-zorro-antd/layout";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzDescriptionsModule} from "ng-zorro-antd/descriptions";
import {EntityService} from "../../services/api/entity.service";
import {NzButtonComponent} from "ng-zorro-antd/button";

@Component({
  selector: 'app-game-setting',
  standalone: true,
  imports: [
    NzSpinComponent,
    NzPageHeaderComponent,
    CdkDrag,
    GameSettingEntityComponent,
    ChatComponent,
    NzContentComponent,
    NzIconDirective,
    NzLayoutComponent,
    NzSiderComponent,
    RouterOutlet,
    NzDescriptionsModule,
    NzButtonComponent,
  ],
  templateUrl: './game-setting.component.html',
  styleUrl: './game-setting.component.scss'
})
export class GameSettingComponent implements OnInit, OnDestroy {
  private readonly entityService = inject(EntityService);
  private readonly subscriptions = new Subscription();

  private query = gql`
    query getGame($gameId: Long!) {
      game(gameId: $gameId) {
        id
        name
        entitiesGroups {
          id
          name
          entities {
            id
            name
            x
            y
            rotation
            showBack
            width
            height
            order
            image
            imageBack
            canFlip
            canMove
            canRotate
            canBeDeleted
            group {
              id
              name
            }
          }
        }
      }
    }
  `;

  private readonly route = inject(ActivatedRoute)
  private readonly gameGQL = inject(GetGameGQL);

  private queryGetGame = this.gameGQL.watch({
    gameId: parseInt(this.route.snapshot.paramMap.get('gameId') ?? '', 10)
  });

  loading = true;
  game$ = signal<Game | undefined>(undefined);

  entitySelected?: Entity = undefined;
  positionOfSelected: { x: number, y: number }[] = [];

  ngOnInit() {
    this.subscriptions.add(
      this.queryGetGame.valueChanges.subscribe(g => {
        this.loading = false;
        this.game$.set(g.data?.game as Game);
        this.positionOfSelected = [];
        this.game$()?.entitiesGroups.flatMap(e => e.entities).forEach(e => {
          this.positionOfSelected[e.id] = {
            x: e.x!,
            y: e.y!
          }
        });
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  click(entity: Entity) {
    this.entitySelected = entity;
  }

  move(entity: Entity, $event: CdkDragEnd) {
    this.positionOfSelected[entity.id].x += $event.distance.x;
    this.positionOfSelected[entity.id].y += $event.distance.y;

    this.subscriptions.add(
      this.entityService.updateEntity(entity.id, {
        x: this.positionOfSelected[entity.id].x,
        y: this.positionOfSelected[entity.id].y,
        rotation: entity.rotation,
        showBack: entity.showBack
      }).subscribe()
    );
  }

  refresh() {
    this.loading = true;
    void this.queryGetGame.refetch();
  }
}
