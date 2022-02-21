import { AfterViewInit, ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { ReplayModel } from 'src/app/Models/ReplayModel';
import { Connect4Service } from 'src/app/services/connect4.service';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ReplayGames } from 'src/app/Models/ReplayGames';
import { element } from 'protractor';

@Component({
  selector: 'app-replaymenu',
  templateUrl: './replaymenu.component.html',
  styleUrls: ['./replaymenu.component.scss']
})
export class ReplaymenuComponent implements AfterViewInit
{
  @ViewChild(MatPaginator) paginator: MatPaginator;
  displayedColumns: string[] = ['gameId', 'gameMode'];
  gameListData: any;


  isLoading: boolean;
  gameMode: string;
  user: any;
  constructor
  (
    private connect4service: Connect4Service,
    private router: Router
  ) {
    this.isLoading = true;
    this.gameMode = this.router.getCurrentNavigation().extras.state.mode;
    this.user = JSON.parse(localStorage.getItem('userObject'));
    this.viewReplayGames();
  }

  ngAfterViewInit(): void { }

  viewReplayGames()
  {
    let bodyObj = {
      jwtToken: this.user.jwtToken,
      userId: this.user._id
    }
    console.log('Request: ',bodyObj);
    this.connect4service.getAllReplayGames(bodyObj).subscribe(res => {
      console.log('result: ',res);
      this.gameListData = res;
      this.isLoading = false;
    });
  }

  getGameMode(id: number): string{
    if(id == 1){
      return 'Tutorial'
    }
    else if (id == 2){
      return 'Single Player'
    }
    else if (id == 3){
      return 'MultiPlayer'
    }
    else{
      return 'N/A'
    }
  }

  onGameSelected(data: any){
    let gameMoves, game, playerOne, playerTwo, playerColor, mode;
    let bodyObj = {
      gameId: data._id
    }
    this.connect4service.getReplayGameMoves(bodyObj).subscribe(res => {
      console.log(res);
      gameMoves = res.gameMoves;
      game = res.game,
      playerOne = res.playerOne;
      playerTwo = res.playerTwo;
      mode = this.gameMode;
      console.log(mode);
      if(game.redColorPlayer == 1){
        playerColor = 'crimson'
      }
      else{
        playerColor = 'yellow'
      }
      this.router.navigate(['game'], {state : {
        gameMoves, game, playerOne, playerTwo, playerColor, mode
      }});
    });
  }

}
