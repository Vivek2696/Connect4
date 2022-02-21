import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginserviceService } from './Account/loginservice.service';
import { ProfileService } from './Account/profile.service';
import { RegisterService } from './Account/register.service';
import { GameBoardService } from './game/game-board.service';
import { GameMenuService } from './game/game-menu.service';
import { ChangePasswordService } from 'src/app/services/Account/change-password.service';
import { ReplaymenuService } from './game/replaymenu.service';

@Injectable({
  providedIn: 'root'
})
export class Connect4Service {

  constructor(private injector: Injector) { }

  //define services here
  private _loginService: LoginserviceService;
  private _registerService: RegisterService;
  private _gameMenuService: GameMenuService;
  private _gameBoardService: GameBoardService;
  private _profileService: ProfileService;
  private _changePasswordService: ChangePasswordService;
  private _replaymenuService: ReplaymenuService;

  //methods to get the services
  public get loginService(): LoginserviceService{
    if(!this._loginService){
      this._loginService = this.injector.get(LoginserviceService);
    }
    return this._loginService;
  }

  public get registerService(): RegisterService{
    if(!this._registerService){
      this._registerService = this.injector.get(RegisterService);
    }
    return this._registerService;
  }

  public get gameMenuService(): GameMenuService{
    if(!this._gameMenuService){
      this._gameMenuService = this.injector.get(GameMenuService);
    }
    return this._gameMenuService;
  }

  public get gameBoardService(): GameBoardService {
    if(!this._gameBoardService){
      this._gameBoardService = this.injector.get(GameBoardService);
    }
    return this._gameBoardService;
  }

  public get profileService(): ProfileService {
    if(!this._profileService){
      this._profileService = this.injector.get(ProfileService);
    }
    return this._profileService;
  }

    public get changePasswordService(): ChangePasswordService {
    if(!this._changePasswordService){
      this._changePasswordService = this.injector.get(ChangePasswordService);
    }
    return this._changePasswordService;
  }

    public get replayMenuService(): ReplaymenuService {
    if(!this._replaymenuService){
      this._replaymenuService = this.injector.get(ReplaymenuService);
    }
    return this._replaymenuService;
  }
  //add all the methods of the services
  authenticateUser(data: any){
    return this.loginService.authenticateUser(data);
  }

  registerUser(data: any){
    return this.registerService.registerUser(data);
  }

  createGame(data: any){
    return this.gameMenuService.createGame(data);
  }

  saveUserMove(data: any){
    return this.gameBoardService.saveUserMove(data);
  }

  computerMove(data: any){
    return this.gameBoardService.getComputerMove(data);
  }

  getProfileData(data: any){
    return this.profileService.getProfileData(data);
  }

  changePassword(id: string, data: any){
    return this.changePasswordService.changePassword(id, data);
  }

  getAllReplayGames(data: any){
    return this.replayMenuService.getAllGames(data);
  }

  getReplayGameMoves(data: any){
    return this.replayMenuService.getReplayGameMoves(data);
  }

}
