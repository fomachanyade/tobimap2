import { TestBed } from '@angular/core/testing';

import { MapPointService } from './map-point.service';

describe('MapPointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapPointService = TestBed.inject(MapPointService);
    expect(service).toBeTruthy();
  });
});
