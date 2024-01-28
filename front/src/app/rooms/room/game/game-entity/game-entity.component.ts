import {Component, EventEmitter, inject, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {EntityFlippableState, EntityPlayed, Player} from "../../../../../services/api/generated.service";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {NgOptimizedImage} from "@angular/common";
import {Subscription} from "rxjs";
import {NzContextMenuService, NzDropdownMenuComponent, NzDropDownModule} from "ng-zorro-antd/dropdown";
import {UserService} from "../../../../../services/api/user.service";

@Component({
  selector: 'app-game-entity',
  standalone: true,
  imports: [
    NzTooltipDirective,
    NgOptimizedImage,
    NzDropDownModule,
  ],
  templateUrl: './game-entity.component.html',
  styleUrl: './game-entity.component.scss'
})
export class GameEntityComponent implements OnDestroy{
  private readonly subscriptions = new Subscription();

  private readonly nzContextMenuService = inject(NzContextMenuService);

  readonly userService = inject(UserService);

  @Input({required: true}) entity!: EntityPlayed | any;
  @Input({required: true}) players!: Player[] | any[];

  @Output() flip = new EventEmitter<{ showBack: boolean, onlyForOwner?: boolean }>();
  @Output() rotate = new EventEmitter<number>();
  @Output() delete = new EventEmitter<void>();
  @Output() give = new EventEmitter<number>();

  @ViewChild('menu') menu?: NzDropdownMenuComponent;

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  showDropDown($event: PointerEvent | any) {
    $event.preventDefault();

    this.nzContextMenuService.create({
      x: $event?.clientX,
      y: $event?.clientY
    }, this.menu!);
  }

  protected readonly EntityFlippableState = EntityFlippableState;
}
