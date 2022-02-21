import { Component, OnInit } from '@angular/core';
import { ChangePasswordComponent } from '../change-password/change-password.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, } from '@angular/material/dialog';
import { Connect4Service } from 'src/app/services/connect4.service';
import { Profile } from 'src/app/Models/Profile';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit
{
  userId: string = JSON.parse(localStorage.getItem("userObject"))._id;
  isLoading: boolean;
  public userProfile: Profile;

  constructor(public dialog: MatDialog, private connect4Serv: Connect4Service)
  {
    this.loadProfileData();
  }

  ngOnInit(): void { }

  openPasswordDialog(): void
  {
    const dialogRef = this.dialog.open(ChangePasswordComponent, { width: '250px', });
  }

  loadProfileData()
  {
    this.isLoading = true;
    this.connect4Serv.getProfileData(this.userId).subscribe(res => this.userProfile = res);
    this.isLoading = false;
  }

  // handleUserData(userObject: any)
  // {
  //   console.log(userObject)
  // }
}
