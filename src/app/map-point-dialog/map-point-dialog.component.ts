import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapPoint } from 'src/app/models/map-point/map-point';
import { MapPointService } from '../services/map-point/map-point.service';
import { MyErrorStateMatcher } from './my-error-state-matcher/my-error-state-matcher';
import { MapService } from '../services/map/map.service';

@Component({
  selector: 'app-map-point-dialog',
  templateUrl: './map-point-dialog.component.html',
  styleUrls: ['./map-point-dialog.component.sass'],
})
/**
 * 座標追加・編集モーダル
 */
export class MapPointDialogComponent implements OnInit {
  /**
   * フォーム管理オブジェクト
   */
  formGroup: FormGroup;
  /**
   * バリデーションハンドラー
   */
  matcher = new MyErrorStateMatcher();

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<MapPointDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: MapPoint,
    private mapPointService: MapPointService,
    private mapService: MapService
  ) {}

  ngOnInit() {
    this.formGroup = this.fb.group({
      name: [this.data.name, [Validators.required]],
      description: this.data.description,
    });
  }

  /**
   * OKボタン押下時に、呼び出し元にデータを渡しモーダルを閉じる関数
   * TODO: ボタン押下時にエラーを表示
   */
  onClickOkButton() {
    if (this.formGroup.valid) {
      const val = this.formGroup.getRawValue();
      this.data.name = val.name;
      this.data.description = val.description;
      this.dialogRef.close(this.data);
    }
  }

  /**
   * キャンセルボタン押下時にモーダルを閉じる関数
   */
  onClickCancelButton(): void {
    this.dialogRef.close();
  }

  /**
   * 削除ボタン押下時にデータを削除し、モーダルを閉じる関数
   * TODO:削除後にアラート表示
   */
  onClickDeleteButton(): void {
    const hasDeleted = this.mapPointService.deleteMapPoint(this.data);
    if (hasDeleted) {
      this.mapService.reDrawPointsonMap();
      this.dialogRef.close();
    }
  }
}
