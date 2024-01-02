import { Routes } from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {RoomsComponent} from "./rooms/rooms.component";
import {connectedGuard} from "../connected.guard";
import {RoomComponent} from "./rooms/room/room.component";
import {RoomInitComponent} from "./rooms/room/room-init/room-init.component";
import {GameComponent} from "./rooms/room/game/game.component";

export const routes: Routes = [
  {
    path: '',
    title: 'Accueil - GameBoardOnline',
    component: HomeComponent
  },
  {
    path: 'rooms',
    title: 'Liste des salons - GameBoardOnline',
    component: RoomsComponent,
    canActivate: [connectedGuard]
  },
  {
    path: 'room/:id',
    title: 'Salon - GameBoardOnline',
    component: RoomComponent,
    canActivate: [connectedGuard],
    children: [
      { path: '', redirectTo: 'init', pathMatch: 'full' },
      {
        path: 'init',
        title: 'Préparation du salon - GameBoardOnline',
        component: RoomInitComponent
      },
      {
        path: 'game',
        title: 'Jeu - GameBoardOnline',
        component: GameComponent
      }
    ]
  },
  { path: '**', redirectTo: '' },
];
