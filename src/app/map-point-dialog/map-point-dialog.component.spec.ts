import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPointDialogComponent } from './map-point-dialog.component';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Component } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MapPoint } from '../models/map-point/map-point';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

@Component({
  template: ''
})
class NoopComponent {}

const TEST_DIRECTIVES = [
  MapPointDialogComponent,
  NoopComponent
];

@NgModule({
  imports: [MatDialogModule, NoopAnimationsModule,ReactiveFormsModule],
  exports: TEST_DIRECTIVES,
  declarations: TEST_DIRECTIVES,
  entryComponents: [
    MapPointDialogComponent
  ],
})
class DialogTestModule { }

// なぜか２つ以上のテストがあると、要素を参照できない
describe('MapPointDialogComponent', () => {
  let component: MapPointDialogComponent;
  let fixture: ComponentFixture<MapPointDialogComponent>;
  let dialog:MatDialog;
  let overlayContainerElement: HTMLElement;
  let noop: ComponentFixture<NoopComponent>;
  // create new instance of FormBuilder
  const formBuilder: FormBuilder = new FormBuilder();
  
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ 
        DialogTestModule,
        
      ],
      providers: [
        { provide: OverlayContainer, useFactory: () => {
          overlayContainerElement = document.createElement('div');
          return { getContainerElement: () => overlayContainerElement };
        }},
        { provide: FormBuilder, useValue: formBuilder }
      ]
    });
    dialog = TestBed.get(MatDialog);
    noop = TestBed.createComponent(NoopComponent);
  }));

  // ここをコメントアウトしないとエラーが起きる。おそらく、正規のテスト方法ではないから
  // beforeEach(() => {
  //   fixture = TestBed.createComponent(MapPointDialogComponent);
  //   component = fixture.componentInstance;
  //   fixture.detectChanges();
  // });

  it('should create', () => {
    const config = {
      data: new MapPoint(1,[10,10])
    };
    dialog.open(MapPointDialogComponent, config);
    noop.detectChanges(); // Updates the dialog in the overlay
    
    const h2 = overlayContainerElement.querySelector('#mat-dialog-title-0');
    expect(h2.textContent).toBe('勤務先の編集');
  });

  // it('do not close when name is empty', () => {
  //   const config = {
  //     data: new MapPoint(1,[10,10])
  //   };
  //   dialog.open(MapPointDialogComponent, config);
  //   noop.detectChanges(); // Updates the dialog in the overlay
  //   const buttons = overlayContainerElement.querySelectorAll('button')
  //   let okButton;
  //   buttons.forEach(b => {
  //     console.log(b)
  //     if(b.textContent.trim() === 'OK'){
  //       okButton = b;
  //     }
  //   })
  //   okButton.click();
  //   // ダイアログが閉じていないことを検知する
  //   const h2 = overlayContainerElement.querySelector('#mat-dialog-title-0');
  //   expect(h2.textContent).toBe('勤務先の編集');
  // });
});
