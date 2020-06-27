import { Component, OnInit } from '@angular/core';
import {MappointModule} from '../map/modules/mappoint/mappoint.module';
import { MapPointService } from '../services/mapPointService/map-point.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.sass']
})
export class NavigationComponent implements OnInit {
  mapPointArray: MappointModule[];
  
  constructor(private mapPointService : MapPointService) { }

  ngOnInit() {
    this.getMapPointArray();
  }

  getMapPointArray(): void {
    this.mapPointService.getMapPointArray()
        .subscribe(mapPointArray => this.mapPointArray = mapPointArray);
  }

  editMapPoint(mapPoint : MappointModule){
    this.mapPointService.editMapPoint(mapPoint);
  }

}
