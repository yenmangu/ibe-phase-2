import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-row-dialog',
  templateUrl: './delete-row-dialog.component.html',
  styleUrls: ['./delete-row-dialog.component.scss']
})
export class DeleteRowDialogComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public  data: any){}

  

}
