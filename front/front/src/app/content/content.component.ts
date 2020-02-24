import { Component, OnInit, ViewChild } from '@angular/core';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.sass']
})
export class ContentComponent implements OnInit {

  @ViewChild(MapComponent,{static:false})
  protected mapComponent: MapComponent;
  constructor() { }

  ngOnInit() {
  }

  drawLine() : void {
    this.mapComponent.drawLine();
  }
}
