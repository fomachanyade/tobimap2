import { TestBed } from '@angular/core/testing';

import { MapService } from './map.service';
import { MapPointService } from '../map-point/map-point.service';
import { MapPoint } from 'src/app/models/map-point/map-point';

describe('MapService', () => {

  it('should be created', () => {  
    const {mapService,stubValue, mapPointServiceSpy } = setup();
    expect(mapService).toBeTruthy();
  });

  it('#getMap', (done:DoneFn) => {  
    const {mapService,stubValue, mapPointServiceSpy } = setup();
    mapService.getMap().then(map => {
      expect(map).toBeTruthy();
      done();
    })
  });

  it('#reDrawPointsOnMap not work when mapPoints is empty', () => {  
    const {mapService,stubValue, mapPointServiceSpy } = setup();
    expect(mapService.reDrawPointsOnMap()).toBe(false);
  });

  it('#reDrawPointsOnMap works when mapPoints has values', () => {  
    const {mapService, stubValue, mapPointServiceSpy } = setup();
    mapPointServiceSpy.addMapPoint(stubValue);
    expect(mapService.reDrawPointsOnMap()).toBe(true);
  });

  it('#drawLine not work when mapPoints is empty or single', () => {  
    const {mapService,stubValue, mapPointServiceSpy } = setup();
    expect(mapService.drawLine()).toBe(false);
    mapPointServiceSpy.addMapPoint(stubValue);
    expect(mapService.drawLine()).toBe(false);
  });

  it('#drawLine works when mapPoints has values', () => {  
    const {mapService, stubValue, mapPointServiceSpy } = setup();
    mapPointServiceSpy.addMapPoint(stubValue);
    const additionalStubValue = new MapPoint(2,[20,20]);
    mapPointServiceSpy.addMapPoint(additionalStubValue);
    expect(mapService.drawLine()).toBe(true);
  });
});

function setup() {
  const mapPointServiceSpy = new MapPointService();
  const mapService = new MapService(mapPointServiceSpy);
  const stubValue: MapPoint = new MapPoint(1,[10,10]);
  return { mapService,stubValue, mapPointServiceSpy };

}
