import { LineString } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer.js';
import { transform } from 'ol/proj';
import { Vector as VectorSource } from 'ol/source.js';
import { Feature } from 'ol/src';
import { Stroke, Style } from 'ol/style';
import { MapPointModule } from 'src/app/map/modules/mappoint/mappoint.module';

/**
 * 星座の線のレイヤーの、描画と操作を管理するハンドラー
 */
export class LineLayerHandler {
  /**
   * 星座の線を引く座標のレイヤー
   */
  private layer: VectorLayer;
  /**
   * 星座の線を引く座標のソース
   */
  private source: VectorSource<LineString>;
  /**
   * 星座の線のスタイル
   */
  private style: Style;

  /**
   * 星座の線の幅とその塗り潰しの定義
   */
  private stroke: Stroke;

  // TODO:style内の定数を別ファイルから参照
  constructor() {
    this.initLineLayer();
  }

  /**
   * 星座の線を引く座標のレイヤーを返却
   */
  getLineLayer(): VectorLayer {
    return this.layer;
  }

  /**
   * 保持しているレイヤーに線を描画
   * TODO: Promise化、エラーハンドリング
   * @param points 座標情報の配列
   * @returns 実行成否
   */
  drawLineOnLayer(points: MapPointModule[]): boolean {
    // TODO: この儀式の根拠を調べる
    const coords: number[][] = points.map((point) => {
      // TODO: 定数を別ファイルから参照
      return transform(point.coordinate, 'EPSG:4326', 'EPSG:3857');
    });
    // 線が最後に始点に戻る様に始点を配列末尾に追加
    coords.push(coords[0]);
    const featureLine = new Feature<LineString>({
      geometry: new LineString(coords),
    });
    this.source.addFeature(featureLine);
    return true;
  }

  /**
   * 星座の線のレイヤーを初期化する関数
   * TODO: 定数を別ファイルから参照
   */
  private initLineLayer(): void {
    this.source = new VectorSource({
      wrapX: false,
    });
    this.stroke = new Stroke({ color: 'black', width: 2 });
    this.style = new Style({
      stroke: this.stroke,
    });
    this.layer = new VectorLayer({
      source: this.source,
      style: this.styleFuction.bind(this),
    });
  }

  /**
   * 地図描画時に呼び出されるFeature毎のstyleを返却する関数
   */
  private styleFuction(): Style {
    return this.style;
  }
}
