import { Component, OnInit, AfterViewInit } from "@angular/core";

import Map from "ol/Map";
import { MapPointService } from "../services/mapPointService/map-point.service";
import { MapServiceService } from '../services/MapService/map-service.service';

@Component({
  selector: "app-map",
  templateUrl: "./map.component.html",
  styleUrls: ["./map.component.sass"]
})
export class MapComponent implements OnInit, AfterViewInit {
  private map: Map;
  mapId:string = 'map';
  imageId:string = 'image-download';

  constructor(private mapService:MapServiceService) {}

  ngOnInit() {
   
  }

  ngAfterViewInit() {
    this.map = this.mapService.getMap().then(result => {
      result.subscribe(m => {
        this.map = m
      });
    }).then(()=> {
      //set target relement in afterViewInit for rendering proper]y
      //https://stackoverflow.com/questions/48283679/use-openlayers-4-with-angular-5
      this.mapService.setTarget(this.mapId);
    })
  }
}
