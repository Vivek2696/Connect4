import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { tap } from 'rxjs/operators';
import { CircleStatus } from 'src/app/Models/CircleStatus';
import { Connect4Service } from 'src/app/services/connect4.service';
import { FinishGameDialogComponent } from '../../finish-game-dialog/finish-game-dialog.component';
import { LoadingComponent } from '../../loading/loading/loading.component';

@Component({
  selector: 'app-multiplayer-board',
  templateUrl: './multiplayer-board.component.html',
  styleUrls: ['./multiplayer-board.component.scss'],
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
export class MultiplayerBoardComponent implements OnInit {

  @Output() onTurnFinishedEvent : EventEmitter<any> = new EventEmitter<any>();
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
  opponent: any;

  isAnimating: boolean;

  //playerColor: string;
  //opponentColor: string;

  circleStatus: string;
  fillColor: string;

  constructor(
    private connect4service: Connect4Service,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.isPlayerTurn = true;
    this.isOpponentTurn = false;
    this.isAnimating = false;

    this.user = JSON.parse(localStorage.getItem('userObject'));
    this.opponent = JSON.parse(localStorage.getItem('userObject2'));

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
      this.setOpponentTurn();
    }
    else{
      //console.log(this.hoverDivs.nativeElement);
      this.setPlayerTurn();
    }
  }

  setOpponentTurn(){
    this.isOpponentTurn = true;
    this.isPlayerTurn = false;
    //this.renderer.removeClass(this.hoverDivs, 'hover-class');
  }

  setPlayerTurn(){
    this.isPlayerTurn = true;
    this.isOpponentTurn = false;
    //this.renderer.addClass(this.hoverDivs, 'hover-class');
  }

  async onPlayerClicked(element: any){
    //TO-DO: animate player move
    if(!this.isAnimating){
      this.isAnimating = true;
      await this.animateMove(element).then(value =>{
        if(value){
          this.onTurnFinished(value);
        }
      });
    }
    //animation finised
    this.isAnimating = false;
  }

  onTurnFinished(userMove: any){
    let currentUser = this.isPlayerTurn? this.user : this.opponent
    console.log("Current User:", currentUser);
    let bodyObj = {
      userId: currentUser._id,
      gameId: this.game._id,
      jwtToken: currentUser.jwtToken,
      x: userMove.x,
      y: userMove.y
    }
    console.log('REQ Body: '+ JSON.stringify(bodyObj));
    //loading snack bar
    //save the userMove
    this.connect4service.saveUserMove(bodyObj).subscribe(res => {
      console.log(JSON.stringify(res));
      //Send the signal that player turn finished
      if(res.winningPlayer == true){
        if(currentUser._id == this.user._id){
          this.onGameFinished.emit('Player');
        }
        else{
          this.onGameFinished.emit('Opponent');
        }
      }
      else if(this.checkForDraw()){
        this.gameFinishDialog('Draw');
      }
      else{
        console.log('Giving turn to otherplayer');
        this.onTurnFinishedEvent.emit(true);
      }
    });


    //Send the signal that player turn finished
    //this.onTurnFinishedEvent.emit(true);
  }

  animateMove(elementId: any){
    var id = Number(elementId);
    var userMove;
    console.log('Column selected: '+ id);
    return new Promise(async resolve => {
      if(this.boardArray[id][0] == 1){
        resolve(false);
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

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  gameFinishDialog(result: string){
    const dialogRef = this.dialog.open(FinishGameDialogComponent,{
      width: '250px'
    })

    dialogRef.afterClosed().pipe(
      tap(() => this.router.navigate(['gameMenu']))
    )
  }

}
