import { Component, OnInit, OnDestroy } from '@angular/core';
import { MapPoint } from 'src/app/models/map-point/map-point';
import { MapPointService } from '../services/map-point/map-point.service';
import { MatDialog } from '@angular/material/dialog';
import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { MapPointDialogComponent } from '../map-point-dialog/map-point-dialog.component';
import { Subscription } from 'rxjs';
import { MapService } from '../services/map/map.service';

// TODO:定数をファイルから参照する
const dialogWidth = '600px';
const dialogHeight = '400px';

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
    public dialog: MatDialog,
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
   * 座標編集モーダルを開く
   */
  openMapPointModal(mapPoint: MapPoint) {
    const dialogRef = this.dialog.open(MapPointDialogComponent, {
      width: dialogWidth,
      height: dialogHeight,
      data: mapPoint,
    });
    const sub = dialogRef.afterClosed().subscribe((result: MapPoint) => {
      if (result) {
        this.mapPointService.editMapPointInfo(result);
      }
      sub.unsubscribe();
    });
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
