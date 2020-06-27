import { Component, OnInit } from '@angular/core';
import { MapPointModule } from '../map/modules/mappoint/mappoint.module';
import { MapPointService } from '../services/map-point/map-point.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.sass'],
})
export class NavigationComponent implements OnInit {
  mapPointArray: MapPointModule[];

  constructor(private mapPointService: MapPointService) {}

  ngOnInit() {
    this.getMapPointArray();
  }

  getMapPointArray(): void {
    this.mapPointService
      .getMapPointArray()
      .subscribe((mapPointArray) => (this.mapPointArray = mapPointArray));
  }

  editMapPoint(mapPoint: MapPointModule) {
    this.mapPointService.editMapPoint(mapPoint);
  }
}
