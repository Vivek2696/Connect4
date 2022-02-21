import { Component, OnInit } from '@angular/core';
import { Connect4Service } from 'src/app/services/connect4.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  isLoading: boolean;
  newPassword: string;

  //url parameter
  userId: string = JSON.parse(localStorage.getItem("userObject"))._id;

  //body
  userfirstName: string = JSON.parse(localStorage.getItem("userObject")).firstName;
  userlastName: string = JSON.parse(localStorage.getItem("userObject")).lastName;
  userEmail: string = JSON.parse(localStorage.getItem("userObject")).email;
  userDob: string = JSON.parse(localStorage.getItem("userObject")).dob;
  userjwtToken: string = JSON.parse(localStorage.getItem("userObject")).jwtToken;

  constructor(private connect4Serv: Connect4Service) { }

  ngOnInit(): void {
  }

  updatePassword()
  {
    console.log("New Password: " + this.newPassword);

    var data = JSON.stringify
    ({
        firstName: this.userfirstName,
        lastName: this.userlastName,
        dob: this.userDob, 
        email: this.userEmail,
        password: this.newPassword,
        jwtToken: this.userjwtToken
    });

    this.isLoading = true;
    console.log(data);
    this.connect4Serv.changePassword(this.userId, data).subscribe(res => {this.handleUserData(res)});
    this.isLoading = false;
  }

  handleUserData(userObject: any)
  {
    console.log(userObject);
  }
}