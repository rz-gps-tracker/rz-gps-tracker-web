import {Component, HostListener, ViewChild} from '@angular/core';
import {Dataset} from './dataset.model';
import {DataParser} from './data-table/data-parser.service';
import {MapComponent} from "./map/map.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  dataset: Dataset[];
  currentData: Dataset;

  @ViewChild(MapComponent, {static: true}) mapComponent: MapComponent;

  @HostListener('window:dragover', ['$event'])
  onDragOver($event: DragEvent) {
    $event.preventDefault();
    $event.dataTransfer.dropEffect = 'copy';
  }

  @HostListener('window:drop', ['$event'])
  onDrop($event: DragEvent) {
    $event.preventDefault();
    if ($event.dataTransfer.files.length === 1) {
      const fileName = $event.dataTransfer.files[0].name;
      if (fileName.toLocaleLowerCase().endsWith('.csv')) {
        this.parseCsvFile($event.dataTransfer.items[0].getAsFile());
      }
    }
  }

  private parseCsvFile(file: File) {
    DataParser.parseCsv(file).then(dataset => {
      this.dataset = dataset;
      this.currentData = dataset[0];
      const lat1 = Math.min(...dataset.map(x => x.latitude));
      const lon1 = Math.min(...dataset.map(x => x.longitude));
      const lat2 = Math.max(...dataset.map(x => x.longitude));
      const lon2 = Math.max(...dataset.map(x => x.longitude));
      this.mapComponent.zoomToBounds(lat1, lon1, lat2, lon2);
    }, error => alert(error));
  }

}
