import {Component, HostListener} from '@angular/core';
import {Dataset} from './dataset.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  dataset: Dataset[];

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
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      this.dataset = [];
      const rows = (fileReader.result as string)
        .split('\n')
        .map(val => val.trim())
        .filter(val => val);
      if (!rows[0] || rows[0].split(';').length !== 7) {
        throw new Error('Invalid columns length');
      }
      let prevDate = null;
      rows.shift();
      for (const row of rows) {
        const cells = row.split(';').map(val => val.trim());
        const dateParts = cells[0].split(/\:|\./);
        const date = new Date();
        date.setHours.call(date, ...dateParts);
        if (prevDate != null && date < prevDate) {
          date.setDate(date.getDate() + 1);
        }
        prevDate = date;
        this.dataset.push({
          time: date,
          latitude: parseFloat(cells[1]),
          longitude: parseFloat(cells[2]),
          altitude: parseFloat(cells[3]),
          sv: parseInt(cells[4], 10),
          fix: cells[5] === '1',
          velocity: parseFloat(cells[6])
        });
      }
    };
    fileReader.onerror = () => {
      alert('Could not load file: ' + fileReader.error);
    };
    fileReader.readAsText(file);
  }

}
