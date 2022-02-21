import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Connect4';

  constructor(private router: Router){
  }

  isLoggedIn(): boolean{
    let userObject = localStorage.getItem('userObject');
    if(userObject != undefined){
      return true;
    }
    else{
      return false;
    }
  }

  onProfileClicked(){
    this.router.navigate(['profile']);
  }

}
