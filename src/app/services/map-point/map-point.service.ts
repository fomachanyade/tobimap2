import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { MapPoint } from 'src/app/models/map-point/map-point';

@Injectable({
  providedIn: 'root',
})
/**
 * 座標情報を管理するサービス
 */
export class MapPointService {
  /**
   * 座標情報の配列
   */
  private mapPoints: MapPoint[] = [];

  constructor() {
    this.initMapPointArray();
  }

  /**
   * 座標情報の配列の購読を返却
   */
  getMapPointArray(): Observable<MapPoint[]> {
    return of(this.mapPoints);
  }

  /**
   * 座標追加モーダルを開く時に、モーダルに表示するためのデータを返却する
   * @param coord 座標情報
   */
  getNextMapPoint(coord: number[]): MapPoint {
    const nextOrderNum: number = this.mapPoints.length + 1;
    return new MapPoint(nextOrderNum, coord);
  }

  /**
   * 地図上の点を追加
   * @param mapPoint 座標情報
   * @returns 追加後の配列の長さ
   */
  addMapPoint(mapPoint: MapPoint): number {
    return this.mapPoints.push(mapPoint);
  }

  /**
   * 座標情報を更新
   * @param mapPoint 座標情報
   * @returns 更新成否
   */
  editMapPoint(mapPoint: MapPoint): boolean {
    const target = this.mapPoints.find((p) => p.order === mapPoint.order);
    if (target) {
      target.name = mapPoint.name;
      target.description = mapPoint.description;
      return true;
    } else {
      return false;
    }
  }

  /**
   * 指定の座標情報を削除
   * @param mapPoint 座標情報
   * @return
   */
  deleteMapPoint(mapPoint: MapPoint): boolean {
    const index = this.mapPoints.indexOf(mapPoint);
    if (index >= 0) {
      this.mapPoints.splice(index, 1);
    } else {
      return false;
    }
  }

  /**
   * 座標情報を初期化
   * TODO:firebaseから持ってくる
   */
  private initMapPointArray(): MapPoint[] {
    return null;
  }
}
