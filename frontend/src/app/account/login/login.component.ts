import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from 'src/app/Models/User';
import { Connect4Service } from 'src/app/services/connect4.service';
import { LoginserviceService } from 'src/app/services/Account/loginservice.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup

  isLoading: boolean;

  isLoggedIn = false;

  constructor(
    public fb: FormBuilder,
    private connect4service: Connect4Service,
    private router: Router
  ){
    localStorage.clear();
    this.loginForm = this.fb.group({
      email: [''],
      password: ['']
    })
    this.checkForLoggedIn();
  }

  checkForLoggedIn(){
    let userObject = localStorage.getItem('userObject');
    if(userObject != undefined){
      this.router.navigate(['gameMenu']);
    }
    else{
      this.isLoggedIn = true;
    }
  }

  ngOnInit(): void {
    this.isLoading = false;
  }

  authUser(){
    this.isLoading = true;
    this.connect4service.authenticateUser(this.loginForm.value).subscribe(res => this.handleUserData(res));
    this.isLoading = false;
  }

  handleUserData(userObject: any){
    console.log(userObject)
    localStorage.setItem('userObject', JSON.stringify(userObject))
    this.router.navigate(['gameMenu']);
  }

}
