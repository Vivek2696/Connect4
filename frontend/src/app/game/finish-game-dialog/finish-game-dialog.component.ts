import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-finish-game-dialog',
  templateUrl: './finish-game-dialog.component.html',
  styleUrls: ['./finish-game-dialog.component.scss']
})
export class FinishGameDialogComponent implements OnInit {

  isLoaded = false;

  title = 'Game Draw!';


  constructor(public dialogRef: MatDialogRef<FinishGameDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
      this.waitForFewSeconds(5000);
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

  async waitForFewSeconds(time: number){
    await this.delay(time);
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
