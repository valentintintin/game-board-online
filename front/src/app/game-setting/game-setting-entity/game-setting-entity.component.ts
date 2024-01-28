import {Component, inject, Input, OnDestroy} from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {Entity} from "../../../services/api/generated.service";
import {EntityService} from "../../../services/api/entity.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-game-setting-entity',
  standalone: true,
  imports: [
    NgOptimizedImage,
    NzTooltipDirective
  ],
  templateUrl: './game-setting-entity.component.html',
  styleUrl: './game-setting-entity.component.scss'
})
export class GameSettingEntityComponent implements OnDestroy {
  private readonly entityService = inject(EntityService);
  private readonly subscriptions = new Subscription();

  @Input({required: true}) entity!: Entity | any;

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  dblclick() {
    this.subscriptions.add(
      this.entityService.updateEntity(this.entity.id, {
        x: this.entity.x,
        y: this.entity.y,
        rotation: this.entity.rotation,
        showBack: !this.entity.showBack
      }).subscribe()
    );
  }
}
