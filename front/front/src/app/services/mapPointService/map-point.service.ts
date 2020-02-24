import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material';

import Map from 'ol/Map';
import XYZ from 'ol/source/XYZ';
import Feature from 'ol/Feature';
import {Vector as VectorSource} from 'ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer.js';
import View from 'ol/View';
import Draw from 'ol/interaction/Draw.js';
import {defaults as defaultControls, OverviewMap, Control} from 'ol/control.js';
import {defaults as defaultInteractions, DragRotateAndZoom} from 'ol/interaction.js';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Point, LineString} from  'ol/geom';
import { Style,Icon } from 'ol/style';
import GeoJSON from 'ol/format/GeoJSON';
import {transform} from 'ol/proj';

import {MappointModule} from '../../map/modules/mappoint/mappoint.module';
import {MapPointDialogComponent} from '../../map-point-dialog/map-point-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class MapPointService implements OnInit {
  private map:Map;
  public mapPointArray : MappointModule[] = [];
  public orderNum = 0;
  selectedMapPoint: MappointModule;

  constructor(public dialog: MatDialog,
              public mapPointService : MapPointService) { }
  
  ngOnInit():void {
  }
  getMap():Map{return this.map}
  setMap(map:Map){this.map = map}
  getMapPointArray():Observable<MappointModule[]>{
    return of(this.mapPointArray);
  }
  
  addMapPoint(coord :number[]): void {
    this.selectedMapPoint  = new MappointModule(this.orderNum, coord);
    const dialogRef = this.dialog.open(MapPointDialogComponent, {
      width: '250px',
      data: this.selectedMapPoint
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.selectedMapPoint.name = result;
      const isAdded = this.mapPointArray.push(this.selectedMapPoint);

      if(isAdded > 0){
        this.orderNum++;
      }else{
        alert('座標の追加に失敗しました');
      }
    });
  }

  editMapPoint(mapPoint : MappointModule): void {
    this.selectedMapPoint  = mapPoint;
    const dialogRef = this.dialog.open(MapPointDialogComponent, {
      width: '250px',
      data: this.selectedMapPoint
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.selectedMapPoint.name = result;
      const target = this.mapPointArray.find( p => p.order === this.selectedMapPoint.order);
      if(!target == undefined){
        target.name = this.selectedMapPoint.name;
      }
    });
  }

  deleteMapPoint(mapPoint:MappointModule){
    const index = this.mapPointArray.indexOf(mapPoint);
    this.mapPointArray.splice(index, 1);
    console.log(this.mapPointArray.length);
  }
}
