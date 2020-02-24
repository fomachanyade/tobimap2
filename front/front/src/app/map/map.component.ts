import { Component, OnInit, AfterViewInit } from "@angular/core";

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

import { MapPointService } from "../services/mapPointService/map-point.service";

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.sass"]
})
export class MapComponent implements OnInit, AfterViewInit {
  map: Map;
  source: XYZ;
  raster: TileLayer;
  vector: VectorLayer;
  vectorSource: VectorSource;
  view: View;
  draw: Draw;
  //style of linestring
  lineStyle: Style = new Style({
    strokeColor: "#0500bd",
    strokeWidth: 15,
    strokeOpacity: 0.5
  });
  pointStyle: Style = new CircleStyle({
    radius: 5,
    fill: new Fill({ color: "#666666" }),
    stroke: new Stroke({ color: "#bada55", width: 1 })
  });

  constructor(private mapPointService: MapPointService) {}

  styleFunction(feature): Style {
    return this.lineStyle;
  }
  ngOnInit() {
    this.raster = new TileLayer({
      source: new XYZ({
        url: "http://tile.osm.org/{z}/{x}/{y}.png"
      })
    });

    this.vectorSource = new VectorSource({
      projection: "EPSG:4326",
      wrapX: false
    });
    this.vector = new VectorLayer({
      source: this.vectorSource,
      style: this.lineStyle
    });

    this.view = new View({
      //centerd at echo mantion
      center: fromLonLat([139.339285, 35.670167]),
      zoom: 14,
      maxZoom: 20,
      minZoom: -10
    });

    //init overview control compoenent
    var overviewMapControl = new OverviewMap({
      // see in overviewmap-custom.html to see the custom CSS used
      className: "ol-overviewmap ol-custom-overviewmap",
      layers: [this.raster],
      collapseLabel: "\u00BB",
      label: "\u00AB",
      collapsed: true
    });
    this.draw = new Draw({
      source: this.vectorSource,
      type: "Polygon"
    });

    this.map = new Map({
      controls: defaultControls().extend([overviewMapControl]),
      /*interactions: defaultInteractions().extend([
        new DragRotateAndZoom(), this.draw
      ]),*/
      layers: [this.raster, this.vector],
      view: this.view
    });
    this.mapPointService.setMap(this.map);
    /*
    this.map.addInteraction(new Draw({
      source: this.vectorSource,
      type: 'polygon'
    }));
    */
  }

  ngAfterViewInit() {
    //set target relement in afterViewInit for rendering proper]y
    //https://stackoverflow.com/questions/48283679/use-openlayers-4-with-angular-5
    this.map.setTarget("map");
    this.getMapPoint();
  }

  getMapPoint(): void {
    const thisMap = this.map;
    const service = this.mapPointService;
    const addFunc = this.addPointToMap.bind(this);
    this.map.on("click", evt => {
      service.addMapPoint(toLonLat(evt.coordinate));
      addFunc(evt.coordinate);
    });
  }

  addPointToMap(coord: number[]) {
    var featurePoint = new Feature({
      geometry: new Point(coord),
      size: 1
    });
    featurePoint.setStyle(
      new Style({
        image: this.pointStyle
      })
    );

    var vectorPoint = new VectorSource({});
    vectorPoint.addFeature(featurePoint);
    var pointStyle = this.pointStyle;
    var vectorPointLayer = new VectorLayer({
      source: vectorPoint,
      style: function(feature) {
        return pointStyle;
      }
    });

    this.map.addLayer(vectorPointLayer);
  }

  drawLine() {
    if (this.mapPointService.mapPointArray.length === 0) {
      return;
    }
    const steps = 50;
    const time = 2000;
    const points: Array<number[]> = this.mapPointService.mapPointArray.map(
      point => {
        return point.coordinate;
      }
    );
    const length = points.length;
    let center: number[] = this.getCeter(points);
    for (var j = 0; j < points.length; j++) {
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

  getCeter(points: Array<number[]>): number[] {
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

  drawAnimatedLine(startPt, endPt, style, steps, time) {
    const directionX = (endPt[0] - startPt[0]) / steps;
    const directionY = (endPt[1] - startPt[1]) / steps;
    let i = 0;
    let prevLayer;
    let ivlDraw = setInterval(() => {
      if (i > steps) {
        clearInterval(ivlDraw);
        return;
      }
      const newEndPt = [
        startPt[0] + i * directionX,
        startPt[1] + i * directionY
      ];
      const line: LineString = new LineString([startPt, newEndPt]);
      let feature = new Feature({
        geometry: line,
        style: this.lineStyle,
        name: "line",
        type: "route"
      });
      this.vectorSource.addFeatures([feature]);
      let layer: VectorLayer = new VectorLayer();
      this.map.changed();
      if (prevLayer) this.map.removeLayer(prevLayer);
      prevLayer = layer;
      i++;
    }, time / steps);
  }
}
