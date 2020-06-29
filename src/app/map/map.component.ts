import { AfterViewInit, Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import Map from 'ol/Map';
import { MapPointDialogComponent } from '../map-point-dialog/map-point-dialog.component';
import { MapPointService } from '../services/map-point/map-point.service';
import { MapService } from '../services/map/map.service';
import { MapPoint } from '../models/map-point/map-point';

const MAP_POINT_DIALOG_WIDTH = '600px';
const MAP_POINT_DIALOG_HEIGHT = '400px';
const MSG_ADD_MAP_POINT_FAIL = '座標の追加に失敗しました';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass'],
})
export class MapComponent implements AfterViewInit {
  private map: Map;
  // TODO:定数をファイルから参照する
  mapId = 'map';
  imageId = 'image-download';

  constructor(
    public dialog: MatDialog,
    private mapService: MapService,
    private mapPointService: MapPointService
  ) {}

  ngAfterViewInit() {
    this.mapService
      .getMap()
      .then((map) => {
        this.map = map;
      })
      .then(() => {
        // set target relement in afterViewInit for rendering proper]y
        // https://stackoverflow.com/questions/48283679/use-openlayers-4-with-angular-5
        this.map.setTarget(this.mapId);
        this.setOnClickMapEvent();
      });
  }

  /**
   * 地図にクリック時のイベントを設定
   */
  private setOnClickMapEvent() {
    this.map.on('click', (evt: any) => {
      this.openMapPointModal(evt.coordinate);
    });
  }

  /**
   * 座標追加・編集モーダルを開く
   * @param coord 座標
   */
  private openMapPointModal(coord: number[]) {
    const mapPoint = this.mapPointService.getNextMapPoint(coord);
    const dialogRef = this.dialog.open(MapPointDialogComponent, {
      width: MAP_POINT_DIALOG_WIDTH,
      height: MAP_POINT_DIALOG_HEIGHT,
      data: mapPoint,
    });

    const sub = dialogRef.afterClosed().subscribe((result: MapPoint) => {
      if (result) {
        // 座標をサービスに追加
        const order: number = this.mapPointService.addMapPoint(result);

        if (order >= 0) {
          // 地図に座標を描画
          this.mapService.addPointToMap(result);
        } else {
          alert(MSG_ADD_MAP_POINT_FAIL);
        }
      }
      sub.unsubscribe();
    });
  }
}
