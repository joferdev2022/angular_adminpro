import { HttpClient } from '@angular/common/http';
import { ThisReceiver } from '@angular/compiler';
import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { catchError, map, tap } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { CargarUsuario } from '../interfaces/cargarUsuarios.interface';

import { LoginForm } from '../interfaces/login-form.interface';
import { RegisterForm } from '../interfaces/register-form.interface';
import { Usuario } from '../models/usuario.model';


declare const google: any;
const base_url = environment.base_url;


@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  email: string = '';
  public usuario!: Usuario;

  constructor( private http: HttpClient,
               private router: Router,
               private ngZone: NgZone ) { }

  get token(): string {
    return localStorage.getItem('token') || '';
  }             
  get role(): 'USER_ROLE' | 'ADMIN_ROLE' {
    return this.usuario.role!;
  }             
  get uid(): string {
    return this.usuario.uid || '';
  } 
  get headers(){
    return { 
      headers: {
        'x-token': this.token
      }
    }
  }            

  crearUsuario( formData: RegisterForm ) {
   
    return this.http.post( `${ base_url }/usuarios`, formData)
                .pipe(
                  tap( (resp: any) => {
                   
                    this.guardarLocalStorage(resp.token, resp.menu);
                  })
                  );
    
  }

  guardarLocalStorage(token: string, menu: any) {

    localStorage.setItem('token', token);
    localStorage.setItem('menu', JSON.stringify(menu));
  }

  actualizarPerfil(data: { email: string, nombre: string, role: string}) {

    data = { 
      ...data,
      role: this.usuario.role || ''
    }
    return this.http.put( `${ base_url }/usuarios/${ this.uid }`, data, this.headers);
  }
  login( formData: LoginForm ) {
   
    return this.http.post( `${ base_url }/login`, formData)
                .pipe(
                  tap( (resp: any) => {
                    this.guardarLocalStorage(resp.token, resp.menu);
                  })
                  );
    
  }

  loginGoogle(token: string) {

    return this.http.post(`${ base_url }/login/google`, { token })
                .pipe(
                  tap( (resp: any) => {
                    console.log(resp);
                    this.email = resp.email;
                    this.guardarLocalStorage(resp.token, resp.menu);
                  })
                  );  
  }

  logOut(){
    localStorage.removeItem('token');
    localStorage.removeItem('menu');
    
    // google.accounts.id.revoke(this.email, () => {
      
    //   this.ngZone.run( () => {
    //     google.accounts.id.disableAutoSelect();
    //     this.router.navigateByUrl('/login');
    //   })
    // });

    google.accounts.id.disableAutoSelect();
    this.router.navigateByUrl('/login');
  }

  validarToken(): Observable<boolean> {
    // const token = localStorage.getItem('token') || '';

    return this.http.get(`${ base_url }/login/renew`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any)  => {
        const {
          email,
          google,
          nombre,
          role,
          img='',
          uid
        } = resp.usuario;

        this.usuario = new Usuario( nombre,email, '', img, google, role, uid);
        this.guardarLocalStorage(resp.token, resp.menu);
        return true;
      }),
      catchError( error => of(false))
    );
  }

  cargarUsuario(desde: number = 0){
    const url = `${ base_url }/usuarios?desde=${ desde }`;
    return this.http.get<CargarUsuario>( url, this.headers )
                .pipe(
                  map( resp => {
                    const usuarios = resp.usuarios.map(
                      user => new Usuario(user.nombre, user.email, '', user.img, user.google, user.role, user.uid)
                    );
                    return {
                      total: resp.total,
                      usuarios
                    }
                  })
                )
  }
  eliminarUsuario(usuario: Usuario) {

    const url = `${ base_url }/usuarios/${ usuario.uid }`;
    return this.http.delete( url, this.headers );
  }
  actualizarUsuario(usuario: Usuario) {
    return this.http.put( `${ base_url }/usuarios/${ usuario.uid}`, usuario, this.headers);
  }
  updateAndDelete(event: string) {
    const evento = event;

    event.toLowerCase();
  }
}
