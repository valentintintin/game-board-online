import {Component, inject, Input, OnDestroy} from '@angular/core';
import {CodeNamesGame, GiveHintQueryGQL, HintType} from "../../../../services/api/generated.service";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NzButtonComponent} from "ng-zorro-antd/button";
import {NzFormControlComponent, NzFormDirective, NzFormItemComponent} from "ng-zorro-antd/form";
import {NzIconDirective} from "ng-zorro-antd/icon";
import {NzInputDirective, NzInputGroupComponent} from "ng-zorro-antd/input";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {NzTooltipDirective} from "ng-zorro-antd/tooltip";
import {Subscription} from "rxjs";
import {gql} from "apollo-angular";
import {NzCheckboxComponent} from "ng-zorro-antd/checkbox";

@Component({
  selector: 'app-code-names-hint-input',
  standalone: true,
  imports: [
    FormsModule,
    NzButtonComponent,
    NzFormControlComponent,
    NzFormDirective,
    NzFormItemComponent,
    NzIconDirective,
    NzInputDirective,
    NzInputGroupComponent,
    NzSpinComponent,
    ReactiveFormsModule,
    NzTooltipDirective,
    NzCheckboxComponent
  ],
  templateUrl: './code-names-hint-input.component.html',
  styleUrl: './code-names-hint-input.component.scss'
})
export class CodeNamesHintInputComponent implements OnDestroy {
  @Input({ required: true }) game!: CodeNamesGame | any;

  private readonly subscription = new Subscription();

  private giveHintQuery = inject(GiveHintQueryGQL);

  form = new FormGroup({
    hint: new FormControl('', [Validators.required, Validators.minLength(2)]),
    nb: new FormControl(1, [Validators.required, Validators.min(0)]),
    isInfinite: new FormControl(false),
  });
  loading = false;

  constructor() {
    this.subscription.add(
      this.form.controls.isInfinite.valueChanges.subscribe(value => {
        if (value) {
          this.form.controls.nb.disable();
        } else {
          this.form.controls.nb.enable();
        }
      })
    );
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  giveHint() {
    gql`
      mutation giveHintQuery($gameId: UUID!, $hint: String!, $nb: Int!, $type: HintType!) {
        codeNames {
         giveHint(gameId: $gameId, data: {
           hint: $hint,
           nb: $nb,
           type: $type
         }) {
           action
         }
        }
      }`;

    if (this.form.invalid) {
      return;
    }

    this.loading = true;
    this.subscription.add(
      this.giveHintQuery.mutate({
        hint: this.form.value.hint ?? '',
        nb: this.form.value.nb ?? 0,
        type: this.form.controls.isInfinite ? HintType.Infinite : ((this.form.value.nb ?? 0) > 0 ? HintType.Nb : HintType.Zero),
        gameId: this.game.id
      }, {
        refetchQueries: ['getCodeNames']
      }).subscribe({
        next: _ => this.form.reset(),
        complete: () => this.loading = false
      })
    );
  }
}
