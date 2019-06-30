import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-user',
  templateUrl: './dialog-user.component.html',
  styleUrls: ['./dialog-user.component.scss']
})
export class DialogUserComponent implements OnInit {

  public usernameFormControl = new FormControl('', [Validators.required]);
  public previousUsername: string;

  constructor(public dialogRef: MatDialogRef<DialogUserComponent>,
              @Inject(MAT_DIALOG_DATA) public params: any) {
    this.previousUsername = params.username ? params.username : undefined;
  }

  ngOnInit() {
    console.log('init DialogUserComponent')
  }

  public onSave(): void {
    this.dialogRef.close({
      username: this.params.username,
      dialogType: this.params.dialogType,
      previousUsername: this.previousUsername
    });
  }
}
