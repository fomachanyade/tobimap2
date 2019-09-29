import { Component, OnInit, AfterViewInit } from '@angular/core';

import Map from 'ol/Map';
import XYZ from 'ol/source/XYZ';
import {Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import View from 'ol/View';
import Draw from 'ol/interaction/Draw.js';
import {defaults as defaultControls, OverviewMap, Control} from 'ol/control.js';
import {defaults as defaultInteractions, DragRotateAndZoom} from 'ol/interaction.js';
import { fromLonLat, toLonLat } from 'ol/proj';

import { MapPointService } from '../services/mapPointService/map-point.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass']
})
export class MapComponent implements OnInit, AfterViewInit {

  map: Map;
  source: XYZ;
  raster: TileLayer;
  vector: VectorLayer;
  vectorSource: VectorSource;
  view: View;
  draw: Draw;
  
  constructor(private mapPointService : MapPointService) { }

  ngOnInit() {

    this.raster = new TileLayer({
      source: new XYZ({
        url: 'http://tile.osm.org/{z}/{x}/{y}.png'
      })
    });

    this.vectorSource = new VectorSource({wrapX: false});
    this.vector = new VectorLayer({
      source: this.vectorSource
    });

    this.view = new View({
      //centerd at echo mantion
      center: fromLonLat([139.339285, 35.670167]),
      zoom: 14,
      maxZoom: 20,
      minZoom: 10
    });

    //init overview control compoenent
    var overviewMapControl = new OverviewMap({
      // see in overviewmap-custom.html to see the custom CSS used
      className: 'ol-overviewmap ol-custom-overviewmap',
      layers: [this.raster],
      collapseLabel: '\u00BB',
      label: '\u00AB',
      collapsed: true
    });
    this.draw = new Draw({
      source: this.vectorSource,
      type: "Polygon"
    });

    this.map = new Map({
      controls: defaultControls().extend([
        overviewMapControl
      ]),
      interactions: defaultInteractions().extend([
        new DragRotateAndZoom(), this.draw
      ]),
      layers: [this.raster, this.vector],
      view: this.view
    });
  }

  ngAfterViewInit() {
    //set target relement in afterViewInit for rendering proper]y
    //https://stackoverflow.com/questions/48283679/use-openlayers-4-with-angular-5
    this.map.setTarget('map');
    this.getMapPoint();
    
  }

  getMapPoint() : void {
    const thisMap = this.map;
    const service =  this.mapPointService;
    this.map.on('click', (evt) => {
      service.initMapPointDialog(toLonLat(evt.coordinate));
    });
  }
}
