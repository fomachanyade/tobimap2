import View from 'ol/View';
import { getCenter } from 'ol/extent';
import { fromLonLat, toLonLat } from 'ol/proj';

const DEFAULT_CENTER_LONLAT = [139.339285, 35.670167];
const DEFAULT_ZOOM = 14;
const MAX_ZOOM = 20;
const MIN_ZOOM = -10;
const MAP_SET_CENTER_ANIMATION_DURATION = 1000;

/**
 * 地図の表示形式を管理するハンドラー
 */
export class OlViewHandler {
  /**
   * 地図の表示形式を管理するオブジェクト
   */
  private view: View;

  constructor() {
    this.view = new View({
      center: fromLonLat(DEFAULT_CENTER_LONLAT),
      zoom: DEFAULT_ZOOM,
      maxZoom: MAX_ZOOM,
      minZoom: MIN_ZOOM,
    });
  }

  /**
   * 地図の表示形式を管理するオブジェクトを返却
   */
  getView(): View {
    return this.view;
  }

  /**
   * 地図を座標情報の中心点をフォーカスさせる関数
   * @param lonLats 経度・緯度の配列
   */
  setCenterOfPoints(extent: number[]): void {
    // https://html.developreference.com/article/13939037/Openlayers+fit+extent+with+bounce
    const resolution = this.view.getResolutionForExtent(extent);
    const zoom = this.view.getZoomForResolution(resolution) - 1;
    const center = getCenter(extent);
    this.view.animate({
      center: center,
      duration: MAP_SET_CENTER_ANIMATION_DURATION,
    });
    this.view.animate({
      zoom: zoom,
      duration: MAP_SET_CENTER_ANIMATION_DURATION / 3,
    });
  }
}
