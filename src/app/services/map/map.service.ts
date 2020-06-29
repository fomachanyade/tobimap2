import { Injectable } from '@angular/core';
import { toPng } from 'html-to-image';
import { defaults as defaultControls, OverviewMap } from 'ol/control.js';
import { Tile as TileLayer } from 'ol/layer.js';
import Map from 'ol/Map';
import { fromLonLat, toLonLat } from 'ol/proj';
import XYZ from 'ol/source/XYZ';
import View from 'ol/View';
import { Observable, of } from 'rxjs';
import { MapPointModule } from 'src/app/map/modules/mappoint/mappoint.module';
import { environment } from 'src/environments/environment';
import { MapPointService } from '../map-point/map-point.service';
import { LineLayerHandler } from './line-layer-handler/line-layer-handler';
import { PointLayerHandler } from './point-layer-handler/point-layer-handler';

@Injectable({
  providedIn: 'root',
})
/**
 * 座標と星座を描画する地図の生成と操作を担うサービス
 */
export class MapService {
  /**
   * 地図オブジェクト
   */
  private map: Map;
  /**
   * ベースの地図を表示するレイヤー
   */
  private baseLayer: TileLayer;
  /**
   * 見た目を管理するオブジェクト
   */
  private view: View;
  /**
   * 俯瞰図コントロールのオブジェクト
   */
  private overviewMapControl: OverviewMap;

  private pointLayerHandler: PointLayerHandler;
  private lineLayerHandler: LineLayerHandler;

  private mapPointArr: Array<MapPointModule>;

  constructor(private mapPointService: MapPointService) {
    this.pointLayerHandler = new PointLayerHandler();
    this.lineLayerHandler = new LineLayerHandler();
    this.subscribeMapPoint();
  }

  async getMap(): Promise<Observable<Map>> {
    return new Promise((resolve) => {
      this.initMap().then(() => {
        resolve(of(this.map));
      });
    });
  }

  drawLine() {
    if (this.mapPointArr.length < 1) {
      alert('地図をクリックして勤務先を複数選択してください');
      return;
    }
    this.lineLayerHandler.drawLineOnLayer(this.mapPointArr);
    const points: Array<number[]> = this.mapPointArr.map((point) => {
      return toLonLat(point.coordinate);
    });
    const center: number[] = this.getCeter(points);
    this.view.setCenter(fromLonLat(center));
  }

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
    const url = environment.imageName;
    const map: Map = this.map;
    map.once('rendercomplete', () => {
      toPng(map.getTargetElement(), exportOptions).then((dataURL) => {
        const link: HTMLElement = document.getElementById('image-download');
        link.setAttribute('href', dataURL);
        link.click();
      });
    });
    this.map.renderSync();
  }

  // 地図モジュール初期化
  private initMap(): Promise<string> {
    return new Promise((resolve) => {
      this.baseLayer = new TileLayer({
        source: new XYZ({
          url: 'http://tile.osm.org/{z}/{x}/{y}.png',
          crossOrigin: 'anonymous',
        }),
      });

      const pointLayer = this.pointLayerHandler.getPointLayer();
      const lineLayer = this.lineLayerHandler.getLineLayer();

      this.view = new View({
        center: fromLonLat([139.339285, 35.670167]),
        zoom: 14,
        maxZoom: 20,
        minZoom: -10,
      });

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
        view: this.view,
      });
      resolve('map init');
    });
  }

  private subscribeMapPoint(): void {
    this.mapPointService.getMapPointArray().subscribe((p) => {
      this.mapPointArr = p;
    });
  }

  // マップクリック時にマップに座標を加えます
  addPointToMap(coord: number[], order: number): void {
    this.pointLayerHandler.drawPointOnLayer(coord, order);
  }

  private getCeter(points: Array<number[]>): number[] {
    const length: number = points.length;
    let lat = 0;
    let lng = 0;
    lat = this.getCenterVal(points, 0) / length;
    lng = this.getCenterVal(points, 1) / length;
    return [lat, lng];
  }
  private getCenterVal(points: Array<number[]>, index: number): number {
    return points
      .map((p) => {
        return p[index];
      })
      .reduce(this.reducer);
  }
  private reducer(accumerator: number, currentValue: number): number {
    return accumerator + currentValue;
  }
}
