import { Component, OnInit } from '@angular/core';
import { FileUploadService } from 'src/app/services/file-upload.service';
import { ModalImagenService } from 'src/app/services/modal-imagen.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir!: File;
  public imgTemp: any = '';

  constructor(public modalImagenService: ModalImagenService,
              public fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.imgTemp = null;
    this.modalImagenService.cerrarModal();
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

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;
    this.fileUploadService.actualizarFoto(this.imagenSubir, tipo, id)
          .then( img => {
            // this.usuario.img = img
            Swal.fire('Guardado', 'Actualizado con exito', 'success');
            this.modalImagenService.nuevaImagen.emit(img);
            this.cerrarModal();
          }).catch( err => {
            Swal.fire('Error', 'No se pudo subir la imagen', 'error')
          })
          
          // window.location.reload()
  }
}
