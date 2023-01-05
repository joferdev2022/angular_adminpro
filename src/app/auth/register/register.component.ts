import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators, AbstractControlOptions } from '@angular/forms';
import Swal from 'sweetalert2'

import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: [
    './register.component.css'
  ]
})
export class RegisterComponent implements OnInit {

  formSubmitted = false;

  // forma deprecada
  // public registerForm = this.fb.group ({
  //   nombre: ['Fernando', [ Validators.required, Validators.minLength(3)]],
  //   email: ['fernando@gmail.com', [Validators.required, Validators.email]],
  //   password: ['123456', Validators.required],
  //   password2: ['123456', Validators.required],
  //   terminos: [ false, Validators.required],
  // },  )

  // { validators: this.passwordsIguales('password', 'password2') }

  public registerForm: FormGroup = new FormGroup({
      nombre: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required,]),
      password2: new FormControl('', [Validators.required]),
      terminos: new FormControl(false, Validators.requiredTrue)
  }, { 
    validators: this.passwordsIguales('password', 'password2')
  } as AbstractControlOptions );
  constructor( private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private router: Router) { }

  ngOnInit(): void {    
  }

  crearUsuario() {
    this.formSubmitted = true;
    if( this.registerForm.invalid) {
      return 
    }
    
    this.usuarioService.crearUsuario( this.registerForm.value).subscribe({
      next: (resp) => {
        console.log('usuario creado');
        console.log(resp);
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        
        Swal.fire('Error', err.error.msg, 'error')
      }
    });
  }
  campoNoValido( campo: string): boolean {
    if( this.registerForm.get(campo)?.invalid && this.formSubmitted){
      return true;
    }else {
      return false;
    }

  }
  passwordNoValido() {
    const pass1 = this.registerForm.get('password')?.value;
    const pass2 = this.registerForm.get('password2')?.value;

    if ( ( pass1 !== pass2 ) && this.formSubmitted) {
      return true;
    }else {
      return false;
    }
  }
  aceptaTerminos() {
    return !this.registerForm.get('terminos')?.value && this.formSubmitted; 
  }

  passwordsIguales(pass1Name: string, pass2Name: string) {

    return ( formGroup: FormGroup) => {
      const pass1Control = formGroup.get(pass1Name);
      const pass2Control = formGroup.get(pass2Name);

      if( pass1Control?.value === pass2Control?.value ) {
        pass2Control?.setErrors( null );
      }else {
        
        pass2Control?.setErrors( { noEsIgual: true } );
      }
    }
  }

}
