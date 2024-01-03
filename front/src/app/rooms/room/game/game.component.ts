import { Component } from '@angular/core';
import {GameCodeNamesComponent} from "../../../games/game-code-names/game-code-names.component";

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [
    GameCodeNamesComponent
  ],
  templateUrl: './game.component.html',
  styleUrl: './game.component.scss'
})
export class GameComponent {

}
