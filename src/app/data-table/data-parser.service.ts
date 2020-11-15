import {Dataset} from '../dataset.model';

export class DataParser {

  static parseCsv(file: File): Promise<Dataset[]> {
    return new Promise<Dataset[]>((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onloadend = () => {
        const dataset = [];
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
          dataset.push({
            time: date,
            latitude: parseFloat(cells[1]),
            longitude: parseFloat(cells[2]),
            altitude: parseFloat(cells[3]),
            sv: parseInt(cells[4], 10),
            fix: cells[5] === '1',
            velocity: parseFloat(cells[6])
          });
        }
        resolve(dataset);
      };
      fileReader.onerror = () => {
        reject('Could not load file: ' + fileReader.error);
      };
      fileReader.readAsText(file);
    });

  }
}
