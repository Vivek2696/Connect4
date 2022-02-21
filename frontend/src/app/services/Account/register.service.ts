import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import {User} from 'src/app/Models/User';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  private loginUrl = 'http://localhost:3000/connect4/api/user/'; //Most probably we need to define the url for every service to get the data from server
  // coordinate with back end developer for this setting up the name

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(
    private http: HttpClient //this is to define http client
  ) {
  }

  //This is an example to authenticate user (coordinate with backend developer to finish this)
  //This type of function can 1. get the data from server 2. pass data to server
  //See official angular documentation for more examples
  registerUser(data: any): Observable<User>{
    return this.http.post<User>(this.loginUrl, data, this.httpOptions).pipe(
      tap((newUser: User) => console.log('user registered!')),
      catchError(this.handleError<User>('login'))
    );
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
