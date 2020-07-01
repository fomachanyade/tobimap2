import { LineLayerHandler } from './line-layer-handler';
import { MapPoint } from 'src/app/models/map-point/map-point';
import { Feature } from 'ol';

describe('LineLayerHandler', () => {

  const handler = new LineLayerHandler();

  it('should create an instance', () => {
    expect(handler).toBeTruthy();
  });

  const points = [
    new MapPoint(1,[10,10]),
    new MapPoint(1,[20,20]),
    new MapPoint(1,[30,30]),
  ]
  const extent = handler.drawLineOnLayer(points);

  it('#drawLineOnLayer generated a right lineString', () => {
    const coordinatesOfLineString = handler
                                      .getLineLayer()
                                      .getSource()
                                      .getFeatures()[0]
                                      .getGeometry()
                                      .getCoordinates() as number[][];
    const expectedCoordinates = [
      [10,10],
      [20,20],
      [30,30],
      [10,10]
    ]
    expect(coordinatesOfLineString.length).toBe(4);
    expect(coordinatesOfLineString).toEqual(expectedCoordinates);
  });

  it('#drawLineOnLayer cleared line string before generate one', () => {
    handler.drawLineOnLayer(points);
    const features = handler
                      .getLineLayer()
                      .getSource()
                      .getFeatures() as Feature[];
    expect(features.length).toBe(1);
  });
});
