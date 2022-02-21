import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/User';
import { Connect4Service } from 'src/app/services/connect4.service';

@Component({
  selector: 'app-game-menu',
  templateUrl: './game-menu.component.html',
  styleUrls: ['./game-menu.component.scss']
})
export class GameMenuComponent implements OnInit {
  userObject: any;
  userName: string;
  selectedOption: string;

  gameOptions = [
    {value:"singleplayer", viewValue: "Single Player"},
    {value:"multiplayer", viewValue: "Multiplayer"},
    {value:"tutorial", viewValue: "Tutorial"},
    {value:"replay", viewValue: "Replay"},
  ];

  constructor(
    private router: Router,
    private connect4service: Connect4Service
  ) {
    this.userObject = JSON.parse(localStorage.getItem("userObject"));
    this.userName = this.userObject.firstName;
  }

  ngOnInit(): void {
  }

  onContinue(selected: string){
    if(selected == "null"){
      // throw error
    }
    var gameMode;
    console.log("Game Mode: "+selected);
    //set appropriate logic for selected options
    if(selected == 'singleplayer'){
      this.router.navigate(['color-picker'], { state: { mode: selected } });
    }
    else if (selected == 'multiplayer'){
      this.router.navigate(['multiplayerlogin'], { state: { mode: selected } });
    }
    else if (selected == 'tutorial'){
      let bodyObj = {jwtToken: this.userObject.jwtToken, gameModeId: 1}
      console.log(bodyObj);
      this.connect4service.createGame(JSON.stringify(bodyObj)).subscribe(res => {
        //this.startTutorial(res, selected);
        console.log('result', res);
        if(res != undefined){
          let gameObj = res;
          console.log(gameObj);
          this.router.navigate(
            ['game'], {state: {
              playerColor: 'crimson',
              mode: selected,
              game: gameObj
            }});
        }
      });
    }
    else if (selected == 'replay'){
      this.router.navigate(['replaymenu'], { state: { mode: selected } });
    }
    else{
      //naviage to the error page
    }
  }

  startTutorial(res: any, selected: string){

  }

}
