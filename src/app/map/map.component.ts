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
const MSG_EDIT_MAP_POINT_FAIL = '座標情報の編集に失敗しました';
const FEATURE_TYPE_PROPERTY_NAME = 'type';
const POINT_FEATURE_TYPE = 'mapPoint';
const POINT_MAPPOINT_PROPERTY_NAME = 'mapPoint';


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
        this.map.on('click',
        this.setOnClickMapEvent.bind(this));
      });
  }

  /**
   * 地図にクリック時のイベントを設定
   */
  private setOnClickMapEvent(evt:any):void {
    const coordinate:number[] = evt.coordinate;
    const pixcel:number[] = evt.pixcel;
    const features = this.map.getFeaturesAtPixel(pixcel);
    if(features){
      const pointFeature = features.find(f => f.get(FEATURE_TYPE_PROPERTY_NAME) === POINT_FEATURE_TYPE);
      if(pointFeature){
        // もしクリックした場所にFatureがあり、かつそれが座標の場合、編集モーダルを開く
        const mapPoint = pointFeature.get(POINT_MAPPOINT_PROPERTY_NAME) as MapPoint;
        this.editMapPoint(mapPoint);
      }
    }else{
      // もしクリックした場所にFatureが無い場合、追加モーダルを開く
      this.addMapPoint(coordinate);
    }
  }

  /**
   * 座標追加モーダルを開く
   * @param coord 座標
   */
  private addMapPoint(coord: number[]):void{
    const mapPoint = this.mapPointService.getNextMapPoint(coord);
    this.openMapModal(mapPoint, this.afterAddModalClosedFn.bind(this));
  }

  /**
   * 座標編集モーダルを開く
   * @param mapPoint 座標情報
   */
  private editMapPoint(mapPoint:MapPoint):void{
    this.openMapModal(mapPoint, this.afterEditModalClosedFn.bind(this));
  }

  /**
   * 座標追加・編集モーダルを呼び出し、結果をコールバックに渡す
   * @param mapPoint 座標情報
   * @param afterModalClosedFn モーダルが閉じた後の処理コールバック
   */
  private openMapModal(mapPoint:MapPoint, afterModalClosedFn:(result:MapPoint)=> void):void{
    const dialogRef = this.dialog.open(MapPointDialogComponent, {
      width: MAP_POINT_DIALOG_WIDTH,
      height: MAP_POINT_DIALOG_HEIGHT,
      data: mapPoint,
    });

    const sub = dialogRef.afterClosed().subscribe((result: MapPoint) => {
      afterModalClosedFn(result);
      sub.unsubscribe();
    });
  }

  /**
   * 追加モーダルの結果を受け取り、座標を追加する関数
   * @param result 座標情報
   */
  private afterAddModalClosedFn(result:MapPoint):void{
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
  }

  /**
   * 編集モーダルの結果を受け取り、座標情報を更新する関数
   * @param result 座標情報
   */
  private afterEditModalClosedFn(result:MapPoint):void{
    if (result) {
      this.mapPointService.editMapPointInfo(result);
    } else {
      alert(MSG_EDIT_MAP_POINT_FAIL);
    }    
  }
}
