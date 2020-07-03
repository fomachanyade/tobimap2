import { PointLayerHandler } from './point-layer-handler';
import { MapPoint } from 'src/app/models/map-point/map-point';
import { Feature } from 'ol';

describe('PointLayerHandler', () => {
  const handler = new PointLayerHandler();
  it('should create an instance', () => {
    expect(handler).toBeTruthy();
  });

  it('#drawSinglePointOnLayer', () => {
    const point = new MapPoint(1, [10, 10]);
    handler.drawSinglePointOnLayer(point);
    const createdFeatureCoordinate: number[] = handler
      .getPointLayer()
      .getSource()
      .getFeatures()[0]
      .getGeometry()
      .getCoordinates();
    expect(createdFeatureCoordinate).toEqual([10, 10]);
  });

  const points = [
    new MapPoint(1, [10, 10]),
    new MapPoint(2, [20, 20]),
    new MapPoint(3, [30, 30]),
  ];

  it('#drawMultiplePointsOnLayer generated right points', () => {
    // TODO: 定数宣言ファイルから取得
    const POINT_ORDER_PROPERTY_NAME = 'order';
    handler.drawMultiplePointsOnLayer(points);
    const features: Feature[] = handler
      .getPointLayer()
      .getSource()
      .getFeatures();
    expect(features.length).toBe(3);
    const resultMapPoints = features.map((f) => {
      const order = Number.parseInt(f.get(POINT_ORDER_PROPERTY_NAME) as string);
      const coordinate = f.getGeometry().getCoordinates() as number[];
      return new MapPoint(order, coordinate);
    });
    expect(points).toEqual(resultMapPoints);
  });

  it('#drawMultiplePointsOnLayer cleared points before generate one', () => {
    handler.drawMultiplePointsOnLayer(points);
    const nextPoints = [
      new MapPoint(1, [10, 10]),
      new MapPoint(2, [20, 20]),
      new MapPoint(3, [30, 30]),
      new MapPoint(4, [40, 40]),
    ];
    handler.drawMultiplePointsOnLayer(nextPoints);
    const features: Feature[] = handler
      .getPointLayer()
      .getSource()
      .getFeatures();
    expect(features.length).toBe(4);
  });
});
