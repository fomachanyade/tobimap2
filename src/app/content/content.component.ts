import { Component, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from '../map/map.component';
import { MapServiceService } from '../services/MapService/map-service.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.sass']
})
export class ContentComponent implements OnInit {

  constructor(private mapService:MapServiceService) { }

  ngOnInit() {
  }

  //地図上に線を引くメソッド
  drawLine() : void {
    this.mapService.drawLine();
  }

  saveMap() : void {
    this.mapService.saveMap();
  }
}
