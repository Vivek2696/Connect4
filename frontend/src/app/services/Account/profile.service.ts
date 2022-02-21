import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { Profile } from 'src/app/Models/Profile';
import { environment } from 'src/environments/environment';
//import { Response } from 'src/app/Models/Profile';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {

  private getUserInfoUrl = 'http://localhost:3000/connect4/api/user/';

  constructor(private http: HttpClient) {
   }


  httpOptions =
  {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  getProfileData(id: string): Observable<Profile>
  {
    const url = `${this.getUserInfoUrl}/${id}`;
    return this.http.get<Profile>(url, this.httpOptions).pipe
    (
      tap(_ => console.log('profile data retrieved!'),
      catchError(this.handleError<Profile>(`getProfileData id=${id}`)))
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
