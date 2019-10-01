import { TestBed } from '@angular/core/testing';

import { MapPointDialogService } from './map-point-dialog.service';

describe('MapPointDialogService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapPointDialogService = TestBed.get(MapPointDialogService);
    expect(service).toBeTruthy();
  });
});
