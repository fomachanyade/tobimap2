import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FlexLayoutModule } from "@angular/flex-layout";

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
} from "@angular/material";

import { MatToolbarModule } from "@angular/material/toolbar";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatDialogModule } from "@angular/material/dialog";

import { MapComponent } from "./map/map.component";
import { NavigationComponent } from "./navigation/navigation.component";
import { MapPointDialogComponent } from "./map-point-dialog/map-point-dialog.component";
import { ContentComponent } from "./content/content.component";

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    NavigationComponent,
    MapPointDialogComponent,
    ContentComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FlexLayoutModule,

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
    MatDialogModule,
    MatFormFieldModule,
  ],
  entryComponents: [MapPointDialogComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
