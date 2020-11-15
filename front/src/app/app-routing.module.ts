import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';
import { StatusComponent } from './components/status/status.component';
import { NameGuard } from './guards/name.guard';
import { ConnectedGuard } from './guards/connected.guard';

const routes: Routes = [
  {
    path: 'game',
    component: GameComponent,
    canActivate: [NameGuard, ConnectedGuard]
  },
  {
    path: 'status',
    children: [
      {
        path: 'network-error',
        component: StatusComponent,
        data: {
          state: 'network.error'
        }
      },
      {
        path: 'game-pause',
        component: StatusComponent,
        canActivate: [NameGuard, ConnectedGuard],
        data: {
          state: 'game.pause'
        }
      },
      {
        path: '',
        component: StatusComponent
      }
    ]
  },
  {
    path: '',
    component: HomeComponent,
    canActivate: [ConnectedGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
