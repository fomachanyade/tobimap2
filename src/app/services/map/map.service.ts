import { Injectable } from '@angular/core';
import { toPng } from 'html-to-image';
import { defaults as defaultControls, OverviewMap } from 'ol/control.js';
import Feature from 'ol/Feature';
import { Geometry, Point } from 'ol/geom';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import Map from 'ol/Map';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Vector as VectorSource } from 'ol/source.js';
import XYZ from 'ol/source/XYZ';
import { Circle as CircleStyle, Fill, Stroke, Style, Text } from 'ol/style';
import View from 'ol/View';
import { Observable, of } from 'rxjs';
import { MapPointModule } from 'src/app/map/modules/mappoint/mappoint.module';
import { environment } from 'src/environments/environment';
import { MapPointService } from '../map-point/map-point.service';
import { LineLayerHandler } from './line-layer-handler/line-layer-handler';

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
  private pointSource: VectorSource<Geometry>;
  private pointLayer: VectorLayer;

  private pointStyle: CircleStyle = new CircleStyle({
    radius: 10,
    fill: new Fill({ color: '#666666' }),
    stroke: new Stroke({ color: '#bada55', width: 1 }),
  });
  private textFill = new Fill({ color: 'white' });

  private lineLayerHandler: LineLayerHandler;

  private mapPointArr: Array<MapPointModule>;

  constructor(private mapPointService: MapPointService) {
    this.lineLayerHandler = new LineLayerHandler();
  }

  async getMap(): Promise<Observable<Map>> {
    return new Promise((resolve) => {
      this.initMap()
        .then(() => {
          this.setOnClickMapEvent();
        })
        .then(() => {
          resolve(of(this.map));
        });
    });
  }

  setTarget(id: string): void {
    this.map.setTarget(id);
  }

  drawLine() {
    if (this.mapPointArr.length < 1) {
      alert('地図をクリックして勤務先を複数選択してください');
      return;
    }
    this.lineLayerHandler.drawLineOnLayer(this.mapPointArr);
    const points: Array<number[]> = this.mapPointArr.map((point) => {
      return point.coordinate;
    });
    const center: number[] = this.getCeter(points);
    this.view.setCenter(fromLonLat(center));
  }

  saveMap(): void {
    // export options for html-to-image.
    // See: https://github.com/bubkoo/html-to-image#options
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
    this.subscribeMapPoint();
    return new Promise((resolve) => {
      this.baseLayer = new TileLayer({
        source: new XYZ({
          url: 'http://tile.osm.org/{z}/{x}/{y}.png',
          crossOrigin: 'anonymous',
        }),
      });

      this.initPointLayers();

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
        layers: [this.baseLayer, lineLayer, this.pointLayer],
        view: this.view,
      });
      resolve('map init');
    });
  }

  private initPointLayers() {
    this.pointSource = new VectorSource({
      wrapX: false,
    });

    this.pointLayer = new VectorLayer({
      source: this.pointSource,
      style: (feature) => {
        console.log(feature.get('order'));
        return new Style({
          image: this.pointStyle,
          text: new Text({ text: feature.get('order'), fill: this.textFill }),
        });
      },
    });
  }

  private subscribeMapPoint(): void {
    this.mapPointService.getMapPointArray().subscribe((p) => {
      this.mapPointArr = p;
    });
  }

  // クリック時のイベントを設定
  private setOnClickMapEvent(): void {
    const service = this.mapPointService;
    const addFunc = this.addPointToMap.bind(this);
    this.map.on('click', (evt: any) => {
      service.addMapPoint(toLonLat(evt.coordinate)).then(
        (point) => {
          addFunc(evt.coordinate, point.order);
        },
        (reject) => {
          console.log(`failed: ${this.setOnClickMapEvent.name} at mapService`);
          console.log(reject);
        }
      );
    });
  }

  // マップクリック時にマップに座標を加えます
  private addPointToMap(coord: number[], order: number): void {
    const featurePoint = new Feature({
      geometry: new Point(coord),
      size: 5,
    });
    featurePoint.set('order', order.toString());
    this.pointSource.addFeature(featurePoint);
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
