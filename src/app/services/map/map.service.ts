import { Injectable, OnDestroy } from '@angular/core';
import { toPng } from 'html-to-image';
import { defaults as defaultControls, OverviewMap } from 'ol/control.js';
import { Tile as TileLayer } from 'ol/layer.js';
import Map from 'ol/Map';
import XYZ from 'ol/source/XYZ';
import { Subscription } from 'rxjs';
import { MapPoint } from 'src/app/models/map-point/map-point';
import { MapPointService } from '../map-point/map-point.service';
import { LineLayerHandler } from './line-layer-handler/line-layer-handler';
import { OlViewHandler } from './ol-view-handler/ol-view-handler';
import { PointLayerHandler } from './point-layer-handler/point-layer-handler';

const MSG_INVALID_POINTS_LENGTH =
  '地図をクリックして勤務先を複数選択してください';
const IMAGE_DOWNLOAD_ANCHOR_ELEMENT_ID = 'image-download';
@Injectable({
  providedIn: 'root',
})
/**
 * 座標と星座を描画する地図の生成と操作を担うサービス
 */
export class MapService implements OnDestroy {
  /**
   * 地図オブジェクト
   */
  private map: Map;
  /**
   * ベースの地図を表示するレイヤー
   */
  private baseLayer: TileLayer;
  /**
   * 俯瞰図コントロールのオブジェクト
   */
  private overviewMapControl: OverviewMap;

  /**
   * 地図の表示形式を管理するハンドラー
   */
  private viewHandler: OlViewHandler;

  /**
   * 星座の座標のレイヤーの、描画と操作を管理するハンドラー
   */
  private pointLayerHandler: PointLayerHandler;
  /**
   * 星座の線のレイヤーの、描画と操作を管理するハンドラー
   */
  private lineLayerHandler: LineLayerHandler;
  /**
   * 座標情報の配列
   */
  private mapPoints: Array<MapPoint>;

  /**
   * 座標情報の配列の購読
   */
  private subscription: Subscription;

  constructor(private mapPointService: MapPointService) {
    this.pointLayerHandler = new PointLayerHandler();
    this.lineLayerHandler = new LineLayerHandler();
    this.viewHandler = new OlViewHandler();
    this.subscription = this.subscribeMapPoint();
  }

  /**
   * 座標と星座を描画する地図オブジェクトを返却
   */
  async getMap(): Promise<Map> {
    return new Promise((resolve) => {
      this.initMap().then(() => {
        resolve(this.map);
      });
    });
  }

  /**
   * マップクリック時にマップに座標を追加
   * @param mapPoint 座標情報
   */
  addPointToMap(mapPoint: MapPoint): void {
    // 処理をハンドラーに委譲
    this.pointLayerHandler.drawSinglePointOnLayer(mapPoint);
  }

  /**
   * 座標を地図に再描画
   * 座標削除時に呼び出される
   */
  reDrawPointsonMap(): void {
    // 処理をハンドラーに委譲
    this.pointLayerHandler.drawMultiplePointsOnLayer(this.mapPoints);
  }

  /**
   * 座標を繋ぐ線を地図に描画
   */
  drawLine() {
    if (this.mapPoints.length < 1) {
      alert(MSG_INVALID_POINTS_LENGTH);
      return;
    }
    // 処理をハンドラーに委譲
    const extent = this.lineLayerHandler.drawLineOnLayer(this.mapPoints);
    // 地図の中心を引いた線に中心を合わせる
    this.viewHandler.setCenterOfPoints(extent);
  }

  /**
   * 地図を画像に保存
   */
  saveMap(): void {
    // export options for html-to-image.
    // See: https://github.com/bubkool/html-to-image#options
    const exportOptions = {
      filter: (element) => {
        return element.className
          ? element.className.indexOf('ol-control') === -1
          : true;
      },
    };
    // cotext固定のため定数に宣言
    const map: Map = this.map;
    map.once('rendercomplete', () => {
      toPng(map.getTargetElement(), exportOptions).then((dataURL) => {
        const link: HTMLElement = document.getElementById(
          IMAGE_DOWNLOAD_ANCHOR_ELEMENT_ID
        );
        link.setAttribute('href', dataURL);
        link.click();
      });
    });
    this.map.renderSync();
  }

  /**
   * 地図オブジェクトとプロパティーの初期化
   */
  private initMap(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      this.baseLayer = new TileLayer({
        source: new XYZ({
          url: 'http://tile.osm.org/{z}/{x}/{y}.png',
          crossOrigin: 'anonymous',
        }),
      });

      const pointLayer = this.pointLayerHandler.getPointLayer();
      const lineLayer = this.lineLayerHandler.getLineLayer();
      const view = this.viewHandler.getView();

      // init overview control compoenent
      this.overviewMapControl = new OverviewMap({
        // see in overviewmap-custom.html to see the custom CSS used
        className: 'ol-overviewmap ol-custom-overviewmap',
        layers: [this.baseLayer],
        collapseLabel: '\u00BB',
        label: '\u00AB',
        collapsed: true,
      });

      this.map = new Map({
        controls: defaultControls().extend([this.overviewMapControl]),
        layers: [this.baseLayer, lineLayer, pointLayer],
        view: view,
      });
      resolve(true);
    });
  }

  /**
   * 座標の配列の購読を初期化
   */
  private subscribeMapPoint(): Subscription {
    return this.mapPointService.getMapPointArray().subscribe((points) => {
      this.mapPoints = points;
    });
  }

  ngOnDestroy() {
    if (this.subscription) this.subscription.unsubscribe();
  }
}
