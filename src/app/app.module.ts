import {BrowserModule} from '@angular/platform-browser';
import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {MapComponent} from './map/map.component';
import { DataTableComponent } from './data-table/data-table.component';
import { SensorInfoComponent } from './sensor-info/sensor-info.component';

@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    DataTableComponent,
    SensorInfoComponent
  ],
  imports: [
    BrowserModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
