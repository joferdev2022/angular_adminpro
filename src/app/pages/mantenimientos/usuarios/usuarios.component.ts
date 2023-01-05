import { Component, OnDestroy, OnInit } from '@angular/core';
import { delay, Subscription } from 'rxjs';
import { ModalImagenComponent } from 'src/app/components/modal-imagen/modal-imagen.component';
import { Hospital } from 'src/app/models/hospital.model';
import { Usuario } from 'src/app/models/usuario.model';
import { BusquedaService } from 'src/app/services/busqueda.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styles: [
  ]
})
export class UsuariosComponent implements OnInit, OnDestroy {

  public totalUsuarios = 0;
  public usuarios: Usuario[] = [];
  public usuariosTemp: Usuario[] = [];
  public desde: number = 0;
  public loading: boolean = true;
  imgSubs!: Subscription;
  

  constructor(private usuarioService: UsuarioService, 
              private busquedaService: BusquedaService,
              public modalImagenService: ModalImagenService) { }
  ngOnDestroy(): void {
    this.imgSubs.unsubscribe();
  }

  ngOnInit(): void {
    this.cargarUsuarios();

    this.imgSubs = this.modalImagenService.nuevaImagen
      .pipe(
        delay(100)
      )
      .subscribe(img => this.cargarUsuarios());
  }

  cargarUsuarios() {
    this.loading = true;
    this.usuarioService.cargarUsuario(this.desde).subscribe( ({ total, usuarios }) => {

      this.totalUsuarios = total; 
      this.usuarios = usuarios;
      this.usuariosTemp = usuarios;
      console.log(usuarios);
      this.loading = false;
    })
  }
  cambiarPagina(valor: number) {
    this.desde += valor;

    if( this.desde < 0 ){
      this.desde = 0;
    }else if( this.desde > this.totalUsuarios ){
      this.desde -= valor;
    }
    this.cargarUsuarios();
  }
  buscar(termino: string) {

    if(termino.length === 0) {
      return this.usuarios = this.usuariosTemp;
    }
    this.busquedaService.buscar('usuarios', termino)
          .subscribe((resp: any ) => {
            this.usuarios = resp;
          })
    
  } 
  eliminarUsuario(usuario: Usuario) {

    if(usuario.uid === this.usuarioService.uid) {
      return Swal.fire('Error', 'No puede borrarse a si mismo','error')
    }
    Swal.fire({
      title: 'Borrar usuario?',
      text: `Esta a punto de borrar a ${ usuario.nombre }`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, borrarlo'
    }).then((result) => {
      if (result.isConfirmed) {

        this.usuarioService.eliminarUsuario(usuario)
              .subscribe( resp => {
                this.cargarUsuarios();
                Swal.fire(
                  'Usuario eliminado!',
                  `${ usuario.nombre } fue eliminado correctamente`,
                  'success'
                        )
              } 
                );
      }
    })
  }
  cambiarRol( usuario: Usuario ) {
    this.usuarioService.actualizarUsuario(usuario).subscribe(resp => {
      console.log(resp);
      
    })
  }

  abrirModals(usuario: Usuario) {
   this.modalImagenService.openModal('usuarios', usuario.uid!, usuario.img);
  }
}
