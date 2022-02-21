import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CircleStatus } from 'src/app/Models/CircleStatus';
import { Connect4Service } from 'src/app/services/connect4.service';
import { FinishGameDialogComponent } from '../../finish-game-dialog/finish-game-dialog.component';
import { LoadingComponent } from '../../loading/loading/loading.component';

@Component({
  selector: 'app-replay-board',
  templateUrl: './replay-board.component.html',
  styleUrls: ['./replay-board.component.scss'],
  animations: [
    trigger('colordiv', [
      state('fill', style({
        'background-color': '{{color}}',
      }), {params : {color : 'red'}}),
      state('empty', style({
        'background-color': 'transparent',
      }), {params : {color : 'transparent'}}),
      transition('* => fill', animate('50ms')),
      transition('* => empty', animate('50ms')),
    ])
  ]
})
export class ReplayBoardComponent implements OnInit {

  @Output() onPlayerTurnFinished : EventEmitter<any> = new EventEmitter<any>();
  @Output() onGameFinished: EventEmitter<any> = new EventEmitter<any>();
  @Input() playerColor: string;
  @Input() opponentColor: string;
  @Input() game: any;
  @Input() gameMoves: any;
  @Input() firstPlayer: any;
  @Input() secondPlayer: any;

  //this board array to track the board
  boardArray: number[][];

  //this array for animation
  boardStatus: CircleStatus[][];

  isPlayerTurn: boolean;
  isOpponentTurn: boolean;

  isAnimating: boolean;

  circleStatus: string;
  fillColor: string;

  constructor(
    private router: Router,
    private connect4service: Connect4Service,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.isPlayerTurn = true;
    this.isOpponentTurn = false;

    this.signalGameStart();
  }

  ngOnInit(): void {
    //set the board status
    this.setBoard();
    this.setBoardStatus();
  }

  async signalGameStart(){
    console.log(this.gameMoves);
    this.snackBar.openFromComponent(LoadingComponent);
    await this.delay(3000);
    this.snackBar.dismiss();

    //start the game
    this.startGame();
  }

  async startGame(){
    for(let gameMove of this.gameMoves){
      console.log(gameMove);
      this.RequestMove(gameMove);
      await this.delay(3000);
      this.snackBar.dismiss();
    }
    //check the final status
    this.declareStatus()
  }

  RequestMove(gameMove: any){
    let x, y;
    x = gameMove.x;
    y = gameMove.y;
    this.makePlayerMove(x, y);
  }

  async makePlayerMove(x: number, y: number){
    console.log('animating: ',x,y);
    await this.onAnimatePlayerMove(x,y);
    //wait for few seconds
    this.snackBar.openFromComponent(LoadingComponent);
    this.onPlayerTurnFinished.emit(true);
    this.isPlayerTurn = !this.isPlayerTurn;
    this.isOpponentTurn = !this.isOpponentTurn;
  }


  setBoard(){
    this.boardArray = new Array(7);
    for(let i = 0; i < 7; i++){
      this.boardArray[i] = new Array(6);
    }
    for(let i = 0; i < 7; i++){
      for(let j = 0; j < 6; j++){
        this.boardArray[i][j] = 0;
      }
    }
  }

  setBoardStatus(){
    this.boardStatus = new Array(7);
    for(let i = 0; i < 7; i++){
      this.boardStatus[i] = new Array(6);
    }
    for(let i = 0; i < 7; i++){
      for(let j = 0; j < 6; j++){
        this.boardStatus[i][j] = {name: 'null', fillColor: 'transparent'};
      }
    }
  }

  checkForDraw(){
    for(let i = 0; i < 7; i++){
      for(let j = 0; j < 6; j++){
        if(this.boardArray[i][j] == 0){
          return false;
        }
      }
    }
    return true;
  }

  //Use this function to animate the player
  onAnimatePlayerMove(x: number, y: number){
    return new Promise(async resolve => {
      for(let i = 0; i < (y+1); i++){
        this.boardStatus[x][i].fillColor = this.isPlayerTurn? this.playerColor: this.opponentColor;
        this.boardStatus[x][i].name = 'fill';
        await this.delay(50);
        if(i < y){
          this.boardStatus[x][i].fillColor = 'transparent';
          this.boardStatus[x][i].name = 'empty';
          await this.delay(50);
        }
      }
      this.boardArray[x][y] = 1;
      resolve(true);
    })
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  declareStatus(){
    if(this.firstPlayer._id == this.game.winningPlayerId){
      this.onGameFinished.emit('Player');
    }
    else if(this.secondPlayer._id == this.game.winningPlayerId){
      this.onGameFinished.emit('Opponent');
    }
    else{
      if(this.checkForDraw()){
        this.gameFinishDialog('Draw');
      }
      else{
        alert('Game was disrupted!!');
        this.routerToMenu();
      }
    }
  }

  async routerToMenu(){
    await this.delay(5000);
    this.router.navigate(['gameMenu']);
  }

  gameFinishDialog(result: string){
    const dialogRef = this.dialog.open(FinishGameDialogComponent,{
      width: '250px'
    })

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate['gameMenu'];
    })
  }

}
