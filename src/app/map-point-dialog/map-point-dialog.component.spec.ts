import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPointDialogComponent } from './map-point-dialog.component';

describe('MapPointDialogComponent', () => {
  let component: MapPointDialogComponent;
  let fixture: ComponentFixture<MapPointDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MapPointDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPointDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
