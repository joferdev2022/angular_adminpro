import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { Medico } from 'src/app/models/medico.model';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { MedicoService } from 'src/app/services/medico.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-medicos',
  templateUrl: './medicos.component.html',
  styles: [
  ]
})
export class MedicosComponent implements OnInit, OnDestroy {

  public medicos: Medico[] = [];
  public cargando: boolean = true;
  private imgSubs!: Subscription;
  constructor(private medicoService: MedicoService,
              private modalImagenService: ModalImagenService,
              private busquedaService: BusquedaService) { }
 ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarMedicos();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(200)
    )
    .subscribe(img => this.cargarMedicos());
  }

  cargarMedicos() {
    this.cargando = true;
    this.medicoService.cargarMedicos().subscribe( medicos => {
      this.cargando = false;
      this.medicos = medicos;
    })
  }
  abrirModal(medico: Medico) {
    this.modalImagenService.openModal('medicos', medico._id!, medico.img);
  }
  // async abrirSweetAlert() {
  //   const {value = ''} = await Swal.fire<string>({
  //     title: 'Crear Medico',
  //     text: 'ingrese el nombre del nuevo Medico',
  //     input: 'text',
  //     inputPlaceholder: 'nombre del Medico',
  //     showCancelButton: true
  //   })

  //   if(value!.trim().length > 0) {
  //     this.medicoService.crearMedico(value!).subscribe( (resp: any) => {
  //       this.hospitales.push(resp.hospital)
  //     })
  //   }
  // }
  buscar(termino: string) {

    if(termino.length === 0) {
      return this.cargarMedicos();
    }
    this.busquedaService.buscar('medicos', termino)
          .subscribe(resultados => {
            this.medicos = resultados;
          })
    
  }
  borrarMedico(medico: Medico) {
    Swal.fire({
      title: 'Borrar Medico?',
      text: `Esta a punto de borrar a ${ medico.nombre }`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {

        this.medicoService.borrarMedico(medico._id!)
              .subscribe( resp => {
                this.cargarMedicos();
                Swal.fire(
                  'Medico eliminado!',
                  `${ medico.nombre } fue eliminado correctamente`,
                  'success'
                        )
              } 
                );
      }
    })
  }
}
