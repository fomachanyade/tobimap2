import View from 'ol/View';
import { fromLonLat, toLonLat } from 'ol/proj';
import { MapPoint } from 'src/app/models/map-point/map-point';

const DEFAULT_CENTER_LONLAT = [139.339285, 35.670167];
const DEFAULT_ZOOM = 14;
const MAX_ZOOM = 14;
const MIN_ZOOM = 14;

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
   * @param points 座標情報の配列
   * TODO:ズーム率の調整
   */
  setCenterOfPoints(points: MapPoint[]): void {
    const lonLats: number[][] = points.map((point) => {
      return toLonLat(point.coordinate);
    });
    const centerCoordinate = this.getCeter(lonLats);
    this.view.setCenter(centerCoordinate);
  }
  /**
   * 経度・緯度の配列から中心点を返却する関数
   * @param lonLats 経度・緯度の配列
   * @returns 中心点の座標
   */
  private getCeter(lonLats: number[][]): number[] {
    const length: number = lonLats.length;
    let lat = 0;
    let lng = 0;
    lat = this.getTotalScalarValueOfIndexElement(lonLats, 0) / length;
    lng = this.getTotalScalarValueOfIndexElement(lonLats, 1) / length;
    // 経度・緯度から座標に変換して返却
    return fromLonLat([lat, lng]);
  }

  /**
   *  経度・緯度の配列のいずれかの総和を返却
   * @param points 経度・緯度の配列
   * @param index 配列のインデックス。0:緯度(lat), 1:経度度(lat)
   */
  private getTotalScalarValueOfIndexElement(
    points: Array<number[]>,
    index: number
  ): number {
    return points
      .map((p) => {
        return p[index];
      })
      .reduce(this.grossReducer);
  }

  /**
   *  総和を計算する関数
   * @param accumerator これまでに和されている数
   * @param currentValue 追加される数
   */
  private grossReducer(accumerator: number, currentValue: number): number {
    return accumerator + currentValue;
  }
}
