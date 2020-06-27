import { Component } from '@angular/core';
import { MapService } from '../services/map/map.service';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.sass'],
})
/**
 * トップ画面全体のレイアウト
 */
export class ContentComponent {
  constructor(private mapService: MapService) {}

  /**
   * 地図上に線を引く関数を呼び出す
   */
  drawLine(): void {
    this.mapService.drawLine();
  }

  /**
   * 地図を保存する関数を呼び出す
   */
  saveMap(): void {
    this.mapService.saveMap();
  }
}
