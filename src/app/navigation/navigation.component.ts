import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MapPoint } from 'src/app/models/map-point/map-point';
import { MapPointService } from '../services/map-point/map-point.service';
import { MapService } from '../services/map/map.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.sass'],
})
/**
 * 全体のレイアウトを定義するコンポーネント
 */
export class NavigationComponent implements OnInit, OnDestroy {
  /**
   * 座標情報の配列
   * リストにバインドされる
   */
  mapPoints: MapPoint[];
  private subscription: Subscription;

  constructor(
    private mapPointService: MapPointService,
    private mapServise: MapService
  ) {}

  ngOnInit() {
    this.subscription = this.getMapPointArray();
  }

  getMapPointArray(): Subscription {
    return this.mapPointService
      .getMapPointArray()
      .subscribe((mapPoints) => (this.mapPoints = mapPoints));
  }

  /**
   * クリックされた座標に地図をフォーカスさせる関数
   * @param mapPoint 座標情報
   */
  moveCenterToClickedPoint(mapPoint: MapPoint): void {
    this.mapServise.setCenter(mapPoint.coordinate);
  }

  /**
   * 座標情報をドロップされた順序に入れ替える
   * 参考にしたサイト:https://qiita.com/masaya-oguro/items/085ed07270ef02d0c8dd
   * @param event ドロップ後のリストの情報
   */
  replaceMapPointList(event: CdkDragDrop<MapPoint[]>) {
    transferArrayItem(
      event.previousContainer.data,
      event.container.data,
      event.previousIndex,
      event.currentIndex
    );
    // 先にtransferArrayItemメソッドを実行することで、データが入れ替え済みのものを参照できる
    const replacedMapPoints = event.container.data;
    const hasUpdated = this.mapPointService.updateMapPointOrder(
      replacedMapPoints
    );
    if (hasUpdated) {
      this.mapServise.reDrawPointsOnMap();
    }
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
