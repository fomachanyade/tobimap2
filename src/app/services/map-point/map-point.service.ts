import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';

import { MapPointModule } from '../../map/modules/mappoint/mappoint.module';
import { MapPointDialogComponent } from '../../map-point-dialog/map-point-dialog.component';

const dialogWidth = '600px';
const dialogHeight = '400px';
@Injectable({
  providedIn: 'root',
})
export class MapPointService {
  private mapPointArray: MapPointModule[] = new Array<MapPointModule>();

  constructor(public dialog: MatDialog) {
    this.initMapPointArray();
  }

  getMapPointArray(): Observable<MapPointModule[]> {
    return of(this.mapPointArray);
  }

  // 地図上の点を追加するメソッドです
  addMapPoint(coord: number[]): Promise<MapPointModule> {
    return new Promise((resolve, reject) => {
      const nextOrderNum: number = this.mapPointArray.length + 1;
      const mapPoint: MapPointModule = new MapPointModule(nextOrderNum, coord);
      const dialogRef = this.dialog.open(MapPointDialogComponent, {
        width: dialogWidth,
        height: dialogHeight,
        data: mapPoint,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          mapPoint.name = result.name;
          mapPoint.description = result.description;
          const isAdded: number = this.mapPointArray.push(mapPoint);
          if (isAdded > 0) {
            resolve(mapPoint);
          } else {
            alert('座標の追加に失敗しました');
            reject(mapPoint);
          }
        }
      });
    });
  }

  editMapPoint(mapPoint: MapPointModule): void {
    const dialogRef = this.dialog.open(MapPointDialogComponent, {
      width: dialogWidth,
      height: dialogHeight,
      data: mapPoint,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        mapPoint = result;
        const target = this.mapPointArray.find(
          (p) => p.order === mapPoint.order
        );
        if (target) {
          target.name = mapPoint.name;
        }
      }
    });
  }

  deleteMapPoint(mapPoint: MapPointModule) {
    const index = this.mapPointArray.indexOf(mapPoint);
    this.mapPointArray.splice(index, 1);
  }

  // TODO:firebaseから持ってくる
  private initMapPointArray(): Array<MapPointModule> {
    return null;
  }
}
