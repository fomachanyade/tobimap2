import { Injectable } from '@angular/core';

import Map from 'ol/Map';
import XYZ from 'ol/source/XYZ';
import Feature from 'ol/Feature';
import { Vector as VectorSource } from 'ol/source.js';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer.js';
import View from 'ol/View';
import { defaults as defaultControls, OverviewMap } from 'ol/control.js';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Point, LineString } from 'ol/geom';
import { Style, Fill, Stroke, Circle as CircleStyle, Text } from 'ol/style';
import { transform } from 'ol/proj';
import { MapPointService } from '../mapPointService/map-point.service';
import { Observable, of, Subscription } from 'rxjs';
import { MappointModule } from 'src/app/map/modules/mappoint/mappoint.module';
import { toPng } from 'html-to-image';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class MapServiceService {
  private map: Map;
  private raster: TileLayer;
  private view: View;
  private overviewMapControl: OverviewMap;
  private lineSource: VectorSource;
  private lineLayer: VectorLayer;
  private pointSource: VectorSource;
  private pointLayer: VectorLayer;

  private pointStyle: Style = new CircleStyle({
    radius: 10,
    fill: new Fill({ color: '#666666' }),
    stroke: new Stroke({ color: '#bada55', width: 1 }),
  });
  private textFill = new Fill({ color: 'white' });

  private mapPointArr: Array<MappointModule>;

  constructor(private mapPointService: MapPointService) {}

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
    const points: Array<number[]> = this.mapPointArr.map((point) => {
      return point.coordinate;
    });
    const length = points.length;
    const center: number[] = this.getCeter(points);
    for (let j = 0; j < length; j++) {
      points[j] = transform(points[j], 'EPSG:4326', 'EPSG:3857');
    }
    // 線が最後に始点に戻る様に始点を配列末尾に追加
    points.push(points[0]);
    const featureLine = new Feature({
      geometry: new LineString(points),
    });
    this.lineSource.addFeature(featureLine);
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
      this.raster = new TileLayer({
        source: new XYZ({
          url: 'http://tile.osm.org/{z}/{x}/{y}.png',
          crossOrigin: 'anonymous',
        }),
      });

      this.initLineLayers();
      this.initPointLayers();

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
        layers: [this.raster],
        collapseLabel: '\u00BB',
        label: '\u00AB',
        collapsed: true,
      });

      this.map = new Map({
        controls: defaultControls().extend([this.overviewMapControl]),
        layers: [this.raster, this.lineLayer, this.pointLayer],
        view: this.view,
      });
      resolve('map init');
    });
  }

  private initLineLayers() {
    this.lineSource = new VectorSource({
      projection: 'EPSG:4326',
      wrapX: false,
    });

    this.lineLayer = new VectorLayer({
      source: this.lineSource,
      style: () => {
        return new Style({
          fill: new Fill({ color: 'black', weight: 4 }),
          stroke: new Stroke({ color: 'black', width: 2 }),
        });
      },
    });
  }

  private initPointLayers() {
    this.pointSource = new VectorSource({
      projection: 'EPSG:4326',
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
    this.map.on('click', (evt) => {
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
