import { animate, state, style, transition, trigger } from '@angular/animations';
import { ThrowStmt } from '@angular/compiler';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CircleStatus } from 'src/app/Models/CircleStatus';
import { Connect4Service } from 'src/app/services/connect4.service';
import { FinishGameDialogComponent } from '../../finish-game-dialog/finish-game-dialog.component';
import { LoadingComponent } from '../../loading/loading/loading.component';

@Component({
  selector: 'app-tutorial-board',
  templateUrl: './tutorial-board.component.html',
  styleUrls: ['./tutorial-board.component.scss'],
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
export class TutorialBoardComponent implements OnInit {

  @Output() onPlayerTurnFinished : EventEmitter<any> = new EventEmitter<any>();
  @Output() onOpponentTurnFinished: EventEmitter<any> = new EventEmitter<any>();
  @Output() onGameFinished: EventEmitter<any> = new EventEmitter<any>();
  @Input() playerColor: string;
  @Input() opponentColor: string;
  @Input() game: any;

  //this board array to track the board
  boardArray: number[][];

  //this array for animation
  boardStatus: CircleStatus[][];

  isPlayerTurn: boolean;
  isOpponentTurn: boolean;

  user: any;

  firstPlayer: any;
  secondPlayer: any;

  isAnimating: boolean;

  circleStatus: string;
  fillColor: string;

  constructor(
    private router: Router,
    private connect4service: Connect4Service,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.user = JSON.parse(localStorage.getItem('userObject'));

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
    this.snackBar.openFromComponent(LoadingComponent);
    await this.delay(3000);
    this.snackBar.dismiss();

    //start the game
    this.RequestMove();
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

  RequestMove(){
    let bodyObj = {
      gameId: this.game._id,
      jwtToken: this.user.jwtToken
    }
    this.connect4service.computerMove(bodyObj).subscribe(async res => {
      await this.onAnimatePlayerMove(res.x, res.y);
      if(res.winningPlayer){
        let winner = this.isPlayerTurn? 'Player' : 'Opponent';
        this.onGameFinished.emit(winner);
      }
      else if(this.checkForDraw()){
        this.gameFinishDialog('Draw');
      }
      else{
        this.changeTurn();
      }
    });
  }

  async changeTurn(){
    this.snackBar.openFromComponent(LoadingComponent);
    await this.delay(3000);
    this.snackBar.dismiss();
    this.onPlayerTurnFinished.emit(true);
    this.isPlayerTurn = !this.isPlayerTurn;
    this.isOpponentTurn = !this.isOpponentTurn;
    this.RequestMove();
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

  gameFinishDialog(result: string){
    const dialogRef = this.dialog.open(FinishGameDialogComponent,{
      width: '250px'
    })

    dialogRef.afterClosed().subscribe(result => {
      this.router.navigate['gameMenu'];
    })
  }
}
