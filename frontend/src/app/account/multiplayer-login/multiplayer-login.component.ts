import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Connect4Service } from 'src/app/services/connect4.service';

@Component({
  selector: 'app-multiplayer-login',
  templateUrl: './multiplayer-login.component.html',
  styleUrls: ['./multiplayer-login.component.scss']
})
export class MultiplayerLoginComponent implements OnInit
{
  loginForm: FormGroup
  gameMode: string;

  constructor
  (
    public fb: FormBuilder,
    private connect4service: Connect4Service,
    private router: Router
  )
  {
    this.loginForm = this.fb.group
    ({
      email: [''],
      password: ['']
    })
    this.gameMode = this.router.getCurrentNavigation().extras.state.mode;
  }

  isLoading: boolean;

  ngOnInit(): void
  {
    this.isLoading = false;
  }

  authUser()
  {
    this.isLoading = true;
    this.connect4service.authenticateUser(this.loginForm.value).subscribe(res => this.handleUserData(res));
    this.isLoading = false;
  }

  handleUserData(userObject2: any)
  {
    console.log(userObject2)
    localStorage.setItem('userObject2', JSON.stringify(userObject2))
    this.router.navigate(['color-picker'], { state: { mode: this.gameMode } });
  }

  onRegister(){
    this.router.navigate(['multiplayerregister'], { state: { mode: this.gameMode } });
  }

}
