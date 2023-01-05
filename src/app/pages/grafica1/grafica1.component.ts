import { Component } from '@angular/core';
import { ChartData, ChartEvent, ChartType, Color } from 'chart.js';

@Component({
  selector: 'app-grafica1',
  templateUrl: './grafica1.component.html',
  styles: [
  ]
})
export class Grafica1Component {

  public labelsGraf: string[] = [ 'Download Sales', 'In-Store Sales', 'Mail-Order Sales' ];
  public dataGraf: ChartData<'doughnut', number[], unknown> ={
    labels: this.labelsGraf,
    datasets: [
      { data: [ 100, 150, 200 ],
        backgroundColor: [ '#9E120E', '#FF5800', '#FFB414'],
      },
    ]
  };
  
}
