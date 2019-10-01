import { Injectable } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MappointModule} from '../../map/modules/mappoint/mappoint.module';
import {MapPointDialogComponent} from '../../map-point-dialog/map-point-dialog.component';
import { MapPointService } from '../mapPointService/map-point.service';

@Injectable({
  providedIn: 'root'
})
export class MapPointDialogService {
  public mapPoint : MappointModule;

  constructor(public dialog: MatDialog,
              public mapPointService : MapPointService) { }

  openDialog(mapPoint : MappointModule): void {
    this.mapPoint = mapPoint;
    const dialogRef = this.dialog.open(MapPointDialogComponent, {
      width: '350px',
      data: this.mapPoint
    });

    dialogRef.afterClosed().subscribe(result => {
      this.mapPoint = result;

    });
  }

  deleteMapPoint():void{
    this.mapPointService.deleteMapPoint(this.mapPoint);
  }
}
