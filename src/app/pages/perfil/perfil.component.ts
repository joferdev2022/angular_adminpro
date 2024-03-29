import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/models/usuario.model';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  perfilForm!: FormGroup;
  public usuario!: Usuario;
  public imagenSubir!: File;
  public imgTemp: any = '';

  constructor(private fb: FormBuilder,
              private usuarioService: UsuarioService,
              private fileUploadService: FileUploadService) { 
                this.usuario = usuarioService.usuario;
              }

  ngOnInit(): void {

    this.perfilForm = this.fb.group({
      nombre: new FormControl(this.usuario.nombre, Validators.required ),
      email: new FormControl(this.usuario.email, [Validators.required, Validators.email] ),

    });
  }

  actualizarPerfil() {
    this.usuarioService.actualizarPerfil( this.perfilForm.value ).subscribe(
      resp => {
        console.log(resp);
        const { nombre, email} = this.perfilForm.value;
        this.usuario.nombre = nombre;
        this.usuario.email = email;

        Swal.fire('Guardado', 'Actualizado con exito', 'success');
      }, (err) => {
        Swal.fire('Error', err.error.msg, 'error');
        
      }
    )
  }

  cambiarImagen(file: File) {
    console.log(file);
    
    this.imagenSubir = file;

    if( !file ){ 
      return this.imgTemp = null; 
    }
    const reader = new FileReader();
    const url64 = reader.readAsDataURL( file );

    reader.onloadend = () => {

      this.imgTemp = reader.result;
      console.log(reader.result);
      
    }

  }

  subirImagen() {
    this.fileUploadService.actualizarFoto(this.imagenSubir, 'usuarios', this.usuario.uid || '')
          .then( img => {
            this.usuario.img = img
            Swal.fire('Guardado', 'Actualizado con exito', 'success');
          }).catch( err => {
            Swal.fire('Error', 'No se pudo subir la imagen', 'error')
          })
          
          // window.location.reload()
  }
}
