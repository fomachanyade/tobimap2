import { Component, OnInit, Inject } from '@angular/core';
import {FormControl, FormGroupDirective, NgForm, Validators} from '@angular/forms';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {ErrorStateMatcher} from '@angular/material/core';
import {MappointModule} from '../map/modules/mappoint/mappoint.module';
import { MapPointService } from '../services/mapPointService/map-point.service';

@Component({
  selector: 'app-map-point-dialog',
  templateUrl: './map-point-dialog.component.html',
  styleUrls: ['./map-point-dialog.component.sass']
})
export class MapPointDialogComponent implements OnInit {
  nameFormControl = new FormControl('', [
    Validators.required
  ]);
  matcher = new MyErrorStateMatcher();
  constructor(
    public dialogRef: MatDialogRef<MapPointDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MappointModule,
    private mapPointService : MapPointService) {}
  
  ngOnInit() {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteMapPoint(mapPoint : MappointModule):void{
    this.mapPointService.deleteMapPoint(mapPoint);
  }

}

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
