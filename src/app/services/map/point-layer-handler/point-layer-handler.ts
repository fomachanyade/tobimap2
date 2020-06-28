import { Feature } from 'ol/';
import { Point, Geometry } from 'ol/geom';
import { Vector as VectorLayer } from 'ol/layer.js';
import { Vector as VectorSource } from 'ol/source.js';
import { Fill, Stroke, Text, Style } from 'ol/style';
import CircleStyle from 'ol/style/Circle';

/**
 * 座標Featureの順序プロパティの名前
 */
const POINT_ORDER_PROPERTY_NAME = 'order';

/**
 * 星座の座標のレイヤーの、描画と操作を管理するハンドラー
 * TODO: おそらく一度描画した座標の削除に対応していない
 */
export class PointLayerHandler {
  /**
   * 星座の座標を描画する座標のレイヤー
   */
  private layer: VectorLayer;
  /**
   * 星座の座標のソース
   */
  private source: VectorSource;
  /**
   * 星座の座標のスタイル
   */
  private style: Style;
  /**
   * 星座の座標の円部分のスタイル
   */
  private pointStyle: CircleStyle;
  /**
   * 星座の座標の円部分の塗り潰しの定義
   */
  private pointFill: Fill;
  /**
   * 星座の座標の円部分の幅とその塗り潰しの定義
   */
  private pointStroke: Stroke;

  /**
   * 星座の座標の数字表示箇所のスタイル
   */
  private textStyle: Text;
  /**
   * 星座の座標の数字表示箇所の塗り潰し
   */
  private textFill: Fill;

  constructor() {
    this.initPointLayer();
  }

  /**
   * 星座の座標のレイヤーを返却
   */
  getPointLayer(): VectorLayer {
    return this.layer;
  }

  /**
   * 保持しているレイヤーに座標の点を描画
   * @param coord 座標
   * @param order 順番
   */
  drawPointOnLayer(coord: number[], order: number): void {
    // TODO: 定数を別ファイルから参照
    const featurePoint = new Feature({
      geometry: new Point(coord),
      size: 5,
    }) as any;
    featurePoint.set('order', order.toString());
    this.source.addFeature(featurePoint);
  }

  /**
   * 星座の座標のレイヤーを初期化する関数
   * TODO: 定数を別ファイルから参照
   */
  private initPointLayer(): void {
    this.source = new VectorSource({
      wrapX: false,
    });
    this.pointFill = new Fill({ color: '#666666' });
    this.pointStroke = new Stroke({ color: '#bada55', width: 1 });
    this.pointStyle = new CircleStyle({
      radius: 10,
      fill: this.pointFill,
      stroke: this.pointStroke,
    });

    this.textFill = new Fill({ color: 'white' });
    this.textStyle = new Text({
      text: '',
      fill: this.textFill,
    });

    this.style = new Style({
      image: this.pointStyle,
      text: this.textStyle,
    });

    this.layer = new VectorLayer({
      source: this.source,
      style: this.styleFuction.bind(this),
    });
  }

  /**
   * 地図描画時に呼び出されるFeature毎のstyleを返却する関数
   */
  private styleFuction(f: Feature): Style {
    const orderStr = f.get(POINT_ORDER_PROPERTY_NAME) as string;
    this.textStyle.setText(orderStr);
    return this.style;
  }
}
