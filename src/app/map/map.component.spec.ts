import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapComponent } from './map.component';
import { MapService } from '../services/map/map.service';
import { MapPointService } from '../services/map-point/map-point.service';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';

// <<-- Create a MatDialog mock class -->>
export class MatDialogMock {
  // When the component calls this.dialog.open(...) we'll return an object
  // with an afterClosed method that allows to subscribe to the dialog result observable.
  open() {
    return {
      afterClosed: () => of({action: true})
    };
  }
}

describe('MapComponent', () => {
  let component: MapComponent;
  let fixture: ComponentFixture<MapComponent>;

  let mapServiceStub: Partial<MapService>;
  let mapPointServiceStub: Partial<MapPointService>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatDialogModule, RouterTestingModule, HttpClientModule, BrowserAnimationsModule,
        HttpClientModule, FlexLayoutModule,
      ],
      declarations: [MapComponent],
      providers:[
        {provide:MapService,useClass: MapService},
        {provide:MapPointService,useClass:MapPointService},
        {provide:MatDialog,useClass: MatDialogMock}
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
