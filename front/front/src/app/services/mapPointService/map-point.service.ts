import { Injectable, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import Map from 'ol/Map';
import {MappointModule} from '../../map/modules/mappoint/mappoint.module';

@Injectable({
  providedIn: 'root'
})
export class MapPointService implements OnInit {
  public mapPointArray : MappointModule[] = [];
  public orderNum = 0;
  constructor() { }

  ngOnInit():void {
  }
  getMapPointArray():Observable<MappointModule[]>{
    return of(this.mapPointArray);
  }

  initMapPointDialog(coord :number[]) : void{
    const mapPoint: MappointModule  = new MappointModule(this.orderNum, coord);
    const isAdded = this.mapPointArray.push(mapPoint);

    if(isAdded > 0){
      this.orderNum++;
    }else{
      alert('座標の追加に失敗しました');
    }
  }
}
