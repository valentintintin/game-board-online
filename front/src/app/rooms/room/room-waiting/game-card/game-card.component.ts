import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {AsyncPipe, DatePipe, JsonPipe, NgOptimizedImage} from "@angular/common";
import {NzButtonComponent, NzButtonGroupComponent} from "ng-zorro-antd/button";
import {NzCardComponent} from "ng-zorro-antd/card";
import {NzColDirective} from "ng-zorro-antd/grid";
import {NzDropdownButtonDirective, NzDropDownDirective, NzDropdownMenuComponent} from "ng-zorro-antd/dropdown";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzMenuDirective, NzMenuItemComponent} from "ng-zorro-antd/menu";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {RouterLink} from "@angular/router";
import {Game, GamePlayed} from "../../../../../services/api/generated.service";

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [
    AsyncPipe,
    DatePipe,
    NgOptimizedImage,
    NzButtonComponent,
    NzButtonGroupComponent,
    NzCardComponent,
    NzColDirective,
    NzDropDownDirective,
    NzDropdownButtonDirective,
    NzDropdownMenuComponent,
    NzIconDirective,
    NzMenuDirective,
    NzMenuItemComponent,
    NzTooltipDirective,
    RouterLink,
  ],
  templateUrl: './game-card.component.html',
  styleUrl: './game-card.component.scss'
})
export class GameCardComponent implements OnChanges {
  @Input() game: Game | any;
  @Input() gamePlayed: GamePlayed | any;
  @Input() gamesPlayed: GamePlayed[] | any[] = [];
  @Output() newGame = new EventEmitter<Game>();

  ngOnChanges(changes: SimpleChanges): void {
    if (this.gamePlayed) {
      this.game = this.gamePlayed.game;
    }
  }
}
