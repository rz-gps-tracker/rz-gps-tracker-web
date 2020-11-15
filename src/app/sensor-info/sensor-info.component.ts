import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {Dataset} from "../dataset.model";

@Component({
  selector: 'app-sensor-info',
  templateUrl: './sensor-info.component.html',
  styleUrls: ['./sensor-info.component.css']
})
export class SensorInfoComponent implements OnInit {

  gps: { lat?: number, lon?: number } = {};
  accel: { x?: number, y?: number, z?: number } = {};
  orient: { x?: number, y?: number, z?: number } = {};
  gyroscope: { x?: number, y?: number, z?: number } = {};

  @Input() data: Dataset;

  constructor(private cd: ChangeDetectorRef) {
  }

  // TODO: To be moved to service
  ngOnInit(): void {
    // this.watchLocation();
    // this.queryAndInitAccelerometer();
    // this.queryAndInitOrientationSensor();
    // this.queryAndInitGyroscope();
  }

  private watchLocation() {
    const watchID = navigator.geolocation.watchPosition((position) => {
      this.gps = {lat: position.coords.latitude, lon: position.coords.longitude};
      this.cd.detectChanges();
    });
  }

  private queryAndInitAccelerometer() {
    navigator.permissions.query({name: 'accelerometer'})
      .then(result => {
        if (result.state === 'denied') {
          console.log('Permission to use accelerometer sensor is denied.');
          return;
        }
        this.initAccelerometer();
      });
  }

  private queryAndInitOrientationSensor() {
    Promise.all([navigator.permissions.query({name: 'accelerometer'}),
      navigator.permissions.query({name: 'magnetometer'}),
      navigator.permissions.query({name: 'gyroscope'})])
      .then(results => {
        if (results.every(result => result.state === 'granted')) {
          this.initOrientationSensor();
        }
      });
  }

  private queryAndInitGyroscope() {
    navigator.permissions.query({name: 'gyroscope'})
      .then(result => {
        if (result.state === 'denied') {
          console.log('Permission to use gyroscope is denied.');
          return;
        }
        this.initGyroscope();
      });
  }

  private initAccelerometer() {
    let accelerometer = null;
    try {
      accelerometer = new Accelerometer({referenceFrame: 'device'});
      accelerometer.addEventListener('error', event => {
        // Handle runtime errors.
        if (event.error.name === 'NotAllowedError') {
          // Branch to code for requesting permission.
        } else if (event.error.name === 'NotReadableError') {
          console.log('Cannot connect to the accelerometer.');
        }
      });
      accelerometer.addEventListener('reading', () => {
        this.accel = {x: accelerometer.x, y: accelerometer.y, z: accelerometer.z};
        this.cd.detectChanges();
      });
      accelerometer.start();
    } catch (error) {
      // Handle construction errors.
      if (error.name === 'SecurityError') {
        // See the note above about feature policy.
        console.log('Accelerometer construction was blocked by a feature policy.');
      } else if (error.name === 'ReferenceError') {
        console.log('Accelerometer is not supported by the User Agent.');
      } else {
        throw error;
      }
    }
  }

  private initOrientationSensor() {
    let sensor = null;
    try {
      const options = {frequency: 60, referenceFrame: 'device'};
      sensor = new RelativeOrientationSensor(options);
      sensor.addEventListener('reading', () => {
        this.orient = {x: sensor.x, y: sensor.y, z: sensor.z};
        this.cd.detectChanges();
      });
      sensor.addEventListener('error', error => {
        if (error.name === 'NotReadableError') {
          console.log('Sensor is not available.');
        }
      });
      sensor.start();
    } catch (error) {
      // Handle construction errors.
      if (error.name === 'SecurityError') {
        // See the note above about feature policy.
        console.log('Sensor construction was blocked by a feature policy.');
      } else if (error.name === 'ReferenceError') {
        console.log('Sensor is not supported by the User Agent.');
      } else {
        throw error;
      }
    }
  }

  private initGyroscope() {
    let sensor = null;
    try {
      const options = {frequency: 60, referenceFrame: 'device'};
      sensor = new Gyroscope(options);
      sensor.addEventListener('reading', () => {
        this.gyroscope = {x: sensor.x, y: sensor.y, z: sensor.z};
        this.cd.detectChanges();
      });
      sensor.addEventListener('error', error => {
        if (error.name === 'NotReadableError') {
          console.log('Gyroscope is not available.');
        }
      });
      sensor.start();
    } catch (error) {
      // Handle construction errors.
      if (error.name === 'SecurityError') {
        // See the note above about feature policy.
        console.log('Gyroscope construction was blocked by a feature policy.');
      } else if (error.name === 'ReferenceError') {
        console.log('Gyroscope is not supported by the User Agent.');
      } else {
        throw error;
      }
    }
  }
}
