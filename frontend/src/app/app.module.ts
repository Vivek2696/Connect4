import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { GameMenuComponent } from './game/game-menu/game-menu.component';
import { GameplayComponent } from './game/gameplay/gameplay.component';
import { GameboardComponent } from './game/gameboards/single-player-board/gameboard.component';
import { ProfileComponent } from './account/profile/profile.component';
import { ChangePasswordComponent } from './account/change-password/change-password.component';
import { HttpClientModule } from '@angular/common/http';
import { MultiplayerBoardComponent } from './game/gameboards/multiplayer-board/multiplayer-board.component';
import { ColorpickerComponent } from './game/color-picker/colorpicker.component';
import { LoadingComponent } from './game/loading/loading/loading.component';
import { ReplayBoardComponent } from './game/gameboards/replay-board/replay-board.component';
import { MultiplayerLoginComponent } from './account/multiplayer-login/multiplayer-login.component';
import { MultiplayerRegisterComponent } from './account/multiplayer-register/multiplayer-register.component';
import { ReplaymenuComponent } from './game/replaymenu/replaymenu.component';
import { FinishGameDialogComponent } from './game/finish-game-dialog/finish-game-dialog.component';
import { TutorialBoardComponent } from './game/gameboards/tutorial-board/tutorial-board.component';
import { ErrorPageComponent } from './error/error-page/error-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    GameMenuComponent,
    GameplayComponent,
    GameboardComponent,
    ProfileComponent,
    ChangePasswordComponent,
    MultiplayerBoardComponent,
    ColorpickerComponent,
    LoadingComponent,
    ReplayBoardComponent,
    MultiplayerLoginComponent,
    MultiplayerRegisterComponent,
    ReplaymenuComponent,
    FinishGameDialogComponent,
    TutorialBoardComponent,
    ErrorPageComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    MaterialModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule { }
