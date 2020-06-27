import { TestBed } from '@angular/core/testing';

import { MapServiceService } from './map-service.service';

describe('MapServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapServiceService = TestBed.inject(MapServiceService);
    expect(service).toBeTruthy();
  });
});
