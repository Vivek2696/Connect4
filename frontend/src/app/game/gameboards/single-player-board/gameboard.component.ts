import { animate, state, style, transition, trigger } from '@angular/animations';
import { ThrowStmt } from '@angular/compiler';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
import { Component, ViewChild, ElementRef, Renderer2, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CircleStatus } from 'src/app/Models/CircleStatus';
import { Connect4Service } from 'src/app/services/connect4.service';
import { FinishGameDialogComponent } from '../../finish-game-dialog/finish-game-dialog.component';
import { LoadingComponent } from '../../loading/loading/loading.component';

@Component({
  selector: 'app-gameboard',
  templateUrl: './gameboard.component.html',
  styleUrls: ['./gameboard.component.scss'],
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
export class GameboardComponent implements OnInit {
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

  isAnimating: boolean;

  //playerColor: string;
  //opponentColor: string;

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

    this.user = JSON.parse(localStorage.getItem('userObject'));

    /*TO-DO: Input the player and opponent color from parent class */
    // this.playerColor = 'crimson';
    // this.opponentColor = 'darkblue';

  }

  ngOnInit(){
    //set the board status
    this.setBoard();
    this.setBoardStatus();
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

  onPlayerTurnToggle(){
    if(this.isPlayerTurn){
      //console.log(this.hoverDivs.nativeElement);
      this.disableMove();
    }
    else{
      //console.log(this.hoverDivs.nativeElement);
      this.enableMove();
    }
  }

  disableMove(){
    this.isOpponentTurn = true;
    this.isPlayerTurn = false;
  }

  enableMove(){
    this.isPlayerTurn = true;
    this.isOpponentTurn = false;
  }

  async onPlayerClicked(element: any){
    //animate player move
    if(this.isPlayerTurn && !this.isAnimating){
      this.isAnimating = true;
      await this.animateUserMove(element).then(value =>{
        if(value){
          this.onPlayerFinished(value);
        }
        //animation finised
        this.isAnimating = false;
      });
    }
  }

  onPlayerFinished(userMove: any){
    let bodyObj = {
      userId: this.user._id,
      gameId: this.game._id,
      jwtToken: this.user.jwtToken,
      x: userMove.x,
      y: userMove.y
    }
    console.log('REQ Body: '+ JSON.stringify(bodyObj));
    //loading snack bar
    this.snackBar.openFromComponent(LoadingComponent);
    //save the userMove
    this.connect4service.saveUserMove(bodyObj).subscribe(res => {
      console.log(JSON.stringify(res));
      //Send the signal that player turn finished
      if(this.isPlayerTurn){
        if(res.winningPlayer == true){
          this.onGameFinished.emit('Player');
          this.snackBar.dismiss();
        }
        else if(this.checkForDraw()){
          this.gameFinishDialog('Draw');
          this.snackBar.dismiss();
        }
        else{
          console.log('Giving turn to computer');
          this.onPlayerTurnFinished.emit(true);
          this.startComputerMove();
        }
      }
    });

    //call the computer move


    //TEST for single player (REMOVE LATER!)
    // this.onPlayerTurnFinished.emit(true);
    // this.startComputerMove();
  }

  async startComputerMove(){
    let isComputerWon = false;
    let x : number;
    let y : number;
    let data = {
      gameId: this.game._id,
    }
    this.connect4service.computerMove(data).subscribe(async res => {
      console.log(res);
      if(res != undefined){
        res.winningPlayer? isComputerWon = true: isComputerWon = false;
        x = res.x;
        y = res.y;
        console.log('starting computer move');
        //coordinate with backend to set up the move
        this.snackBar.dismiss();
        console.log('x = ', x, ' y = ',y);
        await this.animateComputerMove(x,y).then(value => {
          if(isComputerWon){
            this.onGameFinished.emit('Opponent');
          }
          else if(this.checkForDraw()){
            this.gameFinishDialog('Draw');
          }
          else{
            console.log('Giving turn to player now!')
            this.onOpponentTurnFinished.emit(true);
          }
        });
      }
    });
  }

  animateUserMove(elementId: any){
    var id = Number(elementId);
    var userMove;
    console.log('Column selected: '+ id);
    return new Promise(async resolve => {
      if(this.boardArray[id][0] == 1){
        resolve(null);
      }
      else{
        for(let i = 0; i < 6; i++){
          if(this.boardArray[id][i] != 1){
            this.boardStatus[id][i].fillColor = this.isPlayerTurn? this.playerColor: this.opponentColor;
            this.boardStatus[id][i].name = 'fill';
            await this.delay(50);
            if(i < 5){
              if(this.boardArray[id][i+1] != 1){
                this.boardStatus[id][i].fillColor = 'transparent';
                this.boardStatus[id][i].name = 'empty';
                await this.delay(50);
              }
              else{
                this.boardArray[id][i] = 1;
                userMove = {x: id, y: i};
                break;
              }
            }
            else{
              this.boardArray[id][i] = 1;
              userMove = {x: id, y: i};
            }
          }
          else{
            break;
          }
        }
        if(userMove != undefined){
          resolve(userMove);
        }
        else{
          resolve(null);
        }
      }
    })
  }

  animateComputerMove(x: number, y: number){
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
