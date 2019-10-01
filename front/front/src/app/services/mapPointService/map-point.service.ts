import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import Map from 'ol/Map';
import {MappointModule} from '../../map/modules/mappoint/mappoint.module';
import {MapPointDialogComponent} from '../../map-point-dialog/map-point-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class MapPointService implements OnInit {
  public mapPointArray : MappointModule[] = [];
  public orderNum = 0;
  selectedMapPoint: MappointModule;

  constructor(public dialog: MatDialog,
              public mapPointService : MapPointService) { }

  ngOnInit():void {
  }

  getMapPointArray():Observable<MappointModule[]>{
    return of(this.mapPointArray);
  }
  
  addMapPoint(coord :number[]): void {
    this.selectedMapPoint  = new MappointModule(this.orderNum, coord);
    const dialogRef = this.dialog.open(MapPointDialogComponent, {
      width: '250px',
      data: this.selectedMapPoint
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.selectedMapPoint.name = result;
      const isAdded = this.mapPointArray.push(this.selectedMapPoint);

      if(isAdded > 0){
        this.orderNum++;
      }else{
        alert('座標の追加に失敗しました');
      }
    });
  }

  editMapPoint(mapPoint : MappointModule): void {
    this.selectedMapPoint  = mapPoint;
    const dialogRef = this.dialog.open(MapPointDialogComponent, {
      width: '250px',
      data: this.selectedMapPoint
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.selectedMapPoint.name = result;
      const target = this.mapPointArray.find( p => p.order === this.selectedMapPoint.order);
      if(!target == undefined){
        target.name = this.selectedMapPoint.name;
      }
    });
  }

  deleteMapPoint(mapPoint:MappointModule){
    const index = this.mapPointArray.indexOf(mapPoint);
    this.mapPointArray.splice(index, 1);
    console.log(this.mapPointArray.length);
  }
}
