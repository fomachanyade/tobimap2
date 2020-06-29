/**
 * 座標情報
 */
export class MapPoint {
  /**
   * 指定された順番
   */
  order: number;
  /**
   * 名称
   */
  name?: string;
  /**
   * 詳細情報
   */
  description?: string;
  /**
   * 座標
   */
  coordinate: number[];

  constructor(
    order: number,
    coordinate: number[],
    name?: string,
    description?: string
  ) {
    this.order = order;
    this.name = name;
    this.description = description;
    this.coordinate = coordinate;
  }
}
