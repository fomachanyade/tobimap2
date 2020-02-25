import { Injectable } from "@angular/core";

import Map from "ol/Map";
import XYZ from "ol/source/XYZ";
import Feature from "ol/Feature";
import { Vector as VectorSource } from "ol/source.js";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer.js";
import View from "ol/View";
import Draw from "ol/interaction/Draw.js";
import {
  defaults as defaultControls,
  OverviewMap,
  Control
} from "ol/control.js";
import {
  defaults as defaultInteractions,
  DragRotateAndZoom
} from "ol/interaction.js";
import { fromLonLat, toLonLat } from "ol/proj";
import { Point, LineString, Circle } from "ol/geom";
import { Style, Fill, Stroke, Icon, Circle as CircleStyle } from "ol/style";
import GeoJSON from "ol/format/GeoJSON";
import { transform } from "ol/proj";
import { MapPointService } from "../mapPointService/map-point.service";
import { Observable, of } from "rxjs";
import { MappointModule } from "src/app/map/modules/mappoint/mappoint.module";

@Injectable({
  providedIn: "root"
})
export class MapServiceService {
  private map: Map;
  private raster: TileLayer;
  private view: View;
  private draw: Draw;
  private overviewMapControl: OverviewMap;
  private lineSource: VectorSource;
  private lineLayer: VectorLayer;
  private pointSource: VectorSource;
  private pointLayer: VectorLayer;
  private lineStyle: Style = new Style({
    strokeColor: "#0500bd",
    strokeWidth: 15,
    strokeOpacity: 0.5
  });
  private pointStyle: Style = new CircleStyle({
    radius: 5,
    fill: new Fill({ color: "#666666" }),
    stroke: new Stroke({ color: "#bada55", width: 1 })
  });

  private mapPointArr: MappointModule[] = [];
  private mapPointSubscription

  constructor(private mapPointService: MapPointService) {}

  ngOnInit() {
    this.mapPointService.getMapPointArray().subscribe(p => {
      console.log(p);
      this.mapPointArr = p;
    });
  }

  //地図モジュール初期化
  private initMap(): Promise<string> {
    return new Promise((resolve) => {
      this.raster = new TileLayer({
        source: new XYZ({
          url: "http://tile.osm.org/{z}/{x}/{y}.png"
        })
      });

      this.initLineLayers();
      this.initPointLayers();

      this.view = new View({
        center: fromLonLat([139.339285, 35.670167]),
        zoom: 14,
        maxZoom: 20,
        minZoom: -10
      });

      //init overview control compoenent
      this.overviewMapControl = new OverviewMap({
        // see in overviewmap-custom.html to see the custom CSS used
        className: "ol-overviewmap ol-custom-overviewmap",
        layers: [this.raster],
        collapseLabel: "\u00BB",
        label: "\u00AB",
        collapsed: true
      });

      this.map = new Map({
        controls: defaultControls().extend([this.overviewMapControl]),
        layers: [this.raster, this.lineLayer, this.pointLayer],
        view: this.view
      });
      resolve('map init');
    });
  }

  private initLineLayers() {
    this.lineSource = new VectorSource({
      projection: "EPSG:4326",
      wrapX: false
    });

    this.lineLayer = new VectorLayer({
      source: this.lineSource,
      style: feature => {
        return this.lineStyle;
      }
    });
  }

  private initPointLayers() {
    this.pointSource = new VectorSource({
      projection: "EPSG:4326",
      wrapX: false
    });

    this.pointLayer = new VectorLayer({
      source: this.pointSource,
      style: feature => {
        return this.pointStyle;
      }
    });
  }

  public async getMap(): Promise<Observable<Map>> {
    return new Promise((resolve) => {
      this.initMap().then(result=> {
        this.setOnClickMapEvent();
      }).then(()=> {
        resolve(of(this.map));
      });;
    });
  }
  public setTarget(id: string): void {
    this.map.setTarget(id);
  }
  // クリック時のイベントを設定
  private setOnClickMapEvent(): void {
    const service = this.mapPointService;
    const addFunc = this.addPointToMap.bind(this);
    this.map.on("click", evt => {
      service.addMapPoint(toLonLat(evt.coordinate)).then(
        result => {
          addFunc(result.coordinate);
        },
        reject => {
          console.log(`failed: ${this.setOnClickMapEvent.name} at mapService`);
          console.log(reject);
        }
      );
    });
  }

  //マップクリック時にマップに座標を加えます
  private addPointToMap(coord: number[]): void {
    console.log(this.mapPointArr);
    //this.map.removeLayer(this.pointLayer);
    let featurePoint = new Feature({
      geometry: new Point(coord),
      size: 1,
    });
    featurePoint.setStyle(
      new Style({
        image: this.pointStyle
      })
    );

    let vectorPoint = new VectorSource({});
    vectorPoint.addFeature(featurePoint);
    const pointStyle = this.pointStyle;
    const vectorPointLayer = new VectorLayer({
      source: this.pointSource,
      style: function(feature) {
        return pointStyle;
      }
    });
    this.map.addLayer(vectorPointLayer); 
  }

  public drawLine() {
    if (this.mapPointArr.length < 1) {
      alert("地図をクリックして勤務先を複数選択してください");
      return;
    }
    const points: Array<number[]> = this.mapPointArr.map(point => {
      return point.coordinate;
    });
    const length = points.length;
    let center: number[] = this.getCeter(points);
    for (var j = 0; j < length; j++) {
      points[j] = transform(points[j], "EPSG:4326", "EPSG:3857");
    }
    points.push(points[0]);

    var featureLine = new Feature({
      geometry: new LineString(points)
    });

    var vectorLine = new VectorSource({});
    vectorLine.addFeature(featureLine);

    var vectorLineLayer = new VectorLayer({
      source: vectorLine,
      style: new Style({
        fill: new Fill({ color: "black", weight: 4 }),
        stroke: new Stroke({ color: "black", width: 2 })
      })
    });
    this.map.addLayer(vectorLineLayer);

    this.view.setCenter(fromLonLat(center));
    this.map.changed();
  }

  //TODO:エキスポート機能の実装
  public saveMap(): void {
    console.log("exported");
  }

  private getCeter(points: Array<number[]>): number[] {
    const length: number = points.length;
    let lat: number = 0;
    let lng: number = 0;
    lat = this.getCenterVal(points, 0) / length;
    lng = this.getCenterVal(points, 1) / length;
    return [lat, lng];
  }
  private getCenterVal(points: Array<number[]>, index: number): number {
    return points
      .map(p => {
        return p[index];
      })
      .reduce(this.reducer);
  }
  private reducer(accumerator: number, currentValue: number): number {
    return accumerator + currentValue;
  }
}
