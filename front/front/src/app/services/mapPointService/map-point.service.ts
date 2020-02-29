import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import {MatDialog} from '@angular/material';

import {MappointModule} from '../../map/modules/mappoint/mappoint.module';
import {MapPointDialogComponent} from '../../map-point-dialog/map-point-dialog.component';

const dialogWidth:string = '800px';
const dialogHeight:string = '600px';
@Injectable({
  providedIn: 'root'
})
export class MapPointService implements OnInit {
  private mapPointArray : MappointModule[] = new Array<MappointModule>();

  constructor(public dialog: MatDialog) { }
  
  
  ngOnInit():void {
    this.initMapPointArray();
  }

  //TODO:firebaseから持ってくる
  private initMapPointArray():Array<MappointModule>{
    this.mapPointArray;
    return null;
  }
  public getMapPointArray():Observable<MappointModule[]>{
    return of(this.mapPointArray);
  }
  
  //地図上の点を追加するメソッドです
  public addMapPoint(coord :number[]): Promise<MappointModule> {
    return new Promise((resolve, reject)=>{
      const nextOrderNum = this.mapPointArray.length + 1;
      const mapPoint  = new MappointModule(nextOrderNum, coord);
      const dialogRef = this.dialog.open(MapPointDialogComponent, {
        width: dialogWidth,
        height: dialogHeight,
        data: mapPoint
      });

      dialogRef.afterClosed().subscribe(result => {
        if(!result) return;
        mapPoint.name = result.name;
        mapPoint.description = result.description;
        const isAdded = this.mapPointArray.push(mapPoint);
        if(isAdded > 0){
          resolve(mapPoint);
        }else{
          alert('座標の追加に失敗しました');
          reject(mapPoint);
        }
      });
    });
  }

  editMapPoint(mapPoint : MappointModule): void {
    //this.selectedMapPoint  = mapPoint;
    const dialogRef = this.dialog.open(MapPointDialogComponent, {
      width: dialogWidth,
      height: dialogHeight,
      data: mapPoint
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      mapPoint = result;
      const target = this.mapPointArray.find( p => p.order === mapPoint.order);
      if(!target == undefined){
        target.name = mapPoint.name;
      }
    });
  }

  deleteMapPoint(mapPoint:MappointModule){
    const index = this.mapPointArray.indexOf(mapPoint);
    this.mapPointArray.splice(index, 1);
  }
}
