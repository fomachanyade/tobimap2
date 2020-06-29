import { Feature } from 'ol';
import { LineString } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer.js';
import { transform } from 'ol/proj';
import { Vector as VectorSource } from 'ol/source';
import { Stroke, Style } from 'ol/style';
import { MapPoint } from 'src/app/models/map-point/map-point';

const LINE_STYLE_STROKE_COLOR = 'rgba(64, 80, 97, 1)';
const LINE_STYLE_STROKE_WIDTH = 2;
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
  private source: VectorSource;
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
   * TODO: すでに追加されている線の削除
   * @param points 座標情報の配列
   * @returns 線オブジェクトの範囲
   */
  drawLineOnLayer(points: MapPoint[]): number[] {
    const coords: number[][] = points.map((point) => {
      return point.coordinate;
    });
    // 線が最後に始点に戻る様に始点を配列末尾に追加
    coords.push(coords[0]);
    const lineGeometry = new LineString(coords);
    const featureLine = new Feature({
      geometry: lineGeometry,
    });
    this.source.addFeature(featureLine);
    return lineGeometry.getExtent();
  }

  /**
   * 星座の線のレイヤーを初期化する関数
   * TODO: 定数を別ファイルから参照
   */
  private initLineLayer(): void {
    this.source = new VectorSource({
      wrapX: false,
    });
    this.stroke = new Stroke({
      color: LINE_STYLE_STROKE_COLOR,
      width: LINE_STYLE_STROKE_WIDTH,
    });
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
