import { Component, OnInit, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { GameboardComponent } from '../gameboards/single-player-board/gameboard.component';
import { Router } from '@angular/router';
import { MultiplayerBoardComponent } from '../gameboards/multiplayer-board/multiplayer-board.component';
import { LayoutGapDirective } from '@angular/flex-layout';

@Component({
  selector: 'app-gameplay',
  templateUrl: './gameplay.component.html',
  styleUrls: ['./gameplay.component.scss'],
  animations: [
    trigger('swapturn', [
      state('turnstarted', style({
        'box-shadow': '0 25px 15px 0px rgba(0, 0, 0, 0.2)',
        transform: 'translatey(-20px)',
        opacity: '1'
      })),
      state('turnended', style({
        'box-shadow': '0 5px 15px 0px rgba(0, 0, 0, 0.6)',
        transform: 'translatey(0px)',
        opacity: '0.4',
        // background: '#dddddd',
        color: '#000000'
      })),
      transition('* => turnended', animate('500ms')),
      transition('* => turnstarted', animate('500ms')),
    ]),
    trigger('gamefinish', [
      state('won', style({
        'max-width': '300px',
        'max-height': '300px',
        'font-size': '2vw',
        width: '300px',
        height: '300px',
        'box-shadow': '0 30px 20px 0px rgba(0, 0, 0, 0.2)',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        opacity: '1'
      })),
      state('lost', style({
        'box-shadow': '0 5px 15px 0px rgba(0, 0, 0, 0.6)',
        transform: 'translatey(0px)',
        opacity: '0.4',
        // color: '#000000'
      })),
      transition('* => won', animate('1s')),
      transition('* => lost', animate('500ms')),
      transition('* => void', animate('1s')),
    ])
  ]
})
export class GameplayComponent implements OnInit {

  @ViewChild(GameboardComponent) gameBoard:GameboardComponent;
  @ViewChild(MultiplayerBoardComponent) multiplayerBoard:MultiplayerBoardComponent;

  gameMode: string;
  isgameSetUp: boolean;

  user: any;
  opponent: any;
  game: any;
  gameMoves: any;

  playerTurn: string;
  opponentTurn: string;

  playerName: string;
  opponentName: string;

  playerColor: string;
  opponentColor: string;

  isPlayerWon: string;
  isOpponentWon: string;

  constructor(
    private router: Router
  ) {

    console.log('rendering gameplay component');
    //waiting for the variables to declare
    this.isgameSetUp = false;

    this.gameMode = this.router.getCurrentNavigation().extras.state.mode;
    this.user = JSON.parse(localStorage.getItem('userObject'));
    //set the player name
    if(this.gameMode == 'singleplayer'){
      this.game = this.router.getCurrentNavigation().extras.state.game;
      this.playerName = this.user.firstName;
      this.opponentName = 'Computer'
    }
    else if (this.gameMode == 'multiplayer'){
      this.game = this.router.getCurrentNavigation().extras.state.game;
      this.playerName = this.user.firstName;
      this.opponent = JSON.parse(localStorage.getItem('userObject2'));
      this.opponentName = this.opponent.firstName;
    }
    else if (this.gameMode == 'tutorial'){
      this.game = this.router.getCurrentNavigation().extras.state.game;
      console.log('Game: ',this.game);
      this.playerName = 'Computer 1';
      this.opponentName = 'Computer 2';
    }
    else if (this.gameMode == 'replay'){
      console.log('ReplayMode detected!!')
      this.game = this.router.getCurrentNavigation().extras.state.game;
      this.user = this.router.getCurrentNavigation().extras.state.playerOne;
      this.opponent = this.router.getCurrentNavigation().extras.state.playerTwo;
      this.gameMoves = this.router.getCurrentNavigation().extras.state.gameMoves;
      this.playerName = this.user.firstName;
      this.opponentName = this.opponent != undefined? this.opponent.firstName : 'Computer';
      console.log(this.gameMoves, this.game, this.user, this.opponent);
    }
    // This is by default a player turn first
    this.playerTurn = 'turnstarted';
    this.opponentTurn = 'turnended';

    // set colors
    let colorSelected = this.router.getCurrentNavigation().extras.state.playerColor;
    if(colorSelected != undefined){
      this.playerColor = colorSelected;
      this.opponentColor = this.playerColor == 'crimson'?
        this.opponentColor = 'yellow' : this.opponentColor = 'crimson';
    }
    else{
      this.playerColor = 'crimson';
      this.opponentColor = 'yellow';
    }

    //set initial win/lose state
    this.isPlayerWon = 'Playing';
    this.isOpponentWon = 'Playing';

    //setting up the game board
    this.isgameSetUp = true;
  }

  ngOnInit(): void {
  }

  changeTurn(){
    this.playerTurn = this.playerTurn === 'turnstarted' ?
                        'turnended' : 'turnstarted';
    this.opponentTurn = this.opponentTurn === 'turnstarted' ?
                          'turnended' : 'turnstarted';
  }

  // argument can be changed to user
  async gamefinished(winner: string){
    if(winner == 'Player'){
      this.isPlayerWon = 'won';
      this.isOpponentWon = 'lost';
    }
    else{
      this.isPlayerWon = 'lost';
      this.isOpponentWon = 'won';
    }
    await this.delay(5000);
    this.router.navigate(['gameMenu']);
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  onPlayerPlayed(data: any){
    //TO-DO: Implement the check for win here
    /*---------------CALL CHECK FOR WIN---------------*/
    console.log("Player turn finished");
    if(data == true)
      this.changeTurn();

    this.toggleTurn()
  }

  toggleTurn(){
    //toggle turn in the game board
    if(this.gameMode == 'singleplayer'){
      this.playerTurn === 'turnstarted' ?
                          this.gameBoard.enableMove() : this.gameBoard.disableMove();
    }
    else if(this.gameMode == 'multiplayer'){
      this.playerTurn === 'turnstarted' ?
                          this.multiplayerBoard.setPlayerTurn() : this.multiplayerBoard.setOpponentTurn();
    }
    else if (this.gameMode == 'tutorial'){
      //toggle is handle in tutorial board
    }
    else{
      //add spectate logic
    }
  }

}
