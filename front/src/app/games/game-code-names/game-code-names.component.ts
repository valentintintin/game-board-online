import {Component, inject} from '@angular/core';
import {CodeNamesWordCardComponent} from "./code-names-word-card/code-names-word-card.component";
import {NzGridModule} from "ng-zorro-antd/grid";
import {gql} from "apollo-angular";
import {
  CodeNameMakeProposalGQL,
  CodeNamesGame,
  CodeNamesState,
  CodeNamesWordCard,
  GetCodeNamesGQL
} from "../../../services/api/generated.service";
import {ActivatedRoute} from "@angular/router";
import {AsyncPipe} from "@angular/common";
import {NzSpinComponent} from "ng-zorro-antd/spin";
import {map, tap} from "rxjs";
import {CodeNamesHintInputComponent} from "./code-names-hint-input/code-names-hint-input.component";

@Component({
  selector: 'app-game-code-names',
  standalone: true,
  imports: [
    CodeNamesWordCardComponent,
    NzGridModule,
    AsyncPipe,
    NzSpinComponent,
    CodeNamesHintInputComponent
  ],
  templateUrl: './game-code-names.component.html',
  styleUrl: './game-code-names.component.scss'
})
export class GameCodeNamesComponent {
  private gameQuery = gql`
    query getCodeNames($gameId: UUID!) {
      codeNames {
        get(gameId: $gameId) {
          id
          currentState
          currentTeam
          winnerTeam
          currentPlayer {
            id
            name
          }
          players {
            id
            name
            team
          }
          words {
            id
            word
            team
            isFound
          }
          hints {
            id
            team
            word
            nb
            owner {
              id
              name
            }
          }
        }
      }
    }
  `;

  protected readonly CodeNamesState = CodeNamesState;

  private getCodeNamesGQL = inject(GetCodeNamesGQL);
  private codeNameMakeProposalGQL = inject(CodeNameMakeProposalGQL);
  private route = inject(ActivatedRoute);

  data$ = this.getCodeNamesGQL.watch({
    gameId: this.route.snapshot.paramMap.get('gameId')
  }).valueChanges;

  game$ = this.data$.pipe(
    map(g => g.data.codeNames.get)
  );

  state$ = this.game$.pipe(
    map(g => g?.currentState)
  );

  currentPlayer$ = this.game$.pipe(
    map(g => g?.currentPlayer)
  );

  currentTeam$ = this.game$.pipe(
    map(g => g?.currentTeam)
  );

  selectWord(word: CodeNamesWordCard) {
    gql`
      mutation codeNameMakeProposal($gameId: UUID!, $word: String!) {
        codeNames {
          makeProposal(gameId: $gameId, data: {
            word: $word
          }) {
            action
          }
        }
      }
    `;

    this.codeNameMakeProposalGQL.mutate({
      gameId: this.route.snapshot.paramMap.get('gameId'),
      word: word.word
    }, { refetchQueries: ['getCodeNames']} )
      .subscribe();
  }
}
