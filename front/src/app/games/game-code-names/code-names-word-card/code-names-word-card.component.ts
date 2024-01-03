import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CodeNamesWordCard} from "../../../../services/api/generated.service";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-code-names-word-card',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './code-names-word-card.component.html',
  styleUrl: './code-names-word-card.component.scss'
})
export class CodeNamesWordCardComponent {
  @Input({required: true}) word!: CodeNamesWordCard | any;
  @Input() alwaysShowWord = false;

  @Output() selected = new EventEmitter<CodeNamesWordCard>();
}
