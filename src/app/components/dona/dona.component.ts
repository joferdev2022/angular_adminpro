import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartEvent, ChartType, Color } from 'chart.js';


@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  styles: [
  ]
})
export class DonaComponent {

  @Input() title: string = 'sin titulo';
  @Input() labels: string[] = ['Download Sales', 'In-Store Sales', 'Mail-Order Sales' ];
  @Input() data1: ChartData<'doughnut', number[], unknown> ={
    labels: this.labels,
    datasets: [
      { data: [ 350, 450, 100 ],
        backgroundColor: [ '#9E120E', '#FF5800', '#FFB414'],
      },
    ]
  };


  // public doughnutChartLabels: string[] = [ 'Download Sales', 'In-Store Sales', 'Mail-Order Sales' ];
  // public doughnutChartData: ChartData<'doughnut'> = {
  //   labels: this.doughnutChartLabels,
  //   datasets: [
  //     { data: [ 350, 450, 100 ],
  //       backgroundColor: [ '#9E120E', '#FF5800', '#FFB414'],
  //     },
  //   ]
  // };
  public doughnutChartType: ChartType = 'doughnut';


}
