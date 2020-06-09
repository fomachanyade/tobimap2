import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";

import { AngularFireModule } from "@angular/fire";
import { AngularFireAnalyticsModule } from "@angular/fire/analytics";
import { AngularFirestoreModule } from "@angular/fire/firestore";

import {
  MatButtonModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatInputModule,
  MatTabsModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatDialogModule
} from "@angular/material";
import { MatToolbarModule } from "@angular/material/toolbar";

import { MapComponent } from "./map/map.component";
import { NavigationComponent } from "./navigation/navigation.component";
import { MapPointDialogComponent } from "./map-point-dialog/map-point-dialog.component";
import { ContentComponent } from "./content/content.component";
import { environment } from "src/environments/environment";

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    NavigationComponent,
    MapPointDialogComponent,
    ContentComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAnalyticsModule,
    AngularFirestoreModule,

    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatTabsModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatToolbarModule,
    MatDialogModule
  ],
  entryComponents: [MapPointDialogComponent],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
