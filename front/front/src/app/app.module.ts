import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';

import { MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatNativeDateModule, MatInputModule, MatTabsModule, MatSidenavModule, MatIconModule } from '@angular/material';
import { MatToolbarModule} from '@angular/material/toolbar';

import { HeaderComponent } from './header/header.component';
import { MapComponent } from './map/map.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    MapComponent
  ],
  imports: [
    BrowserModule,
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

    MatToolbarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
