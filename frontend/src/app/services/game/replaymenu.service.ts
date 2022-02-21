import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { ReplayGames } from 'src/app/Models/ReplayGames';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReplaymenuService
{
  //Urls
  private getAllGamesUrl =  'http://localhost:3000/connect4/api/game';

  httpOptions =
  {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {

  }

  getAllGames(data: any){
    const url = `${this.getAllGamesUrl}/${data.userId}/allgames/completed`; //Therefore need to change here as well
    let body = JSON.stringify(data);
    return this.http.post<ReplayGames[]>(url, body, this.httpOptions).pipe
    (
      tap(_ => console.log('Replayable Games Retrieved!'),
      catchError(this.handleError<ReplayGames[]>(`getAllReplayGames`)))
    )
  }


  getReplayGameMoves(data: any): Observable<any> {
    //result: gameMoves , game, playerOne, playerTwo
    const getAllGameMovesUrl = `${this.getAllGamesUrl}/${data.gameId}/gamemoves/`;
    return this.http.get<any>(getAllGameMovesUrl).pipe(
      tap((res)=> {console.log('All game moves retrieved!')}),
      catchError(this.handleError<any>('No game moves retrieved!'))
    )
  }

  private handleError<T>(operation = 'operation', result?: T)
  {
    return (error: any): Observable<T> =>
    {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
