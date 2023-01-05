import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, interval, Subscription  } from 'rxjs';
import { filter, map, retry, take } from "rxjs/operators";

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnInit, OnDestroy {

  public intervalSubs?: Subscription ;
 
  constructor() { 
    

    // this.retornaObservable().pipe(
    //   retry(2)
    // ).subscribe({
    //   next: valor => console.log('Subs: ' , valor),
    //   error: error => console.warn('Error: ', error),
    //   complete: () => console.info('obs terminado')
    // });
    this.intervalSubs= this.retornarInterval().subscribe(
      valor => console.log(valor)
    )

  }
  ngOnDestroy(): void {
    this.intervalSubs?.unsubscribe();
  }

  ngOnInit(): void {
  }

  retornarInterval() {
    const interval$ = interval(500)
                        .pipe(
                          map(
                            valor => {
                              return valor + 1;
                            }
                            ),
                          filter( valor => (valor % 2 === 0) ? true: false),
                          // take(10),
                            );

    return interval$;
  }

  retornaObservable(): Observable<number  > {
    let i = -1;
    return new Observable<number>( observer => {
      const intervalo = setInterval( () => {
        i++;
        observer.next(i);
        if (i === 4) {
          clearInterval(intervalo);
          observer.complete();
        }

        if(i ===2 ) {
          observer.error('i llego al valor de 2');
        }
      }, 1000)
    });
  }

}
