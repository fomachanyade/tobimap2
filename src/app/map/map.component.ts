import { AfterViewInit, Component, Output, EventEmitter } from '@angular/core';
import Map from 'ol/Map';
import { MapService } from '../services/map/map.service';
import { toLonLat } from 'ol/proj';
import { MapPointDialogComponent } from '../map-point-dialog/map-point-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { MapPointService } from '../services/map-point/map-point.service';

const dialogWidth = '600px';
const dialogHeight = '400px';
@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass'],
})
export class MapComponent implements AfterViewInit {
  private map: Map;
  // TODO:定数をファイルから参照する
  mapId = 'map';
  imageId = 'image-download';

  constructor(
    public dialog: MatDialog,
    private mapService: MapService,
    private mapPointService: MapPointService
  ) {}

  ngAfterViewInit() {
    this.mapService
      .getMap()
      .then((map) => {
        this.map = map;
      })
      .then(() => {
        // set target relement in afterViewInit for rendering proper]y
        // https://stackoverflow.com/questions/48283679/use-openlayers-4-with-angular-5
        this.map.setTarget(this.mapId);
        this.setOnClickMapEvent();
      });
  }

  private setOnClickMapEvent() {
    this.map.on('click', (evt: any) => {
      this.openMapPointModal(evt.coordinate);
    });
  }

  private openMapPointModal(coord: number[]) {
    const mapPoint = this.mapPointService.getNextMapPoint(coord);
    // TODO: データに型をつける
    const dialogRef = this.dialog.open(MapPointDialogComponent, {
      width: dialogWidth,
      height: dialogHeight,
      data: mapPoint,
    });

    const sub = dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const order: number = this.mapPointService.addMapPoint(
          result.name,
          coord,
          result.description
        );

        if (order >= 0) {
          this.mapService.addPointToMap(coord, order);
        } else {
          alert('座標の追加に失敗しました');
        }
      }
      sub.unsubscribe();
    });
  }
}
