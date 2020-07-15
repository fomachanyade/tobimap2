import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentComponent } from './content.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MapService } from '../services/map/map.service';

describe('ContentComponent', () => {
  let component: ContentComponent;
  let fixture: ComponentFixture<ContentComponent>;
  let mapServiceStub: Partial<MapService>;
  let drawn: boolean;
  let saved: boolean;
  mapServiceStub = {
    drawLine: (): boolean => {
      drawn = true;
      return true;
    },
    saveMap: () => {
      saved = true;
    },
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ContentComponent],
      providers: [{ provide: MapService, useValue: mapServiceStub }],
      schemas: [NO_ERRORS_SCHEMA],
    });
    fixture = TestBed.createComponent(ContentComponent);
    component = fixture.componentInstance;
  });

  it('draw line', () => {
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons.forEach((b) => {
      if (b.textContent.trim() === '星座を書く') {
        b.click();
      }
    });
    expect(drawn).toBe(true);
  });

  it('save map', () => {
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('button');
    buttons.forEach((b) => {
      if (b.textContent.trim() === '星座を保存する') {
        b.click();
      }
    });
    expect(saved).toBe(true);
  });
});
