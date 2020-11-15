import {Component, OnInit} from '@angular/core';
import Map from 'ol/Map';
import View from 'ol/View';
import OSM from 'ol/source/OSM';
import * as olProj from 'ol/proj';
import TileLayer from 'ol/layer/Tile';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {

  map: any;

  ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
        this.initMap(position.coords.latitude, position.coords.longitude);
      }, () => {
        this.initMap(50.041187, 21.999121);
      });
    } else {
      this.initMap(50.041187, 21.999121);
    }
  }

  private initMap(latitude: number, longitude: number) {
    this.map = new Map({
      target: 'map',
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: new View({
        center: olProj.fromLonLat([latitude, longitude]),
        zoom: 2
      })
    });
  }

  setCenter(latitude: number, longitude: number) {
    const view = this.map.getView();
    view.setCenter(olProj.fromLonLat([longitude, latitude]));
    view.setZoom(2);
  }

  zoomToBounds(lat1: number, lon1: number, lat2: number, lon2: number) {
    const extent = [lon1, lat1, lon2, lat2];
    this.map.getView().fit(extent, this.map.getSize());
  }

}
