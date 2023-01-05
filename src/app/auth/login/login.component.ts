import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario.service';
import Swal from 'sweetalert2';

declare const google: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    './login.component.css'
  ]
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChild('googleBtn') googleBtn!: ElementRef;

  public loginForm: FormGroup = new FormGroup({
    email: new FormControl(localStorage.getItem('email') || '', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required,]), 
    remember: new FormControl(false),
});

  constructor( private router: Router,
               private fb: FormBuilder,
               private usuarioService: UsuarioService,
               private ngZone: NgZone) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    this.googleInit();
  }

  googleInit() {
    google.accounts.id.initialize({
      client_id: '690985882068-kji8d582rclctuc0k7otbv6gvkbcgg32.apps.googleusercontent.com',
      callback: (response: any) => this.handleCredentialResponse(response)
    });
    google.accounts.id.renderButton(
      // document.getElementById("buttonDiv"),
      this.googleBtn.nativeElement,
      { theme: "outline", size: "large" }  // customization attributes
    );
  }

  handleCredentialResponse(response: any){
    console.log("Encoded JWT ID token: " + response.credential);
    this.usuarioService.loginGoogle( response.credential )
      .subscribe( resp => { 
        console.log( { login: resp } );

        this.ngZone.run( () => {
          this.router.navigateByUrl('/');
        })
      })
  }

  login() {

    this.usuarioService.login( this.loginForm.value).subscribe({
      next: (resp) => {
        if( this.loginForm.get('remember')?.value ){
          localStorage.setItem('email', this.loginForm.get('email')?.value );
        }else {
          localStorage.removeItem('email');
        }

        this.router.navigateByUrl('/');
      },
      error: (err) => {
        
        Swal.fire('Error', err.error.msg, 'error')
      }
    });
  }
}
