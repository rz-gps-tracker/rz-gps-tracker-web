import {Component, Input} from '@angular/core';
import {Dataset} from '../dataset.model';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent {

  @Input() dataset: Dataset[];

}
