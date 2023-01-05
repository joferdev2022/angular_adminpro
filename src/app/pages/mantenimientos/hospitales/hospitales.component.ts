import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { Hospital } from 'src/app/models/hospital.model';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { HospitalService } from 'src/app/services/hospital.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-hospitales',
  templateUrl: './hospitales.component.html',
  styles: [
  ]
})
export class HospitalesComponent implements OnInit, OnDestroy {
  public hospitales: Hospital[] = [];
  public cargando: boolean = true;
  private imgSubs!: Subscription;

  constructor(private hospitalService: HospitalService,
              public modalImagenService: ModalImagenService,
              private busquedaService: BusquedaService) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarHospitales();
    this.imgSubs = this.modalImagenService.nuevaImagen
    .pipe(
      delay(100)
    )
    .subscribe(img => this.cargarHospitales());
  }

  cargarHospitales() {
    this.cargando = true;
    this.hospitalService.cargarHospitales().subscribe(resp => {
      this.cargando = false;
      this.hospitales = resp;
    })

  }
  crearHospital() {
    this.cargando = true;
    this.hospitalService.cargarHospitales().subscribe(resp => {
      this.cargando = false;
      this.hospitales = resp;
    })
  }

  guardarCambios(hospital: Hospital) {
    this.hospitalService.actualizarHospital(hospital._id!, hospital.nombre).subscribe(resp => {
      Swal.fire('actualizado', hospital.nombre, 'success')
    })
  }
  eliminarHospital(hospital: Hospital) {
    this.hospitalService.borrarHospital(hospital._id!).subscribe(resp => {
      this.cargarHospitales();
      Swal.fire('Borrado', hospital.nombre, 'success')
    })
  }

  async abrirSweetAlert() {
    const {value = ''} = await Swal.fire<string>({
      title: 'Crear Hospital',
      text: 'ingrese el nombre del nuevo hospital',
      input: 'text',
      inputPlaceholder: 'nombre del hospital',
      showCancelButton: true
    })

    if(value!.trim().length > 0) {
      this.hospitalService.crearHospital(value!).subscribe( (resp: any) => {
        this.hospitales.push(resp.hospital)
      })
    }
  }
  abrirModal(hospital: Hospital) {
    this.modalImagenService.openModal('hospitales', hospital._id!, hospital.img);
  }
  buscar(termino: string) {

    if(termino.length === 0) {
      return this.cargarHospitales();
    }
    this.busquedaService.buscar('hospitales', termino)
          .subscribe(resultados => {
            this.hospitales = resultados;
          })
    
  } 
}
