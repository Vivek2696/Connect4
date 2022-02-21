import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './account/login/login.component';
import { RegisterComponent } from './account/register/register.component';
import { GameMenuComponent } from './game/game-menu/game-menu.component';
import { GameplayComponent } from './game/gameplay/gameplay.component';
import { ProfileComponent } from './account/profile/profile.component';
import { ColorpickerComponent } from './game/color-picker/colorpicker.component';
import { MultiplayerLoginComponent } from './account/multiplayer-login/multiplayer-login.component';
import { MultiplayerRegisterComponent } from './account/multiplayer-register/multiplayer-register.component';
import { ReplaymenuComponent } from './game/replaymenu/replaymenu.component';
import { TutorialBoardComponent } from './game/gameboards/tutorial-board/tutorial-board.component';
import { ErrorPageComponent } from './error/error-page/error-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'gameMenu', component: GameMenuComponent},
  { path: 'game', component: GameplayComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'color-picker', component: ColorpickerComponent },
  { path: 'multiplayerlogin', component: MultiplayerLoginComponent },
  { path: 'multiplayerregister', component: MultiplayerRegisterComponent },
  { path: 'replaymenu', component: ReplaymenuComponent },
  { path: 'tutorial', component: TutorialBoardComponent },
  { path: 'error', component: ErrorPageComponent },
  { path: '**', redirectTo: 'error' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
