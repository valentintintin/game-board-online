import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './components/app.component';
import { DrawingAreaComponent } from './components/game/drawing-area/drawing-area.component';
import { WebsocketService } from './services/websocket.service';
import { DrawingService } from './services/drawing.service';
import { SocketIoModule } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { UserService } from './services/user.service';
import { UserNameComponent } from './components/home/user-name/user-name.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ListUserComponent } from './components/game/list-user/list-user.component';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { ChatComponent } from './components/game/chat/chat.component';
import { ChatInputComponent } from './components/game/chat/chat-input/chat-input.component';
import { ChatService } from './services/chat.service';
import { ListImageComponent } from './components/game/collection/list-image/list-image.component';
import { CollectionService } from './services/collection.service';
import { ListCollectionComponent } from './components/game/collection/list-collection.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { fr_FR, NZ_I18N } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import fr from '@angular/common/locales/fr';
import { HomeComponent } from './components/home/home.component';
import { GameComponent } from './components/game/game.component';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputModule } from 'ng-zorro-antd/input';
import { StatusComponent } from './components/status/status.component';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzResultModule } from 'ng-zorro-antd/result';
import { NzListModule } from 'ng-zorro-antd/list';
import { SocketIdGuard } from './guards/socket-id-guard.service';
import { ConnectedGuard } from './guards/connected.guard';
import { HasCollectionGuard } from './guards/has-collection.guard';
import { IconDefinition } from '@ant-design/icons-angular';
import {
  BugTwoTone,
  PauseCircleTwoTone,
  RightOutline,
  SendOutline,
  WarningTwoTone
} from '@ant-design/icons-angular/icons';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzNotificationModule } from 'ng-zorro-antd/notification';

registerLocaleData(fr);

const icons: IconDefinition[] = [RightOutline, SendOutline, PauseCircleTwoTone, WarningTwoTone, BugTwoTone]

@NgModule({
  declarations: [
    AppComponent,
    DrawingAreaComponent,
    UserNameComponent,
    ListUserComponent,
    ChatComponent,
    ChatInputComponent,
    ListImageComponent,
    ListCollectionComponent,
    HomeComponent,
    GameComponent,
    StatusComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgxLocalStorageModule.forRoot(),
    SocketIoModule.forRoot({
      url: environment.serverUrl
    }),
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NzLayoutModule,
    NzIconModule.forRoot(icons),
    NzButtonModule,
    NzInputModule,
    NzTypographyModule,
    NzSpaceModule,
    NzResultModule,
    NzListModule,
    NzDropDownModule,
    NzNotificationModule
  ],
  providers: [
    WebsocketService,
    DrawingService,
    UserService,
    ChatService,
    CollectionService,
    { provide: NZ_I18N, useValue: fr_FR },

    SocketIdGuard,
    ConnectedGuard,
    HasCollectionGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
