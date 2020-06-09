import { Injectable, OnInit } from "@angular/core";
import { Observable, of } from "rxjs";
import { map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import "firebase/firestore";
import { MatDialog } from "@angular/material";

import { MappointModule } from "../../map/modules/mappoint/mappoint.module";
import { MapPointDialogComponent } from "../../map-point-dialog/map-point-dialog.component";

//TODO: 環境変数から取得
const dialogWidth: string = "800px";
const dialogHeight: string = "600px";
@Injectable({
  providedIn: "root"
})
export class MapPointService implements OnInit {
  private mapPointArray: Observable<MappointModule[]>;
  //TODO: ユーザー情報サービスから取得
  private userId: string = "homare takatani";
  //TODO: ユーザー情報サービスから取得すること
  private mapVersion: number = 1;
  //TODO: 環境変数から取得
  private collectionName = "points";
  constructor(public dialog: MatDialog, private firestore: AngularFirestore) {
    this.mapPointArray = this.initMapPointArray();
  }

  ngOnInit(): void {}

  //TODO:firebaseから持ってくる
  private initMapPointArray(): Observable<Array<MappointModule>> {
    return this.firestore
      .collection<MappointModule>("points", ref => {
        return ref.where("userId", "==", this.userId).orderBy("order", "asc");
      })
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(action => {
            const data = action.payload.doc.data() as MappointModule;
            const mapPointData = new MappointModule(
              data.order,
              data.coordinate,
              data.name,
              data.description
            );
            mapPointData.path = action.payload.doc.ref.path;
            return mapPointData;
          })
        )
      );
  }
  public getMapPointArray(): Observable<MappointModule[]> {
    return this.mapPointArray;
  }

  //地図上の点を追加するメソッドです
  public async addMapPoint(coord: number[]): Promise<MappointModule> {
    return new Promise(async (resolve, reject) => {
      const nextOrderNum: number = await this.mapPointArray
        .pipe(
          map(points => {
            return points.length;
          })
        )
        .toPromise();
      const mapPoint: MappointModule = new MappointModule(nextOrderNum, coord);
      const dialogRef = this.dialog.open(MapPointDialogComponent, {
        width: dialogWidth,
        height: dialogHeight,
        data: mapPoint
      });

      dialogRef.afterClosed().subscribe(async result => {
        if (!result) return;
        mapPoint.name = result.name;
        mapPoint.description = result.description;
        mapPoint.mapVersion = this.mapVersion;
        mapPoint.userId = this.userId;
        const isAdded = await this.firestore
          .collection(this.collectionName)
          .add(mapPoint.deserialize());
        if (isAdded) {
          resolve(mapPoint);
        } else {
          alert("座標の追加に失敗しました");
          reject(mapPoint);
        }
      });
    });
  }

  async editMapPoint(mapPoint: MappointModule) {
    //this.selectedMapPoint  = mapPoint;
    return new Promise<boolean>(async (resolve, reject) => {
      const dialogRef = this.dialog.open(MapPointDialogComponent, {
        width: dialogWidth,
        height: dialogHeight,
        data: mapPoint
      });

      dialogRef.afterClosed().subscribe(async result => {
        if (!result) return;
        mapPoint = result;
        const target = await this.mapPointArray
          .pipe(
            map(points => {
              return points.find(p => p.order === mapPoint.order);
            })
          )
          .toPromise();
        if (!target == undefined) {
          target.name = mapPoint.name;
          target.description = mapPoint.description;
          await this.firestore.doc<MappointModule>(target.path).update(target);
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }

  deleteMapPoint(mapPoint: MappointModule) {
    this.firestore.doc<MappointModule>(mapPoint.path).delete();
  }
}
