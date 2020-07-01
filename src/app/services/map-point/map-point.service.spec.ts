import { TestBed } from '@angular/core/testing';

import { MapPointService } from './map-point.service';
import { MapPoint } from 'src/app/models/map-point/map-point';
import { resolveSrv } from 'dns';

describe('MapPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));
  
  const testMapPoint = new MapPoint(1,[10,20],'test','testDefault');

  it('should be created', () => {
    const service: MapPointService = TestBed.inject(MapPointService);
    expect(service).toBeTruthy();
  });

  it('#addMapPoint', () => {
    const service: MapPointService = TestBed.inject(MapPointService);
    const value = service.addMapPoint(testMapPoint);
    expect(value).toBe(1);
  });

  it('#getNextMapPoint', () => {
    const service: MapPointService = TestBed.inject(MapPointService);
    service.addMapPoint(testMapPoint);

    const testCoordinate:number[] = [40,50]
    const expected = new MapPoint(2, testCoordinate); 
    const value = service.getNextMapPoint(testCoordinate);
    expect(value).toEqual(expected);
  });

  it('#editMapPointInfo', (done: DoneFn) => {
    const service: MapPointService = TestBed.inject(MapPointService);
    service.addMapPoint(testMapPoint);

    const testName = 'editTest';
    const testDescription = 'edit test result expected';
    const editedMapPoint = new MapPoint(testMapPoint.order,testMapPoint.coordinate,testName,testDescription)
    const subscription = service.getMapPointArray().subscribe(mapPoints => {
      expect(mapPoints[0].name).toBe(testName);
      expect(mapPoints[0].description).toBe(testDescription);
      done();
    }); 
    service.editMapPointInfo(editedMapPoint);
   
  });

  it('#deleteMapPoint', (done: DoneFn)  => {
    const service: MapPointService = TestBed.inject(MapPointService);
    service.addMapPoint(testMapPoint);

    const subscription = service.getMapPointArray().subscribe(mapPoints => {
      expect(mapPoints.length).toBe(0);
      done();
    }); 
    service.deleteMapPoint(testMapPoint);
   
  });

  it('#resetOrder',  (done: DoneFn) => {
    const service: MapPointService = TestBed.inject(MapPointService);
    const replacedMapPoints = 
      [
        new MapPoint(3, [10,10]),
        new MapPoint(1, [20,20]),
        new MapPoint(2, [30,30]),
      ];
    const reOrderedMapPoints = 
      [
        new MapPoint(1, [10,10]),
        new MapPoint(2, [20,20]),
        new MapPoint(3, [30,30]),  
      ];
    const subscription = service.getMapPointArray().subscribe(mapPoints => {
      expect(mapPoints).toEqual(reOrderedMapPoints);
      done();
    }); 
    service.updateMapPointOrder(replacedMapPoints);   
  });

});
