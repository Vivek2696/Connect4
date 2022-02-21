import { ConditionalExpr } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { stringToKeyValue } from '@angular/flex-layout/extended/typings/style/style-transforms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { Connect4Service } from 'src/app/services/connect4.service';

@Component({
  selector: 'app-colorpicker',
  templateUrl: './colorpicker.component.html',
  styleUrls: ['./colorpicker.component.scss']
})
export class ColorpickerComponent implements OnInit {

  gameMode : string;

  playerColor: string;

  firstPlayer: any;
  secondPlayer: any;

  playerName: string;
  opponentName: string;

  bodyObj: any;

  constructor(
    private router: Router,
    private connect4service: Connect4Service
  ){
    this.gameMode = this.router.getCurrentNavigation().extras.state.mode;
    if(this.gameMode == 'singleplayer'){
      this.firstPlayer = JSON.parse(localStorage.getItem('userObject'));
    }
    else if(this.gameMode == 'multiplayer'){
      this.firstPlayer = JSON.parse(localStorage.getItem('userObject'));
      this.secondPlayer = JSON.parse(localStorage.getItem('userObject2'));
      this.playerName = this.firstPlayer.firstName;
    }
    else{
      console.log('Error in game creation');
    }
  }

  ngOnInit(): void {
  }

  onColorSelected(id: number){
    //set colors for players
    if(id == 0){
      this.playerColor = 'crimson';
    }
    else{
      this.playerColor = 'yellow';
    }
    // create new game
    if(this.gameMode == 'singleplayer'){
      if(id == 0){
        this.bodyObj = {jwtToken: this.firstPlayer.jwtToken, gameModeId: 2, PlayerOneId: this.firstPlayer._id, redColorPlayer: 1}
      }
      else{
        this.bodyObj = {jwtToken: this.firstPlayer.jwtToken, gameModeId: 2, PlayerOneId: this.firstPlayer._id, redColorPlayer: 2}
      }
      let reqBody = JSON.stringify(this.bodyObj);
      this.connect4service.createGame(reqBody).subscribe((res) => {
        this.router.navigate(
          ['game'], {state: {
            playerColor: this.playerColor,
            mode: this.gameMode,
            game: res
          }});
      });
      // this.router.navigate(
      //   ['game'], {state: {
      //     playerColor: this.playerColor,
      //     mode: this.gameMode,
      //     game: {gameId: 1}
      //   }});
    }
    else if (this.gameMode == 'multiplayer'){
      if(id == 0){
        this.bodyObj = {jwtToken: this.firstPlayer.jwtToken, gameModeId: 3, PlayerOneId: this.firstPlayer._id, PlayerTwoId: this.secondPlayer._id, redColorPlayer: 1}
      }
      else{
        this.bodyObj = {jwtToken: this.firstPlayer.jwtToken, gameModeId: 3, PlayerOneId: this.firstPlayer._id, PlayerTwoId: this.secondPlayer._id, redColorPlayer: 2}
      }
      let reqBody = JSON.stringify(this.bodyObj);
      this.connect4service.createGame(reqBody).subscribe(res => {
        this.router.navigate(
          ['game'], {state: {
            playerColor: this.playerColor,
            mode: this.gameMode,
            game: res
          }});
      });
    }
    else{
      console.log('Error in creating new game');
    }
  }

}
