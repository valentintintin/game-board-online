import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {RoomsComponent} from "./rooms/rooms.component";
import {connectedGuard} from "../connected.guard";
import {RoomComponent} from "./rooms/room/room.component";
import {GameComponent} from "./rooms/room/game/game.component";
import {notConnectedGuard} from "../not-connected.guard";
import {RoomWaitingComponent} from "./rooms/room/room-waiting/room-waiting.component";
import {GameSettingComponent} from "./game-setting/game-setting.component";

export const routes: Routes = [
  {
    path: '',
    title: 'Accueil - GameBoardOnline',
    component: HomeComponent,
    canActivate: [notConnectedGuard]
  },
  {
    path: 'rooms',
    title: 'Liste des salons - GameBoardOnline',
    component: RoomsComponent,
    canActivate: [connectedGuard]
  },
  {
    path: 'room/:roomId',
    title: 'Salon - GameBoardOnline',
    component: RoomComponent,
    canActivate: [connectedGuard],
    children: [
      {
        path: '',
        title: 'Salon - GameBoardOnline',
        component: RoomWaitingComponent
      },
      {
        path: 'game/:gameId',
        title: 'Jeu - GameBoardOnline',
        component: GameComponent
      }
    ]
  },
  {
    path: 'game/:gameId',
    title: 'Modification d\'un jeu - GameBoardOnline',
    component: GameSettingComponent,
    canActivate: [connectedGuard]
  },
  { path: '**', redirectTo: '' },
];
