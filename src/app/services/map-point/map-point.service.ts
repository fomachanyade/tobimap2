import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';

import { MapPointModule } from '../../map/modules/mappoint/mappoint.module';

@Injectable({
  providedIn: 'root',
})
export class MapPointService {
  private mapPointArray: MapPointModule[] = new Array<MapPointModule>();

  constructor() {
    this.initMapPointArray();
  }

  getMapPointArray(): Observable<MapPointModule[]> {
    return of(this.mapPointArray);
  }

  // 地図上の点を追加するメソッドです
  addMapPoint(name: string, coord: number[], description: string): number {
    // TODO: 処理が重複しているので修正
    const mapPoint = this.getNextMapPoint(coord);
    mapPoint.name = name;
    mapPoint.description = description;
    this.mapPointArray.push(mapPoint);
    return mapPoint.order;
  }

  /**
   * 座標追加モーダルを開く時に、モーダルに表示するためのデータを返却する
   * @param coord 座標情報
   */
  getNextMapPoint(coord: number[]): MapPointModule {
    const nextOrderNum: number = this.mapPointArray.length + 1;
    return new MapPointModule(nextOrderNum, coord);
  }

  editMapPoint(mapPoint: MapPointModule): void {
    const target = this.mapPointArray.find((p) => p.order === mapPoint.order);
    if (target) {
      target.name = mapPoint.name;
      target.description = mapPoint.description;
    }
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
