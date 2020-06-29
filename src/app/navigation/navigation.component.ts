import { Component, OnInit } from '@angular/core';
import { MapPoint } from 'src/app/models/map-point/map-point';
import { MapPointService } from '../services/map-point/map-point.service';
import { MatDialog } from '@angular/material/dialog';
import { MapPointDialogComponent } from '../map-point-dialog/map-point-dialog.component';

// TODO:定数をファイルから参照する
const dialogWidth = '600px';
const dialogHeight = '400px';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.sass'],
})
/**
 * TODO:定数をファイルから参照する
 */
export class NavigationComponent implements OnInit {
  mapPointArray: MapPoint[];

  constructor(
    public dialog: MatDialog,
    private mapPointService: MapPointService
  ) {}

  ngOnInit() {
    this.getMapPointArray();
  }

  getMapPointArray(): void {
    this.mapPointService
      .getMapPointArray()
      .subscribe((mapPointArray) => (this.mapPointArray = mapPointArray));
  }

  openMapPointModal(mapPoint: MapPoint) {
    const dialogRef = this.dialog.open(MapPointDialogComponent, {
      width: dialogWidth,
      height: dialogHeight,
      data: mapPoint,
    });
    const sub = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.mapPointService.editMapPoint(result as MapPoint);
      }
      sub.unsubscribe();
    });
  }
}
