import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {GameComponent} from './components/game/game.component';
import {StatusComponent} from './components/status/status.component';
import {ConnectedGuard} from './guards/connected.guard';

const routes: Routes = [
  {
    path: 'game',
    component: GameComponent,
    canActivate: [ConnectedGuard]
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
        canActivate: [ConnectedGuard],
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
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
