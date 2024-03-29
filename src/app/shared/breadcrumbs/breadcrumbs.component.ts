import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivationEnd, Router } from '@angular/router';
import { filter, map, Subscription } from 'rxjs';

@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
  styles: [
  ]
})
export class BreadcrumbsComponent implements OnInit, OnDestroy {

  public titulo: string = '';
  public tituloSubs$!: Subscription;

  constructor(private router: Router) {
    this.tituloSubs$ =  this.retornarTitle().subscribe( ({ titulo }) => {
      this.titulo = titulo
      document.title = `AdminPro - ${ titulo }`;
    });;
    
   }
  ngOnDestroy(): void {
    this.tituloSubs$.unsubscribe();
  }

  ngOnInit(): void {
  }

  retornarTitle() {
      return this.router.events
      .pipe(
        filter( (event: any) => event instanceof ActivationEnd),
        filter( (event: ActivationEnd) => event.snapshot.firstChild === null),
        map( (event: ActivationEnd) => event.snapshot.data),
    )
  }

}
