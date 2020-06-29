import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
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
  private mapPointSubject: Subject<MapPoint[]>;
  constructor() {
    this.mapPointSubject = new Subject<MapPoint[]>();
    this.initMapPointArray();
  }

  /**
   * 座標情報の配列の購読を返却
   */
  getMapPointArray(): Observable<MapPoint[]> {
    return this.mapPointSubject.asObservable();
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
    const addedLength = this.mapPoints.push(mapPoint);
    this.mapPointSubject.next(this.mapPoints);
    return addedLength;
  }

  /**
   * 座標情報を更新
   * @param mapPoint 座標情報
   * @returns 更新成否
   */
  editMapPointInfo(mapPoint: MapPoint): boolean {
    const target = this.mapPoints.find((p) => p.order === mapPoint.order);
    if (target) {
      target.name = mapPoint.name;
      target.description = mapPoint.description;
      this.mapPointSubject.next(this.mapPoints);
      return true;
    } else {
      return false;
    }
  }

  /**
   * 入れ替えられた順序に従って、座標情報の順番を更新
   * @param replacedMapPoints 順序の入れ替わった座標の配列
   */
  updateMapPointOrder(replacedMapPoints: MapPoint[]): boolean {
    this.mapPoints = replacedMapPoints.map(this.resetOrder);
    this.mapPointSubject.next(this.mapPoints);
    return true;
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
      this.mapPoints = this.mapPoints.map(this.resetOrder);
      this.mapPointSubject.next(this.mapPoints);
      return true;
    } else {
      return false;
    }
  }

  private resetOrder(mapPoint: MapPoint, index: number): MapPoint {
    const newOrderNumber = index + 1;
    mapPoint.order = newOrderNumber;
    return mapPoint;
  }

  /**
   * 座標情報を初期化
   * TODO:firebaseから持ってくる
   */
  private initMapPointArray(): MapPoint[] {
    return null;
  }
}
