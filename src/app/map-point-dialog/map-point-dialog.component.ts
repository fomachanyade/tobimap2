import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapPointModule } from '../map/modules/mappoint/mappoint.module';
import { MapPointService } from '../services/map-point/map-point.service';
import { MyErrorStateMatcher } from './my-error-state-matcher/my-error-state-matcher';

@Component({
  selector: 'app-map-point-dialog',
  templateUrl: './map-point-dialog.component.html',
  styleUrls: ['./map-point-dialog.component.sass'],
})
export class MapPointDialogComponent implements OnInit {
  formGroup: FormGroup;
  matcher = new MyErrorStateMatcher();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MapPointDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MapPointModule,
    private mapPointService: MapPointService
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      name: [this.data.name, [Validators.required]],
      description: this.data.description,
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  deleteMapPoint(mapPoint: MapPointModule): void {
    this.mapPointService.deleteMapPoint(mapPoint);
  }
  onClickOkButton() {
    const val = this.formGroup.getRawValue();
    this.data.name = val.name;
    this.data.description = val.description;
    this.dialogRef.close(this.data);
  }
}
