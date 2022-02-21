import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GameBoardService {

  //Urls
  private gameBaseUrl = 'http://localhost:3000/connect4/api/game'

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) {
  }

  saveUserMove(data: any): Observable<any>{
    const saveMoveUrl = `${this.gameBaseUrl}/${data.gameId}/${data.userId}`;
    console.log('sending url: '+ saveMoveUrl);
    let body = JSON.stringify(data);
    return this.http.post<any>(saveMoveUrl, body, this.httpOptions).pipe(
      tap((res)=> {console.log('User Move Saved!')}),
      catchError(this.handleError<any>('user Move'))
    )
  }

  getComputerMove(data: any): Observable<any> {
    const getMoveUrl = `${this.gameBaseUrl}/${data.gameId}/computermove/`;
    return this.http.get<any>(getMoveUrl).pipe(
      tap((res)=> {console.log('Computer played!')}),
      catchError(this.handleError<any>('comp Move'))
    )
  }

  //This function is to handle the error
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
