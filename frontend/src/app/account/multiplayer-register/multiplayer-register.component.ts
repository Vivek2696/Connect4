import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Connect4Service } from 'src/app/services/connect4.service';

@Component({
  selector: 'app-multiplayer-register',
  templateUrl: './multiplayer-register.component.html',
  styleUrls: ['./multiplayer-register.component.scss']
})
export class MultiplayerRegisterComponent implements OnInit
{
  gameMode: string;
  constructor(
    private router: Router,
    private connect4Service: Connect4Service
  ) {
    this.gameMode = this.router.getCurrentNavigation().extras.state.mode
  }

  firstNameObject: string
  lastNameObject: string
  dobObject: string
  emailObject: string
  passwordObject: string

  ngOnInit(): void { }

  registerUser()
  {
    console.log(this.firstNameObject)
    console.log(this.lastNameObject)
    console.log(this.dobObject)
    console.log(this.emailObject)
    console.log(this.passwordObject)

    var data = JSON.stringify
    ({
      firstName:this.firstNameObject,
      lastName: this.lastNameObject,
      dob:this.dobObject,
      email:this.emailObject,
      password:this.passwordObject
    })

    this.connect4Service.registerUser(data).subscribe( res => this.handleUserData(res))
  }

  handleUserData(userObject2: any)
  {
    console.log(userObject2)
    localStorage.setItem('userObject2', JSON.stringify(userObject2))
    this.router.navigate(['color-picker'], { state: { mode: this.gameMode } });
  }
}
