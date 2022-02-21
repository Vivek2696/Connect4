import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Connect4Service } from 'src/app/services/connect4.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(
    private connect4Serivce: Connect4Service,
    private router: Router
  ) { }

  firstNameObject: string
  lastNameObject: string
  dobObject: string
  emailObject: string
  passwordObject: string

  ngOnInit(): void {

  }
  registerUser(){
    console.log(this.firstNameObject)
    console.log(this.lastNameObject)
    console.log(this.dobObject)
    console.log(this.emailObject)
    console.log(this.passwordObject)
    var data = JSON.stringify({firstName:this.firstNameObject, lastName: this.lastNameObject,
      dob:this.dobObject, email:this.emailObject, password:this.passwordObject})
    this.connect4Serivce.registerUser(data).subscribe( res => this.handleUserData(res))
  }
  handleUserData(userObject: any){
    console.log(userObject)
    localStorage.setItem('userObject', JSON.stringify(userObject))
    this.router.navigate(['gameMenu']);
  }

}
